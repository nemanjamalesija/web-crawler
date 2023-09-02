function getImagesURL(src, baseURL) {
  if (src.includes('http')) {
    return src;
  } else if (src.startsWith('/')) {
    return `${baseURL}/${src}`;
  } else {
    return `${baseURL}/${src}`;
  }
}

module.exports = {
  getImagesURL,
};
