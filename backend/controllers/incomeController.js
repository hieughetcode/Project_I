const xlsx = require('xlsx');
const Income = require("../models/Income");

exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try{
        const { icon, source, amount, date } = req.body;

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
        res.status(500).json({message: "Server Error"});
    }
}

exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate, search } = req.query; 

    try {
        let query = { userId };

        if (startDate && endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            query.date = {
                $gte: new Date(startDate),
                $lte: end
            };
        }

        if (search) {
            query.source = { $regex: search, $options: "i" }; 
        }

        const income = await Income.find(query).sort({ date: -1});
        res.json(income);
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income deleted successfully!"});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};

exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const income = await Income.find({ userId }).sort({ date: -1});

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
        res.status(500).json({message: "Server Error"});
    }
};

exports.updateIncome = async (req, res) => {
    try {
        const { id } = req.params;
        const { source, amount, date, icon } = req.body;

        const updatedIncome = await Income.findByIdAndUpdate(
            id,
            { source, amount, date, icon },
            { new: true }
        );

        if (!updatedIncome) {
            return res.status(404).json({ message: "Income not found" });
        }

        res.status(200).json(updatedIncome);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};