import React, { useEffect, useState } from "react";
import "../../AdminPage/UserList/UserList.css";
import { useDispatch, useSelector } from "react-redux";
import { getAge, getDate, getDateTime } from "../../../utils/TimeUtils";
import Search from "../../../components/Search/Search";
import { MdCancel, MdCheckCircle } from "react-icons/md"
import { TbSend, TbSendOff } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import {
    cancelAccessRequest,
    patientSelector,
    getAccessRequestList,
    grantAccess,
    filterAccessRequestList,
} from "../PatientSlice";
import { getUser } from "../../../utils/LocalStorage";
import LoadingTable from "../../../components/LoadingTable/LoadingTable";
import NoResults from "../../../components/NoResults/NoResults";
import { loginSelector } from "../../LoginPage/LoginSlice";
import SelectCustom from "../../../components/SelectCustom/SelectCustom";
import { Pagination } from "../../../components/Pagination/Pagination";
export const PatientAccessRequest = () => {
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
    const rowCount = 7;
    const filteredAccessRequestList = useSelector((state) => filterAccessRequestList(state, searchContent));

    const fillter = (e) => {
        setSearchContent({
            ...searchContent,
            [e.target.name] : e.target.value
        })
    }
    console.log(patientSelect.accessRequestList)
    
    useEffect(() => {
        dispatch(getAccessRequestList());
    }, []);

    return (
        <div className="main-content-container">
        <h3 className="role-title" style={{position: 'absolute', top: '0px'}}> Danh sách các yêu cầu</h3>
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
                <Pagination limit={5} page={page} siblings={1} totalPage={Math.ceil(filteredAccessRequestList?.length / rowCount) | 1} setPage={setPage}></Pagination>
            </div>
            <div className="line"></div>
            {patientSelect.isLoading ? (
                <table className="table">
                <thead>
                <th style={{ width: '9%' }}>CMNN</th>
                    <th style={{ width: '18%' }}>Họ và Tên</th>
                    <th style={{ width: '8%' }}>Giới tính</th>
                    <th style={{ width: '12%' }}>Chức vụ</th>
                    <th style={{ width: '11%' }}>Khoa</th>
                    <th style={{ width: '10%' }}>Bệnh viện</th>
                    <th style={{ width: '15%' }}>Thời gian yêu cầu</th>
                    <th style={{ width: '10%' }}>Chấp nhận</th>
                    <th style={{ width: '7%' }}>Hủy</th>
                </thead>
                <LoadingTable columnCount={9} rowCount={9}></LoadingTable>{" "}
            </table>
            ) : (
                filteredAccessRequestList?.length >0 ?
            <table className="table">
                <thead>
                    <th style={{ width: '9%' }}>CMNN</th>
                    <th style={{ width: '18%' }}>Họ và Tên</th>
                    <th style={{ width: '8%' }}>Giới tính</th>
                    <th style={{ width: '12%' }}>Chức vụ</th>
                    <th style={{ width: '11%' }}>Khoa</th>
                    <th style={{ width: '10%' }}>Bệnh viện</th>
                    <th style={{ width: '15%' }}>Thời gian yêu cầu</th>
                    <th style={{ width: '10%' }}>Chấp nhận</th>
                    <th style={{ width: '7%' }}>Hủy</th>
                </thead>
                <tbody>
                    {filteredAccessRequestList?.map((request, index) => {
                        if (index < rowCount * page && index >= page * rowCount - rowCount){
                        return (
                            <tr key={index}>
                                <td>{request?.doctor?.user?.citizenNumber}</td>
                                <td>{request?.doctor?.user?.fullName}</td>
                                <td>
                                    {request?.doctor?.user?.gender === "MALE"
                                        ? "Nam"
                                        : "Nữ"}
                                </td>
                                <td>{request?.doctor?.position}</td>
                                <td>{request?.doctor?.specialty}</td>
                                <td>{request?.doctor?.hospital}</td>
                                <td>
                                    {getDateTime(request?.requestTime)}
                                </td>
                                <td>
                                    {
                                        <MdCheckCircle
                                            className="icon"
                                            color="green"
                                            fontSize="20px"
                                            onClick={() => dispatch(grantAccess(request?.doctor?.citizenId))}
                                        ></MdCheckCircle>
                                    }
                                </td>
                                <td>
                                    {
                                        <MdCancel
                                            className="icon"
                                            color="red"
                                            fontSize="20px"
                                            onClick={() => dispatch(cancelAccessRequest(request?.doctor?.citizenId))}
                                        ></MdCancel>
                                    }
                                </td>
                            </tr>
                        );}
                    })}
                </tbody>
                </table>
                : <NoResults content={''} title={'Không tìm thấy yêu cầu'}/>
            )}
        </div>
    );
};
