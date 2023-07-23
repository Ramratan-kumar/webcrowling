"use strict"
module.exports = {
    filterReivewByDate:filterReivewByDate
}

async function filterReivewByDate(filterDate,data){
    if(filterDate){
        data.aggregated_reviews = data.aggregated_reviews.filter((ele)=>ele.date<=filterDate);
       
    }
}