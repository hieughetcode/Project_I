import React, { use, useContext } from 'react' // <--- Đã thêm useContext
import { UserContext } from '../../context/userContext'
import Navbar from './Navbar';
import SideMenu from './SideMenu';
import {useUserAuth} from '../../hooks/useUserAuth'

const DashboardLayout = ({children, activeMenu}) => {
    const {user} = useContext(UserContext);

    useUserAuth();
    
    return (
        <div className="">
            <Navbar activeMenu = {activeMenu} />

            {user && (
                <div className = "flex">
                    <div className = "max-[1080px]:hidden">
                        <SideMenu activeMenu = {activeMenu} />
                    </div>

                    <div className="grow mx-5">{children}</div>
                </div>
            )}
        </div>
    )
}

export default DashboardLayout