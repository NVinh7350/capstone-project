import React, { useEffect, useState } from "react";
import "../../AdminPage/DetailUser/DetailUser.css";
import { useDispatch, useSelector } from "react-redux";
import { getAge, getDate, getDateTime, getDateTimeLocal } from "../../../utils/TimeUtils";
import ReactLoading from "react-loading";
import doctorSlice, { doctorSelector, filterMRList, getDetailMR, getMRList } from "../DoctorSlice";
import { TbSend } from "react-icons/tb";
import { AiOutlineFileAdd } from 'react-icons/ai'
import { BiPlusMedical } from 'react-icons/bi'
import { BsSearch, BsFillEyeFill } from "react-icons/bs";
import { RiFileListLine } from 'react-icons/ri'
import { getUser } from "../../../utils/LocalStorage";
import { useNavigate } from "react-router-dom";

import Avatar from "../../../components/Avatar/Avatar";
import { loginSelector } from "../../LoginPage/LoginSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TabCustom from '../../../components/TabCustom/TabCustom'
import { MRList } from "../MRList/MRList";
import Search from "../../../components/Search/Search";
import NoResults from "../../../components/NoResults/NoResults";
import LoadingTable from "../../../components/LoadingTable/LoadingTable";
import { Pagination } from "../../../components/Pagination/Pagination";
import SelectCustom from "../../../components/SelectCustom/SelectCustom";
import { getDetailDoctor } from "../../PatientPage/PatientSlice";
export const UserInfo = () => {
    const doctorSelect = useSelector(doctorSelector);
    const detailUser = doctorSelect.detailPatient;
    return (
        <div style={{
            width: '100%', display: 'flex',
            flexWrap: 'wrap',
        }}>
            {doctorSelect.isLoading ? (
                <div className="user-column">
                    <h3 style={{ width: "60px" }}>
                        <Skeleton duration={1}></Skeleton>
                    </h3>
                    <div className="user-row">
                        <h3 style={{ width: "80%" }}>
                            <Skeleton duration={1}></Skeleton>
                        </h3>
                    </div>
                    <div className="user-row">
                        <h3 style={{ width: "80%" }}>
                            <Skeleton duration={1}></Skeleton>
                        </h3>
                    </div>
                    <div className="user-row">
                        <h3 style={{ width: "30%" }}>
                            <Skeleton duration={1}></Skeleton>
                        </h3>
                    </div>
                    <div className="user-row">
                        <h3 style={{ width: "60%" }}>
                            <Skeleton duration={1}></Skeleton>
                        </h3>
                    </div>
                </div>
            ) : (
                <div className="user-column" style={{ width: '35%' }}>
                    <h3> CÁ NHÂN</h3>
                    <div className="user-row">
                        <h4>Số CMND:</h4>
                        <span>{detailUser?.citizenNumber}</span>
                    </div>
                    <div className="user-row">
                        <h4>Dân tộc:</h4>
                        <span>{detailUser?.ethnicity}</span>
                    </div>
                    <div className="user-row">
                        <h4>Giới tính:</h4>
                        <span>
                            {detailUser?.gender === "MALE"
                                ? "Nam"
                                : "Nữ"}
                        </span>
                    </div>
                    <div className="user-row">
                        <h4>Ngày sinh:</h4>
                        <span>{getDate(detailUser?.birthDay)}</span>
                    </div>
                </div>
            )}
            {doctorSelect.isLoading ? (
                <div className="user-column">
                    <h3 style={{ width: "20%" }}>
                        <Skeleton duration={1}></Skeleton>
                    </h3>
                    <div className="user-row">
                        <h3 style={{ width: "70%" }}>
                            <Skeleton duration={1}></Skeleton>
                        </h3>
                    </div>
                    <div className="user-row">
                        <h3 style={{ width: "70%" }}>
                            <Skeleton duration={1}></Skeleton>
                        </h3>
                    </div>
                    <div className="user-row">
                        <h3 style={{ width: "90%" }}>
                            <Skeleton duration={1}></Skeleton>
                        </h3>
                    </div>
                </div>
            ) : (
                <div className="user-column" style={{ width: '60%' }}>
                    <h3>LIÊN HỆ</h3>
                    <div className="user-row">
                        <h4>Số điện thoại:</h4>
                        <span>{detailUser?.citizenNumber}</span>
                    </div>
                    <div className="user-row">
                        <h4>Email:</h4>
                        <span>{detailUser?.email}</span>
                    </div>
                    <div className="user-row">
                        <h4>Địa chỉ:</h4>
                        <span>{detailUser?.address}</span>
                    </div>
                </div>
            )}
            {doctorSelect.isLoading ? (
                <div className="user-column">
                    <h3 style={{ width: "20%" }}>
                        <Skeleton duration={1}></Skeleton>
                    </h3>
                    <div className="user-row">
                        <h3 style={{ width: "60%" }}>
                            <Skeleton duration={1}></Skeleton>
                        </h3>
                    </div>
                    <div className="user-row">
                        <h3 style={{ width: "60%" }}>
                            <Skeleton duration={1}></Skeleton>
                        </h3>
                    </div>
                    <div className="user-row">
                        <h3 style={{ width: "60%" }}>
                            <Skeleton duration={1}></Skeleton>
                        </h3>
                    </div>
                    <div className="user-row">
                        <h3 style={{ width: "60%" }}>
                            <Skeleton duration={1}></Skeleton>
                        </h3>
                    </div>
                </div>
            ) : (
                <>
                    {detailUser?.doctor ? (
                        <div className="user-column">
                            <h3> CÁ NHÂN</h3>
                            <div className="user-row">
                                <h4>Chức vụ:</h4>
                                <span>
                                    {detailUser?.doctor?.position}
                                </span>
                            </div>
                            <div className="user-row">
                                <h4>Khoa:</h4>
                                <span>
                                    {detailUser?.doctor?.specialty}
                                </span>
                            </div>
                            <div className="user-row">
                                <h4>Bệnh viện:</h4>
                                <span>
                                    {detailUser?.doctor?.hospital}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                    {detailUser?.patient ? (
                        <>
                            <div className="user-column" style={{ width: '100%' }}>
                                <h3>BỆNH NHÂN</h3>
                                <div className="user-row">
                                    <h4>Số BHYT:</h4>
                                    <span>
                                        {
                                            detailUser?.patient
                                                ?.HICNumber
                                        }
                                    </span>
                                </div>
                                <div className="user-row">
                                    <h4>Họ Tên NT:</h4>
                                    <span>
                                        {
                                            detailUser?.patient
                                                ?.guardianName
                                        }
                                    </span>
                                </div>
                                <div className="user-row">
                                    <h4>Điện thoại NT:</h4>
                                    <span>
                                        {
                                            detailUser?.patient
                                                ?.guardianPhone
                                        }
                                    </span>
                                </div>
                                <div className="user-row">
                                    <h4>Địa chỉ NT:</h4>
                                    <span>
                                        {
                                            detailUser?.patient
                                                ?.guardianAddress
                                        }
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </>
            )}
        </div>
    )
}

export const MRTable = () => {
    const dispatch = useDispatch();
    const doctorSelect = useSelector(doctorSelector);
    const detailUser = doctorSelect.detailPatient;
    const detailMR = doctorSelect.medicalRecord;
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
        dispatch(getMRList(detailUser.citizenId))
        if (detailMR) {
            navigate('/doctor/detail-patient/detail-mr');

        }
    }, [detailMR])
    const handleShowDetailMR = (data, doctorId ,path) => {
        dispatch(getDetailMR(data));
        dispatch(getDetailDoctor(doctorId));
    }

    return (<div style={{ width: '100%' }}>
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
        {doctorSelect.isLoading ? (
            <table className="table" style={{ marginTop: '20px', boxSizing: 'border-box' }}>
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

                <table className="table" style={{ marginTop: '20px', boxSizing: 'border-box' }}>
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
                                        <td>{getDateTime(getDateTimeLocal(request?.comeTime))}</td>
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
                                                    onClick={() => handleShowDetailMR(request?.MRId,request?.creator?.citizenId ,'/doctor/detail-patient/detail-mr')}
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

}

export const DetailPatient = () => {
    const dispatch = useDispatch();
    const doctorSelect = useSelector(doctorSelector);
    const logginSelect = useSelector(loginSelector);

    const detailUser = doctorSelect.detailPatient;
    const user = logginSelect.user || (JSON.parse(getUser()));
    const userId = user.citizenId;
    const checkRequest = detailUser?.patient?.accessRequestList?.some(e => e.doctorId === userId);
    const checkAccess = detailUser?.patient?.accessList?.some(e => e.doctorId === userId);
    const navigate = useNavigate();

    useEffect(() => {
    }, [])
    const createMR = () => {
        navigate('/doctor/create-mr')
    }
    return (
        <>
            <div className="user-content-container" style={{ width: '100%', padding: '0px' }}>
                <h3 className="role-title" style={{ position: "absolute", top: "0px" }}>
                    Thông tin bệnh nhân
                </h3>
                <div className={"user-content-container"}>
                    {doctorSelect.isLoading ? (
                        <>
                            <div className="action-container">
                                <div style={{ width: "150px" }}>
                                    <Skeleton
                                        style={{
                                            width: "100%",
                                            borderRadius: "100%",
                                            aspectRatio: 1,
                                        }}
                                        duration={1}
                                    ></Skeleton>
                                </div>
                                <h3 style={{ width: "86%" }}>
                                    <Skeleton duration={1}></Skeleton>
                                </h3>
                                <div className="action-request-status">
                                    <h3 style={{ width: "100%" }}>
                                        <Skeleton duration={1}></Skeleton>
                                    </h3>
                                </div>
                                <div
                                    className="action-request-status"
                                    style={{ borderBottomWidth: "1px" }}
                                >
                                    <h3 style={{ width: "100%" }}>
                                        <Skeleton duration={1}></Skeleton>
                                    </h3>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="action-container">
                                <Avatar
                                    width={"150px"}
                                    base64String={detailUser?.avatar}
                                ></Avatar>
                                <h3 style={{ color: "var(--prima--color)" }}>
                                    {detailUser?.fullName}
                                </h3>

                                {detailUser?.doctor ? (
                                    <>
                                        <div className="action-request-status">
                                            <span>Danh sách yêu cầu</span>
                                            <span className="request-action">
                                                {
                                                    detailUser?.doctor
                                                        ?.accessRequestList?.length
                                                }
                                            </span>
                                        </div>
                                        <div
                                            className="action-request-status"
                                            style={{ borderBottomWidth: "1px" }}
                                        >
                                            <span>Danh sách truy cập</span>
                                            <span className="access-action">
                                                {
                                                    detailUser?.doctor
                                                        ?.accessList?.length
                                                }
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                                {detailUser?.patient ? (
                                    <>
                                        <div className="action-request-status">
                                            <span>Danh sách yêu cầu</span>
                                            <span className="request-action">
                                                {
                                                    detailUser?.patient
                                                        ?.accessRequestList?.length
                                                }
                                            </span>
                                        </div>
                                        <div
                                            className="action-request-status"
                                            style={{ borderBottomWidth: "1px" }}
                                        >
                                            <span>Danh sách truy cập</span>
                                            <span className="access-action">
                                                {
                                                    detailUser?.patient
                                                        ?.accessList?.length
                                                }
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                                {
                                    checkRequest ?
                                        <>
                                            <div className="action-button-send" style={{ backgroundColor: '#1877f2' }}>
                                                <TbSend className="action-button-icon"></TbSend>
                                                <label >{`Gửi yêu cầu`}</label>
                                            </div>
                                        </> :
                                        checkAccess ?
                                            <>
                                                <div className="action-button-send" style={{ backgroundColor: 'white', color: 'var(--prima--color)' }} onClick={createMR}>
                                                    <BiPlusMedical className="action-button-icon"></BiPlusMedical>
                                                    <label >{`Thêm bệnh án`}</label>
                                                </div>
                                            </> :
                                            <>
                                                <div className="action-button-send" style={{ backgroundColor: '#1877f2' }}>
                                                    <TbSend className="action-button-icon"></TbSend>
                                                    <label >{`Gửi yêu cầu`}</label>
                                                </div>
                                            </>
                                }
                            </div>
                        </>
                    )}
                    <div className="user-container" style={{ width: '77%', padding: 0 }}>
                        <TabCustom childrenList={
                            [{
                                name: 'Thông tin cá nhân',
                                children:
                                    <UserInfo></UserInfo>
                            }, {
                                name: 'Danh sách bệnh án',
                                children: <MRTable></MRTable>
                            }
                            ]
                        }></TabCustom>
                    </div>
                </div>

            </div>
        </>
    );
};
