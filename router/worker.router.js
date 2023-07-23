"use strict"
const express = require("express");
const router= express.Router();
const controller = require("../controller/workerController")
router.get("/aggregate",controller.workerController);
module.exports = router