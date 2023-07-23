
const puppeteer = require('puppeteer');
module.exports = {
    extractHTML:extractHTML
}
async function extractHTML(url){
    try{
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport:false,
            userDataDir:"./temp"
           
        });
        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: "load"
        });
        let element  = await page.$("div.x78zum5.xdt5ytf.x4cne27.xifccgj>div.xzueoph.x1k70j0n");
        let overAllrating =  await page.evaluate(el => el.querySelector("h2>span").textContent, element)
       
       let reivewObj = formatReviewAndRating(overAllrating)
       let cardsHandler = await page.$$(".x9f619.x193iq5w.x1sltb1f.x3fxtfs.x1swvt13.x1pi30zi.xw7yly9.x1xwk8fm>div>div")
   
       reivewObj.aggregated_reviews = [] 
       for(let ele of cardsHandler){
            let object = {}
            object.name =  await page.evaluate(el => el.querySelector("span.xt0psk2>span").textContent, ele);
            object.comment = await page.evaluate(el=> el.querySelector("div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs.x126k92a>div").textContent,ele)
            //let dateSector1 = await page.evaluate(el=> el.querySelector("span.xmper1u.xt0psk2.xjb2p0i.x1qlqyl8.x15bjb6t.x1n2onr6.x17ihmo5.x1g77sc7").textContent,ele)
            object.like = await page.evaluate(el=>el.querySelector("span.xt0b8zv.x1jx94hy.xrbpyxo.xl423tq>span").textContent,ele)
            object.date = "";
            reivewObj.aggregated_reviews.push(object);
        }
        return reivewObj
    }catch(err){
        console.log(err);
    }
  
}

function formatReviewAndRating(value){
   let v =  value.split("(");
   let rating = v[0].trim().split(" ")[2];
   let review = v[1].trim().split(" ")[0]
   return {review_count: review, overAllrating: rating}
}
