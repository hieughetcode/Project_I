const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { addBudget, getAllBudgets, deleteBudget, updateBudget } = require("../controllers/budgetController");

router.post("/add", protect, addBudget);
router.get("/get", protect, getAllBudgets);
router.delete("/:id", protect, deleteBudget);
router.put("/:id", protect, updateBudget);

module.exports = router;