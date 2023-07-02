import React, { useEffect } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { useSelector } from "react-redux";
import { loginSelector } from "../../pages/LoginPage/LoginSlice";
import {FaUserShield, FaUserInjured, FaUserMd, FaEdit, FaHourglassEnd} from 'react-icons/fa'
import {AiFillHome,AiOutlineFileAdd} from 'react-icons/ai'
import '../AdminLayout/AdminLayout.css'
import { patientSelector } from "../../pages/PatientPage/PatientSlice";
import {ToastContainer, toast} from 'react-toastify'
import Avatar from "../../components/Avatar/Avatar";
const PatientLayout = ({ element }) => {
    const loginSelect = useSelector(loginSelector);
    const patientSelect = useSelector(patientSelector);
    const sideItemList = [
        // {
        //     icon: AiFillHome,
        //     label: 'Trang chủ',
        //     link: '/admin/user-list'
        // },
        // {
        //     icon: FaUserInjured,
        //     label: 'Thêm bệnh nhân',
        //     link: '/admin/add-patient'
        // },
        {
            icon: AiOutlineFileAdd,
            label: 'Danh sách bệnh án',
            link: '/patient/mr-list'
        },
        {
            icon: FaUserMd,
            label: 'Danh sách truy cập',
            link: '/patient/access-list'
        },
        {
            icon: FaHourglassEnd,
            label: 'Danh sách yêu cầu',
            link: '/patient/access-request-list'
        },
        {
            icon: FaEdit,
            label: 'Chỉnh sửa thông tin',
            link: '/patient/edit-patient-info'
        },
    ];
    useEffect(() => {
        if (patientSelect.isLoading == true) console.log("this i loading");
        if (patientSelect.error) {
            toast.error(patientSelect.error, {
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
        if(patientSelect.success){
            toast.success(patientSelect.success, {
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
    }, [patientSelect.isLoading, patientSelect.error, patientSelect.success]);

    return (
        <div className="layout-container">
            <ToastContainer/>
            <SideBar sideItemList={sideItemList}></SideBar>
            <div className="layout-body">
                <div className="layout-title">
                    <div className="layout-role-title" style={{width: '110px'}}>
                        <i><FaUserShield size={'20px'}></FaUserShield></i>
                        <h4>{' Bệnh nhân'}</h4>
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

export default PatientLayout;
