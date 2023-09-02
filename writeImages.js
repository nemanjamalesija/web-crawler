const fs = require('fs');
const https = require('https');
const sanitize = require('sanitize-filename');

function writeImages(imagesArray) {
  for (const imageUrl of imagesArray) {
    const imageName = `./images/${sanitize(imageUrl)}`;
    const file = fs.createWriteStream(imageName);

    https
      .get(imageUrl, (response) => {
        response.pipe(file);

        file.on('finish', () => {
          file.close();
        });
      })
      .on('error', (err) => {
        fs.unlink(imageName);
      });
  }
}

module.exports = { writeImages };
