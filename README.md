# webcrowling
Steps for project setup
1. install nodejs v14.20.0
2. install node package using npm install
3. start project using npm start

-------------------------------------------------------------
bootstrap of application
index.js

start application using
npm start or node index.js

---------------------------------------------------------------

request Object

type: form data
api:http://localhost:8080/reviews/aggregate
method: post

request:{
    source_name:string
    url:string
    filter_date:string
}
--------------------------------------------------
success response

response :{

    "review_count": number,
    "over_all_rating": number,
    "aggregated_reviews": [
        {
            "name": String,
            "comment": String
            "like": Number,
            "date": String,
            "raiting": Number
        }
    ],
    "review_aggregated_count": Number,
    "response_code": status_code
}
--------------------------------------------------
failed_response:
{
    "response_code": 400,
    "error": {
        "message": "Network Issue"
    }
}
