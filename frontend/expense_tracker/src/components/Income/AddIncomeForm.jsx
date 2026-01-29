import React, { useState, useEffect } from 'react'
import Input from '../Inputs/Input';
import EmojiPickerPopup from '../EmojiPickerPopup';
import moment from "moment";

const AddIncomeForm = ({ onAddIncome, incomeInfo }) => {
    const [income, setIncome] = useState({
        source: "",
        amount: "",
        date: "",
        icon: "",
    });

    useEffect(() => {
        if (incomeInfo) {
            setIncome({
                source: incomeInfo.source,
                amount: incomeInfo.amount,
                date: moment(incomeInfo.date).format("YYYY-MM-DD"),
                icon: incomeInfo.icon,
            });
        }
    }, [incomeInfo]);

    const handleChange = (key, value) => setIncome({...income, [key]: value});

  return (
    <div>
        <EmojiPickerPopup
            icon={income.icon}
            onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
        />

        <Input 
            value={income.source}
            onChange={({ target }) => handleChange("source", target.value)}
            label="Income Source"
            placeholder="e.g. Salary, Freelance"
        />

        <Input 
            value={income.amount}
            onChange={({target}) => handleChange("amount", target.value)}
            label="Amount"
            placeholder=""
            type="number"
        />

        <Input
            value={income.date}
            onChange={({target}) => handleChange("date", target.value)}
            label="Date"
            placeholder=""
            type="date"
        />

        <div className="flex justify-end mt-6">
            <button
                type="button"
                className="add-btn add-btn-fill"
                onClick={() => onAddIncome(income)}
            >
                {incomeInfo ? "Update Income" : "Add Income"}
            </button>
        </div>
    </div>
  )
}

export default AddIncomeForm;