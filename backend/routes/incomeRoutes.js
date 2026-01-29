const express = require("express");
const { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel, updateIncome } = require("../controllers/incomeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.delete("/:id", protect, deleteIncome);
router.get("/download", protect, downloadIncomeExcel);
router.put("/:id", protect, updateIncome);

module.exports = router;