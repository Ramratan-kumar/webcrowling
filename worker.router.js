const express = require("express");
const router= express.Router();
const controller = require("./workerController")
router.get("/aggregate",controller.workerController);
module.exports = router