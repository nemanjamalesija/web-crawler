const { CrawledPage } = require('./crawledPage.js');
const { printReport } = require('./report.js');
const { writeImages } = require('./writeImages.js');

async function main() {
  if (process.argv.length < 3) {
    console.log('no website provided');
  }
  if (process.argv.length > 3) {
    console.log('too many arguments provided');
  }

  const baseURL = process.argv[2];

  console.log(`starting crawl of: ${baseURL}...`);

  const crawledPage = new CrawledPage();

  await crawledPage.crawlPage(baseURL, baseURL);

  writeImages(crawledPage.srcs);
  printReport(crawledPage.pages, crawledPage.externalLinks, crawledPage.srcs);
}

main();
