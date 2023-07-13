import React, { useState } from "react";
import './TreatmentForm.css'
import { IoIosRemoveCircle } from 'react-icons/io'
import {BiPlusMedical} from 'react-icons/bi'
const TreatmentForm = ({
    treatments,
    handleAddTreatment,
    handleRemoveTreatment,
    handleAddMedicine,
    handleRemoveMedicine,
    handleInputChange,
    readOnly = false,
}) => {
    return (
        <>
            {treatments?.map((treatment, treatmentIndex) => (
                <div key={treatmentIndex} className='treatment-form-container'>
                    <h3> {readOnly ? 'Điều trị' : 'Điều trị mới'} {treatmentIndex + 1}</h3>
                    <div
                        className="mr-patient-row"
                        style={{
                            width: "100%",
                            alignItems: "center",
                            marginBottom: "0px",
                            display:'flex'
                        }}>
                        <label style={{ width: '50%' }}>Diễn biến bệnh:</label>
                        <div style={{ width: '30%', }}>
                            <label>Ngày điều trị:</label>
                            <input
                                style={{height: '30px', margin: ' 0px 10px'}}
                                type="date"
                                name="treatmentTime"
                                value={treatment.treatmentTime}
                                readOnly={readOnly}
                                onChange={(e) =>
                                    handleInputChange(treatmentIndex, null, e)
                                }
                            />
                        </div>
                        {readOnly ? (
                            <></>
                        ) : (
                            <div style={{ width: '20%', color: 'red', display: "flex", alignItems: 'center' }}
                                onClick={() =>
                                    handleRemoveTreatment(treatmentIndex)
                                }
                            >
                                <IoIosRemoveCircle width={'30px'} height={'30px'} fontSize={'30px'}></IoIosRemoveCircle>
                                <label style={{ width: '200px', color: 'red' }}>{`Huỷ`}</label>
                            </div>
                        )}
                    </div>
                    <div
                        className="mr-patient-row"
                        style={{ width: "100%", alignItems: "center", margin:'10px 10px' }}
                    >
                        <textarea
                            style={{ width: "95%" }}
                            rows={3}
                            class="notes"
                            name="diseaseProgression"
                            value={treatment.diseaseProgression}
                            readOnly={readOnly}
                            onChange={(e) =>
                                handleInputChange(treatmentIndex, null, e)
                            }
                        ></textarea>
                    </div>

                    <div className="medicine-container">
                    {treatment?.medicines?.map((medicine, medicineIndex) => (
                        <div
                            key={medicineIndex}
                            className="mr-patient-row"
                            style={{
                                width: "49%",
                                alignItems: "center",
                                marginBottom: "20px",
                                border: '1px solid black'
                            }}>
                            <div key={medicineIndex} className="medicine-container">
                            <div
                                className="mr-patient-row"
                                style={{
                                    width: "100%",
                                    alignItems: "center",
                                    marginBottom: "0px",
                                    display: "flex",
                                    justifyContent:'space-between'
                                }}>
                                    <h4 style={{margin: '5px'}}>{readOnly ? 'Thuốc' : 'Thuốc mới'} {medicineIndex + 1}</h4>
                                    {readOnly ? (
                                        <></>
                                    ) : (
                                        <div style={{ width: '40%', color: 'red', display: "flex", alignItems: 'center' }}
                                            onClick={() =>
                                                handleRemoveMedicine(
                                                    treatmentIndex,
                                                    medicineIndex
                                                )
                                            }
                                        >
                                            <IoIosRemoveCircle width={'30px'} height={'30px'} fontSize={'30px'}></IoIosRemoveCircle>
                                            <label style={{ width: '200px', color: 'red' }}>{`Huỷ thuốc`}</label>
                                        </div>
                                    )}
                                </div>
                                <div style={{ alignItems: "center", display: 'flex', width: '95%' }}>
                                    <label style={{ width: '120px' }}>Tên thuốc:</label>
                                    <textarea
                                        style={{ flexGrow: 1 }}
                                        rows={1}
                                        name="medicineName"
                                        value={medicine.medicineName}
                                        readOnly={readOnly}
                                        onChange={(e) =>
                                            handleInputChange(
                                                treatmentIndex,
                                                medicineIndex,
                                                e
                                            )
                                        }
                                        class="notes"></textarea>
                                </div>
                                <div style={{ alignItems: "center", display: 'flex', width: '95%' }}>
                                    <label style={{ width: '120px' }}>Liều dùng/Lần:</label>
                                    <textarea
                                        style={{ flexGrow: 1 }}
                                        rows={1}
                                        name="drugDosage"
                                        value={medicine.drugDosage}
                                        readOnly={readOnly}
                                        onChange={(e) =>
                                            handleInputChange(
                                                treatmentIndex,
                                                medicineIndex,
                                                e
                                            )
                                        }
                                        class="notes"></textarea>
                                </div>
                                <div style={{ alignItems: "center", display: 'flex',width: '95%' }}>
                                    <label style={{ width: '120px' }}>Lần dùng/Ngày:</label>
                                    <textarea
                                        style={{ flexGrow: 1 }}
                                        rows={1}
                                        name="drugFrequency"
                                        value={medicine.drugFrequency}
                                        readOnly={readOnly}
                                        onChange={(e) =>
                                            handleInputChange(
                                                treatmentIndex,
                                                medicineIndex,
                                                e
                                            )
                                        }
                                        class="notes"></textarea>
                                </div>
                                <div style={{ alignItems: "center", display: 'flex', width: '95%' }}>
                                    <label style={{ width: '120px' }}>Tổng ngày:</label>
                                    <textarea
                                        style={{ flexGrow: 1 }}
                                        rows={1}
                                        name="totalDay"
                                        value={medicine.totalDay}
                                        readOnly={readOnly}
                                        onChange={(e) =>
                                            handleInputChange(
                                                treatmentIndex,
                                                medicineIndex,
                                                e
                                            )
                                        }
                                        class="notes"></textarea>
                                </div>
                                <div style={{ width: '500px', margin: '10px 0px 0px 0px' }}><label >Chỉ định thêm:</label></div>

                                <textarea
                                    rows={2}
                                    style={{ width: '90%' }}
                                    name="specify"
                                    value={medicine.specify}
                                    readOnly={readOnly}
                                    onChange={(e) =>
                                        handleInputChange(
                                            treatmentIndex,
                                            medicineIndex,
                                            e
                                        )
                                    }
                                    class="notes"></textarea>

                            </div>
                        </div>

                    ))}
                    </div>
                    
                    {readOnly ? (
                        <></>
                    ) : (
                        <div className="action-button-send" style={{backgroundColor:'#5cdb17', width: '120px', height:'40px', margin: '10px'}}  onClick={() => handleAddMedicine(treatmentIndex)}>
                        <BiPlusMedical className="action-button-icon"></BiPlusMedical>
                        <label >{`Thuốc`}</label>
                    </div>
                    )}
                </div>
            ))}
            {readOnly ? (
                        <></>
                    ) : (
                        <div className="action-button-send" style={{backgroundColor:'#5cdb17', width: '180px', height:'40px', margin: '30px'}}  onClick={() => handleAddTreatment()}>
                        <BiPlusMedical className="action-button-icon"></BiPlusMedical>
                        <label >{`Thêm điều trị`}</label>
                    </div>
                    )}
        </>
    );
};

export default TreatmentForm;
