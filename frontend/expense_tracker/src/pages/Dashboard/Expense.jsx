import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import Modal from "../../components/Modal";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";
import { LuSearch, LuX } from "react-icons/lu"; 

const Expense = () => {
    useUserAuth();

    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });
    
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    const [filterDate, setFilterDate] = useState({
        startDate: "",
        endDate: "",
        search: ""
    });

    const fetchExpenseDetails = async () => {
        if(loading) return;
        setLoading(true);

        try {
            let queryUrl = `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}?t=${new Date().getTime()}`;
            
            if (filterDate.startDate && filterDate.endDate) {
                queryUrl += `&startDate=${filterDate.startDate}&endDate=${filterDate.endDate}`;
            }
            if (filterDate.search) {
                queryUrl += `&search=${filterDate.search}`;
            }

            const response = await axiosInstance.get(queryUrl);

            if(response.data){
                setExpenseData(response.data);
            }
        } catch (error) {
            console.error("Error fetching data", error);
            toast.error("Failed to load expense data.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (filterDate.startDate && !filterDate.endDate) {
            toast.error("Please select end date");
            return;
        }
        fetchExpenseDetails();
    };

    const handleReset = () => {
        setFilterDate({ startDate: "", endDate: "", search: "" });
        setTimeout(() => fetchExpenseDetails(), 100); 
    };

    const handleEditExpense = (expense) => {
        setEditingExpense(expense);
        setOpenAddExpenseModal(true);
    };

    const handleAddOrUpdateExpense = async (expense) => {
        const {category, amount, date, icon} = expense;

        if(!category.trim()) {
            toast.error("Category is required");
            return;
        }

        if(!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be a valid number");
            return;
        }

        if(!date) {
            toast.error("Date is required");
            return;
        }

        try{
            if (editingExpense) {
                await axiosInstance.put(API_PATHS.EXPENSE.UPDATE_EXPENSE(editingExpense._id), {
                    category, amount, date, icon
                });
                toast.success("Expense updated successfully");
            } else {
                await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
                    category, amount, date, icon,
                });
                toast.success("Expense added successfully");
            }

            setOpenAddExpenseModal(false);
            setEditingExpense(null);
            fetchExpenseDetails();
        } catch (error) {
            console.error("Error adding/updating expense:", error);
            toast.error("Something went wrong");
        }
    };

    const deleteExpense = async (id) => {
        try{
            await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

            setOpenDeleteAlert({show: false, data: null});
            toast.success("Expense deleted successfully");
            fetchExpenseDetails();
        } catch (error) {
            console.error("Error deleting expense", error);
        }
    };

    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosInstance.get (
                API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "expense_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading details:", error);
            toast.error("Failed to download.");
        }
    };

    useEffect(() => {
        fetchExpenseDetails();
    }, []); 

    return (
        <DashboardLayout activeMenu="Expense">
            <div className = "my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            
                            <div className="flex-1 w-full">
                                <label className="text-sm text-gray-600 mb-1 block">Search</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search by category..."
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary pl-9 text-sm"
                                        value={filterDate.search}
                                        onChange={(e) => setFilterDate({ ...filterDate, search: e.target.value })}
                                    />
                                    <LuSearch className="absolute left-3 top-2.5 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">From Date</label>
                                <input
                                    type="date"
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                    value={filterDate.startDate}
                                    onChange={(e) => setFilterDate({ ...filterDate, startDate: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">To Date</label>
                                <input
                                    type="date"
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                    value={filterDate.endDate}
                                    onChange={(e) => setFilterDate({ ...filterDate, endDate: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={handleSearch}
                                    className="px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/90 flex items-center gap-2 h-[38px]"
                                >
                                    <LuSearch /> Filter
                                </button>
                                
                                {(filterDate.startDate || filterDate.search) && (
                                    <button 
                                        onClick={handleReset}
                                        className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-md hover:bg-gray-200 border border-gray-200 h-[38px] flex items-center gap-2"
                                    >
                                        <LuX /> Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <ExpenseOverview
                            transactions={expenseData}
                            onAddExpense={() => {
                                setEditingExpense(null);
                                setOpenAddExpenseModal(true);
                            }}
                        />
                    </div>

                    <ExpenseList
                        transactions={expenseData}
                        onDelete={(id) => {
                            setOpenDeleteAlert({show: true, data: id});
                        }}
                        onEdit={handleEditExpense}
                        onDownload={handleDownloadExpenseDetails}
                    />
                </div>

                <Modal 
                    isOpen = {openAddExpenseModal}
                    onClose = {() => {
                        setOpenAddExpenseModal(false);
                        setEditingExpense(null);
                    }}
                    title={editingExpense ? "Update Expense" : "Add Expense"}
                >
                    <AddExpenseForm 
                        onAddExpense={handleAddOrUpdateExpense} 
                        expenseInfo={editingExpense}
                    />
                </Modal>

                <Modal 
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({show: false, data: null})}
                    title="Delete Expense"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this expense?"
                        ondelete={() => deleteExpense(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    )
};

export default Expense;