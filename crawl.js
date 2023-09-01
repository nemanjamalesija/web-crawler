const { JSDOM } = require('jsdom');

class CrawledPage {
  pages = {};
  externalLinks = [];
  constructor() {}

  getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const aElements = dom.window.document.querySelectorAll('a');
    for (const aElement of aElements) {
      if (aElement.href.slice(0, 1) === '/') {
        // relative url
        try {
          urls.push(new URL(aElement.href, baseURL).href);
        } catch (err) {
          console.log(`${err.message}: ${aElement.href}`);
        }
      } else {
        // absolute url
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
    if (fullPath.length > 0 && fullPath.slice(-1) === '/') {
      fullPath = fullPath.slice(0, -1);
    }
    return fullPath;
  }

  async crawlPage(baseURL, currentURL) {
    // if this is an offsite URL, push to external links array, then return
    const currentUrlObj = new URL(currentURL);
    const baseUrlObj = new URL(baseURL);
    if (currentUrlObj.hostname !== baseUrlObj.hostname) {
      this.externalLinks.push(currentURL);
      return;
    }

    const normalizedURL = this.normalizeURL(currentURL);

    // if already visited this page
    // just increase the count and don't repeat
    // the http request
    if (this.pages[normalizedURL] > 0) {
      this.pages[normalizedURL]++;

      return;
    }

    // initialize this page in the map
    // since it doesn't exist yet

    this.pages[normalizedURL] = 1;

    // fetch and parse the html of the currentURL
    console.log(`crawling ${currentURL}`);
    let htmlBody = '';
    try {
      const resp = await fetch(currentURL);

      // account for status error status code
      if (resp.status > 399) {
        console.log(`Got HTTP error, status code: ${resp.status}`);
        return;
      }
      const contentType = resp.headers.get('content-type');
      if (!contentType.includes('text/html')) {
        console.log(`Got non-html response: ${contentType}`);
        return;
      }
      htmlBody = await resp.text();
    } catch (err) {
      console.log(err.message);
    }

    const nextURLs = this.getURLsFromHTML(htmlBody, baseURL);
    for (const nextURL of nextURLs) {
      await this.crawlPage(baseURL, nextURL);
    }

    return;
  }
}

module.exports = {
  CrawledPage,
};
