function getLinksURL(link, baseURL) {
  // if relative url concatinate with base url
  if (link.href.slice(0, 1) === '/') {
    try {
      const linkURL = new URL(link.href, baseURL).href;
      return linkURL;
    } catch (err) {
      console.log(`${err.message}: ${link.href}`);
    }
  }
  // else absolute url, return links href
  else {
    try {
      const linkURL = new URL(link.href).href;
      return linkURL;
    } catch (err) {
      console.log(`${err.message}: ${link.href}`);
    }
  }
}

module.exports = { getLinksURL };
