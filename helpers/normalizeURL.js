function normalizeURL(url) {
  const urlObj = new URL(url);

  // remove protocol
  let fullPath = `${urlObj.host}${urlObj.pathname}`;

  // account for href ending with /
  if (fullPath.length > 0 && fullPath.slice(-1) === '/') {
    fullPath = fullPath.slice(0, -1);
  }
  return fullPath;
}

module.exports = { normalizeURL };
