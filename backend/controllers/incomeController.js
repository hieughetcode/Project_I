

const xlsx = require('xlsx');
const Income = require("../models/Income");


//Thêm nguồn thu nhập
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try{
        const { icon, source, amount, date } = req.body;

        //Xác thực dữ liệu
        if(!source || !amount || !date){
            return res.status(400).json({ message: "Please fill in all required fields"});
        }

        const newIncome = new Income({
            userId,
            icon, 
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({message: "Lỗi server!"});
    }
}

//Lấy thông tin tất cả nguồn thu nhập
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;
    // 1. Nhận tham số từ query string
    const { startDate, endDate, search } = req.query; 

    try {
        let query = { userId };

        // 2. Lọc theo ngày (nếu có)
        if (startDate && endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Lấy hết ngày kết thúc

            query.date = {
                $gte: new Date(startDate),
                $lte: end
            };
        }

        // 3. Tìm kiếm theo nguồn thu (Source)
        if (search) {
            // Tìm gần đúng (không phân biệt hoa thường)
            query.source = { $regex: search, $options: "i" }; 
        }

        const income = await Income.find(query).sort({ date: -1});
        res.json(income);
    } catch (error) {
        res.status(500).json({message: "Lỗi server!"});
    }
};


//Xóa nguồn thu nhập
exports.deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income deleted successfully!"});
    } catch (error) {
        res.status(500).json({message: "Lỗi server!"});
    }
};

//Tải danh sách .xlxs về nguồn thu nhập
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const income = await Income.find({ userId }).sort({ date: -1});

        //Chuẩn bị dữ liệu cho excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, 'income_details.xlsx');
        res.download('income_details.xlsx');
    } catch (error) {
        res.status(500).json({message: "Lỗi server!"});
    }
};