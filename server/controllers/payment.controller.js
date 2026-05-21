const axios = require("axios");
const crypto = require("crypto");
const Payment = require("../models/Payment");

// PhonePe UAT Credentials (Use .env for production)
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "PGTESTPAYUAT";
const SALT_KEY = process.env.PHONEPE_SALT_KEY || "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || "1";

const IS_PROD = process.env.PHONEPE_ENV === "production";
const PHONEPE_API_URL = IS_PROD 
    ? "https://api.phonepe.com/apis/hermes/pg/v1/pay" 
    : "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

const PHONEPE_STATUS_URL = IS_PROD 
    ? "https://api.phonepe.com/apis/hermes/pg/v1/status" 
    : "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status";

const initiatePayment = async (req, res) => {
    try {
        const { amount, subjectName, unitId } = req.body;
        const merchantTransactionId = `T${Date.now()}`;
        
        const payload = {
            merchantId: MERCHANT_ID,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: "MUID" + Date.now(),
            amount: amount * 100, // Amount in paise
            redirectUrl: `http://localhost:5173/payment/status/${merchantTransactionId}`,
            redirectMode: "POST",
            callbackUrl: `${process.env.BACKEND_URL}/api/payment/callback`,
            mobileNumber: "9999999999",
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        };

        const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
        const base64Payload = bufferObj.toString("base64");

        const stringToHash = base64Payload + "/pg/v1/pay" + SALT_KEY;
        const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
        const checksum = sha256 + "###" + SALT_INDEX;

        const options = {
            method: "POST",
            url: PHONEPE_API_URL,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
            },
            data: {
                request: base64Payload,
            },
        };

        const response = await axios.request(options);

        // Save pending payment record
        const newPayment = new Payment({
            transactionId: merchantTransactionId,
            merchantTransactionId: merchantTransactionId,
            amount: amount,
            subjectName: subjectName,
            unitId: unitId,
            status: "PENDING"
        });
        await newPayment.save();

        res.status(200).json({
            success: true,
            url: response.data.data.instrumentResponse.redirectInfo.url,
        });
    } catch (error) {
        console.error("Payment initiation error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "Payment initiation failed" });
    }
};

const checkStatus = async (req, res) => {
    try {
        const { merchantTransactionId } = req.params;

        const stringToHash = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + SALT_KEY;
        const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
        const checksum = sha256 + "###" + SALT_INDEX;

        const options = {
            method: "GET",
            url: `${PHONEPE_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
                "X-MERCHANT-ID": MERCHANT_ID,
            },
        };

        const response = await axios.request(options);

        if (response.data.success && response.data.code === "PAYMENT_SUCCESS") {
            await Payment.findOneAndUpdate(
                { merchantTransactionId },
                { status: "SUCCESS", paymentResponse: response.data }
            );
            return res.status(200).json({ success: true, message: "Payment successful" });
        } else {
            await Payment.findOneAndUpdate(
                { merchantTransactionId },
                { status: "FAILED", paymentResponse: response.data }
            );
            return res.status(200).json({ success: false, message: "Payment failed" });
        }
    } catch (error) {
        console.error("Status check error:", error.message);
        res.status(500).json({ success: false, message: "Status check failed" });
    }
};

const handleCallback = async (req, res) => {
    // PhonePe will send a POST request with encoded response
    // For simplicity, we usually rely on frontend status check or webhooks
    console.log("Payment Callback Received:", req.body);
    res.status(200).send("OK");
};

module.exports = { initiatePayment, checkStatus, handleCallback };
