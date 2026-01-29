const xlsx = require('xlsx');
const Expense = require("../models/Expense");


//Thêm khoản chi tiêu
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try{
        const { icon, category, amount, date } = req.body;

        //Xác thực dữ liệu
        if(!category || !amount || !date){
            return res.status(400).json({ message: "Please fill in all required fields"});
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
    // 1. Lấy tham số từ query string (VD: ?startDate=...&endDate=...)
    const { startDate, endDate, search } = req.query; 

    try {
        // Khởi tạo điều kiện tìm kiếm cơ bản
        let query = { userId };

        // 2. Nếu có lọc theo ngày
        if (startDate && endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Đặt cuối ngày để lấy trọn vẹn ngày đó

            query.date = {
                $gte: new Date(startDate), // Lớn hơn hoặc bằng ngày bắt đầu
                $lte: end                  // Nhỏ hơn hoặc bằng ngày kết thúc
            };
        }

        // 3. (Tùy chọn) Nếu muốn tìm kiếm theo tên danh mục (Category)
        if (search) {
            query.category = { $regex: search, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
        }

        const expense = await Expense.find(query).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};


//Xóa khoản chi tiêu
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully!"});
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

exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, amount, date, icon } = req.body;

        const updatedExpense = await Expense.findByIdAndUpdate(
            id,
            { category, amount, date, icon },
            { new: true } // Trả về dữ liệu mới sau khi update
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};