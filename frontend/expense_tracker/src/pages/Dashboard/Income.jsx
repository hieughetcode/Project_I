import React, {useState, useEffect} from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { IoLogoModelS, IoMdDoneAll } from "react-icons/io";
import Modal from "../../components/Cards/Modal";
import { useUserAuth } from "../../hooks/useUserAuth";
import { LuTrash2 } from "react-icons/lu";
const Income = () => {

    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });
    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

    const fetchIncomeDetails = async () => {
        if( loading) return;

        try {
            const response = await axiosInstance.get(
                `${API_PATHS.INCOME.GET_ALL_INCOME}`
            );

            if(response.data){
                setIncomeData(response.data);
            }
        } catch (error) {
            console.error("Something went wrong. Please try again.", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddIncome = async (income) => {};

    const deleteIncome = async (id) => {};

    const handleDownloadIncomeDetails = () => {};

    useEffect(() => {
        fetchIncomeDetails();
        
        return () => {};
    }, []);

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className = "my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div className="">
                        <IncomeOverview
                            transactions={incomeData}
                            onAddIncome={() => setOpenAddIncomeModal(true)}
                        />
                    </div>
                </div>

                <Modal 
                    isOpen = {openAddIncomeModal}
                    onClose = {() => setOpenAddIncomeModal(false)}
                    title="Add Income"
                >
                    <div>Add Income Form</div>
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Income;