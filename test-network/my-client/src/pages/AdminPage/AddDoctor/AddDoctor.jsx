import React, { useState, useEffect } from "react";
import "./AddDoctor.css";
import TextField from "../../../components/TextField/TextField";
import { useDispatch, useSelector } from "react-redux";
import adminSlice, { adminSelector, createDoctor } from "../AdminSlice";
import { validateAddress, validateHICNumber, validateCitizenId, validateDateOfBirth, validateEmail, validateName, validatePhoneNumber } from "../../../utils/Validate";
import ReactLoading from 'react-loading'
import { validateHook } from "../../../components/validateHook/validateHook";
export const AddDoctor = () => {
    const dispatch = useDispatch();
    const adminSelect = useSelector(adminSelector);
    const doctorInput = adminSelect.doctorInput;
    useEffect(() => {
        dispatch(adminSlice.actions.setDoctorInput({
            'gender' : 'MALE'
        }));
        return () => {
            dispatch(adminSlice.actions.removeDoctorInput());
        }
    }, [])
    const handleChange = (event) => {
        dispatch(
            adminSlice.actions.setDoctorInput({
                ...doctorInput,
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
          value: doctorInput?.citizenId
        },
        fullName : {
          check : validateName,
          req : true,
          label: 'Họ và tên',
          name: 'fullName',
          value: doctorInput?.fullName
        },
        email : {
          check : validateEmail,
          req : false,
          label: 'Email',
          name: 'email',
          value: doctorInput?.email
        },
        birthDay : {
          check : validateDateOfBirth,
          req : true,
          label: 'Ngày sinh',
          name: 'birthDay',
          value: doctorInput?.birthDay
        },
        gender : {
          check : () => {return null},
          req : true,
          label: 'Giới tính',
          name: 'gender',
          value: doctorInput?.gender
        },
        ethnicity : {
          check : validateName,
          req : false,
          label: 'Dân tộc',
          name: 'ethnicity',
          value: doctorInput?.ethnicity
        },
        address : {
          check : validateAddress,
          req : true,
          label: 'Địa chỉ',
          name: 'address',
          value: doctorInput?.address
        },
        phoneNumber : {
          check : validatePhoneNumber,
          req : false,
          label: 'Điện thoại',
          name: 'phoneNumber',
          value: doctorInput?.phoneNumber
        },
        position : {
            check : validateName,
            req : true,
            label: 'Chức vụ',
            name: 'position',
            value: doctorInput?.position
          },
          specialty : {
            check : validateName,
            req : true,
            label: 'Khoa',
            name: 'specialty',
            value: doctorInput?.specialty
          },
          hospital : {
            check : validateName,
            req : true,
            label: 'Bệnh viện',
            name: 'hospital',
            value: doctorInput?.hospital
          },
    }

    const {error, checkValidate} = validateHook();
    return (
        <>
            <h3 className="role-title" style={{position: 'absolute', top: '0px'}}> Đăng ký bác sĩ</h3>
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
                                <input type="radio" name="gender" value={'MALE'} checked={doctorInput?.gender==='MALE'} onChange={
                                   (e) => handleChange(e) 
                                }></input>
                            </div>
                            <div className="radio-column">
                                <label>Nữ</label>
                                <input type="radio" name="gender" value={'FEMALE'} checked={doctorInput?.gender==='FEMALE'} onChange={(e) => handleChange(e)}></input>
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
                    <h4>Thông tin bác sĩ</h4>
                    <TextField
                        containerStyle={{ flexGrow: "1" }}
                        handleChange={handleChange}
                        value={requiredFields.position.value}
                        name={requiredFields.position.name}
                        required={requiredFields.position.req}
                        label={requiredFields.position.label}
                        error={error?.position}
                    ></TextField>
                    <TextField
                        containerStyle={{ flexGrow: '1' }}
                        handleChange={handleChange}
                        value={requiredFields.specialty.value}
                        name={requiredFields.specialty.name}
                        required={requiredFields.specialty.req}
                        label={requiredFields.specialty.label}
                        error={error?.specialty}
                    ></TextField>
                    <TextField
                        containerStyle={{ flexGrow: "1" }}
                        handleChange={handleChange}
                        value={requiredFields.hospital.value}
                        name={requiredFields.hospital.name}
                        required={requiredFields.hospital.req}
                        label={requiredFields.hospital.label}
                        error={error?.hospital}
                    ></TextField>
                    <button
                        onClick={() => {
                            checkValidate(doctorInput,requiredFields, () => {dispatch(createDoctor())})
                        }}
                    >  
                        {adminSelect.isLoading ? <ReactLoading color="#fff" height='40px' width='40px' type={"spinningBubbles"}></ReactLoading> : 'Đăng ký'}
                    </button>
                </div>
            </div>
        </>
    );
};
