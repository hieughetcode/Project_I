import React, {createContext, useState} from "react";

export const UserContext = createContext();

const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);

    //Hàm cập nhật dữ liệu người dùng
    const updateUser = (userData) => {
        setUser(userData);
    };

    //Hàm để xóa dữ liệu người dùng khi logout
    const clearUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;