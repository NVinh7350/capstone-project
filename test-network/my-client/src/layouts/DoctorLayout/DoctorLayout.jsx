import React, { useEffect } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { useSelector } from "react-redux";
import { loginSelector } from "../../pages/LoginPage/LoginSlice";
import {FaUserShield, FaUserInjured, FaUserMd, FaEdit, FaHourglassEnd} from 'react-icons/fa'
import {AiFillHome, AiOutlineFileAdd} from 'react-icons/ai'
import {MdPersonSearch} from 'react-icons/md'
import '../AdminLayout/AdminLayout.css'
import {ToastContainer, toast} from 'react-toastify'
import { doctorSelector } from "../../pages/DoctorPage/DoctorSlice";
import Avatar from "../../components/Avatar/Avatar";
const DoctorLayout = ({ element }) => {
    const loginSelect = useSelector(loginSelector);
    const doctorSelect = useSelector(doctorSelector);
    const sideItemList = [
        // {
        //     icon: AiOutlineFileAdd,
        //     label: 'Tạo bệnh án',
        //     link: '/doctor/create-mr'
        // },
        
        
        {
            icon: FaUserInjured,
            label: 'Danh sách truy cập',
            link: '/doctor/access-list'
        },
        {
            icon: MdPersonSearch,
            label: 'Tìm bệnh nhân',
            link: '/doctor/find-patient'
        },
        {
            icon: FaHourglassEnd,
            label: 'Danh sách yêu cầu',
            link: '/doctor/access-request-list'
        },
        {
            icon: FaEdit,
            label: 'Chỉnh sửa thông tin',
            link: '/doctor/edit-doctor-info'
        },
    ]
    useEffect(() => {
        if (doctorSelect.isLoading == true) console.log("this i loading");
        if (doctorSelect.error) {
            toast.error(doctorSelect.error, {
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
        if(doctorSelect.success){
            toast.success(doctorSelect.success, {
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
    }, [doctorSelect.isLoading, doctorSelect.error, doctorSelect.success]);

    return (
        <div className="layout-container">
            <ToastContainer/>
            <SideBar sideItemList={sideItemList}></SideBar>
            <div className="layout-body">
                <div className="layout-title">
                    <div className="layout-role-title" style={{width: '80px'}}>
                        <i><FaUserShield size={'20px'}></FaUserShield></i>
                        <h4>{' Bác sĩ'}</h4>
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

export default DoctorLayout;
