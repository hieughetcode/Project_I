import React from 'react';
import moment from "moment";
import { LuTrash2, LuPencil, LuDownload } from "react-icons/lu";

const ExpenseList = ({ transactions, onDelete, onEdit, onDownload }) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold text-gray-700">All Expenses</h5>
                
                {/* Nút Download mới đẹp hơn */}
                <button 
                    onClick={onDownload} 
                    className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
                >
                    <LuDownload className="text-base" />
                    Download
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {transactions?.map((expense) => (
                    <div key={expense._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-md hover:shadow-sm transition-all">
                        <div className="flex items-center gap-4">
                             <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-xl">
                                {expense.icon}
                            </div>
                            <div>
                                <h6 className="text-sm font-medium text-gray-900">{expense.category}</h6>
                                <span className="text-xs text-gray-500">{moment(expense.date).format("Do MMM YYYY")}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                             <span className="text-sm font-semibold text-gray-700 mr-2">
                                ${expense.amount}
                            </span>
                            
                            <button 
                                onClick={() => onEdit(expense)}
                                className="text-slate-400 hover:text-primary transition-colors"
                            >
                                <LuPencil size={18} />
                            </button>

                            <button 
                                onClick={() => onDelete(expense._id)} 
                                className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <LuTrash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {transactions?.length === 0 && (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        No expenses found.
                    </div>
                )}
            </div>
        </div>
    );
};
export default ExpenseList;