function normalizeURL(urlString) {
  const urlObj = new URL(urlString);

  // remove protocol
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;

  //remove trailing slahe
  if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
    return hostPath.slice(0, -1);
  }

  return hostPath;
}

module.exports = {
  normalizeURL,
};
