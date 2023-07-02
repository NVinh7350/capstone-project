import React, { useEffect, useState } from "react";
import "../../AdminPage/UserList/UserList.css";
import { useDispatch, useSelector } from "react-redux";
import { getAge, getDate, getDateTime } from "../../../utils/TimeUtils";
import Search from "../../../components/Search/Search";
import {BsFillEyeFill} from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

import { getUser } from "../../../utils/LocalStorage";
import LoadingTable from "../../../components/LoadingTable/LoadingTable";
import NoResults from "../../../components/NoResults/NoResults";
import { filterMRList, getDetailDoctor, getDetailMR, getMRList, patientSelector } from "../PatientSlice";
import { loginSelector } from "../../LoginPage/LoginSlice";
import { Pagination } from "../../../components/Pagination/Pagination";
import SelectCustom from "../../../components/SelectCustom/SelectCustom";
export const PatientMRList = () => {
    const dispatch = useDispatch();
    const patientSelect = useSelector(patientSelector);
    const loginSelect = useSelector(loginSelector);
    const user = loginSelect.user || JSON.parse(getUser());
    const detailMR = patientSelect.medicalRecord;
    const navigate = useNavigate();



    const [searchContent, setSearchContent] = useState({
        searchText: '',
        status: 'Trạng thái',
    });

    const fillter = (e) => {
        setSearchContent({
            ...searchContent,
            [e.target.name]: e.target.value
        })
    }
    const [page, setPage] = useState(1);
    const rowCount = 5;

    const filteredMRList = useSelector((state) => filterMRList(state, searchContent));

    useEffect(() => {
        dispatch(getMRList(user.citizenId))
        console.log('fl')
        console.log(detailMR)
        if(detailMR) {
        }
    }, [detailMR]);
    
    const handleShowDetailMR = (MRId,doctorId, path) => {
        dispatch(getDetailMR(MRId));
        console.log(doctorId);
        dispatch(getDetailDoctor(doctorId));
        navigate(path);
    }
    return (<div className="main-content-container">
    <h3 className="role-title" style={{position: 'absolute', top: '0px'}}> Danh sách bệnh án</h3>
        <div className="main-content-header">
            <Search
                handleChange={fillter}
                planceHolder={"Tìm bệnh nhân"}
                name={'searchText'}
            ></Search>
            <SelectCustom
                value={searchContent.status === 'CREATING' ? 'Đang tạo' : (searchContent.status === 'COMPLETED' ? 'Hoàn thành' : 'Trạng thái')}
                name={'status'}
                handleChange={fillter}
                options={[{ label: 'Trạng thái', value: 'Trạng thái' }, { label: 'Đang tạo', value: 'CREATING' }, { label: 'Hoàn thành', value: 'COMPLETED' }]}>
            </SelectCustom>
            <Pagination limit={5} page={page} siblings={1} totalPage={Math.ceil(filteredMRList?.length / rowCount) | 1} setPage={setPage}></Pagination>

        </div>
        <div className="line"></div>
        {patientSelect.isLoading ? (
            <table className="table" style={{  boxSizing: 'border-box' }}>
                <thead>
                    <th style={{ width: '20%' }}>Bác sĩ tạo</th>
                    <th style={{ width: '15%' }} >Bệnh viện</th>
                    <th style={{ width: '20%' }}>Ngày tạo</th>
                    <th style={{ width: '20%' }}>Chuẩn đoán</th>
                    <th style={{ width: '15%' }}>Trạng thái</th>
                    <th style={{ width: '10%' }}>Chi tiết</th>
                </thead>
                <LoadingTable columnCount={5} rowCount={rowCount}></LoadingTable>{" "}
            </table>
        ) : (
            filteredMRList?.length > 0 ?

                <table className="table" style={{ boxSizing: 'border-box' }}>
                    <thead>
                    <th style={{ width: '20%' }}>Bác sĩ tạo</th>
                    <th style={{ width: '15%' }} >Bệnh viện</th>
                    <th style={{ width: '20%' }}>Ngày tạo</th>
                    <th style={{ width: '20%' }}>Chuẩn đoán</th>
                    <th style={{ width: '15%' }}>Trạng thái</th>
                    <th style={{ width: '10%' }}>Chi tiết</th>
                    </thead>
                    <tbody>
                        {filteredMRList?.map((request, index) => {
                            if (index < rowCount * page && index >= page * rowCount - rowCount) {
                                return (
                                    <tr key={index}>
                                        <td style={{ textAlign: 'left', fontWeight: 'bolder' }}>{request?.creator?.user?.fullName}</td>
                                        <td>{request?.creator?.hospital}</td>
                                        <td>{getDateTime(request?.comeTime)}</td>
                                        <td style={{ textAlign: 'left' }}>{request?.majorReason}</td>
                                        <td>
                                            {request?.status == 'CREATING' ? (
                                                <span className="success status">
                                                    Đang tạo
                                                </span>
                                            ) : (<span className="status waiting">
                                                    Hoàn thành
                                                </span>
                                            )
                                            }
                                        </td>

                                        <td>
                                            {
                                                <BsFillEyeFill
                                                    color="#695cfe"
                                                    fontSize="20px"
                                                    onClick={() => handleShowDetailMR(request?.MRId,request?.creator?.citizenId, '/patient/mr-list/detail-mr')}
                                                ></BsFillEyeFill>
                                            }
                                        </td>
                                    </tr>
                                );
                            }
                        })}
                    </tbody>
                </table>
                : <NoResults content={'Tạo bệnh án cho bệnh nhân'} title={'Bệnh nhân chưa có bệnh án'} />
        )}
    </div>)
};
