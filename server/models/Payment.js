const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    merchantTransactionId: { type: String, required: true },
    userId: { type: String }, // Optional if you have users
    amount: { type: Number, required: true },
    status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
    subjectName: { type: String },
    unitId: { type: String },
    paymentResponse: { type: Object },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);
