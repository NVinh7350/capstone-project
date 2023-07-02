import React, { useState, useEffect } from "react";
import "../AddDoctor/AddDoctor.css";
import TextField from "../../../components/TextField/TextField";
import { useDispatch, useSelector } from "react-redux";
import adminSlice, { adminSelector, createPatient } from "../AdminSlice";
import { validateAddress, validateHICNumber, validateCitizenId, validateDateOfBirth, validateEmail, validateName, validatePhoneNumber } from "../../../utils/Validate";
import ReactLoading from 'react-loading'
import { validateHook } from "../../../components/validateHook/validateHook";
export const AddPatient = () => {
    const dispatch = useDispatch();
    const adminSelect = useSelector(adminSelector);
    const patientInput = adminSelect.patientInput;
    useEffect(() => {
        dispatch(adminSlice.actions.setPatientInput({
            'gender' : 'MALE'
        }));
        return () => {
            dispatch(adminSlice.actions.removePatientInput());
        }
    }, [])
    const handleChange = (event) => {
        dispatch(
            adminSlice.actions.setPatientInput({
                ...patientInput,
                [event.target.name]: event.target.value,
            })
        );
    }; 

    const requiredFields = {
        citizenId : {
          check : validateCitizenId,
          req : true,
          label: 'Số CMND',
          name: 'citizenId',
          value: patientInput?.citizenId
        },
        fullName : {
          check : validateName,
          req : true,
          label: 'Họ và tên',
          name: 'fullName',
          value: patientInput?.fullName
        },
        email : {
          check : validateEmail,
          req : false,
          label: 'Email',
          name: 'email',
          value: patientInput?.email
        },
        birthDay : {
          check : validateDateOfBirth,
          req : true,
          label: 'Ngày sinh',
          name: 'birthDay',
          value: patientInput?.birthDay
        },
        gender : {
          check : () => {return null},
          req : true,
          label: 'Giới tính',
          name: 'gender',
          value: patientInput?.gender
        },
        ethnicity : {
          check : validateName,
          req : false,
          label: 'Dân tộc',
          name: 'ethnicity',
          value: patientInput?.ethnicity
        },
        address : {
          check : validateAddress,
          req : true,
          label: 'Địa chỉ',
          name: 'address',
          value: patientInput?.address
        },
        phoneNumber : {
          check : validatePhoneNumber,
          req : false,
          label: 'Điện thoại',
          name: 'phoneNumber',
          value: patientInput?.phoneNumber
        },
         HICNumber : {
          check : validateHICNumber,
          req : false,
          label: 'số BHYT',
          name: 'HICNumber',
          value: patientInput?.HICNumber
        },
        guardianName : {
          check : validateName,
          req : true,
          label: 'Tên người thân',
          name: 'guardianName',
          value: patientInput?.guardianName
        },
        guardianPhone : {
          check : validatePhoneNumber,
          req : false,
          label: 'Điện thoại người thân',
          name: 'guardianPhone',
          value: patientInput?.guardianPhone
        },
        guardianAddress : {
          check : validateAddress,
          req : false,
          label: 'Địa chỉ người thân',
          name: 'guardianAddress',
          value: patientInput?.guardianAddress
        },

    }

    const {error, checkValidate} = validateHook();
    return (
        <>
            <h3 className="role-title" style={{position: 'absolute', top: '0px'}}> Đăng ký bệnh nhân</h3>
            <div className="add-doctor-container">
                <div className="user-input-container">
                <h4>Thông tin cá nhân</h4>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChange}
                            value={requiredFields.citizenId.value}
                            name={requiredFields.citizenId.name}
                            required={requiredFields.citizenId.req}
                            label={requiredFields.citizenId.label}
                            error={error?.citizenId}
                        ></TextField>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChange}
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
                            handleChange={handleChange}
                            value={requiredFields.fullName.value}
                            name={requiredFields.fullName.name}
                            required={requiredFields.fullName.req}
                            label={requiredFields.fullName.label}
                            error={error?.fullName}
                        ></TextField>

                        <div className="radio-container">
                            <div className="radio-column">
                                <label>Nam</label>
                                <input type="radio" name="gender" value={'MALE'} checked={patientInput?.gender==='MALE'} onChange={
                                   (e) => handleChange(e) 
                                }></input>
                            </div>
                            <div className="radio-column">
                                <label>Nữ</label>
                                <input type="radio" name="gender" value={'FEMALE'} checked={patientInput?.gender==='FEMALE'} onChange={(e) => handleChange(e)}></input>
                            </div>
                        </div>
                    </div>
                    <div className="user-input-row" style={{ width: "100%" }}>
                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChange}
                            value={requiredFields.phoneNumber.value}
                            name={requiredFields.phoneNumber.name}
                            required={requiredFields.phoneNumber.req}
                            label={requiredFields.phoneNumber.label}
                            error={error?.phoneNumber}
                        ></TextField>

                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChange}
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
                            handleChange={handleChange}
                            value={requiredFields.address.value}
                            name={requiredFields.address.name}
                            required={requiredFields.address.req}
                            label={requiredFields.address.label}
                            error={error?.address}
                        ></TextField>

                        <TextField
                            containerStyle={{ width: "40%" }}
                            handleChange={handleChange}
                            value={requiredFields.ethnicity.value}
                            name={requiredFields.ethnicity.name}
                            required={requiredFields.ethnicity.req}
                            label={requiredFields.ethnicity.label}
                            error={error?.ethnicity}
                        ></TextField>
                    </div>
                </div>
                <div className="doctor-input-container">
                    <h4>Thông tin bệnh nhân</h4>
                    <TextField
                        containerStyle={{ flexGrow: "1" }}
                        handleChange={handleChange}
                        value={requiredFields.HICNumber.value}
                        name={requiredFields.HICNumber.name}
                        required={requiredFields.HICNumber.req}
                        label={requiredFields.HICNumber.label}
                        error={error?.HICNumber}
                    ></TextField>
                    <TextField
                        containerStyle={{ flexGrow: 3 }}
                        handleChange={handleChange}
                        value={requiredFields.guardianName.value}
                        name={requiredFields.guardianName.name}
                        required={requiredFields.guardianName.req}
                        label={requiredFields.guardianName.label}
                        error={error?.guardianName}
                    ></TextField>
                    <TextField
                        containerStyle={{ flexGrow: "1" }}
                        handleChange={handleChange}
                        value={requiredFields.guardianPhone.value}
                        name={requiredFields.guardianPhone.name}
                        required={requiredFields.guardianPhone.req}
                        label={requiredFields.guardianPhone.label}
                        error={error?.guardianPhone}
                    ></TextField>
                    <TextField
                        containerStyle={{ flexGrow: "1" }}
                        handleChange={handleChange}
                        value={requiredFields.guardianAddress.value}
                        name={requiredFields.guardianAddress.name}
                        required={requiredFields.guardianAddress.req}
                        label={requiredFields.guardianAddress.label}
                        error={error?.guardianAddress}
                    ></TextField>
                    <button
                        onClick={() => {
                            checkValidate(patientInput,requiredFields, () => {dispatch(createPatient())})
                        }}
                    >  
                        {adminSelect.isLoading ? <ReactLoading color="#fff" height='40px' width='40px' type={"spinningBubbles"}></ReactLoading> : 'Đăng ký'}
                    </button>
                </div>
            </div>
        </>
    );
};
