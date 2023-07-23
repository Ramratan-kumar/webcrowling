// const { workerData, parentPort } = require('worker_threads');
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const moment = require("moment")
module.exports = {
    extractHTML: extractHTML
}
function extractHTML(url) {
    return new Promise(async (resolve, reject) => {
        try {
            
            let pageHTML =await axios.get(url)
            let $ = cheerio.load(pageHTML.data)
            // fs.writeFileSync("./webContent.txt",pageHTML.data,(err)=>{
            //     console.log(err);
            // })
            // let pageHTML = fs.readFileSync("./webContent.html", { encoding: 'utf8', flag: 'r' });
            // let $ = cheerio.load(pageHTML)
            let totalPage = $("div.border-color--default__09f24__NPAKY.text-align--center__09f24__fYBGO>span.css-chan6m").text();
            totalPage = +totalPage.split(" ")[2];
            let overAllrating = $('div.border-color--default__09f24__NPAKY>div>div>div>span.display--inline__09f24__c6N_k.border-color--default__09f24__NPAKY').find('div').attr('aria-label')
            let totalReview = $('div.border-color--default__09f24__NPAKY').find('p.css-foyide').text()
            
            let commentList = { review_count: totalReview.split(" ")[0], overAllrating: overAllrating.split(" ")[0], aggregated_reviews: [] };
            // call for 1st page and extract result
          
            let $li = $('ul.undefined.list__09f24__ynIEd>li');
            await getCrawlingResult($, $li, commentList)

            let perPageRecord = 10
         
            for(let i=1;i<totalPage;i++){
                pageHTML = await axios.get(url+'?start='+perPageRecord*i);
                $ = cheerio.load(pageHTML.data)
                $li = $('ul.undefined.list__09f24__ynIEd>li');
                await getCrawlingResult($, $li, commentList)
            }
            return resolve(commentList);
        } catch (err) {
            reject(err)
        }
    })

}

function getCrawlingResult($, $li, commentList) {
    return new Promise((resolve, reject) => {
        try {
            $li.each(function (index) {
                let object = {}
                let name = $(this).find(`div.border-color--default__09f24__NPAKY
    >span.fs-block.css-ux5mu6
    >a`).text();
                let date = $(this).find(`div.border-color--default__09f24__NPAKY
    >div.arrange-unit__09f24__rqHTg.arrange-unit-fill__09f24__CUubG.border-color--default__09f24__NPAKY
    >span.css-chan6m:first`).text();
                let rating = $(this).find(`
    div.border-color--default__09f24__NPAKY
    >span.display--inline__09f24__c6N_k.border-color--default__09f24__NPAKY
    >div`)
                    .attr('aria-label')
                let comment = $(this).find(`div.margin-b2__09f24__CEMjT.border-color--default__09f24__NPAKY
    >p.comment__09f24__D0cxf.css-qgunke>span`).text()

                if (name) {
                    object.reviewer_name = name;
                    object.rating = +rating.split(" ")[0];
                    object.date = moment(date).format("YYYY-MM-DD");
                    object.comment = comment;
                    commentList.aggregated_reviews.push(object);
                    
                }
            });
            resolve('')
        } catch (err) {
            reject(err)
        }
    })
}

