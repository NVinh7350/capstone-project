import React, { useEffect, useState } from "react";
import "./DetailUser.css";
import { useDispatch, useSelector } from "react-redux";
import { adminSelector, getDetailAccount } from "../AdminSlice";
import { getAge, getDate } from "../../../utils/TimeUtils";
import Avatar from "../../../components/Avatar/Avatar";
import { loginSelector } from "../../LoginPage/LoginSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export const DetailUser = () => {
    const adminSelect = useSelector(adminSelector);
    const detailAccount = adminSelect.detailAccount;
    const loginSelect = useSelector(loginSelector);
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
                {adminSelect.isLoading ? (
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
                                width={'150px'}
                                base64String={detailAccount?.avatar}
                            ></Avatar>
                            <h3 style={{ color: "var(--prima--color)" }}>
                                {detailAccount?.fullName}
                            </h3>
                            {detailAccount?.doctor ? (
                                <>
                                    <div className="action-request-status">
                                        <span>Danh sách yêu cầu</span>
                                        <span className="request-action">
                                            {
                                                detailAccount?.doctor
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
                                                detailAccount?.doctor
                                                    ?.accessList?.length
                                            }
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                            {detailAccount?.patient ? (
                                <>
                                    <div className="action-request-status">
                                        <span>Danh sách yêu cầu</span>
                                        <span className="request-action">
                                            {
                                                detailAccount?.patient
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
                                                detailAccount?.patient
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
                    {adminSelect.isLoading ? (
                        <div className="user-column" >
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
                        <div className="user-column" style={{width: '35%'}}>
                            <h3> CÁ NHÂN</h3>
                            <div className="user-row">
                                <h4>Số CMND:</h4>
                                <span>{detailAccount?.citizenNumber}</span>
                            </div>
                            <div className="user-row">
                                <h4>Dân tộc:</h4>
                                <span>{detailAccount?.ethnicity}</span>
                            </div>
                            <div className="user-row">
                                <h4>Giới tính:</h4>
                                <span>
                                    {detailAccount?.gender === "MALE"
                                        ? "Nam"
                                        : "Nữ"}
                                </span>
                            </div>
                            <div className="user-row">
                                <h4>Ngày sinh:</h4>
                                <span>{getDate(detailAccount?.birthDay)}</span>
                            </div>
                        </div>
                    )}
                    {adminSelect.isLoading ? (
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
                        <div className="user-column" style={{width: '60%'}}>
                            <h3>LIÊN HỆ</h3>
                            <div className="user-row">
                                <h4>Số điện thoại:</h4>
                                <span>{detailAccount?.citizenNumber}</span>
                            </div>
                            <div className="user-row">
                                <h4>Email:</h4>
                                <span>{detailAccount?.email}</span>
                            </div>
                            <div className="user-row">
                                <h4>Địa chỉ:</h4>
                                <span>{detailAccount?.address}</span>
                            </div>
                        </div>
                    )}
                    {adminSelect.isLoading ? (
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
                            {detailAccount?.doctor ? (
                                <div className="user-column">
                                    <h3> CÁ NHÂN</h3>
                                    <div className="user-row">
                                        <h4>Chức vụ:</h4>
                                        <span>
                                            {detailAccount?.doctor?.position}
                                        </span>
                                    </div>
                                    <div className="user-row">
                                        <h4>Khoa:</h4>
                                        <span>
                                            {detailAccount?.doctor?.specialty}
                                        </span>
                                    </div>
                                    <div className="user-row">
                                        <h4>Bệnh viện:</h4>
                                        <span>
                                            {detailAccount?.doctor?.hospital}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                            {detailAccount?.patient ? (
                                <>
                                    <div className="user-column"  style={{width:'100%'}}>
                                        <h3>BỆNH NHÂN</h3>
                                        <div className="user-row">
                                            <h4>Số BHYT:</h4>
                                            <span>
                                                {
                                                    detailAccount?.patient
                                                        ?.HICNumber
                                                }
                                            </span>
                                        </div>
                                        <div className="user-row">
                                            <h4>Họ Tên NT:</h4>
                                            <span>
                                                {
                                                    detailAccount?.patient
                                                        ?.guardianName
                                                }
                                            </span>
                                        </div>
                                        <div className="user-row">
                                            <h4>Điện thoại NT:</h4>
                                            <span>
                                                {
                                                    detailAccount?.patient
                                                        ?.guardianPhone
                                                }
                                            </span>
                                        </div>
                                        <div className="user-row">
                                            <h4>Địa chỉ NT:</h4>
                                            <span>
                                                {
                                                    detailAccount?.patient
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
