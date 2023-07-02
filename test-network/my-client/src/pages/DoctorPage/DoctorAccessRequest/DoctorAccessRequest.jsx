import React, { useEffect, useState } from "react";
import "../../AdminPage/UserList/UserList.css";
import { useDispatch, useSelector } from "react-redux";
import { getAge, getDate, getDateTime } from "../../../utils/TimeUtils";
import Search from "../../../components/Search/Search";
import { MdCancel } from "react-icons/md"
import { TbSend, TbSendOff } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import {
    cancelAccessRequest,
    doctorSelector,
    filterAccessRequestList,
    findPatientBySearch,
    getAccessRequestList,
    requestAccess,
} from "../DoctorSlice";
import { getUser } from "../../../utils/LocalStorage";
import LoadingTable from "../../../components/LoadingTable/LoadingTable";
import NoResults from "../../../components/NoResults/NoResults";
import { loginSelector } from "../../LoginPage/LoginSlice";
import { Pagination } from "../../../components/Pagination/Pagination";
export const DoctorAccessRequest = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const doctorSelect = useSelector(doctorSelector);
    const loginSelect = useSelector(loginSelector);

    const citizenId = loginSelect?.user?.citizenId ||JSON.parse(getUser())?.citizenId;
    const [searchContent, setSearchContent] = useState("");

    const [page, setPage] = useState(1);
    const rowCount = 7;

    const filteredAccessRequestList = useSelector((state) => filterAccessRequestList(state, searchContent));

    const fillter = (e) => {
        setSearchContent(e.target.value)
    }

    useEffect(() => {
        dispatch(getAccessRequestList());
    }, []);


    return (
        <div className="main-content-container">
            <h3 className="role-title" style={{position: 'absolute', top: '0px'}}>Danh sách các yêu cầu</h3>
            <div className="main-content-header">
                <Search
                    name={'fullName'}
                    handleChange={fillter}
                    planceHolder={"Tìm bệnh nhân"}
                ></Search>
                <Pagination limit={5} page={page} siblings={1} totalPage={Math.ceil(filteredAccessRequestList?.length / rowCount) | 1} setPage={setPage}></Pagination>
            </div>
            <div className="line"></div>
            {doctorSelect.isLoading ? (
               <table className="table">
               <thead>
               <th style={{ width: '15%' }}>CMNN</th>
                <th style={{ width: '21%' }}>Họ và Tên</th>
                <th style={{ width: '8%' }}>Giới tính</th>
                <th style={{ width: '15%' }}>Ngày sinh</th>
                <th style={{ width: '15%' }}>Mã BHYT</th>
                <th style={{ width: '18%' }}>Thời gian yêu cầu</th>
                <th style={{ width: '8%' }}>Hủy</th>
               </thead>
               <LoadingTable columnCount={7} rowCount={rowCount}></LoadingTable>{" "}
            </table>
            ) : (
                filteredAccessRequestList?.length > 0 ?
            <table className="table">
                <thead>
                <th style={{ width: '15%' }}>CMNN</th>
                     <th style={{ width: '21%' }}>Họ và Tên</th>
                     <th style={{ width: '8%' }}>Giới tính</th>
                     <th style={{ width: '15%' }}>Ngày sinh</th>
                     <th style={{ width: '15%' }}>Mã BHYT</th>
                     <th style={{ width: '18%' }}>Thời gian yêu cầu</th>
                     <th style={{ width: '8%' }}>Huỷ</th>
                </thead>
                <tbody>
                    {filteredAccessRequestList?.map((request, index) => {
                        if (index < rowCount * page && index >= page * rowCount - rowCount){
                        return (
                            <tr key={index}>
                                <td>{request?.patient?.user?.citizenNumber}</td>
                                <td style={{ textAlign: 'left', fontWeight: 'bolder' }}>{request?.patient?.user?.fullName}</td>
                                <td>
                                    {request?.patient?.user?.gender === "MALE"
                                        ? "Nam"
                                        : "Nữ"}
                                </td>
                                <td>{`${getDate(
                                    request?.patient?.user?.birthDay
                                )} (${getAge(
                                    request?.patient?.user?.birthDay
                                )})`}</td>
                                <td>{request?.patient?.HICNumber}</td>
                                <td>
                                    {getDateTime(request?.requestTime)}
                                </td>
                                <td>
                                    {
                                        <MdCancel
                                            className="icon"
                                            color="red"
                                            fontSize="20px"
                                            onClick={() => dispatch(cancelAccessRequest(request?.patient?.citizenId))}
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
