import React, {useState, useEffect} from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import { useUserAuth } from "../../hooks/useUserAuth";
import { toast } from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import { LuSearch, LuX } from "react-icons/lu"; 

const Income = () => {
    useUserAuth();

    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

    // State cho bộ lọc
    const [filterDate, setFilterDate] = useState({
        startDate: "",
        endDate: "",
        search: ""
    });

    const fetchIncomeDetails = async () => {
        if(loading) return;
        setLoading(true);

        try {
            let queryUrl = `${API_PATHS.INCOME.GET_ALL_INCOME}?t=${new Date().getTime()}`;

            if (filterDate.startDate && filterDate.endDate) {
                queryUrl += `&startDate=${filterDate.startDate}&endDate=${filterDate.endDate}`;
            }
            if (filterDate.search) {
                queryUrl += `&search=${filterDate.search}`;
            }

            const response = await axiosInstance.get(queryUrl);

            if(response.data){
                setIncomeData(response.data);
            }
        } catch (error) {
            console.error("Something went wrong. Please try again.", error);
            toast.error("Không thể tải dữ liệu thu nhập.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (filterDate.startDate && !filterDate.endDate) {
            toast.error("Vui lòng chọn cả ngày kết thúc");
            return;
        }
        fetchIncomeDetails();
    };

    const handleReset = () => {
        setFilterDate({ startDate: "", endDate: "", search: "" });
        setTimeout(() => fetchIncomeDetails(), 100);
    };

    const handleAddIncome = async (income) => {
        const {source, amount, date, icon} = income;

        if(!source.trim()) {
            toast.error("Source is required");
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
            await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
                source,
                amount,
                date,
                icon,
            });

            setOpenAddIncomeModal(false);
            toast.success("Income added successfully");
            fetchIncomeDetails();
        } catch (error) {
            console.error("Error adding income. Please try again.", error);
        }
    };

    const deleteIncome = async (id) => {
        try{
            await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

            setOpenDeleteAlert({show: false, data: null});
            toast.success("Income details deleted successfully");
            fetchIncomeDetails();
        } catch (error) {
            console.error(
                "Error deleting income",
                error.response?.data?.message || error.message
            );
        }
    };

    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosInstance.get (
                API_PATHS.INCOME.DOWNLOAD_INCOME,
                {
                    responseType: "blob",
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "income_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading income details:", error);
            toast.error("Failed to download income details. Please try again.");
        }
    };

    useEffect(() => {
        fetchIncomeDetails();
    }, []);

    return (
        <DashboardLayout activeMenu="Income">
            <div className = "my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    
                    {/* --- [VỊ TRÍ MỚI] THANH TÌM KIẾM & LỌC ĐƯỢC ĐẨY LÊN ĐẦU --- */}
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
                    {/* --- KẾT THÚC PHẦN TÌM KIẾM --- */}

                    {/* Thẻ Overview nằm dưới bộ lọc */}
                    <div className="">
                        <IncomeOverview
                            transactions={incomeData}
                            onAddIncome={() => setOpenAddIncomeModal(true)}
                        />
                    </div>

                    <IncomeList
                        transactions={incomeData}
                        onDelete={(id) => {
                           setOpenDeleteAlert({show: true, data: id});
                        }}
                        onDownload={handleDownloadIncomeDetails}
                    />
                </div>

                <Modal 
                    isOpen = {openAddIncomeModal}
                    onClose = {() => setOpenAddIncomeModal(false)}
                    title="Add Income"
                >
                    <AddIncomeForm onAddIncome={handleAddIncome} />
                </Modal>

                <Modal 
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({show: false, data: null})}
                    title="Delete Income"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this income?"
                        ondelete={() => deleteIncome(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Income;