"use strict"
const workerService = require("./workerService");
const fs = require("fs")

module.exports = {
    workerController:workerController
}

async function workerController(req,res){
    try{
        let source = req.body.source_name;
        let url = req.body.url  ;
        let filter_date = req.body.filter_date;
        switch(source){
            case 'yelp':
                let cachedData = fs.readFileSync("./localcache.json",{ encoding: 'utf8', flag: 'r' });
                let data = {};
                if(cachedData){
                    data = JSON.parse(cachedData);
                }else{
                    data = await workerService.extractHTML(url);
                    fs.writeFileSync("./localcache.json",JSON.stringify(data))
                }
               
                if(filter_date){
                    data.aggregated_reviews = data.aggregated_reviews.filter((ele)=>ele.date<=filter_date)
                }
                
                return res.status(200).json(data)
            default:
                res.status(200).json({message:"no option provided"})
        }
       
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"some thing went wrong"})
    }
}