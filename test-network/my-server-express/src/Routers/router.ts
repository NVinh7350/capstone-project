import express, { Router, Express, Request, Response, NextFunction } from "express";
import { userController } from "../Controller/userController";
import { medicalRecordController } from "../Controller/medicalRecordController";
import jwt, { Jwt } from "jsonwebtoken";
import { userServices } from "../Sevices/userServices";
const router: Router = express.Router();

const initAPIRoute = (app: Express) => {

    router.use('/Auth', Authorization);
    router.use('/Admin', roleAdmin);
    router.use('/Doctor', roleDoctor);
    router.use('/Patient', rolePatient);

    router.post('/createAdmin', userController.createAdmin);
    router.put('/Auth/changePassword', userController.changePassword);
    router.put('/Auth/Admin/updateAdminInfo', userController.updateAdminInfo);
    router.get('/Auth/getUser/:userId', userController.getUser);
    router.get('/Auth/getUserListBySearch/:searchContent', userController.getUserListBySearch);
    router.post('/login', userController.login);
    router.post('/refreshToken', userController.refreshToken);
    router.post('/Auth/Admin/createPatient', userController.createPatient);
    router.post('/Auth/Admin/createDoctor', userController.createDoctor);
    router.get('/Auth/getDoctorById', userController.getDoctorById);
    router.put('/Auth/Patient/updatePatientInfo', userController.updatePatientInfo);
    router.put('/Auth/Doctor/updateDoctorInfo', userController.updateDoctorInfo);
    router.get('/Auth/getPatientList/:page', userController.getPatientList);
    router.get('/Auth/getDoctorList/:page', userController.getDoctorList);
    router.get('/Auth/Doctor/getPatientById', userController.getPatientById);
    router.get('/Auth/getUserList/:page', userController.getUserList);
    router.get('/Auth/Doctor/findPatientBySearch/:searchContent', userController.findPatientBySearch);

    // Bác sĩ yêu cầu, bệnh nhân và bác sĩ xem danh sách yêu cầu
    router.post('/Auth/Doctor/requestAccess', userController.requestAccess);
    router.get('/Auth/Patient/getRequestDoctorList/:page', userController.getRequestDoctorList);
    router.get('/Auth/Doctor/getRequestedList/:page', userController.getRequestedList);

    // Bệnh nhân chấp nhận yêu cầu, bệnh nhân và bác sĩ xem danh sách truy cập
    router.post('/Auth/Patient/grantAccess', userController.grantAccess);
    router.get('/Auth/Patient/getAccessibleDoctorList/:page', userController.getAccessibleDoctorList);
    router.get('/Auth/Doctor/getAuthorizedAccessList/:page', userController.getAuthorizedAccessList);

    // Bệnh nhân từ chối, bác sĩ hủy yêu cầu
    router.post('/Auth/Patient/refuseRequest', userController.refuseRequest);
    router.post('/Auth/Doctor/cancelRequest', userController.refuseRequest);

    // Bệnh nhân Thu hồi quyền truy cập 
    router.post('/Auth/Patient/revokeRequest', userController.revokeAccess);

    // Thêm mới bệnh án
    router.post('/Auth/Doctor/createMR', medicalRecordController.createMR);
    router.put('/Auth/Doctor/updateMR', medicalRecordController.updateMR);
    router.get('/Auth/getDetailMR/:MRId/:patientId', medicalRecordController.getDetailMR);
    router.put('/Auth/Doctor/completedMR', medicalRecordController.completedMR);
    router.get('/Auth/Doctor/getMRList/:patientId', medicalRecordController.getMRList);
    router.get('/Auth/Patient/getMRList/:patientId', medicalRecordController.getMRList);

    router.post('/Auth/Admin/testConnectLedger', userController.testConnectLedger);
    router.post('/Auth/Patient/readPatientRecord', userController.readPatientRecord)
    return app.use('/api/v1/', router);

}


const Authorization = (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if(req.method === "OPTIONS"){
            // next();
        }
        if (!accessToken) {
            res.status(403).json({ error: 'Unauthorized' });
        } else {
            try {
                const decoded = jwt.verify(accessToken, 'secretKey') as { citizenId: string, role: string, organization: string };
                req.body.citizenId = decoded.citizenId;
                req.body.organization = decoded.organization;
                req.body.role = decoded.role;
                next();
            } catch (error) {
                res.status(401).json({ error: 'Unauthorized1' });
            }
        }
    } catch (error) {
        res.status(401).json('authen error')
    }
}

const roleAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body.role)
        if (req.body.role === 'ADMIN') {
            next();
        } else {
            res.status(401).json('Not have access');
        }
    } catch (error) {
        res.status(401).json(error);
    }
}
const rolePatient = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.role === 'PATIENT') {
            next();
        } else {
            res.status(401).json('Not have access');
        }
    } catch (error) {
        res.status(401).json(error);
    }
}
const roleDoctor = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.role === 'DOCTOR') {
            next();
        } else {
            res.status(401).json('Not have access');
        }
    } catch (error) {
        res.status(401).json(error);
    }
}

export default initAPIRoute;