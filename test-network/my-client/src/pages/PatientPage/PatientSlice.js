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
    patientInfo: null,
    userInfo : null,
    accessRequestList: [],
    accessList: [],
    detailDoctor: null,

    MRList: [],
    medicalRecord: null,
    treatments: [],
}

export const patientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {
        setPatientInfo: (state, action) => {
            state.patientInfo = action.payload;
        },
        removePatientInfo: (state, action) => {
            state.patientInfo = null
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
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
                isLoading: false,
                error: null,
                passwordUpdate: null,
                patientInfo: null,
                userInfo : null,
                accessRequestList: [],
                accessList: [],
                detailDoctor: null
            }
        },
        setMedicalRecord: (state,action) => {
            state.medicalRecord = action.payload;
        },
        setMRList : (state, action) => {
            state.MRList = action.payload;
        },
        setTreatments : (state, action) => {
            state.treatments = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updatePatientInfo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updatePatientInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.success = 'Cập nhật thông tin thành công';
            })
            .addCase(updatePatientInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            })
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
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
                state.accessRequestList = state.accessRequestList.filter((access) => access?.doctor?.citizenId !== action.payload?.doctorId)
                state.success = 'Hủy yêu cầu thành công';
            })
            .addCase(cancelAccessRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            })
            .addCase(grantAccess.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(grantAccess.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.accessRequestList = state.accessRequestList.filter((access) => access?.doctor?.citizenId !== action.payload?.doctorId);
                state.success = 'Cấp quyền truy cập thành công';
            })
            .addCase(grantAccess.rejected, (state, action) => {
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
            .addCase(revokeAccess.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
                
            })
            .addCase(revokeAccess.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.accessList = state.accessList.filter((access) => access?.doctor?.citizenId !== action.payload?.doctorId);
                state.success = 'Thu hồi quyền truy cập thành công';
            })
            .addCase(revokeAccess.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
                state.success = null;
            }).addCase(getDetailDoctor.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                
            })
            .addCase(getDetailDoctor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.detailDoctor = action.payload;
            })
            .addCase(getDetailDoctor.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(action.payload || action.error.message || 'Đã xảy ra lỗi');
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
    },
})

export const getDetailMR  = createAsyncThunk(
    'patient/getDetailMR',
async (MRId, { getState, rejectWithValue }) => {
    const state = getState();
    try {
        const patientId = state.login.user.citizenId;
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
    'patient/getMRList',
async (patientId, { getState, rejectWithValue }) => {
    const state = getState();
    try {
        
        const detailUser= await instance(
            `/Auth/Patient/getMRList/${patientId}`,
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

export const getDetailDoctor = createAsyncThunk(
    'patient/getDetailDoctor',
    async (userId, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const detailUser= await instance(
                `/Auth/getUser/${userId}`,
                {
                    method: 'get'
                }
            )
            console.log(detailUser)
            return detailUser?.data?.user
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)
export const revokeAccess = createAsyncThunk(
    'patient/revokeAccess',
    async (doctorId, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Patient/revokeRequest`,
                {
                    method: 'post',
                    data: {
                        doctorId: doctorId
                    }
                }
            )
            return patientList?.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const getAccessList = createAsyncThunk(
    'patient/getAccessList',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Patient/getAccessibleDoctorList/1`,
                {
                    method: 'get',
                }
            )
            return patientList?.data?.accessList
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const grantAccess = createAsyncThunk(
    'patient/grantAccess',
    async (doctorId, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Patient/grantAccess`,
                {
                    method: 'post',
                    data: {
                        doctorId: doctorId
                    }
                }
            )
            return patientList?.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const cancelAccessRequest = createAsyncThunk(
    'patient/cancelAccessRequest',
    async (doctorId, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Patient/refuseRequest`,
                {
                    method: 'post',
                    data: {
                        doctorId: doctorId
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
    'patient/getAccessRequestList',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientList= await instance(
                `/Auth/Patient/getRequestDoctorList/1`,
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

export const changePassword = createAsyncThunk(
    'patient/changePassword',
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const userList= await instance(
                `/Auth/changePassword`,
                {
                    method: 'put',
                    data: {
                        password: state.patient.passwordUpdate?.oldPassword,
                        newPW : state.patient.passwordUpdate?.newPassword
                    }
                }
            )
            return userList?.data?.userList
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export const updatePatientInfo = createAsyncThunk(
    'patient/updatePatientInfo',
    async (_, { getState, rejectWithValue, dispatch }) => {
        const state = getState();
        try {
            const userUpdate = {
                ...state.patient.userInfo,
                birthDay : convertToUTC(state.patient.userInfo.birthDay)
            }
            const {accessList, accessRequestList, ...updatePatient} = state.patient.patientInfo;
            const userList= await instance(
                `/Auth/Patient/updatePatientInfo`,
                {
                    method: 'put',
                    data: {
                        user: userUpdate,
                        patient: updatePatient
                    }
                }
            )
            const newUser = {
                ...state.patient.userInfo,
                patient: {
                    ...state.patient.patientInfo
                },
                doctor: null
            }
            dispatch(loginSlice.actions.setUser(newUser));
            setUser(JSON.stringify(newUser))
            return userList?.data?.userList
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
)

export default patientSlice
export const patientSelector = (state) => state.patient;


export const filterAccessRequestList = createSelector(
    (state) => state.patient.accessRequestList,
    (_, searchCriteria) => searchCriteria,
    (accessRequestList, searchCriteria) => {
        const {gender, searchText, hospital} = searchCriteria;
        return accessRequestList.filter((accessRequest) => {
          const containsCitizenId = accessRequest?.doctor?.user?.citizenNumber?.toLowerCase().includes(searchText.toLowerCase());
          const containsFullName = accessRequest?.doctor?.user?.fullName.toLowerCase().includes(searchText.toLowerCase());
          const containsBirthDay = getDate(accessRequest?.doctor?.user?.birthDay).toLowerCase().includes(searchText.toLowerCase());
          const matchesGender = gender === 'Giới tính' || accessRequest?.doctor?.user?.gender === gender;
          const matchesHospital = hospital === 'Bệnh viện' || accessRequest?.doctor?.hospital === hospital;
          return (containsCitizenId || containsFullName || containsBirthDay) && matchesGender && matchesHospital ;
        });
    }
);

export const filterAccessList = createSelector(
    (state) => state.patient.accessList,
    (_, searchCriteria) => searchCriteria,
    (accessList, searchCriteria) => {
        const {gender, searchText, hospital} = searchCriteria;
        return accessList.filter((access) => {
          const containsCitizenId = access?.doctor?.user?.citizenNumber.toLowerCase().includes(searchText.toLowerCase());
          const containsFullName = access?.doctor?.user?.fullName.toLowerCase().includes(searchText.toLowerCase());
          const containsBirthDay = getDate(access?.doctor?.user?.birthDay).toLowerCase().includes(searchText.toLowerCase());
          const matchesGender = gender === 'Giới tính' || access?.doctor?.user?.gender === gender;
          const matchesHospital = hospital === 'Bệnh viện' || access?.doctor?.hospital === hospital;
          return (containsCitizenId || containsFullName || containsBirthDay) && matchesGender && matchesHospital ;
        });
    }
);

export const filterMRList = createSelector(
    (state) => state.patient.MRList,
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