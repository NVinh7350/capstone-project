import React, { useEffect, useState } from "react";
import "../../AdminPage/UserList/UserList.css";
import { useDispatch, useSelector } from "react-redux";
import { getAge, getDate, getDateTime } from "../../../utils/TimeUtils";
import Search from "../../../components/Search/Search";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { TbSend, TbSendOff } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import doctorSlice, {
    doctorSelector,
    findPatientBySearch,
    getDetailPatient,
    requestAccess,
    filterPatientSearch
} from "../DoctorSlice";
import { getUser } from "../../../utils/LocalStorage";
import LoadingTable from "../../../components/LoadingTable/LoadingTable";
import NoResults from "../../../components/NoResults/NoResults";
import { loginSelector } from "../../LoginPage/LoginSlice";
import { Pagination } from "../../../components/Pagination/Pagination";
import SelectCustom from "../../../components/SelectCustom/SelectCustom";
export const FindFatient = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const doctorSelect = useSelector(doctorSelector);
    const loginSelect = useSelector(loginSelector);

    const citizenId = loginSelect?.user?.citizenId ||JSON.parse(getUser())?.citizenId;
    const [searchContent, setSearchContent] = useState({
        citizenNumber: '',
        fullName: '',
        gender: 'Giới tính'
    });

    const [page, setPage] = useState(1);
    const rowCount = 7;
    const filteredPatientList = useSelector((state) => filterPatientSearch(state, searchContent));

    const fillter = (e) => {
        setSearchContent({
            ...searchContent,
            [e.target.name]: e.target.value
        })
    }
    
    useEffect(() => {
        return () => dispatch(doctorSlice.actions.removePatientSearchList());
    }, []);

    const sendRequestAccess = (patientId) => {
        dispatch(requestAccess(patientId));
        dispatch(findPatientBySearch(patientId));
    };

    const handleShowDetailUser = async (userId, path) => {
        dispatch(getDetailPatient(userId));
        navigate(path);
    };
    return (
        <div className="main-content-container">
            <h3 className="role-title" style={{ position: 'absolute', top: '0px' }}>Tìm kiếm bệnh nhân</h3>
            <div className="main-content-header">
            <Search
                onClick={() => {
                    dispatch(findPatientBySearch(searchContent.fullName));
                }}
                name={'fullName'}
                handleChange={fillter}
                planceHolder={"Tìm bệnh nhân"}
            ></Search>
            <SelectCustom 
                    value={searchContent.gender === 'MALE' ? 'Nam' : (searchContent.gender === 'FEMALE' ? 'Nữ' : 'Giới tính')}
                    name={'gender'} 
                    handleChange={fillter} label={'Giới tính'} 
                    options={[{ label: 'Giới tính', value: 'Giới tính' }, { label: 'Nam', value: 'MALE' }, { label: 'Nữ', value: 'FEMALE' }]}>
                </SelectCustom>

                <Pagination limit={5} page={page} siblings={1} totalPage={Math.ceil(filteredPatientList?.length / rowCount) | 1} setPage={setPage}></Pagination>
            
            </div>
            <div className="line"></div>
            {doctorSelect.isLoading ? (
                <table className="table">
                <thead>
                    <th style={{ width: '10%' }}>CMNN</th>
                    <th style={{ width: '20%' }}>Họ và Tên</th>
                    <th style={{ width: '8%' }}>Giới tính</th>
                    <th style={{ width: '15%' }}>Ngày sinh</th>
                    <th style={{ width: '15%' }}>Mã BHYT</th>
                    <th style={{ width: '10%' }}>Quyền truy cập</th>
                    <th style={{ width: '8%' }}>Yêu cầu</th>
                    <th style={{ width: '8%' }}>Truy cập</th>
                </thead>
                <LoadingTable columnCount={7} rowCount={rowCount}></LoadingTable>{" "}
            </table>
            ) : (
            filteredPatientList?.length > 0 ?
            <table className="table">
                <thead>
                    <th style={{ width: '10%' }}>CMNN</th>
                    <th style={{ width: '24%' }}>Họ và Tên</th>
                    <th style={{ width: '8%' }}>Giới tính</th>
                    <th style={{ width: '15%' }}>Ngày sinh</th>
                    <th style={{ width: '15%' }}>Mã BHYT</th>
                    <th style={{ width: '12%' }}>Quyền truy cập</th>
                    <th style={{ width: '8%' }}>Yêu cầu</th>
                    <th style={{ width: '8%' }}>Truy cập</th>
                </thead>
                <tbody>
                    {filteredPatientList?.map((patient, index) => {
                        const access = patient?.accessList?.some(
                            (access) => access?.doctorId === citizenId
                        );
                        const accessRequest = patient?.accessRequestList.some(
                            (accessRequest) =>
                                accessRequest?.doctorId === citizenId
                        );
                        if (index < rowCount * page && index >= page * rowCount - rowCount)
                        {return (
                            <tr key={index}>
                                <td>{patient?.user.citizenNumber}</td>
                                <td style={{ textAlign: 'left', fontWeight: 'bolder' }}>{patient?.user.fullName}</td>
                                <td>
                                    {patient?.user?.gender === "MALE"
                                        ? "Nam"
                                        : "Nữ"}
                                </td>
                                <td>{`${getDate(
                                    patient?.user?.birthDay
                                )} (${getAge(patient?.user?.birthDay)})`}</td>
                                <td>{patient?.HICNumber}</td>
                                <td>
                                    {access ? (
                                        <span className="success status">
                                            Có thể truy cập
                                        </span>
                                    ) : accessRequest ? (
                                        <span className="status waiting">
                                            Đã yêu cầu
                                        </span>
                                    ) : (
                                        <span className="status pending">
                                            Chưa yêu cầu
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {accessRequest || access ? (
                                        <TbSendOff
                                            className="icon"
                                            color="dimgray"
                                            fontSize="20px"
                                        ></TbSendOff>
                                    ) : (
                                        <TbSend
                                            color="#695cfe"
                                            fontSize="20px"
                                            onClick={() =>
                                                sendRequestAccess(
                                                    patient?.citizenId
                                                )
                                            }
                                        ></TbSend>
                                    )}
                                </td>
                                <td>
                                    {access ? (
                                        <BsFillEyeFill
                                            color="#695cfe"
                                            fontSize="20px"
                                            onClick={() =>
                                                handleShowDetailUser(
                                                    patient?.citizenId,
                                                    "/doctor/find-patient/detail-patient"
                                                )
                                            }
                                        ></BsFillEyeFill>
                                    ) : (
                                        <BsFillEyeSlashFill
                                            fontSize="20px"
                                            color="dimgray"
                                        ></BsFillEyeSlashFill>
                                    )}
                                </td>
                            </tr>
                        );}
                    })}
                </tbody>
            </table>
            : <NoResults content={''} title={'Không tìm thấy bệnh nhân'}/>
            )}
        </div>
    );
};
