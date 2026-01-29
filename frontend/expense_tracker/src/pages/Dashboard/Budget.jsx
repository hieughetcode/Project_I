import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import Modal from "../../components/Modal";
import Input from "../../components/Inputs/Input";
import { LuPlus, LuTrash2, LuTrendingUp } from "react-icons/lu";

const Budget = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    
    // State cho form thêm mới
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");

    const fetchBudgets = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.BUDGET.GET_ALL_BUDGETS);
            setBudgets(response.data);
        } catch (error) {
            toast.error("Lỗi tải dữ liệu ngân sách");
        } finally {
            setLoading(false);
        }
    };

    const handleAddBudget = async () => {
        if (!category || !amount) {
            toast.error("Please fill in all fields");
            return;
        }
        try {
            await axiosInstance.post(API_PATHS.BUDGET.ADD_BUDGET, {
                category,
                amount: Number(amount)
            });
            toast.success("Budget set successfully!");
            setOpenAddModal(false);
            setCategory("");
            setAmount("");
            fetchBudgets();
        } catch (error) {
            toast.error("Lỗi khi thêm ngân sách");
        }
    };

    const handleDeleteBudget = async (id) => {
        if (window.confirm("Are you sure you want to delete this budget?")) {
            try {
                await axiosInstance.delete(API_PATHS.BUDGET.DELETE_BUDGET(id));
                toast.success("Budget deleted!");
                fetchBudgets();
            } catch (error) {
                toast.error("Lỗi khi xóa");
            }
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    return (
        <DashboardLayout activeMenu="Budget">
            <div className="my-5 mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Budget Management (This Month)</h2>
                    <button
                        onClick={() => setOpenAddModal(true)}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                    >
                        <LuPlus /> Create New
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map((item) => (
                        <div key={item._id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-medium text-gray-700 text-lg">{item.category}</h3>
                                    <p className="text-xs text-gray-400">Limit: ${item.amount.toLocaleString()}</p>
                                </div>
                                <button onClick={() => handleDeleteBudget(item._id)} className="text-red-400 hover:text-red-600">
                                    <LuTrash2 />
                                </button>
                            </div>

                            {/* Progress Bar Info */}
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="text-gray-600 font-medium">Spent: ${item.totalSpent.toLocaleString()}</span>
                                <span className={`font-bold ${item.percent > 100 ? "text-red-500" : "text-green-600"}`}>
                                    {item.percent}%
                                </span>
                            </div>

                            {/* Progress Bar Visual */}
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                                <div
                                    className={`h-2.5 rounded-full ${item.percent > 100 ? "bg-red-500" : "bg-green-500"}`}
                                    style={{ width: `${Math.min(item.percent, 100)}%` }}
                                ></div>
                            </div>
                            
                            {item.percent > 100 && (
                                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                    <LuTrendingUp /> Over budget!
                                </p>
                            )}
                        </div>
                    ))}
                    
                    {budgets.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-400">
                            No budget set yet.
                        </div>
                    )}
                </div>

                {/* Modal Thêm Ngân sách */}
                <Modal isOpen={openAddModal} onClose={() => setOpenAddModal(false)} title="Set Budget">
                    <div className="flex flex-col gap-4">
                        <Input
                            value={category}
                            onChange={({ target }) => setCategory(target.value)}
                            label="Category"
                            placeholder="e.g. Food, Transport"
                            type="text"
                        />
                        <Input
                            value={amount}
                            onChange={({ target }) => setAmount(target.value)}
                            label="Limit Amount ($)"
                            placeholder="e.g. 500"
                            type="number"
                        />
                        <button
                            onClick={handleAddBudget}
                            className="bg-primary text-white py-2 rounded-md hover:bg-primary/90 mt-2"
                        >
                            Save Budget
                        </button>
                    </div>
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Budget;