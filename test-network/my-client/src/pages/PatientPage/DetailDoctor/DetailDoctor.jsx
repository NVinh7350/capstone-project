import React, { useEffect } from "react";
import "../../AdminPage/DetailUser/DetailUser.css";
import { useDispatch, useSelector } from "react-redux";
import { getAge, getDate } from "../../../utils/TimeUtils";

import Avatar from "../../../components/Avatar/Avatar";
import { loginSelector } from "../../LoginPage/LoginSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { patientSelector } from "../PatientSlice";
export const DetailDoctor = () => {
    const patientSelect = useSelector(patientSelector);
    const detailDoctor = patientSelect.detailDoctor;
    const dispatch = useDispatch();
    return (
        <>
            <h3
                className="role-title"
                style={{ position: "absolute", top: "0px" }}
            >
                {" "}
                Thông tin chi tiết<td></td>
            </h3>
            <div className={"user-content-container"}>
                {patientSelect.isLoading ? (
                    <>
                        <div className="action-container">
                            <div style={{ width: "75%" }}>
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
                                width={"70%"}
                                base64String={detailDoctor?.avatar}
                            ></Avatar>
                            <h3 style={{ color: "var(--prima--color)" }}>
                                {detailDoctor?.fullName}
                            </h3>
                            {detailDoctor?.doctor ? (
                                <>
                                    <div className="action-request-status">
                                        <span>Danh sách yêu cầu</span>
                                        <span className="request-action">
                                            {
                                                detailDoctor?.doctor
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
                                                detailDoctor?.doctor
                                                    ?.accessList?.length
                                            }
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                            {detailDoctor?.patient ? (
                                <>
                                    <div className="action-request-status">
                                        <span>Danh sách yêu cầu</span>
                                        <span className="request-action">
                                            {
                                                detailDoctor?.patient
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
                                                detailDoctor?.patient
                                                    ?.accessList?.length
                                            }
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    </>
                )}
                <div className="user-container">
                    {patientSelect.isLoading ? (
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
                        <div className="user-column">
                            <h3> CÁ NHÂN</h3>
                            <div className="user-row">
                                <h4>Số CMND:</h4>
                                <span>{detailDoctor?.citizenNumber}</span>
                            </div>
                            <div className="user-row">
                                <h4>Dân tộc:</h4>
                                <span>{detailDoctor?.ethnicity}</span>
                            </div>
                            <div className="user-row">
                                <h4>Giới tính:</h4>
                                <span>
                                    {detailDoctor?.gender === "MALE"
                                        ? "Nam"
                                        : "Nữ"}
                                </span>
                            </div>
                            <div className="user-row">
                                <h4>Ngày sinh:</h4>
                                <span>{getDate(detailDoctor?.birthDay)}</span>
                            </div>
                        </div>
                    )}
                    {patientSelect.isLoading ? (
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
                        <div className="user-column">
                            <h3>LIÊN HỆ</h3>
                            <div className="user-row">
                                <h4>Số điện thoại:</h4>
                                <span>{detailDoctor?.citizenNumber}</span>
                            </div>
                            <div className="user-row">
                                <h4>Email:</h4>
                                <span>{detailDoctor?.email}</span>
                            </div>
                            <div className="user-row">
                                <h4>Địa chỉ:</h4>
                                <span>{detailDoctor?.address}</span>
                            </div>
                        </div>
                    )}
                    {patientSelect.isLoading ? (
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
                            {detailDoctor?.doctor ? (
                                <div className="user-column">
                                    <h3> CÁ NHÂN</h3>
                                    <div className="user-row">
                                        <h4>Chức vụ:</h4>
                                        <span>
                                            {detailDoctor?.doctor?.position}
                                        </span>
                                    </div>
                                    <div className="user-row">
                                        <h4>Khoa:</h4>
                                        <span>
                                            {detailDoctor?.doctor?.specialty}
                                        </span>
                                    </div>
                                    <div className="user-row">
                                        <h4>Bệnh viện:</h4>
                                        <span>
                                            {detailDoctor?.doctor?.hospital}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                            {detailDoctor?.patient ? (
                                <>
                                    <div className="user-column">
                                        <h3>BỆNH NHÂN</h3>
                                        <div className="user-row">
                                            <h4>Số BHYT:</h4>
                                            <span>
                                                {
                                                    detailDoctor?.patient
                                                        ?.HICNumber
                                                }
                                            </span>
                                        </div>
                                        <div className="user-row">
                                            <h4>Họ Tên NT:</h4>
                                            <span>
                                                {
                                                    detailDoctor?.patient
                                                        ?.guardianName
                                                }
                                            </span>
                                        </div>
                                        <div className="user-row">
                                            <h4>Điện thoại NT:</h4>
                                            <span>
                                                {
                                                    detailDoctor?.patient
                                                        ?.guardianPhone
                                                }
                                            </span>
                                        </div>
                                        <div className="user-row">
                                            <h4>Địa chỉ NT:</h4>
                                            <span>
                                                {
                                                    detailDoctor?.patient
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
            </div>
        </>
    );
};
