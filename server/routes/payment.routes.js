const express = require("express");
const router = express.Router();
const { initiatePayment, checkStatus, handleCallback } = require("../controllers/payment.controller");

router.post("/initiate", initiatePayment);
router.get("/status/:merchantTransactionId", checkStatus);
router.post("/callback", handleCallback);

module.exports = router;
