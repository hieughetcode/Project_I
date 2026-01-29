import React, { useContext, useState } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";
import UserProfileModal from "../UserProfileModal"; // Đã import đúng

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [openProfileModal, setOpenProfileModal] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    const handleClick = (item) => {
        if (item.label === "Logout") {
            handleLogout();
            return;
        }
        navigate(item.path);
    };

    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
            {/* 1. THÊM onClick VÀ cursor-pointer VÀO THẺ DIV NÀY */}
            <div 
                className="flex flex-col items-center justify-center gap-3 mt-3 mb-7 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setOpenProfileModal(true)}
            >
                {user?.profileImageUrl ? (
                    <img
                        src={user?.profileImageUrl || ""}
                        alt="Profile Image"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                ) : (
                    <CharAvatar
                        fullName={user?.fullName}
                        width="w-20"
                        height="h-20"
                        style="text-xl"
                    />
                )}

                <h5 className="text-gray-950 font-medium leading-6">
                    {user?.fullName}
                </h5>
            </div>

            {SIDE_MENU_DATA.map((item, index) => (
                <button
                    key={`menu_${index}`}
                    className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3
                        ${
                            activeMenu === item.label
                                ? "text-white bg-primary"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    onClick={() => handleClick(item)}
                >
                    <item.icon className="text-xl" />
                    {item.label}
                </button>
            ))}

            {/* 2. HIỂN THỊ MODAL Ở CUỐI CÙNG */}
            <UserProfileModal 
                isOpen={openProfileModal} 
                onClose={() => setOpenProfileModal(false)} 
            />
        </div>
    );
};

export default SideMenu;