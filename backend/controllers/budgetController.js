const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

// Thêm ngân sách
exports.addBudget = async (req, res) => {
    const userId = req.user.id;
    const { category, amount } = req.body;

    try {
        if (!category || !amount) {
            return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
        }

        // Kiểm tra xem danh mục này đã có ngân sách chưa, nếu có thì update
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
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Lấy danh sách ngân sách kèm theo số tiền đã chi tiêu trong tháng
exports.getAllBudgets = async (req, res) => {
    const userId = req.user.id;
    try {
        // 1. Lấy tất cả ngân sách đã cài đặt
        const budgets = await Budget.find({ userId }).sort({ createdAt: -1 });

        // 2. Tính tổng chi tiêu của tháng hiện tại cho từng danh mục
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        // Lấy tất cả chi tiêu trong tháng này
        const expenses = await Expense.find({
            userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // 3. Ghép số liệu vào danh sách budget
        const result = budgets.map((budget) => {
            // Lọc ra các khoản chi thuộc danh mục này
            const totalSpent = expenses
                .filter(e => e.category === budget.category)
                .reduce((sum, record) => sum + record.amount, 0);
            
            return {
                ...budget._doc,
                totalSpent, // Số tiền đã tiêu
                percent: totalSpent > 0 ? Math.round((totalSpent / budget.amount) * 100) : 0 // % đã tiêu
            };
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Xóa ngân sách
exports.deleteBudget = async (req, res) => {
    try {
        await Budget.findByIdAndDelete(req.params.id);
        res.json({ message: "Đã xóa ngân sách" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};