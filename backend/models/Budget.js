const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true }, // Tên danh mục (Ăn uống, Di chuyển...)
    amount: { type: Number, required: true },   // Số tiền giới hạn
}, { timestamps: true });

module.exports = mongoose.model("Budget", BudgetSchema);