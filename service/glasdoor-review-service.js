// const { workerData, parentPort } = require('worker_threads');
const puppeteer = require('puppeteer');
const moment = require("moment");

module.exports = {
  extractHTML: extractHTML
}
async function extractHTML(url) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false,
      userDataDir: "./temp"

    });
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "load"
    });
    // await page.click('a[data-test=reviewSeeAllLink]')
    // await require('util').promisify(setTimeout)(3000);

    await Promise.all([
      page.click('a[data-test=reviewSeeAllLink]'),
      page.waitForNavigation({waitUntil: 'networkidle2'})
   ]);
    let el = await page.$("div.d-flex.justify-content-between.justify-content-sm-around.mx-std");
    let review = await page.evaluate(el => el.querySelectorAll("a")[1].textContent, el);

    el = await page.$("div.empStatsBody");

    let overAllRating = await page.evaluate(el => el.querySelector("div.v2__EIReviewsRatingsStylesV2__ratingNum.v2__EIReviewsRatingsStylesV2__large").textContent, el);

    let reivewObj = { review_count: parseInt(review.replace("Reviews", '')), over_all_raring: overAllRating, aggregated_reviews: [] }

    totalPage = getTotalPage(reivewObj.review_count);

    reivewObj.aggregated_reviews = []

    for (let pageNo = 1; pageNo <= totalPage; pageNo++) {

      let cardsHandler = await page.$$("ol>li")

      await getReviewPageWise(page, cardsHandler, reivewObj)
      if (pageNo != totalPage) {
        await page.click('.nextButton');
        await require('util').promisify(setTimeout)(3000);
      }
    }
    await browser.close();
    return reivewObj

  } catch (err) {
    console.log(err);
    throw err;
  }

}


async function getReviewPageWise(page, cardsHandler, reivewObj) {
  try {
    for (let ele of cardsHandler) {
      try {
        let object = {}
        object.rating = await page.evaluate(el => el.querySelector("span.ratingNumber").textContent, ele);
        object.name = await page.evaluate(el => el.querySelector("span.pt-xsm.pt-md-0.css-1qxtz39.eg4psks0").textContent, ele);
        let date = await page.evaluate(el => el.querySelector("span.middle.common__EiReviewDetailsStyle__newGrey").textContent, ele);
        object.date = moment(date.split("-")[0]).format("YYYY-MM-DD");
        object.comment = {
          pros: await page.evaluate(el => el.querySelector("span[data-test=pros]").textContent, ele),
          cons: await page.evaluate(el => el.querySelector("span[data-test=cons]").textContent, ele)
        }

        reivewObj.aggregated_reviews.push(object);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    throw err
  }
}
function getTotalPage(reviewCount) {
  if (Math.round(reviewCount / 10) < reviewCount / 10) {

    return Math.round(reviewCount / 10) + 1
  } else {
    return Math.round(reviewCount / 10)
  }
}
