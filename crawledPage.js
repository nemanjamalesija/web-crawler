const { JSDOM } = require('jsdom');

class CrawledPage {
  pages = {};
  externalLinks = [];
  srcs = [];
  constructor() {}

  getUrl(link, baseUrl) {
    if (link.includes('http')) {
      return link;
    } else if (link.startsWith('/')) {
      return `${baseUrl}/${link}`;
    } else {
      return `${baseUrl}/${link}`;
    }
  }

  getImagesFromHTML(htmlBody, baseURL) {
    const dom = new JSDOM(htmlBody);
    const imgElements = dom.window.document.querySelectorAll('img');

    for (const imgElement of imgElements) {
      try {
        this.srcs.push(this.getUrl(imgElement.getAttribute('src'), baseURL));
      } catch (error) {
        console.log(`${error.message}: ${imgElement.src}`);
      }
    }

    return this.srcs;
  }

  getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];

    const dom = new JSDOM(htmlBody);
    const aElements = dom.window.document.querySelectorAll('a');

    for (const aElement of aElements) {
      // if relative url concatinate with base url
      if (aElement.href.slice(0, 1) === '/') {
        try {
          urls.push(new URL(aElement.href, baseURL).href);
        } catch (err) {
          console.log(`${err.message}: ${aElement.href}`);
        }
      }
      // else absolute url, return links href
      else {
        try {
          urls.push(new URL(aElement.href).href);
        } catch (err) {
          console.log(`${err.message}: ${aElement.href}`);
        }
      }
    }

    return urls;
  }

  normalizeURL(url) {
    const urlObj = new URL(url);

    // remove protocol
    let fullPath = `${urlObj.host}${urlObj.pathname}`;

    // account for href ending with /
    if (fullPath.length > 0 && fullPath.slice(-1) === '/') {
      fullPath = fullPath.slice(0, -1);
    }
    return fullPath;
  }

  async crawlPage(baseURL, currentURL) {
    const currentUrlObj = new URL(currentURL);
    const baseUrlObj = new URL(baseURL);

    // if an offsite URL
    // push to external links array, then return
    if (currentUrlObj.hostname !== baseUrlObj.hostname) {
      this.externalLinks.push(currentURL);
      return;
    }

    const normalizedURL = this.normalizeURL(currentURL);

    // if already visited this page, increase its count in the map
    if (this.pages[normalizedURL] > 0) {
      this.pages[normalizedURL]++;

      //don't repeat the http request
      return;
    }

    // if first occurence of the page, initialize it in the map
    this.pages[normalizedURL] = 1;

    // fetch and parse the html of the currentURL
    console.log(`crawling ${currentURL}`);
    let htmlBody = '';
    try {
      const res = await fetch(currentURL);

      // account for status error status code
      if (res.status > 399) {
        console.log(`Got HTTP error, status code: ${res.status}`);
        return;
      }

      // account for invalid html
      const contentType = res.headers.get('content-type');
      if (!contentType.includes('text/html')) {
        console.log(`Got non-html response: ${contentType}`);
        return;
      }

      // if all ok read html
      htmlBody = await res.text();
    } catch (err) {
      console.log(err.message);
    }

    const nextURLs = this.getURLsFromHTML(htmlBody, baseURL);
    this.getImagesFromHTML(htmlBody, baseURL);

    // crawl page recursively
    for (const nextURL of nextURLs) {
      await this.crawlPage(baseURL, nextURL);
    }

    return;
  }
}

module.exports = {
  CrawledPage,
};
