"use strict"
module.exports = {
    sortReivewByDate:sortReivewByDate
}

async function sortReivewByDate(data){
   
    let sortedData = data.aggregated_reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    data.aggregated_reviews = sortedData;
        
}