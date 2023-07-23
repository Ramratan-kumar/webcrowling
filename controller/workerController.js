"use strict"
const workerService = require("../service/yelp-reivew-service");
const glassdoorService = require("../service/glasdoor-review-service")
const fs = require("fs");
const filterService = require("../service/filter-by-date-service");
const sortByDateService = require("../service/sorting-by-date-service");

module.exports = {
    workerController: workerController
}

async function workerController(req, res) {
    try {
        let source = req.body.source_name;
        let url = req.body.url;
        let filter_date = req.body.filter_date;
        switch (source) {
            case 'yelp':
                let cachedData = fs.readFileSync("./localcache.json", { encoding: 'utf8', flag: 'r' });
                let data = {};
                if (cachedData) {
                    data = JSON.parse(cachedData);
                } else {
                    data = await workerService.extractHTML(url);
                    fs.writeFileSync("./localcache.json", JSON.stringify(data))
                }
                sortByDateService.sortReivewByDate(data)
                if (filter_date) {
                    filterService.filterReivewByDate(filter_date, data)
                }
                getReviewCount(data)
                return res.status(200).json(data)
            case 'glassdoor':
                let glassdoorReivew = await glassdoorService.extractHTML(req.body.url);
                sortByDateService.sortReivewByDate(glassdoorReivew)
                if (filter_date) {
                    filterService.filterReivewByDate(filter_date, glassdoorReivew)
                }
                getReviewCount(glassdoorReivew)
                return res.status(200).json(glassdoorReivew)

            default:
                res.status(200).json({ message: "no option provided" })
        }

    } catch (err) {
        return res.status(400).json({
            "response_code": 400,
            "error": {
                "message": "Network Issue"
            }
        })
    }
}

function getReviewCount(data){
    data.review_aggregated_count = data.aggregated_reviews.length;
    data.response_code = 200
}