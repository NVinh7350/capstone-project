import { createAsyncThunk, createSlice, createSelector } from "@reduxjs/toolkit";
import { instance } from "../../api/axiosConfig";
import { setUser } from "../../utils/LocalStorage";
import { convertToUTC } from "../../utils/Validate";
import loginSlice from "../LoginPage/LoginSlice";
const initialState = {
    isLoading: false,
    error: null,
    success: null,

    accountList: [],


    doctorInput: null,
    patientInput: null,
    adminUpdate: null,
    passwordUpdate: null,
    pageIndex: 1,
    detailAccount: null,
};

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setDoctorInput: (state, action) => {
            state.doctorInput = action.payload;
        },
        removeDoctorInput: (state, action) => {
            state.doctorInput = null;
        },
        setPatientInput: (state, action) => {
            state.patientInput = action.payload;
        },
        removePatientInput: (state, action) => {
            state.patientInput = null;
        },
        setAdminUpdate: (state, action) => {
            state.adminUpdate = action.payload;
        },
        setPageIndex: (state, action) => {
            state.pageIndex = action.payload;
        },
        setPasswordUpdate: (state, action) => {
            state.passwordUpdate = action.payload;
        },
        removePasswordUpdate: (state, action) => {
            state.passwordUpdate = null;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        removeAdminUpdate: (state, action) => {
            state.adminUpdate = null;
        },
        setAccountList: (state, action) => {
            state.accountList = action.payload;
        },
        removeState : (state, action) =>{
            state = {
                ...initialState
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAccountList.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(getAccountList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accountList = action.payload;
                state.success = null;
                state.error = null;
            })
            .addCase(getAccountList.rejected, (state, action) => {
                state.isLoading = false;
                state.success = null;
                state.error = JSON.stringify(
                    action.payload || action.error.message || "Đã xảy ra lỗi"
                );
            })
            .addCase(getDetailAccount.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(getDetailAccount.fulfilled, (state, action) => {
                state.isLoading = false;
                state.detailAccount = action.payload;
                state.error = null;
                state.success = null;
            })
            .addCase(getDetailAccount.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(
                    action.payload || action.error.message || "Đã xảy ra lỗi"
                );
                state.success = null;
            })
            .addCase(getAccountBySearch.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(getAccountBySearch.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accountList = action.payload;
                state.error = null;
                state.success = null;
            })
            .addCase(getAccountBySearch.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(
                    action.payload || action.error.message || "Đã xảy ra lỗi"
                );
                state.success = null;
            })
            .addCase(createDoctor.pending, (state) => {
                state.isLoading = 'createDoctor';
                state.error = null;
                state.success = null;
            })
            .addCase(createDoctor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.success = "Đăng ký bác sĩ thành công";
            })
            .addCase(createDoctor.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(
                    action.payload || action.error.message || "Đã xảy ra lỗi"
                );
                state.success = null;
            })
            .addCase(createPatient.pending, (state) => {
                state.isLoading = 'createPatient';
                state.error = null;
                state.success = null;
            })
            .addCase(createPatient.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.success = "Đăng ký bệnh nhân thành công";
            })
            .addCase(createPatient.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(
                    action.payload || action.error.message || "Đã xảy ra lỗi"
                );
                state.success = null;
            })
            .addCase(updateAdminInfo.pending, (state) => {
                state.isLoading = 'updateAdminInfo';
                state.error = null;
                state.success = null;
            })
            .addCase(updateAdminInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.success = "Cập nhật thông tin thành công";
            })
            .addCase(updateAdminInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(
                    action.payload || action.error.message || "Đã xảy ra lỗi"
                );
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
                state.success = "Thay đổi mật khẩu thành công";
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = JSON.stringify(
                    action.payload || action.error.message || "Đã xảy ra lỗi"
                );
                state.success = null;
            });
    },
});

export const changePassword = createAsyncThunk(
    "admin/changePassword",
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const {oldPassword,newPassword,confirmPassword} = state.admin.passwordUpdate;
            if(newPassword!== confirmPassword) {
                return rejectWithValue('Mật khẩu mới và mật khẩu xác nhận không giống nhau');
            }
            const updatePW = await instance(`/Auth/changePassword`, {
                method: "put",
                data: {
                    password: oldPassword,
                    newPW: newPassword
                },
            });
            return updatePW?.data;
        } catch (error) {
            if(error.response?.data?.error)
            return rejectWithValue(error.response?.data?.error); 
            else 
            return error
        }
    }
);

export const updateAdminInfo = createAsyncThunk(
    "admin/updateAdminInfo",
    async (_, { getState, rejectWithValue, dispatch }) => {
        const state = getState();
        try {
            const adminUpdate = {
                ...state.admin.adminUpdate,
                birthDay : convertToUTC(state.admin.adminUpdate.birthDay)
            }
            const updateAdmin = await instance(`/Auth/Admin/updateAdminInfo`, {
                method: "put",
                data: {
                    admin: adminUpdate,
                },
            });
            setUser(JSON.stringify(state.admin.adminUpdate));
            dispatch(loginSlice.actions.setUser(state.admin.adminUpdate));
            return updateAdmin?.data;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data?.error);
        }
    }
);

export const getAccountList = createAsyncThunk(
    "admin/getAccountList",
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const userList = await instance(
                `/Auth/getUserList/${state.admin.pageIndex}`,
                {
                    method: "get",
                }
            );
            return userList?.data?.userList;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
);
export const getAccountBySearch = createAsyncThunk(
    "admin/getAccountBySearch",
    async (searchContent, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const userList = searchContent
                ? await instance(`/Auth/getUserListBySearch/${searchContent}`, {
                      method: "get",
                  })
                : await instance(`/Auth/getUserList/${state.admin.pageIndex}`, {
                      method: "get",
                  });
            return userList?.data?.userList;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
);
export const getDetailAccount = createAsyncThunk(
    "admin/getDetailAccount",
    async (userId, { getState, rejectWithValue }) => {
        try {
            const detailAccount = await instance(`/Auth/getUser/${userId}`, {
                method: "get",
            });
            return detailAccount?.data?.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error);
        }
    }
);
export const createDoctor = createAsyncThunk(
    "admin/createDoctor",
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const doctorInfo = {
                ...state.admin.doctorInput,
            };
            const detailUser = await instance(`/Auth/Admin/createDoctor`, {
                method: "post",
                data: {
                    doctor: doctorInfo,
                },
            });
            return detailUser?.data?.user;
        } catch (error) {
            if (error?.response?.data?.error?.errors?.[0]?.code == 74)
                return rejectWithValue("Số CMND/ CCCD đã được sử dụng");
            else return rejectWithValue(error?.response?.data?.error);
        }
    }
);
export const createPatient = createAsyncThunk(
    "admin/createPatient",
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        try {
            const patientInfo = {
                ...state.admin.patientInput,
            };
            const detailUser = await instance(`/Auth/Admin/createPatient`, {
                method: "post",
                data: {
                    patient: patientInfo,
                },
            });
            return detailUser?.data?.user;
        } catch (error) {
            console.log("first");
            console.log(error);
            if (error.response?.data?.error?.code === 10) {
                return rejectWithValue("Số CMND/ CCCD đã được sử dụng");
            } else if (error?.response?.data?.error?.errors?.[0]?.code == 74)
                return rejectWithValue("Số CMND/ CCCD đã được sử dụng");
            else {
                return rejectWithValue(error.response?.data?.error);
            }
        }
    }
);

export default adminSlice;
export const adminSelector = (state) => state.admin;

export const filterAccountList = createSelector(
  (state) => state.admin?.accountList,
  (_, searchCriteria) => searchCriteria,
  (accountList, searchCriteria) => {
    const { citizenNumber, fullName, gender, role } = searchCriteria;
    return accountList?.filter((account) => {
      const matchesGender = gender === 'Giới tính' || account?.gender === gender;
      const matchesType = role === 'Loại' || account?.role === role;
      return matchesGender && matchesType;
    });
  }
);
