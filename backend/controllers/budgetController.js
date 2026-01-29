const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

exports.addBudget = async (req, res) => {
    const userId = req.user.id;
    const { category, amount } = req.body;

    try {
        if (!category || !amount) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const existingBudget = await Budget.findOne({ userId, category });
        if (existingBudget) {
            existingBudget.amount = amount;
            await existingBudget.save();
            return res.status(200).json(existingBudget);
        }

        const newBudget = new Budget({ userId, category, amount });
        await newBudget.save();
        res.status(200).json(newBudget);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getAllBudgets = async (req, res) => {
    const userId = req.user.id;
    try {
        const budgets = await Budget.find({ userId }).sort({ createdAt: -1 });

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const expenses = await Expense.find({
            userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const result = budgets.map((budget) => {
            const totalSpent = expenses
                .filter(e => e.category === budget.category)
                .reduce((sum, record) => sum + record.amount, 0);
            
            return {
                ...budget._doc,
                totalSpent,
                percent: totalSpent > 0 ? Math.round((totalSpent / budget.amount) * 100) : 0
            };
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.deleteBudget = async (req, res) => {
    try {
        await Budget.findByIdAndDelete(req.params.id);
        res.json({ message: "Budget deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.updateBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, amount } = req.body;

        const updatedBudget = await Budget.findByIdAndUpdate(
            id,
            { category, amount },
            { new: true }
        );

        if (!updatedBudget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.status(200).json(updatedBudget);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};