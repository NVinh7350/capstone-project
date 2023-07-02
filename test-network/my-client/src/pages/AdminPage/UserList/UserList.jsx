import React, { useEffect, useState } from "react";
import "./UserList.css";
import { useDispatch, useSelector } from "react-redux";
import adminSlice, {
    adminSelector,
    getDetailAccount,
    getAccountList,
    getAccountBySearch,
    filterAccountList,
} from "../AdminSlice";
import { getAge, getDateTime } from "../../../utils/TimeUtils";
import Search from "../../../components/Search/Search";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import LoadingTable from "../../../components/LoadingTable/LoadingTable";
import NoResults from "../../../components/NoResults/NoResults";
import { Pagination } from "../../../components/Pagination/Pagination";
import SelectCustom from "../../../components/SelectCustom/SelectCustom";
export const UserList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    
    const [searchContent, setSearchContent] = useState({
        citizenNumber: '',
        fullName: '',
        gender: 'Giới tính',
        role: 'Loại'
    });
    const [page, setPage] = useState(1);
    const rowCount = 8;
    
    const adminSelect = useSelector(adminSelector);
    const filteredAccounts = useSelector((state) => filterAccountList(state, searchContent));
    
    const fillter = (e) => {
        setSearchContent({
            ...searchContent,
            [e.target.name]: e.target.value
        })
    }
    const handleShowDetailUser = async (userId, path) => {
        dispatch(getDetailAccount(userId));
        navigate(path);
    };

    useEffect(() => {
        dispatch(getAccountList());
    }, []);
    
    return (
        <div className="main-content-container">
            <h3 className="role-title" style={{ position: 'absolute', top: '0px' }}> Danh sách tài khoản</h3>
            <div className="main-content-header">
                <Search
                    onClick={() => {
                        dispatch(getAccountBySearch(searchContent.fullName));
                    }}
                    name={'fullName'}
                    handleChange={fillter}
                    planceHolder={"Tìm người dùng"}
                ></Search>
                <SelectCustom 
                    value={searchContent.role === 'DOCTOR'? 'Bác sĩ' : (searchContent.role === 'PATIENT'? 'Bệnh nhân' : 'Loại')}
                    name={'role'} 
                    handleChange={fillter} label={'Loại'} 
                    options={[{ label: 'Loại', value: 'Loại' }, { label: 'Doctor', value: 'DOCTOR' }, { label: 'Patient', value: 'PATIENT' }]}>
                </SelectCustom>
                <SelectCustom 
                    value={searchContent.gender === 'MALE' ? 'Nam' : (searchContent.gender === 'FEMALE' ? 'Nữ' : 'Giới tính')}
                    name={'gender'} 
                    handleChange={fillter} label={'Giới tính'} 
                    options={[{ label: 'Giới tính', value: 'Giới tính' }, { label: 'Nam', value: 'MALE' }, { label: 'Nữ', value: 'FEMALE' }]}>
                </SelectCustom>

                <Pagination limit={5} page={page} siblings={1} totalPage={Math.ceil(filteredAccounts?.length / rowCount) | 1} setPage={setPage}></Pagination>
            </div>
            <div className="line"></div>

            {adminSelect.isLoading ? (
                <table className="table">
                    <thead>
                        <th style={{ width: '15%' }}>CMNN</th>
                        <th style={{ width: '25%' }}>Họ và Tên</th>
                        <th style={{ width: '10%' }}>Giới tính</th>
                        <th style={{ width: '10%' }}>Tuổi</th>
                        <th style={{ width: '10%' }}>Loại</th>
                        <th style={{ width: '20%' }}>Ngày tạo</th>
                        <th style={{ width: '10%' }}>Chi tiết</th>
                    </thead>
                    <LoadingTable columnCount={7} rowCount={rowCount}></LoadingTable>{" "}
                </table>
            ) : (
                filteredAccounts.length > 0 ?
                    <table className="table">
                        <thead>
                            <th style={{ width: '15%' }}>CMNN</th>
                            <th style={{ width: '25%' }}>Họ và Tên</th>
                            <th style={{ width: '10%' }}>Giới tính</th>
                            <th style={{ width: '10%' }}>Tuổi</th>
                            <th style={{ width: '10%' }}>Loại</th>
                            <th style={{ width: '20%' }}>Ngày tạo</th>
                            <th style={{ width: '10%' }}>Chi tiết</th>
                        </thead>
                        <tbody>
                            {filteredAccounts?.map((user, index) => {
                                if (index < rowCount * page && index >= page * rowCount - rowCount) {
                                    return (<tr key={index}>
                                        <td>{user.citizenNumber}</td>
                                        <td style={{ textAlign: 'left', fontWeight: 'bolder' }}>{user.fullName}</td>
                                        <td>{user.gender === "MALE" ? "Nam" : "Nữ"}</td>
                                        <td>{getAge(user.birthDay)}</td>
                                        <td>{user.role}</td>
                                        <td>{getDateTime(user.createDate)}</td>
                                        <td>
                                            <BsFillEyeFill
                                                color="#695cfe"
                                                fontSize="20px"
                                                onClick={() =>
                                                    handleShowDetailUser(
                                                        user.citizenId,
                                                        "/admin/user-list/detail-user"
                                                    )
                                                }
                                            ></BsFillEyeFill>
                                        </td>
                                    </tr>)
                                }
                            })}
                        </tbody>
                    </table>
                    : <NoResults content={'Vui lòng tìm lại hoặc tạo người dùng này'} title={'Ngườ dùng không được tim thấy'} />
            )}
        </div>
    );
};
