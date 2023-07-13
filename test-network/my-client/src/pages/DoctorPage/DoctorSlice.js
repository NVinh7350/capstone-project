import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { instance } from '../../api/axiosConfig'
import { setUser } from '../../utils/LocalStorage'
import { convertToUTC } from '../../utils/Validate'
import loginSlice from '../LoginPage/LoginSlice'
import { changeDateForm, getDate, getDateTimeLocal } from '../../utils/TimeUtils'

const initialState = {
    isLoading: false,
    error: null,
    success: null,

    passwordUpdate: null,
    doctorInfo: null,
    userInfo : null,
    
    patientSearchList: [],
    accessRequestList: [],
    accessList: [],
    
    detailPatient: null,
    MRList:[],

    medicalRecord: null,
    treatments: [],
    newMedicalRecord: null,
    newTreatments: [],

}

export const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        removePatientSearchList : (state, action) => {
            state.patientSearchList = []
        },
        setDoctorInfo: (state, action) => {
            state.doctorInfo = action.payload
        },
        removeDoctorInfo: (state, action) => {
            state.doctorInfo = null
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload
        },
        removeUserInfo: (state, action) => {
            state.userInfo = null
        },
        setPageIndex: (state,action) => {
            state.pageIndex = action.payload
        },
        setPasswordUpdate: (state, action) => {
            state.passwordUpdate = action.payload
        },
        removePasswordUpdate: (state, action) => {
            state.passwordUpdate = null
        },
        removeState : (state, action) => {
            state = {
                ...initialState
            }
        },
        setMedicalRecord: (state, action) => {
            state.medicalRecord = action.payload
        },
        setTreatments : (state, action) => {
            state.treatments = action.payload
        },
        setNewMedicalRecord: (state, action) => {
            state.newMedicalRecord = action.payload
        },
        setNewTreatments : (state, action) => {
            state.newTreatments = action.payload
        },
        setMRList : (state,action) => {
            state.MRList = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateDoctorInfo.pending, (state) => {
                state.isLoading = 'updateDoctorInfo';
                state.error = null;
                state.success = null;
            })
            .addCase(updateDoctorInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.success = 'Cập nhật thông tin thành công';
            })
            .addCase(updateDoctorInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            })
            .addCase(changePassword.pending, (state) => {
                state.isLoading = 'changePassword';
                state.error = null;
                state.success = null;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.success = 'Thay đổi mật khẩu thành công';
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            })
            .addCase(findPatientBySearch.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(findPatientBySearch.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.patientSearchList = action.payload;
                state.success = null;
            })
            .addCase(findPatientBySearch.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            })
            .addCase(requestAccess.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(requestAccess.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.patientSearchList = state.patientSearchList.map((patient) => {
                    if(patient?.citizenId === action.payload?.patientId) {
                        patient?.accessRequestList?.push({
                            doctorId: action.payload?.doctorId,
                            patientId: action.payload?.patientId
                        })
                    }
                    return patient;
                });
                state.success = null;
            })
            .addCase(requestAccess.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            })
            .addCase(getAccessRequestList.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(getAccessRequestList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.accessRequestList = action.payload;
                state.success = null;
            })
            .addCase(getAccessRequestList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            })
            .addCase(cancelAccessRequest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(cancelAccessRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.accessRequestList = state.accessRequestList.filter((access) => access?.patient?.citizenId !== action.payload?.patientId)
                state.success = 'Hủy yêu cầu thành công';
            })
            .addCase(cancelAccessRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            })
            .addCase(getAccessList.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(getAccessList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.accessList = action.payload;
                state.success = null;
            })
            .addCase(getAccessList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            })
            .addCase(getDetailPatient.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
                
            })
            .addCase(getDetailPatient.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.detailPatient = action.payload;
                state.success = null;
            })
            .addCase(getDetailPatient.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            })
            .addCase(createMedicalRecord.pending, (state) => {
                state.isLoading = 'createMedicalRecord';
                state.error = null;
                state.success = null;
                
            })
            .addCase(createMedicalRecord.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.medicalRecord = {
                    ...action.payload.medicalRecord,
                    comeTime: getDateTimeLocal(action.payload.medicalRecord.comeTime)
                };
                state.treatments = action.payload.treatments?.map(treatment => {
                    return {
                        ...treatment,
                        treatmentTime : changeDateForm(treatment.treatmentTime)
                    }
                });
                state.newTreatments = [];
                state.success = 'Tạo bệnh án thành công';
            })
            .addCase(createMedicalRecord.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            })
            .addCase(getMRList.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
                
            })
            .addCase(getMRList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.success = null;
                state.MRList = action.payload;
            })
            .addCase(getMRList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            })
            .addCase(getDetailMR.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
                
            })
            .addCase(getDetailMR.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.success = null;
                state.medicalRecord = {
                    ...action.payload.medicalRecord,
                    comeTime: getDateTimeLocal(action.payload.medicalRecord.comeTime)
                };
                state.treatments = action.payload.treatments?.map(treatment => {
                    return {
                        ...treatment,
                        treatmentTime : changeDateForm(treatment.treatmentTime)
                    }
                });
            })
            .addCase(getDetailMR.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            })
            .addCase(updateMedicalRecord.pending, (state) => {
                state.isLoading = 'updateMedicalRecord';
                state.error = null;
                state.success = null;
                
            })
            .addCase(updateMedicalRecord.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.success = 'Cập nhật bệnh án thành công';
                state.newTreatments = [];
                state.treatments = action.payload?.treatments?.map(treatment => {
                    return {
                        ...treatment,
                        treatmentTime: changeDateForm(treatment.treatmentTime)
                    }
                });
            })
            .addCase(updateMedicalRecord.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            })
            .addCase(completedMedicalRecord.pending, (state) => {
                state.isLoading = 'completedMedicalRecord';
                state.error = null;
                state.success = null;
                
            })
            .addCase(completedMedicalRecord.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.success = 'Kết thúc bệnh án thành công';
                state.newTreatments = [];
                state.medicalRecord = action.payload?.medicalRecord;
            })
            .addCase(completedMedicalRecord.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            })
    },
})

export const getDetailMR  = createAsyncThunk(
    'doctor/getDetailMR',
async (MRId, { getState, rejectWithValue }) => {
    const state = getState();
    try {
        const patientId = state.doctor.detailPatient.citizenId;
        const detailUser= await instance(
            `/Auth/getDetailMR/${MRId}/${patientId}`,
            {
                method: 'get',
            }
        )
        console.log(detailUser);
        return detailUser?.data?.resultMySQL
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data?.error);
    }
})

export const getMRList = createAsyncThunk(
    'doctor/getMRList',
async (patientId, { getState, rejectWithValue }) => {
    const state = getState();
    try {
        
        const detailUser= await instance(
            `/Auth/Doctor/getMRList/${patientId}`,
            {
                method: 'get',
            }
        )
        return detailUser?.data?.MRList
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data?.error);
    }
})

export const completedMedicalRecord = createAsyncThunk(
    'doctor/completedMedicalRecord',
async (_, { getState, rejectWithValue }) => {
    const state = getState();
    try {
        const medicalRecord = state.doctor.medicalRecord;
        
        const updateMR= await instance(
            `/Auth/Doctor/completedMR`,
            {
                method: 'put',
                data: { 
                    MRId: medicalRecord.MRId,
                    patientId: medicalRecord.patientId
                }
            }
        )
        return updateMR?.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data?.error);
    }
})

export const updateMedicalRecord = createAsyncThunk(
    'doctor/updateMedicalRecord',
async (_, { getState, rejectWithValue }) => {
    const state = getState();
    try {
        const medicalRecord = state.doctor.medicalRecord;
        const newTreatments = state.doctor.newTreatments;
        console.log(newTreatments);
        
        const updateMR= await instance(
            `/Auth/Doctor/updateMR`,
            {
                method: 'put',
                data: { 
                    MRId: medicalRecord.MRId,
                    treatments: newTreatments,
                    patientId: medicalRecord.patientId
                }
            }
        )
        return updateMR?.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data?.error);
    }
})

export const createMedicalRecord = createAsyncThunk(
    'doctor/createMedicalRecord',
async (_, { getState, rejectWithValue }) => {
    const state = getState();
    try {
        const newMedicalRecord = state.doctor.newMedicalRecord;
        const newTreatments = state.doctor.newTreatments;
        const createMR= await instance(
            `/Auth/Doctor/createMR`,
            {
                method: 'post',
                data: {
                    medicalRecord: newMedicalRecord,
                    treatments: newTreatments
                }
            }
        )
        return createMR.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data?.error);
    }
})

export const getDetailPatient = createAsyncThunk(
    'doctor/getDetailPatient',
    async (userId, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const detailUser= await instance(
                `/Auth/getUser/${userId}`,
                {
                    method: 'get'
                }
            )
            return detailUser?.data?.user
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const getAccessList = createAsyncThunk(
    'doctor/getAccessList',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Doctor/getAuthorizedAccessList/1`,
                {
                    method: 'get',
                }
            )
            return patientList?.data?.accessList;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const cancelAccessRequest = createAsyncThunk(
    'doctor/cancelAccessRequest',
    async (patientId, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Doctor/cancelRequest`,
                {
                    method: 'post',
                    data: {
                        patientId: patientId
                    }
                }
            )
            return patientList?.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const getAccessRequestList = createAsyncThunk(
    'doctor/getAccessRequestList',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Doctor/getRequestedList/1`,
                {
                    method: 'get',
                }
            )
            return patientList?.data?.accessRequestList
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const requestAccess = createAsyncThunk(
    'doctor/requestAccess',
    async (patientId, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Doctor/requestAccess`,
                {
                    method: 'post',
                    data: {
                        patientId : patientId
                    }
                }
            )
            return patientList?.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const findPatientBySearch = createAsyncThunk(
    'doctor/findPatientBySearch',
    async (searchContent, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            if(!searchContent) {
                return []
            }
            else {const patientList= await instance(
                `/Auth/Doctor/findPatientBySearch/${searchContent}`,
                {
                    method: 'get'
                }
            )
            return patientList?.data?.patientList}
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const changePassword = createAsyncThunk(
    'doctor/changePassword',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const userList= await instance(
                `/Auth/changePassword`,
                {
                    method: 'put',
                    data: {
                        password: state.doctor.passwordUpdate?.oldPassword,
                        newPW : state.doctor.passwordUpdate?.newPassword
                    }
                }
            )
            return userList?.data?.userList
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const updateDoctorInfo = createAsyncThunk(
    'doctor/updateDoctorInfo',
    async (_, { getState, rejectWithValue, dispatch }) => {
        const state = getState();
        try {
            const userUpdate = {
                ...state.doctor.userInfo,
                birthDay : convertToUTC(state.doctor.userInfo.birthDay)
            }
            const {accessList, accessRequestList, ...updateDoctor} = state.doctor.doctorInfo;
            const userList= await instance(
                `/Auth/Doctor/updateDoctorInfo`,
                {
                    method: 'put',
                    data: {
                        user: userUpdate,
                        doctor: updateDoctor
                    }
                }
            )
            const newUser = {
                ...state.doctor.userInfo,
                doctor: state.doctor.doctorInfo,
                patient: null
            }
            dispatch(loginSlice.actions.setUser(newUser));
            setUser(JSON.stringify(newUser))
            return userList?.data?.userList
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export default doctorSlice
export const doctorSelector = (state) => state.doctor;

export const filterPatientSearch = createSelector(
    (state) => state.doctor?.patientSearchList,
    (_, searchCriteria) => searchCriteria,
    (patientList, searchCriteria) => {
      const { gender } = searchCriteria;
      return patientList?.filter((patient) => {
        const matchesGender = gender === 'Giới tính' || patient?.user?.gender === gender;
        return matchesGender ;
      });
    }
);

export const filterAccessList = createSelector(
    (state) => state.doctor.accessList,
    (_, searchCriteria) => searchCriteria,
    (accessList, searchCriteria) => {
      return accessList.filter((access) => {
        const containsCitizenId = access?.patient?.user?.citizenNumber.toLowerCase().includes(searchCriteria.toLowerCase());
        const containsFullName = access?.patient?.user?.fullName.toLowerCase().includes(searchCriteria.toLowerCase());
        const containsHICNumber = access?.patient?.HICNumber.toLowerCase().includes(searchCriteria.toLowerCase());
        const containsBirthDay = getDate(access?.patient?.user?.birthDay).toLowerCase().includes(searchCriteria.toLowerCase());
        return containsCitizenId || containsFullName || containsHICNumber || containsBirthDay;
      });
    }
);

export const filterAccessRequestList = createSelector(
    (state) => state.doctor.accessRequestList,
    (_, searchCriteria) => searchCriteria,
    (accessRequestList, searchCriteria) => {
        return accessRequestList.filter((accessRequest) => {
          const containsCitizenId = accessRequest?.patient?.user?.citizenNumber.toLowerCase().includes(searchCriteria.toLowerCase());
          const containsFullName = accessRequest?.patient?.user?.fullName.toLowerCase().includes(searchCriteria.toLowerCase());
          const containsHICNumber = accessRequest?.patient?.HICNumber.toLowerCase().includes(searchCriteria.toLowerCase());
          const containsBirthDay = getDate(accessRequest?.patient?.user?.birthDay).toLowerCase().includes(searchCriteria.toLowerCase());
          return containsCitizenId || containsFullName || containsHICNumber || containsBirthDay;
        });
    }
);

export const filterMRList = createSelector(
    (state) => state.doctor.MRList,
    (_, searchCriteria) => searchCriteria,
    (MRList, searchCriteria) => {
        const {status, searchText} = searchCriteria;
        return MRList.filter((medicalRecord) => {
            const containsDoctorName = medicalRecord?.creator?.user?.fullName.toLowerCase().includes(searchText.toLowerCase());
            const containsDoctorId = medicalRecord?.creator?.user?.citizenNumber.toLowerCase().includes(searchText.toLowerCase());
            const containsHospital = medicalRecord?.creator?.hospital.toLowerCase().includes(searchText.toLowerCase());
            const containsComeTime = getDate(medicalRecord?.comeTime).toLowerCase().includes(searchText.toLowerCase());
            const containsMarjor = medicalRecord?.majorReason.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = status === 'Trạng thái' || medicalRecord.status === status;
            return (containsDoctorName || containsDoctorId || containsHospital || containsComeTime || containsMarjor) && matchesStatus;
        });
    }
)