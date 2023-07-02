import React, { useState, useEffect } from "react";
import "../../AdminPage/AddDoctor/AddDoctor.css";
import TextField from "../../../components/TextField/TextField";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../../utils/LocalStorage";
import ReactLoading from "react-loading"
import { changeDateForm } from "../../../utils/TimeUtils";
import { validateAddress, validateHICNumber, validateCitizenId, validateDateOfBirth, validateEmail, validateName, validatePhoneNumber } from "../../../utils/Validate";
import patientSlice, { changePassword, patientSelector, updatePatientInfo } from "../PatientSlice";
import { validateHook } from "../../../components/validateHook/validateHook";
import Avatar from "../../../components/Avatar/Avatar";
import { loginSelector } from "../../LoginPage/LoginSlice";
import { BsFillEyeSlashFill, BsFillEyeFill } from 'react-icons/bs'
export const EditPatientInfo = () => {
    const dispatch = useDispatch();
    const loginSelect = useSelector(loginSelector);
    const patientSelect = useSelector(patientSelector);
    const patientInfo = patientSelect.patientInfo;
    const userInfo = patientSelect.userInfo;
    const passwordUpdate = patientSelect.passwordUpdate;
    useEffect(() => {
        let {patient, doctor, ...user} = loginSelect.user || JSON.parse(getUser());
        user = {
            ...user,
            birthDay: changeDateForm(user?.birthDay)
        }
        dispatch(patientSlice.actions.setPatientInfo(patient))
        dispatch(patientSlice.actions.setUserInfo(user))

        return () => {
            // dispatch(patientSlice.actions.removeState());
        }
    }, [])
    
    const handleChangePatientInfo = (event) => {
        dispatch(
            patientSlice.actions.setPatientInfo({
                ...patientInfo,
                [event.target.name]: event.target.value,
            })
        );
    };

    const handleChangeUserInfo = (event) => {
        dispatch(
            patientSlice.actions.setUserInfo({
                ...userInfo,
                [event.target.name]: event.target.value,
            })
        );
    };

    const handleChangePW = (event) => {
        dispatch(
            patientSlice.actions.setPasswordUpdate({
                ...passwordUpdate,
                [event.target.name]: event.target.value,
            })
        )
    }
    const requiredFields = {
        citizenId : {
          check : () => {return null},
          req : true,
          label: 'Số CMND',
          name: 'citizenId',
          value: userInfo?.citizenNumber
        },
        fullName : {
          check : validateName,
          req : true,
          label: 'HỌ và TÊN',
          name: 'fullName',
          value: userInfo?.fullName
        },
        email : {
          check : validateEmail,
          req : false,
          label: 'EMAIL',
          name: 'email',
          value: userInfo?.email
        },
        birthDay : {
          check : validateDateOfBirth,
          req : true,
          label: 'NGÀY SINH',
          name: 'birthDay',
          value: userInfo?.birthDay
        },
        gender : {
          check : () => {return null},
          req : true,
          label: 'GIỚI TÍNH',
          name: 'gender',
          value: userInfo?.gender
        },
        ethnicity : {
          check : validateName,
          req : false,
          label: 'DÂN TỘC',
          name: 'ethnicity',
          value: userInfo?.ethnicity
        },
        address : {
          check : validateAddress,
          req : true,
          label: 'ĐỊA CHỈ',
          name: 'address',
          value: userInfo?.address
        },
        phoneNumber : {
          check : validatePhoneNumber,
          req : false,
          label: 'ĐIỆN THOẠI',
          name: 'phoneNumber',
          value: userInfo?.phoneNumber
        },
        
        HICNumber : {
            check : validateHICNumber,
            req : true,
            label: 'Số BHYT',
            name: 'HICNumber',
            value: patientInfo?.HICNumber
          },
          guardianName : {
            check : validateName,
            req : false,
            label: 'Tên NT',
            name: 'guardianName',
            value: patientInfo?.guardianName
          },
          guardianPhone : {
            check : validatePhoneNumber,
            req : false,
            label: 'Điện thoại NT',
            name: 'guardianPhone',
            value: patientInfo?.guardianPhone
          },
          guardianAddress : {
            check : validateAddress,
            req : false,
            label: 'Địa chỉ NT',
            name: 'guardianAddress',
            value: patientInfo?.guardianAddress
          },
    }
    const [showPW, setShowPW] = useState(false);


    const requiredPWFields = { oldPassword : {
        check : () => {return null},
        req : true,
        label: 'MẬT KHẨU CŨ',
        name: 'oldPassword',
        value: passwordUpdate?.oldPassword
      },
      newPassword : {
        check : () => {return null},
        req : true,
        label: 'MẬT KHẨU MỚI',
        name: 'newPassword',
        value: passwordUpdate?.newPassword
      },
      confirmPassword : {
        check : () => {return null},
        req : true,
        label: 'XÁC NHẬN MẬT KHẨU MỚI',
        name: 'confirmPassword',
        value: passwordUpdate?.confirmPassword
      },
  }

  const changeAvatar = (e) => {
    dispatch(
        patientSlice.actions.setUserInfo({
            ...userInfo,
            avatar: e
        })
    )
}
    const {error, checkValidate} = validateHook();

    return (
        <>
            <h3 className="role-title" style={{position: 'absolute', top: '0px'}}> Cập nhật thông tin</h3>
            <div className="add-doctor-container">
                <div className="user-input-container" style={{height: '115vh'}}>
                <h4>Thông tin cá nhân</h4>
                <div className="user-input-row" style={{ height: '40%', width: "100%", position: 'relative', top: '5%', left: '0%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '48%' }}>
                        <Avatar width={'150px'} handleUpload={changeAvatar} base64String={userInfo?.avatar}></Avatar>
                    </div>
                    <div className="user-input-row" style={{ width: "40%", display: 'flex', flexDirection: 'column' }}>
                        <TextField
                            containerStyle={{ width: "100%" }}
                            value={requiredFields?.citizenId.value}
                            handleChange={handleChangeUserInfo}
                            name={requiredFields.citizenId.name}
                            required={requiredFields.citizenId.req}
                            label={requiredFields.citizenId.label}
                            error={error?.citizenId}
                            readOnly={true}
                        ></TextField>
                        <div className="radio-container" style={{ top: '-20px' }}>
                            <div className="radio-column">
                                <label>Nam</label>
                                <input type="radio" name="gender" value={'MALE'} checked={userInfo?.gender==='MALE'} onChange={
                                   (e) => handleChangeUserInfo('gender', e.target.value) 
                                }></input>
                            </div>
                            <div className="radio-column">
                                <label>Nữ</label>
                                <input type="radio" name="gender" value={'FEMALE'} checked={userInfo?.gender==='FEMALE'} onChange={(e) => handleChangeUserInfo('gender', e.target.value)}></input>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            value={requiredFields?.fullName.value}
                            handleChange={handleChangeUserInfo}
                            name={requiredFields.fullName.name}
                            required={requiredFields.fullName.req}
                            label={requiredFields.fullName.label}
                            error={error?.fullName}
                        ></TextField>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            value={requiredFields?.birthDay.value}
                            handleChange={handleChangeUserInfo}
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
                            value={requiredFields?.phoneNumber.value}
                            handleChange={handleChangeUserInfo}
                            name={requiredFields.phoneNumber.name}
                            required={requiredFields.phoneNumber.req}
                            label={requiredFields.phoneNumber.label}
                            error={error?.phoneNumber}
                        ></TextField>

                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChangeUserInfo}
                            value={requiredFields?.email.value}
                            name={requiredFields.email.name}
                            required={requiredFields.email.req}
                            label={requiredFields.email.label}
                            error={error?.email}
                        ></TextField>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChangeUserInfo}
                            value={requiredFields?.address.value}
                            name={requiredFields.address.name}
                            required={requiredFields.address.req}
                            label={requiredFields.address.label}
                            error={error?.address}
                        ></TextField>

                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChangeUserInfo}
                            value={requiredFields?.ethnicity.value}
                            name={requiredFields.ethnicity.name}
                            required={requiredFields.ethnicity.req}
                            label={requiredFields.ethnicity.label}
                            error={error?.ethnicity}
                        ></TextField>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChangePatientInfo}
                            value={requiredFields.HICNumber.value}
                            name={requiredFields.HICNumber.name}
                            required={requiredFields.HICNumber.req}
                            label={requiredFields.HICNumber.label}
                            error={error?.HICNumber}
                        ></TextField>

                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChangePatientInfo}
                            value={requiredFields?.guardianName.value}
                            name={requiredFields.guardianName.name}
                            required={requiredFields.guardianName.req}
                            label={requiredFields.guardianName.label}
                            error={error?.guardianName}
                        ></TextField>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChangePatientInfo}
                            value={requiredFields?.guardianPhone.value}
                            name={requiredFields.guardianPhone.name}
                            required={requiredFields.guardianPhone.req}
                            label={requiredFields.guardianPhone.label}
                            error={error?.guardianPhone}
                        ></TextField>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChangePatientInfo}
                            value={requiredFields?.guardianAddress.value}
                            name={requiredFields.guardianAddress.name}
                            required={requiredFields.guardianAddress.req}
                            label={requiredFields.guardianAddress.label}
                            error={error?.guardianAddress}
                        ></TextField>
                        </div>
                    <div className="user-input-row" style={{width:'100%'}}>
                    <button
                        onClick={() => {
                            checkValidate({...userInfo, ...patientInfo}, requiredFields, () => dispatch(updatePatientInfo()))
                        }}
                    >
                        {patientSelect.isLoading ?
            (<ReactLoading color="white" height='40px' width='40px' type={"spinningBubbles"}></ReactLoading>) :'Cập nhật'}
                    </button>
                    </div>
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
                        {patientSelect.isLoading ? (
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
