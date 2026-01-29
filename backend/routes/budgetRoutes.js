const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { addBudget, getAllBudgets, deleteBudget } = require("../controllers/budgetController");

router.post("/add", protect, addBudget);
router.get("/get", protect, getAllBudgets);
router.delete("/:id", protect, deleteBudget);

module.exports = router;