const xlsx = require('xlsx');
const Expense = require("../models/Expense");


//Thêm khoản chi tiêu
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try{
        const { icon, category, amount, date } = req.body;

        //Xác thực dữ liệu
        if(!category || !amount || !date){
            return res.status(400).json({ message: "Vui lòng điền tất cả thông tin theo yêu cầu"});
        }

        const newExpense = new Expense({
            userId,
            icon, 
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({message: "Lỗi server!"});
    }
}

//Lấy thông tin tất cả khoản chi tiêu
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({userId}).sort({ date: -1});
        res.json(expense);
    } catch (error) {
        res.status(500).json({message: "Lỗi server!"});
    }
};


//Xóa khoản chi tiêu
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Xóa khoản chi tiêu thành công!"});
    } catch (error) {
        res.status(500).json({message: "Lỗi server!"});
    }
};

//Tải danh sách .xlxs về khoản chi tiêu
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1});

        //Chuẩn bị dữ liệu cho excel
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, 'expense_details.xlsx');
        res.download('expense_details.xlsx');
    } catch (error) {
        res.status(500).json({message: "Lỗi server!"});
    }
};