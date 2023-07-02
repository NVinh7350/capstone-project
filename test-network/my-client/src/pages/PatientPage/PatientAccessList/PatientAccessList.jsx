import React, { useEffect, useState } from "react";
import "../../AdminPage/UserList/UserList.css";
import { useDispatch, useSelector } from "react-redux";
import { getAge, getDate, getDateTime } from "../../../utils/TimeUtils";
import Search from "../../../components/Search/Search";
import { MdCancel, MdCheckCircle } from "react-icons/md"
import { BsFillEyeFill} from 'react-icons/bs'
import { Link, useNavigate } from "react-router-dom";
import {
    patientSelector,
    getAccessList,
    revokeAccess,
    getDetailDoctor,
    filterAccessList,
} from "../PatientSlice";
import { getUser } from "../../../utils/LocalStorage";
import LoadingTable from "../../../components/LoadingTable/LoadingTable";
import NoResults from "../../../components/NoResults/NoResults";
import { loginSelector } from "../../LoginPage/LoginSlice";
import { Pagination } from "../../../components/Pagination/Pagination";
import SelectCustom from "../../../components/SelectCustom/SelectCustom";
export const PatientAccessList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const patientSelect = useSelector(patientSelector);
    const loginSelect = useSelector(loginSelector);

    const citizenId = loginSelect?.user?.citizenId ||JSON.parse(getUser())?.citizenId;
    const [searchContent, setSearchContent] = useState({
        gender : 'Giới tính',
        hospital: 'Bệnh viện',
        searchText : ''
    });
    const [page, setPage] = useState(1);
    const rowCount = 8;

    const filteredAccessList = useSelector((state) => filterAccessList(state, searchContent));

    const fillter = (e) => {
        setSearchContent({
            ...searchContent,
            [e.target.name] : e.target.value
        })
    }

    

    useEffect(() => {
        dispatch(getAccessList());
    }, []);

    const handleShowDetailUser = async(userId, path) => {
        dispatch(getDetailDoctor(userId));
        navigate(path)
    }

    return (
        <div className="main-content-container">
            <h3 className="role-title" style={{position: 'absolute', top: '0px'}}> Danh sách được quyền truy cập</h3>
            <div className="main-content-header">
                <Search
                    onClick={fillter}
                    name={'searchText'}
                    handleChange={fillter}
                    planceHolder={"Tìm bác sĩ"}
                ></Search>
                <SelectCustom 
                    value={searchContent.gender === 'MALE' ? 'Nam' : (searchContent.gender === 'FEMALE' ? 'Nữ' : 'Giới tính')}
                    name={'gender'} 
                    handleChange={fillter} label={'Giới tính'} 
                    options={[{ label: 'Giới tính', value: 'Giới tính' }, { label: 'Nam', value: 'MALE' }, { label: 'Nữ', value: 'FEMALE' }]}>
                </SelectCustom>
                <SelectCustom 
                    value={searchContent.hospital}
                    name={'hospital'} 
                    handleChange={fillter} 
                    options={[{ label: 'Bệnh viện', value: 'Bệnh viện' }, { label: 'Vĩnh Đức', value: 'Vĩnh Đức' }, { label: 'Bình An', value: 'Bình An' }]}>
                </SelectCustom>
                <Pagination limit={5} page={page} siblings={1} totalPage={Math.ceil(filteredAccessList?.length / rowCount) | 1} setPage={setPage}></Pagination>
            </div>
            <div className="line"></div>
            {patientSelect.isLoading ? (
                <table className="table">
                    <thead>
                    <th style={{ width: '10%' }}>CMNN</th>
                    <th style={{ width: '20%' }}>Họ và Tên</th>
                    <th style={{ width: '8%' }}>Giới tính</th>
                    <th style={{ width: '13%' }}>Ngày sinh</th>
                    <th style={{ width: '12%' }}>Chức vụ</th>
                    <th style={{ width: '11%' }}>Khoa</th>
                    <th style={{ width: '10%' }}>Bệnh viện</th>
                    <th style={{ width: '8%' }}>Chi tiết</th>
                    <th style={{ width: '8%' }}>Thu hồi</th>
                    </thead>
                    <LoadingTable columnCount={9} rowCount={9}></LoadingTable>{" "}
                </table>
            ) : (
                filteredAccessList?.length >0 ?
                <table className="table">
                    <thead>
                    <th style={{ width: '10%' }}>CMNN</th>
                        <th style={{ width: '20%' }}>Họ và Tên</th>
                        <th style={{ width: '8%' }}>Giới tính</th>
                        <th style={{ width: '13%' }}>Ngày sinh</th>
                        <th style={{ width: '12%' }}>Chức vụ</th>
                        <th style={{ width: '11%' }}>Khoa</th>
                        <th style={{ width: '10%' }}>Bệnh viện</th>
                        <th style={{ width: '8%' }}>Chi tiết</th>
                        <th style={{ width: '8%' }}>Thu hồi</th>
                    </thead>
                    <tbody>
                    {filteredAccessList?.map((request, index) => {
                        if (index < rowCount * page && index >= page * rowCount - rowCount) {
                        return (
                            <tr key={index}>
                                <td>{request?.doctor?.user?.citizenNumber}</td>
                                <td style={{ textAlign: 'left', fontWeight: 'bolder' }}>{request?.doctor?.user?.fullName}</td>
                                <td>
                                    {request?.doctor?.user?.gender === "MALE"
                                        ? "Nam"
                                        : "Nữ"}
                                </td>
                                <td>
                                    {`${getDate(request?.doctor?.user?.birthDay)} (${getAge(request?.doctor?.user?.birthDay)})`}
                                </td>
                                <td>{request?.doctor?.position}</td>
                                <td>{request?.doctor?.specialty}</td>
                                <td>{request?.doctor?.hospital}</td>
                                <td>
                                    {
                                        <BsFillEyeFill
                                            color="#695cfe"
                                            fontSize="20px"
                                            onClick={() =>  handleShowDetailUser(request?.doctor?.citizenId, '/patient/detail-doctor')}
                                        ></BsFillEyeFill>
                                    }
                                </td>
                                <td>
                                    {
                                        <MdCancel
                                            className="icon"
                                            color="red"
                                            fontSize="20px"
                                            onClick={() => dispatch(revokeAccess(request?.doctor?.citizenId))}
                                        ></MdCancel>
                                    }
                                </td>
                            </tr>
                        );}
                    })}
                </tbody>
            </table>
                : <NoResults content={''} title={'Không tìm thấy quyền truy cập'}/>
            )}
        </div>
    );
};
