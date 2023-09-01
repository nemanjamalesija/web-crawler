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
    } else {
      // absolute url
      try {
        const urlObj = new URL(`${link.href}`);
        urls.push(urlObj.href);
      } catch (error) {
        console.log(`Invalid absolute url: ${error.message}`);
      }
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

module.exports = {
  normalizeURL,
  getURLsFomHTML,
};
