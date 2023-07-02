import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../pages/LoginPage/LoginSlice";
import { adminSlice } from "../pages/AdminPage/AdminSlice";
import doctorSlice from "../pages/DoctorPage/DoctorSlice";
import patientSlice from "../pages/PatientPage/PatientSlice";

export const store = configureStore({
  reducer: {
    login : loginSlice.reducer,
    admin: adminSlice.reducer,
    doctor: doctorSlice.reducer,
    patient: patientSlice.reducer
  },
})