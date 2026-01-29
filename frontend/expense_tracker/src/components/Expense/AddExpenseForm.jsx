import React, { useState, useEffect } from 'react';
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
import moment from "moment";

// Nhận thêm prop 'expenseInfo' (dữ liệu cần sửa)
const AddExpenseForm = ({ onAddExpense, expenseInfo }) => {
    const [income, setIncome] = useState({
        category: "",
        amount: "",
        date: "",
        icon: "",
    });

    // Nếu có expenseInfo (tức là đang sửa), điền dữ liệu vào form
    useEffect(() => {
        if (expenseInfo) {
            setIncome({
                category: expenseInfo.category,
                amount: expenseInfo.amount,
                // Chuyển ngày về định dạng YYYY-MM-DD cho input type="date"
                date: moment(expenseInfo.date).format("YYYY-MM-DD"), 
                icon: expenseInfo.icon,
            });
        }
    }, [expenseInfo]);

    const handleChange = (key, value) => setIncome({ ...income, [key]: value });

    return (
        <div>
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={income.category}
                onChange={({ target }) => handleChange("category", target.value)}
                label="Category"
                placeholder="Rent, Groceries, etc"
                type="text"
            />

            <Input
                value={income.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder=""
                type="number"
            />

            <Input
                value={income.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className="add-btn add-btn-fill"
                    onClick={() => onAddExpense(income)}
                >
                    {/* Đổi tên nút tùy theo đang thêm hay sửa */}
                    {expenseInfo ? "Update Expense" : "Add Expense"}
                </button>
            </div>
        </div>
    );
}

export default AddExpenseForm;