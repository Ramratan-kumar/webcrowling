

const extractHTML = require("./extratHTML")
module.exports = {
    facebookReivew: facebookReivew
}
async function facebookReivew(url) {
    try {
        let browerObj = await extractHTML(url);
        let page = browerObj.page;
        await require('util').promisify(setTimeout)(3000);
        let element = await page.$("div.x78zum5.xdt5ytf.x4cne27.xifccgj>div.xzueoph.x1k70j0n");
        let overAllrating = await page.evaluate(el => el.querySelector("h2>span").textContent, element)
        let reivewObj = formatReviewAndRating(overAllrating);
        let previousHeight = await page.evaluate('document.body.scrollHeight');
        let totalRecord = 0;
        
        while (true) {
            let cardsHandler = await page.$$(`div.x9f619.x1n2onr6.x1ja2u2z.xeuugli.xs83m0k.x1xmf6yo.x1emribx.x1e56ztr.x1i64zmx.xjl7jj.x19h7ccj.xu9j1y6.x7ep2pv
       >div.x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z`)
            reivewObj.aggregated_reviews = [];
            getReview(page,cardsHandler,reivewObj)
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await require('util').promisify(setTimeout)(3000);
            // await page.waitForTimeout(2000);
            currentHeight = await page.evaluate('document.body.scrollHeight');
            await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
            
            if(totalRecord == reivewObj.aggregated_reviews.length){
               break;
            }
            totalRecord = reivewObj.aggregated_reviews.length
        
        }
        await browerObj.browser.close();
        return reivewObj;
    } catch (err) {
        throw err;
    }

}

async function getReview(page,cardsHandler,reivewObj){
    for (let ele of cardsHandler) {
        try {
            let object = {}
            object.reviewer_name =  await page.evaluate(el => el.querySelector("span.xt0psk2>span").textContent, ele); 
            object.comment = await page.evaluate(el => el.querySelector("div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs.x126k92a>div").textContent, ele)
            //let dateSector1 = await page.evaluate(el=> el.querySelector("span.xmper1u.xt0psk2.xjb2p0i.x1qlqyl8.x15bjb6t.x1n2onr6.x17ihmo5.x1g77sc7").textContent,ele)
            object.like = +await page.evaluate(el => el.querySelector("span.xt0b8zv.x1jx94hy.xrbpyxo.xl423tq>span").textContent, ele)
            object.date = "";
            object.raiting=0
            reivewObj.aggregated_reviews.push(object);
        } catch (err) {
            
        }
    }
}

function formatReviewAndRating(value) {
    let v = value.split("(");
    let rating = v[0].trim().split(" ")[2];
    let review = v[1].trim().split(" ")[0]
    return { review_count: +review, over_all_rating: +rating }
}


