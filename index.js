"use strict"

const express = require("express");
var bodyParser = require('body-parser')
var multer = require('multer');
var upload = multer();

const app = express();



app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array()); 
app.use(express.static('public'));
app.use("/reviews",require("./worker.router"))
app.listen(8080,function(err,success){
    if(!err){
        console.log("server litning on 8080")
    }
})