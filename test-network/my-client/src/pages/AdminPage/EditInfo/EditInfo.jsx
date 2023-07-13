import React, { useState, useEffect } from "react";
import "../AddDoctor/AddDoctor.css";
import TextField from "../../../components/TextField/TextField";
import { useDispatch, useSelector } from "react-redux";
import adminSlice, {
    adminSelector,
    changePassword,
    updateAdminInfo,
} from "../AdminSlice";
import { loginSelector } from '../../LoginPage/LoginSlice'
import { changeDateForm } from "../../../utils/TimeUtils";
import {
    validateAddress,
    validateDateOfBirth,
    validateEmail,
    validateName,
    validatePhoneNumber,
} from "../../../utils/Validate";
import ReactLoading from "react-loading";
import { validateHook } from "../../../components/validateHook/validateHook";
import { getUser } from "../../../utils/LocalStorage";
import { BsFillEyeSlashFill, BsFillEyeFill } from 'react-icons/bs'
import Avatar from "../../../components/Avatar/Avatar";
export const EditInfo = () => {
    const dispatch = useDispatch();
    const loginSelect = useSelector(loginSelector);
    const adminSelect = useSelector(adminSelector);
    const adminUpdate = adminSelect.adminUpdate;
    const passwordUpdate = adminSelect.passwordUpdate;
    useEffect(() => {
        let admin = loginSelect.user || JSON.parse(getUser());
        admin = {
            ...admin,
            birthDay: changeDateForm(admin?.birthDay),
        };
        dispatch(adminSlice.actions.setAdminUpdate(admin));

        return () => {
            dispatch(adminSlice.actions.removePasswordUpdate());
            dispatch(adminSlice.actions.removeAdminUpdate());
        };
    }, []);
    const handleChangeInfo = (event) => {
        dispatch(
            adminSlice.actions.setAdminUpdate({
                ...adminUpdate,
                [event.target.name]: event.target.value,
            })
        );
    };
    const handleChangePW = (event) => {
        dispatch(
            adminSlice.actions.setPasswordUpdate({
                ...passwordUpdate,
                [event.target.name]: event.target.value,
            })
        );
    };

    const [showPW, setShowPW] = useState(false);

    const requiredFields = {
        citizenId: {
            check: () => {
                return null;
            },
            req: true,
            label: "Số CMND",
            name: "citizenId",
            value: adminUpdate?.citizenNumber,
        },
        fullName: {
            check: validateName,
            req: true,
            label: 'Họ và tên',
            name: 'fullName',
            value: adminUpdate?.fullName
        },
        email: {
            check: validateEmail,
            req: false,
            label: 'Email',
            name: 'email',
            value: adminUpdate?.email
        },
        birthDay: {
            check: validateDateOfBirth,
            req: true,
            label: 'Ngày sinh',
            name: 'birthDay',
            value: adminUpdate?.birthDay
        },
        gender: {
            check: () => { return null },
            req: true,
            label: 'Giới tính',
            name: 'gender',
            value: adminUpdate?.gender
        },
        ethnicity: {
            check: validateName,
            req: false,
            label: 'Dân tộc',
            name: 'ethnicity',
            value: adminUpdate?.ethnicity
        },
        address: {
            check: validateAddress,
            req: true,
            label: 'Địa chỉ',
            name: 'address',
            value: adminUpdate?.address
        },
        phoneNumber: {
            check: validatePhoneNumber,
            req: false,
            label: 'Điện thoại',
            name: 'phoneNumber',
            value: adminUpdate?.phoneNumber
        },
    };
    const requiredPWFields = {
        oldPassword: {
            check: () => {
                return null;
            },
            req: true,
            label: "Mật khẩu cũ",
            name: "oldPassword",
            value: passwordUpdate?.oldPassword
        },
        newPassword: {
            check: () => {
                return null;
            },
            req: true,
            label: "Mật khẩu mới",
            name: "newPassword",
            value: passwordUpdate?.newPassword
        },
        confirmPassword: {
            check: () => {
                return null;
            },
            req: true,
            label: "Xác nhận mật khẩu mới",
            name: "confirmPassword",
            value: passwordUpdate?.confirmPassword
        },
    };

    const changeAvatar = (e) => {
        dispatch(
            adminSlice.actions.setAdminUpdate({
                ...adminUpdate,
                avatar: e
            })
        )
    }

    const { error, checkValidate } = validateHook();
    return (
        <>
            <h3 className="role-title" style={{ position: "absolute", top: "0px" }}>
                Cập nhật thông tin
            </h3>
            <div className="add-doctor-container">
                <div className="user-input-container">
                    <h4>Thông tin cá nhân</h4>
                    <div className="user-input-row" style={{ height: '30%', width: "100%", position: 'relative', top: '3%', left: '0%' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '48%' }}>
                            <Avatar width={'150px'} handleUpload={changeAvatar} base64String={adminUpdate?.avatar}></Avatar>
                        </div>
                        <div className="user-input-row" style={{ width: "40%", display: 'flex', flexDirection: 'column' }}>
                            <TextField
                                containerStyle={{ width: "100%" }}
                                handleChange={handleChangeInfo}
                                value={requiredFields.citizenId.value}
                                name={requiredFields.citizenId.name}
                                required={requiredFields.citizenId.req}
                                label={requiredFields.citizenId.label}
                                error={error?.citizenId}
                                readOnly={true}
                            ></TextField>
                            <div className="radio-container" style={{ top: '-20px' }}>
                                <div className="radio-column">
                                    <label>Nam</label>
                                    <input type="radio" name="gender" value={'MALE'} checked={adminUpdate?.gender === 'MALE'} onChange={
                                        (e) => handleChangeInfo(e)
                                    }></input>
                                </div>
                                <div className="radio-column">
                                    <label>Nữ</label>
                                    <input type="radio" name="gender" value={'FEMALE'} checked={adminUpdate?.gender === 'FEMALE'} onChange={(e) => handleChangeInfo(e)}></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChangeInfo}
                            value={requiredFields.fullName.value}
                            name={requiredFields.fullName.name}
                            required={requiredFields.fullName.req}
                            label={requiredFields.fullName.label}
                            error={error?.fullName}
                        ></TextField>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChangeInfo}
                            value={requiredFields.birthDay.value}
                            type="date"
                            name={requiredFields.birthDay.name}
                            required={requiredFields.birthDay.req}
                            label={requiredFields.birthDay.label}
                            error={error?.birthDay}
                        ></TextField>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChangeInfo}
                            value={requiredFields.phoneNumber.value}
                            name={requiredFields.phoneNumber.name}
                            required={requiredFields.phoneNumber.req}
                            label={requiredFields.phoneNumber.label}
                            error={error?.phoneNumber}
                        ></TextField>

                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChangeInfo}
                            value={requiredFields.email.value}
                            name={requiredFields.email.name}
                            required={requiredFields.email.req}
                            label={requiredFields.email.label}
                            error={error?.email}
                        ></TextField>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChangeInfo}
                            value={requiredFields.address.value}
                            name={requiredFields.address.name}
                            required={requiredFields.address.req}
                            label={requiredFields.address.label}
                            error={error?.address}
                        ></TextField>

                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChangeInfo}
                            value={requiredFields.ethnicity.value}
                            name={requiredFields.ethnicity.name}
                            required={requiredFields.ethnicity.req}
                            label={requiredFields.ethnicity.label}
                            error={error?.ethnicity}
                        ></TextField>
                    </div>
                    <button
                        onClick={() => {
                            checkValidate(adminUpdate, requiredFields, () =>
                                dispatch(updateAdminInfo())
                            );
                        }}
                    >
                        {adminSelect.isLoading === 'updateAdminInfo' ? (
                            <ReactLoading
                                color="white"
                                height="40px"
                                width="40px"
                                type={"spinningBubbles"}
                            ></ReactLoading>
                        ) : (
                            "Cập nhật"
                        )}
                    </button>
                </div>
                <div className="doctor-input-container">
                    <h4>Đổi mật khẩu</h4>
                    <span style={{ position: 'relative', top: '11%', left: '80%', zIndex: 1 }}>
                        {
                            showPW ?
                                <BsFillEyeFill onClick={() => setShowPW(!showPW)}></BsFillEyeFill>
                                :
                                <BsFillEyeSlashFill onClick={() => setShowPW(!showPW)}></BsFillEyeSlashFill>
                        }
                    </span>
                    <TextField
                        handleChange={handleChangePW}
                        value={requiredPWFields.oldPassword.value}
                        name={requiredPWFields.oldPassword.name}
                        required={requiredPWFields.oldPassword.req}
                        label={requiredPWFields.oldPassword.label}
                        error={error?.oldPassword}
                        type={showPW ? 'text' : 'password'}
                    ></TextField>

                    <TextField
                        handleChange={handleChangePW}
                        value={requiredPWFields.newPassword.value}
                        name={requiredPWFields.newPassword.name}
                        required={requiredPWFields.newPassword.req}
                        label={requiredPWFields.newPassword.label}
                        error={error?.newPassword}
                        type={showPW ? 'text' : 'password'}
                    ></TextField>
                    <TextField
                        handleChange={handleChangePW}
                        value={requiredPWFields.confirmPassword.value}
                        name={requiredPWFields.confirmPassword.name}
                        required={requiredPWFields.confirmPassword.req}
                        label={requiredPWFields.confirmPassword.label}
                        error={error?.confirmPassword}
                        type={showPW ? 'text' : 'password'}
                    ></TextField>
                    <button
                        onClick={() => {
                            checkValidate(
                                passwordUpdate,
                                requiredPWFields,
                                () => dispatch(changePassword())
                            );
                        }}
                    >
                        {adminSelect.isLoading == 'changePassword' ? (
                            <ReactLoading
                                color="white"
                                height="40px"
                                width="40px"
                                type={"spinningBubbles"}
                            ></ReactLoading>
                        ) : (
                            "Đổi mật khẩu"
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};
