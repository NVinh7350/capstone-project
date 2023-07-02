import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import DoctorLayout from "../layouts/DoctorLayout/DoctorLayout";
import MRLayout from "../layouts/MRLayout/MRLayout";
import PatientLayout from "../layouts/PatientLayout/PatientLayout";
import { AddDoctor } from "../pages/AdminPage/AddDoctor/AddDoctor";
import { AddPatient } from "../pages/AdminPage/AddPatient/AddPatient";
import { DetailUser } from "../pages/AdminPage/DetailUser/DetailUser";
import { EditInfo } from "../pages/AdminPage/EditInfo/EditInfo";
import { UserList } from "../pages/AdminPage/UserList/UserList";
import CreateMR from "../pages/DoctorPage/CreateMR/CreateMR";
import DetailMR from "../pages/DoctorPage/DetailMR/DetailMR";
import { DetailPatient } from "../pages/DoctorPage/DetailPatient/DetaiPatient";
import { DoctorAccessList } from "../pages/DoctorPage/DoctorAccessList/DoctorAccessList";
import { DoctorAccessRequest } from "../pages/DoctorPage/DoctorAccessRequest/DoctorAccessRequest";
import { EditDoctorInfo } from "../pages/DoctorPage/EditDoctorInfo/EditDoctorInfo";
import { FindFatient } from "../pages/DoctorPage/FindFatient/FindFatient";
import { MRList } from "../pages/DoctorPage/MRList/MRList";
import  LoginPage from "../pages/LoginPage/LoginPage";
import { DetailDoctor } from "../pages/PatientPage/DetailDoctor/DetailDoctor";
import PatientDetailMR from "../pages/PatientPage/DetailMR/PatientDetailMR";
import { EditPatientInfo } from "../pages/PatientPage/EditPatientInfo/EditPatientInfo";
import { PatientMRList } from "../pages/PatientPage/MRList/PatientMRList";
import { PatientAccessList } from "../pages/PatientPage/PatientAccessList/PatientAccessList";
import { PatientAccessRequest } from "../pages/PatientPage/PatientAccessRequest/PatientAccessRequest";

const publicRoute = [
    {
        path: "/login",
        componet: LoginPage,
        layout: null
    },
    
];

const privateRoute = [
    {
        path: "/admin/user-list",
        componet: UserList,
        role: 'ADMIN',
        layout: AdminLayout,
    },
    {
        path: "/admin/edit-info",
        componet: EditInfo,
        role: 'ADMIN',
        layout: AdminLayout
    },
    {
        path: "/admin/add-patient",
        componet: AddPatient,
        role: 'ADMIN',
        layout: AdminLayout
    },
    {
        path: "/admin/add-doctor",
        componet: AddDoctor,
        role: 'ADMIN',
        layout: AdminLayout
    },
    {
        path: "/admin/user-list/detail-user",
        componet: DetailUser,
        role: 'ADMIN',
        layout: AdminLayout
    },
    /** DOCTOR ROUTE */
    {
        path: "/doctor/create-mr",
        componet: CreateMR,
        role: 'DOCTOR',
        layout: DoctorLayout
    },
    {
        path: "/doctor/edit-doctor-info",
        componet: EditDoctorInfo,
        role: 'DOCTOR',
        layout: DoctorLayout
    },
    {
        path: "/doctor/find-patient",
        componet: FindFatient,
        role: 'DOCTOR',
        layout: DoctorLayout
    },
    {
        path: "/doctor/access-request-list",
        componet: DoctorAccessRequest,
        role: 'DOCTOR',
        layout: DoctorLayout
    },
    {
        path: "/doctor/access-list",
        componet: DoctorAccessList,
        role: 'DOCTOR',
        layout: DoctorLayout
    },
    {
        path: "/doctor/access-list/detail-patient",
        componet: DetailPatient,
        role: 'DOCTOR',
        layout: DoctorLayout
    },
    {
        path: "/doctor/find-patient/detail-patient",
        componet: DetailPatient,
        role: 'DOCTOR',
        layout: DoctorLayout
    },
    {
        path: "/doctor/MR-list",
        componet: MRList,
        role: 'DOCTOR',
        layout: DoctorLayout
    },
    {
        path: "/doctor/detail-patient/detail-mr",
        componet: DetailMR,
        role: 'DOCTOR',
        layout: DoctorLayout
    },
    /** PATIENT ROUTE */
    {
        path: "/patient/edit-patient-info",
        componet: EditPatientInfo,
        role: 'PATIENT',
        layout: PatientLayout
    },
    {
        path: "/patient/access-request-list",
        componet: PatientAccessRequest,
        role: 'PATIENT',
        layout: PatientLayout
    },
    {
        path: "/patient/access-list",
        componet: PatientAccessList,
        role: 'PATIENT',
        layout: PatientLayout
    },
    {
        path: "/patient/detail-doctor",
        componet: DetailDoctor,
        role: 'PATIENT',
        layout: PatientLayout
    },
    {
        path: "/patient/mr-list",
        componet: PatientMRList,
        role: 'PATIENT',
        layout: PatientLayout
    },
    {
        path: "/patient/mr-list/detail-mr",
        componet: PatientDetailMR,
        role: 'PATIENT',
        layout: PatientLayout
    }
];

export { publicRoute, privateRoute };
