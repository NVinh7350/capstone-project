import React, { useEffect } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { useSelector } from "react-redux";
import { loginSelector } from "../../pages/LoginPage/LoginSlice";
import { FaUserShield, FaUserInjured, FaUserMd, FaEdit } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import "./AdminLayout.css";
import { adminSelector } from "../../pages/AdminPage/AdminSlice";
import {ToastContainer, toast} from 'react-toastify'
import Avatar from "../../components/Avatar/Avatar";
const AdminLayout = ({ element}) => {
    const loginSelect = useSelector(loginSelector);
    const adminSelect = useSelector(adminSelector);
    const sideItemList = [
        {
            icon: AiFillHome,
            label: "Trang chủ",
            link: "/admin/user-list",
        },
        {
            icon: FaUserInjured,
            label: "Thêm bệnh nhân",
            link: "/admin/add-patient",
        },
        {
            icon: FaUserMd,
            label: "Thêm bác sĩ",
            link: "/admin/add-doctor",
        },
        {
            icon: FaEdit,
            label: "Chỉnh sửa thông tin",
            link: "/admin/edit-info",
        },
    ];

    useEffect(() => {
        if (adminSelect.error) {
            toast.error(adminSelect.error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        if(adminSelect.success){
            toast.success(adminSelect.success, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        }
    }, [adminSelect.isLoading, adminSelect.error, adminSelect.success]);

    return (
        <div className="layout-container">
             <ToastContainer/>
            <SideBar sideItemList={sideItemList}></SideBar>
            <div className="layout-body">
                <div className="layout-title">
                <div className="layout-role-title" style={{width: '80px'}}>
                        <i><FaUserShield size={'20px'}></FaUserShield></i>
                        <h4>{' Admin'}</h4>
                    </div>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <Avatar width={'50px'} base64String={loginSelect.user?.avatar}></Avatar>
                    <h4 className="role-title" style={{ marginLeft:'20px'}}>{loginSelect.user?.fullName}</h4>
                    </div>
                </div>
                <div className="main-content">{element}</div>
            </div>
        </div>
    );
};

export default AdminLayout;
