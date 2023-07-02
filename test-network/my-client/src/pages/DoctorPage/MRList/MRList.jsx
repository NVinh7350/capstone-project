import React, { useEffect, useState } from "react";
import "../../AdminPage/UserList/UserList.css";
import { useDispatch, useSelector } from "react-redux";
import { getAge, getDate, getDateTime } from "../../../utils/TimeUtils";
import Search from "../../../components/Search/Search";
import {BsFillEyeFill} from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import {
    cancelAccessRequest,
    doctorSelector,
    findPatientBySearch,
    getAccessList,
    getAccessRequestList,
    getDetailPatient,
    getMRList,
    requestAccess,
} from "../DoctorSlice";
import { getUser } from "../../../utils/LocalStorage";
import LoadingTable from "../../../components/LoadingTable/LoadingTable";
import NoResults from "../../../components/NoResults/NoResults";
export const MRList = () => {
    const dispatch = useDispatch();
    const doctorSelect = useSelector(doctorSelector);
    const detailUser = doctorSelect.detailPatient;
    const [searchContent, setSearchContent] = useState("");
    useEffect(() => {
        dispatch(getMRList(detailUser.citizenId))
    }, []);
    const handleShowMR = (data, path) => {
        console.log(data);
        console.log(path);
    }
    return (
        <div className="main-content-container">
            <div className="main-content-header">
                <Search
                    onClick={() => {
                        dispatch(findPatientBySearch(searchContent));
                    }}
                    setSearchContent={setSearchContent}
                    planceHolder={"Tìm bệnh nhân"}
                ></Search>
            </div>
            <div className="line"></div>
            {doctorSelect.isLoading ? (
                 <table className="table">
                 <thead>
                     <th>Bác sĩ tạo</th>
                     <th>Ngày tạo</th>
                     <th>Tóm tắt </th>
                     <th>Chuẩn đoán</th>
                     <th>Trạng thái</th>
                     <th>Chi tiết</th>
                 </thead>
                 <LoadingTable columnCount={7} rowCount={9}></LoadingTable>{" "}
            </table>
            ) : (
                doctorSelect.MRList?.length > 0 ?
            
            <table className="table">
                <thead>
                <th>Bác sĩ tạo</th>
                     <th>Ngày tạo</th>
                     <th>Tóm tắt </th>
                     <th>Chuẩn đoán</th>
                     <th>Trạng thái</th>
                     <th>Chi tiết</th>
                </thead>
                <tbody>
                    {doctorSelect.MRList?.map((request, index) => {
                        if (index < rowCount * page && index >= page * rowCount - rowCount){
                        return (
                            <tr key={index}>
                                <td>{request?.creator?.user?.fullName}</td>
                                <td>{getDateTime(request?.comeTime)}</td>
                                <td>{request?.majorReason}</td>
                                <td>
                                    {request?.diagnosis}
                                </td>
                                <td>
                                    {request?.status}
                                </td>
                                <td>
                                    {
                                        <BsFillEyeFill
                                        color="#695cfe"
                                        fontSize="20px"
                                        onClick={() =>  handleShowMR(request?.MRId, '/patient/mr-list')}
                                        ></BsFillEyeFill>
                                    }
                                </td>
                                <td>
                                    
                                </td>
                            </tr>
                        );}
                    })}
                </tbody>
            </table>
            : <NoResults content={'Vui lòng cấp quyền truy cập'} title={'Chưa có quyền truy cập nào được cấp'}/>
            )}
        </div>
    );
};
