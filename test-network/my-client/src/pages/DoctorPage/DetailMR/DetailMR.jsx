import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import doctorSlice, { completedMedicalRecord, createMedicalRecord, doctorSelector, getDetailMR, updateMedicalRecord } from "../DoctorSlice";
import "../CreateMR/CreateMR.css";
import ReactLoading from 'react-loading'
import { changeDateForm, getAge, getDate } from "../../../utils/TimeUtils";
import TextField from "../../../components/TextField/TextField";
import TreatmentForm from "../../../components/TreatmentForm/TreatmentForm";
import { validateHook } from "../../../components/validateHook/validateHook";
import { loginSelector } from "../../LoginPage/LoginSlice";
import { getUser } from "../../../utils/LocalStorage";
import Swal from 'sweetalert2'
import { patientSelector } from "../../PatientPage/PatientSlice";
const DetailMR = () => {
    const dispatch = useDispatch();
    const doctorSelect = useSelector(doctorSelector);
    const loginSelect = useSelector(loginSelector);
    const patientSelect = useSelector(patientSelector);
    const user = loginSelect.user || JSON.parse(getUser());
    const patient = doctorSelect.detailPatient;
    const medicalRecord = doctorSelect.medicalRecord;
    const treatments = doctorSelect.treatments;
    
    const newMedicalRecord = doctorSelect.newMedicalRecord;
    const newTreatments = doctorSelect.newTreatments;
    const checkCreator = user?.citizenId === medicalRecord.doctorId;
    const doctor = patientSelect.detailDoctor;
    useEffect(() => {
        // dispatch(doctorSlice.actions.setNewMedicalRecord({
        //     ...doctorSelect.medicalRecord,
        //     doctorId: user.citizenId,
        //     patientId: patient.citizenId,
        //     specialty: user?.doctor?.specialty,
        //     status: 'CREATING'
        // }))
        // dispatch(doctorSlice.actions.setMedicalRecord({
            // ...medicalRecord,
            // comeTime : getDate(medicalRecord?.comeTime)
        // }))

        
        return () => {
            dispatch(doctorSlice.actions.setMedicalRecord(null));
            dispatch(doctorSlice.actions.setTreatments([]));
            dispatch(doctorSlice.actions.setNewMedicalRecord(null));
            dispatch(doctorSlice.actions.setNewTreatments([]));
        }
    }, [])
    const handleAddTreatment = () => {
        // setTreatments([...treatments, { diseaseProgression: '', treatmentTime: '', medicines: [] }]);
        dispatch(doctorSlice.actions.setNewTreatments([...newTreatments, {
            diseaseProgression: '', treatmentTime: '', medicines: [] 
        }]))
    };

    const handleRemoveTreatment = (index) => {
        const updatedTreatments = [...newTreatments];
        updatedTreatments.splice(index, 1);
        // setTreatments(updatedTreatments);
        dispatch(doctorSlice.actions.setNewTreatments(updatedTreatments));
    };
    console.log(newTreatments);
    const handleAddMedicine = (treatmentIndex) => {
        let updatedTreatments = [...newTreatments].map((e, index) => {
            if(index === treatmentIndex) {
                return {
                    ...e,
                    medicines: [
                        ...e.medicines ,
                        {
                            medicineName: '',
                            drugDosage: '',
                            drugFrequency: '',
                            totalDay: '',
                            specify: ''
                        }
                    ]
                }
            }
            return e
        });
        // updatedTreatments[treatmentIndex]?.medicines?.push({
        //     medicineName: '',
        //     drugDosage: '',
        //     drugFrequency: '',
        //     totalDay: '',
        //     specify: ''
        // });
        // setTreatments(updatedTreatments);
        console.log(updatedTreatments)
        dispatch(doctorSlice.actions.setNewTreatments(updatedTreatments));
    };

    const handleRemoveMedicine = (treatmentIndex, medicineIndex) => {
        // const updatedTreatments = [...newTreatments];
        // updatedTreatments[treatmentIndex].medicines.splice(medicineIndex, 1);
        let updatedTreatments = [...newTreatments].map((e, index) => {
            if(index === treatmentIndex) {
                return {
                    ...e,
                    medicines: e.medicines.filter((m, i) => 
                        i !== medicineIndex
                    )
                }
            }
            return e
        });
        // setTreatments(updatedTreatments);
        dispatch(doctorSlice.actions.setNewTreatments(updatedTreatments));
    };

    const handleInputChange = (treatmentIndex, medicineIndex, e) => {
        let updatedTreatments 
        if (medicineIndex === null) {
            // updatedTreatments[treatmentIndex][e.target.name] = e.target.value;
            updatedTreatments = [...newTreatments].map((treatment, index) => {
                if(index === treatmentIndex) {
                    return {
                        ...treatment,
                        [e.target.name] : e.target.value
                    }
                }
                return treatment;
            })
        } else {
            // updatedTreatments[treatmentIndex].medicines[medicineIndex][e.target.name] = e.target.value;
            updatedTreatments = [...newTreatments].map((treatment, index) => {
                if(index === treatmentIndex) {
                    return {
                        ...treatment,
                        medicines : [...treatment.medicines].map((medicine, i) => {
                            if(i === medicineIndex) {
                                return {
                                    ...medicine,
                                    [e.target.name] : e.target.value
                                }
                            } 
                            return medicine
                        })
                    }
                }
                return treatment;
            })
        }
        // setTreatments(updatedTreatments);
        dispatch(doctorSlice.actions.setNewTreatments(updatedTreatments));
    };

    const handleSubmit = () => {
        // setMrTreatment(treatments)
        // dispatch(doctorSlice.actions.setTreatments(treatments))
        console.log(newTreatments);
        console.log(newMedicalRecord);
        dispatch(createMedicalRecord())
        // setTreatments([])
    };

    const handleUpdate = () => {
        if(newTreatments?.length) {
            Swal.fire({
                title: 'Cập nhật thông tin?',
                showCancelButton: true,
                confirmButtonText: 'Cập nhật',
                cancelButtonText: 'Hủy'
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    dispatch(updateMedicalRecord());
                } else if (result.isDenied) {
                }
              })
        } else {
            console.log('not update')
        }
    }

    const handleFinish = () => {
        Swal.fire({
            title: 'Kết thúc bệnh án?',
            showCancelButton: true,
            confirmButtonText: 'Kết thúc',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                dispatch(completedMedicalRecord());
            } else if (result.isDenied) {
            }
        })
    }

    const handleChangeMR = (e) => {
        dispatch(doctorSlice.actions.setNewMedicalRecord({
            ...newMedicalRecord,
            [e.target.name] : e.target.value
        }))
    }

    const { error, checkValidate } = validateHook();
    return (
        <>
            <h3 className="role-title" style={{ position: "absolute", top: "0px" }}>
                    Thông tin bệnh án
                </h3>
            <div className="mr-container">
            <div className="mr-header">
                <h2 style={{ textAlign: "center", flexGrow: 1 }}>BỆNH ÁN</h2>
            </div>
            <div className="mr-patient-container">
                <div
                    className="mr-patient-row"
                    style={{ width: "60%", marginBottom: 0 }}
                ></div>
                {/* <div
                    className="mr-patient-row"
                    style={{ width: "20%", marginBottom: 0 }}
                >
                    <label>Bệnh viện: </label>
                    <span>{}</span>
                </div>
                <div
                    className="mr-patient-row"
                    style={{ width: "20%", marginBottom: 0 }}
                >
                    <label>Bệnh viện: </label>
                    <span>{}</span>
                </div> */}
                <hr className="mr-patient-container-hr " />
                <h3 style={{ width: "100%" }}>HÀNH CHÍNH</h3>
                <div className="mr-patient-row" style={{ width: "40%" }}>
                    <label>1. Họ và tên: </label>
                    <span>{patient.fullName}</span>
                </div>
                <div className="mr-patient-row" style={{ width: "28%" }}>
                    <label style={{ width: "90px" }}>3. Giới tính: </label>
                    <span>{patient.gender === "MALE" ? "Nam" : "Nữ"}</span>
                </div>
                <div className="mr-patient-row" style={{ width: "32%" }}>
                    <div style={{ width: "65%" }}>
                        <label>2. Sinh ngày: </label>
                        <span>{getDate(patient.birthDay)}</span>
                    </div>
                    <div style={{ width: "32%" }}>
                        <label style={{ width: "40px" }}>Tuổi: </label>
                        <span>{getAge(patient.birthDay)}</span>
                    </div>
                </div>

                <div className="mr-patient-row" style={{ width: "40%" }}>
                    <label>4. Số điện thoại: </label>
                    <span>{patient.phoneNumber}</span>
                </div>
                <div className="mr-patient-row" style={{ width: "30%" }}>
                    <label style={{ width: "90px" }}>5. Email: </label>
                    <span>{patient.email}</span>
                </div>
                <div className="mr-patient-row" style={{ width: "100%" }}>
                    <label>5. Địa chỉ: </label>
                    <span>{patient.address}</span>
                </div>
                <hr className="mr-patient-container-hr " />
                <h3 style={{ width: "100%" }}>NHÂN THÂN</h3>
                <div className="mr-patient-row" style={{ width: "40%" }}>
                    <label>7. Họ và tên NT: </label>
                    <span>{patient.patient.guardianName}</span>
                </div>
                <div className="mr-patient-row" style={{ width: "50%" }}>
                    <label style={{ width: "130px" }}>7.Điện thoại NT: </label>
                    <span>{patient.patient.guardianPhone}</span>
                </div>
                <div className="mr-patient-row" style={{ width: "100%" }}>
                    <label>5. Địa chỉ NT: </label>
                    <span>{patient.address}</span>
                </div>
                <hr className="mr-patient-container-hr " />
                <h3 style={{ width: "100%" }}>BÁC SĨ </h3>
                <div className="mr-patient-row" style={{ width: "40%" }}>
                    <label>Họ và tên : </label>
                    <span>{doctor?.fullName}</span>
                </div>
                <div className="mr-patient-row" style={{ width: "50%" }}>
                    <label style={{ width: "130px" }}>Số CMND: </label>
                    <span>{doctor?.citizenNumber}</span>
                </div>
                <div className="mr-patient-row" style={{ width: "40%" }}>
                    <label>Chức vụ: </label>
                    <span>{doctor?.doctor?.position}</span>
                </div>
                <div className="mr-patient-row" style={{ width: "30%" }}>
                    <label style={{ width: "90px" }}>Khoa: </label>
                    <span>{doctor?.doctor?.specialty}</span>
                </div>
                <div className="mr-patient-row" style={{ width: "30%" }}>
                    <label style={{ width: "90px" }}>Bệnh viện: </label>
                    <span>{doctor?.doctor?.hospital}</span>
                </div>
                <hr className="mr-patient-container-hr " />
                <h3 style={{ width: "100%" }}>HỎI BỆNH</h3>
                <div
                    className="mr-patient-row"
                    style={{ width: "100%", alignItems: "center", display:'flex' }}>
                    <label>9.Lý do vào viện:</label>
                    <textarea
                        style={{ width: "50%" }}
                        name="majorReason"
                        value={medicalRecord?.majorReason}
                        onChange={(e) => handleChangeMR(e)}
                        readOnly={Boolean(medicalRecord)}
                        rows={1}
                        class="notes">
                    </textarea>
                    <label>Ngày nhập viện:</label>
                    <input
                        style={{ width: "20%" }}
                        type="datetime-local"
                        class="notes"
                        name="comeTime"
                        value={medicalRecord?.comeTime}
                        onChange={(e) => handleChangeMR(e)}
                        readOnly={Boolean(medicalRecord)}
                        ></input>
                </div>
                <div
                    className="mr-patient-row"
                    style={{
                        width: "100%",
                        alignItems: "center",
                        marginBottom: "0px",
                    }}
                >
                    <label>Quá trình bệnh lý:</label>
                    <label style={{ flexGrow: 1, color: '#555' }}>(khởi phát, diễn biến, chẩn đoán, điều trị trước đây v.v...).</label>
                </div>
                <div
                    className="mr-patient-row"
                    style={{ width: "100%", alignItems: "center" }}
                >
                    <textarea
                        style={{ width: "100%" }}
                        rows={6}
                        class="notes"
                        name="pathogenesis"
                        value={medicalRecord?.pathogenesis}
                        onChange={(e) => handleChangeMR(e)}
                        readOnly={Boolean(medicalRecord)}
                    ></textarea>
                </div>
                <div
                    className="mr-patient-row"
                    style={{
                        width: "100%",
                        alignItems: "center",
                        marginBottom: "0px",
                    }}
                >
                    <label style={{ width: '170px' }}>Tiền sử bệnh bản thân:</label>
                    <label style={{ flexGrow: 1, color: '#555' }}>(phát triển thể lực từ nhỏ đến lớn, những bệnh đã mắc, phương pháp ĐTr, tiêm phòng, ăn uống, sinh hoạt  vv...).</label>
                </div>
                <div
                    className="mr-patient-row"
                    style={{ width: "100%", alignItems: "center" }}
                >
                    <textarea
                        style={{ width: "100%" }}
                        rows={6}
                        class="notes"
                        name="personalMH"
                        value={medicalRecord?.personalMH}
                        onChange={(e) => handleChangeMR(e)}
                        readOnly={Boolean(medicalRecord)}
                    ></textarea>
                </div>
                <div
                    className="mr-patient-row"
                    style={{
                        width: "100%",
                        alignItems: "center",
                        marginBottom: "0px",
                    }}
                >
                    <label style={{ width: '170px' }}>Tiền sử bệnh gia đình:</label>
                    <label style={{ flexGrow: 1, color: '#555' }}>(Những người trong gia đình:  bệnh đã mắc, đời sống, tinh thần, vật chất v.v...).</label>
                </div>
                <div
                    className="mr-patient-row"
                    style={{ width: "100%", alignItems: "center" }}
                >
                    <textarea
                        style={{ width: "100%" }}
                        rows={3}
                        class="notes"
                        name="familyMH"
                        value={medicalRecord?.familyMH}
                        onChange={(e) => handleChangeMR(e)}
                        readOnly={Boolean(medicalRecord)}
                    ></textarea>
                </div>
                <hr className="mr-patient-container-hr " />
                <h3 style={{ width: "100%" }}>KHÁM BỆNH</h3>
                <div
                    className="mr-patient-row"
                    style={{
                        width: "100%",
                        alignItems: "center",
                        marginBottom: "0px",
                    }}
                >
                    <label style={{ width: '100px' }}>Toàn thân:</label>
                    <label style={{ flexGrow: 1, color: '#555' }}>(ý thức, da niêm mạc, hệ thống hạch, tuyến giáp, vị trí, kích thước, số lượng, di động v.v...)</label>
                </div>
                <div
                    className="mr-patient-row"
                    style={{ width: "100%", alignItems: "center" }}
                >
                    <textarea
                        style={{ width: "100%" }}
                        rows={4}
                        class="notes"
                        name="body"
                        value={medicalRecord?.body}
                        onChange={(e) => handleChangeMR(e)}
                        readOnly={Boolean(medicalRecord)}
                    ></textarea>
                </div>
                <TextField readOnly={Boolean(medicalRecord)} name={'pulse'} value={medicalRecord?.pulse} handleChange={handleChangeMR} containerStyle={{ margin: '0 35px' }} label={'Mạch (Lần/phút)'}></TextField>
                <TextField readOnly={Boolean(medicalRecord)} name={'temperature'} value={medicalRecord?.temperature} handleChange={handleChangeMR} containerStyle={{ margin: '0 35px' }} label={'Nhiệt độ (C)'}></TextField>
                <TextField readOnly={Boolean(medicalRecord)} name={'weight'} value={medicalRecord?.weight} handleChange={handleChangeMR} containerStyle={{ margin: '0 35px' }} label={'Cân nặng (kg)'}></TextField>
                <TextField readOnly={Boolean(medicalRecord)} name={'breathing'} value={medicalRecord?.breathing} handleChange={handleChangeMR} containerStyle={{ margin: '0 35px 35px 35px' }} label={'Nhịp thở (Lần/phút)'}></TextField>
                <TextField readOnly={Boolean(medicalRecord)} name={'maxBP'} value={medicalRecord?.maxBP} handleChange={handleChangeMR} containerStyle={{ margin: '0 35px 35px 35px' }} label={'Huyết áp tối đa (mmHg)'}></TextField>
                <TextField readOnly={Boolean(medicalRecord)} name={'minBP'} value={medicalRecord?.minBP} handleChange={handleChangeMR} containerStyle={{ margin: '0 35px 35px 35px' }} label={'Huyết áp tối thiểu (mmHg)'}></TextField>
                <div
                    className="mr-patient-row"
                    style={{
                        width: "100%",
                        alignItems: "center",
                        marginBottom: "0px",
                    }}
                >
                    <label style={{ width: '110px' }}>Các cơ quan:</label>
                    <label style={{ flexGrow: 1, color: '#555' }}>(Tuần hoàn, hô hấp, tiêu hóa, thần kinh, Thận-Tiết niệu,tai mũi họng, răng hàm mặt v.v...)</label>
                </div>
                <div
                    className="mr-patient-row"
                    style={{ width: "100%", alignItems: "center" }}
                >
                    <textarea
                        style={{ width: "100%" }}
                        rows={8}
                        class="notes"
                        name="organs"
                        value={medicalRecord?.organs}
                        onChange={(e) => handleChangeMR(e)}
                        readOnly={Boolean(medicalRecord)}
                    ></textarea>
                </div>

                <div
                    className="mr-patient-row"
                    style={{
                        width: "100%",
                        alignItems: "center",
                        marginBottom: "0px",
                    }}
                >
                    <label style={{ width: '200px' }}>Tóm tắt khám bệnh:</label>
                </div>
                <div
                    className="mr-patient-row"
                    style={{ width: "100%", alignItems: "center" }}
                >
                    <textarea
                        style={{ width: "100%" }}
                        rows={4}
                        class="notes"
                        name="summaryMR"
                        value={medicalRecord?.summaryMR}
                        onChange={(e) => handleChangeMR(e)}
                        readOnly={Boolean(medicalRecord)}
                    ></textarea>
                </div>
                <hr className="mr-patient-container-hr " />
                <h3 style={{ width: "100%" }}>CHUẨN ĐOÁN</h3>
                <div
                    className="mr-patient-row"
                    style={{
                        width: "100%",
                        alignItems: "center",
                        marginBottom: "0px",
                    }}
                >
                    <label style={{ width: '200px' }}>Chuẩn đoán bệnh:</label>
                </div>
                <div
                    className="mr-patient-row"
                    style={{ width: "100%", alignItems: "center" }}
                >
                    <textarea
                        style={{ width: "100%" }}
                        rows={4}
                        class="notes"
                        name="diagnosis"
                        value={medicalRecord?.diagnosis}
                        onChange={(e) => handleChangeMR(e)}
                        readOnly={Boolean(medicalRecord)}
                    ></textarea>
                </div>
                <div
                    className="mr-patient-row"
                    style={{
                        width: "100%",
                        alignItems: "center",
                        marginBottom: "0px",
                    }}
                >
                    <label style={{ width: '200px' }}>Tiên lượng:</label>
                </div>
                <div
                    className="mr-patient-row"
                    style={{ width: "100%", alignItems: "center" }}
                >
                    <textarea
                        style={{ width: "100%" }}
                        rows={1}
                        class="notes"
                        name="prognosis"
                        value={medicalRecord?.prognosis}
                        onChange={(e) => handleChangeMR(e)}
                        readOnly={Boolean(medicalRecord)}
                    ></textarea>
                </div>
                <div
                    className="mr-patient-row"
                    style={{
                        width: "100%",
                        alignItems: "center",
                        marginBottom: "0px",
                    }}
                >
                    <label style={{ width: '200px' }}>Hướng điều trị:</label>
                </div>
                <div
                    className="mr-patient-row"
                    style={{ width: "100%", alignItems: "center" }}
                >
                    <textarea
                        style={{ width: "100%" }}
                        rows={2}
                        class="notes"
                        name="directionTreatment"
                        value={medicalRecord?.directionTreatment}
                        onChange={(e) => handleChangeMR(e)}
                        readOnly={Boolean(medicalRecord)}
                    ></textarea>
                </div>
                <hr className="mr-patient-container-hr " />
                <h3 style={{ width: "100%" }}>ĐIỀU TRỊ</h3>
                <div
                    className="mr-patient-row"
                    style={{ width: "100%", alignItems: "center" }}
                ><TreatmentForm treatments={treatments} handleAddMedicine={handleAddMedicine} handleAddTreatment={handleAddTreatment} handleRemoveMedicine={handleRemoveMedicine} handleRemoveTreatment={handleRemoveTreatment} handleInputChange={handleInputChange} readOnly={true}></TreatmentForm>

                </div>

                
                {
                    medicalRecord?.status === 'CREATING' && checkCreator ? 
                    <>
                        <TreatmentForm treatments={newTreatments} handleAddMedicine={handleAddMedicine} handleAddTreatment={handleAddTreatment} handleRemoveMedicine={handleRemoveMedicine} handleRemoveTreatment={handleRemoveTreatment} handleInputChange={handleInputChange}></TreatmentForm>
                        <button className="action-button-send" 
                        style={{width: '20%', height:'42px', margin: '28px', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', border:'none', outline:'none', background:'var(--prima--color)'}} onClick={handleUpdate}>
                                {
                                    doctorSelect.isLoading === 'updateMedicalRecord' ? <ReactLoading
                                    color="white"
                                    height="40px"
                                    width="40px"
                                    type={"spinningBubbles"}
                                ></ReactLoading> : 'Cập nhật bệnh án'
                                }
                            </button> 
                        <button className="action-button-send" 
                        style={{width: '20%', height:'42px', margin: '28px', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', border:'none', outline:'none', background:'#FCA308'}} onClick={handleFinish}>
                                {
                                    doctorSelect.isLoading === 'completedMedicalRecord' ? <ReactLoading
                                    color="white"
                                    height="40px"
                                    width="40px"
                                    type={"spinningBubbles"}
                                ></ReactLoading> : 'Kết thúc bệnh án'
                                }
                        </button>
                    </> : 
                    <></>
                }
            </div>
        </div>
        </>
    );
};

export default DetailMR;
