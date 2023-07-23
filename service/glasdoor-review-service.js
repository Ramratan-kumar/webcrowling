// const { workerData, parentPort } = require('worker_threads');
const cheerio = require("cheerio");
const axios = require("axios");
const moment = require("moment");
const CONSTANTS = require("../CONSTANTS")
const api_url = CONSTANTS.PAGE_2API;
module.exports = {
    extractHTML: extractHTML
}
function extractHTML(url) {
    return new Promise(async (resolve, reject) => {
        try {
           
            const payload = {
              api_key: CONSTANTS.PAGE_2API_KEY,
              premium_proxy: 'us',
              real_browser: true,
              javascript: false,    
              merge_loops: true,
              url: url,
           
              scenario: [
                {
                  loop: [
                    { wait_for: 'div.gdReview' },
                    { execute: 'parse' },
                    { execute_js: 'document.querySelector(".nextButton")?.click()' },
                    { "wait": 1 }
                  ],
                   iterations: 20,
                  stop_condition: 'document.querySelector(".nextButton") === null'
                }
              ],
              parse: {
                overAllrating:[{
                    _parent:"div.d-none",
                    rating:"div.count >> text"
                }],
                reviews: [
                  {  
                    _parent: 'div.gdReview',
                    title: 'a.reviewLink >> text',
                    author_info: '[class*=newUiJobLine] .middle >> text',
                    rating: 'span.ratingNumber >> text',
                    pros: 'span[data-test=pros] >> text',
                    cons: 'span[data-test=cons] >> text',
                    helpful: 'div.common__EiReviewDetailsStyle__socialHelpfulcontainer >> text'
                  }
                ]
              }
            };
            axios.post(api_url, payload)
              .then((res) => {
                let formatedReivew = formateReivewObject(res.data.result)
                return resolve(formatedReivew);
              }).catch((err) => {
                 console.error(err);
                 reject(err)
              });   
        } catch (err) {
          console.log(err);
            reject(err)
        }
    })
}

function formateReivewObject(reviewResult){
    let reivewList = {review_count:reviewResult.overAllrating[1].rating,aggregated_reviews:[]}
    for(let ele of reviewResult.reviews){
        let obj = {
            reviewer_name : ele.author_info.split("-")[1],
            rating : +ele.rating,
            date : moment(ele.author_info.split("-")[0]).format("YYYY-MM-DD"),
            comment : {pros:ele.pros,cons:ele.cons}
        }
        reivewList.aggregated_reviews.push(obj);
    }
   return reivewList;
    
}
