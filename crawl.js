const { JSDOM } = require('jsdom');

function getURLsFomHTML(htmlBODY, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBODY);
  const linkElements = dom.window.document.querySelectorAll('a');

  linkElements.forEach((link) => {
    if (link.href.slice(0, 1) === '/') {
      // relative url

      try {
        const urlObj = new URL(`${baseURL}${link.href}`);
        urls.push(urlObj.href);
      } catch (error) {
        console.log(`Invalid relative url: ${error.message}`);
      }
    }

    // else absolute url
    try {
      const urlObj = new URL(`${link.href}`);
      urls.push(urlObj.href);
    } catch (error) {
      console.log(`Invalid absolute url: ${error.message}`);
    }
  });

  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);

  // remove protocol
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;

  //remove trailing slahes
  if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
    return hostPath.slice(0, -1);
  }

  return hostPath;
}

async function crawlPage(currentURL) {
  try {
    // account for invalid URL
    const res = await fetch(currentURL);

    // account for status error status code
    if (res.status > 399) {
      console.log(
        `Error while fetching with status code: ${error.status}, on page: ${currentURL}`
      );
      return;
    }

    // check if its valid html
    const contentType = res.headers.get('content-type');
    if (!contentType.includes('text/html')) {
      console.log(
        `Invalid html in response, content type: ${contentType}, on page: ${currentURL}`
      );
      return;
    }

    console.log(await res.text());
  } catch (error) {
    console.log(
      `Error while fetching: ${error.message}, on page: ${currentURL}`
    );
  }
}

module.exports = {
  normalizeURL,
  getURLsFomHTML,
  crawlPage,
};
