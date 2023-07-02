import { Request, Response } from "express";
import { userServices } from "../Sevices/userServices";
import { buildCAClient, changeSecret, enrollIdentity, registerIdentity } from "../Sevices/fabricCAServices";
import { ledgerService } from "../Sevices/ledgerServices";
import * as grpc from '@grpc/grpc-js';
import { caClientOrg1, caClientOrg2, grpcConnectionOrg1, grpcConnectionOrg2 } from "../Config/configConnection";
import jwt from 'jsonwebtoken';
import { User } from "@prisma/client";
import { FabricError } from "fabric-network";
import { GatewayError } from "@hyperledger/fabric-gateway";


const createAdmin = async (req: Request, res: Response) => {
    try {
        const citizenNumber = req.body.user.citizenId;
        const password = req.body.user.password;
        const organization = req.body.user.organization;
        const caClient = organization == 'ORG1' ? caClientOrg1 : caClientOrg2;
        const citizenId = `${req.body.user.role}-${citizenNumber}`;
        const newX509Identity = await enrollIdentity(caClient?.caClient, caClient?.mspOrg, citizenId, password);
        const newUser = {
            ...req.body.user,
            citizenId: citizenId,
            citizenNumber : citizenNumber,
            birthDay: new Date(req.body.user.birthDay),
            x509Identity: JSON.stringify(newX509Identity)
        }
        await userServices.createUserService(newUser);

        res.status(200).json({
            citizenId: citizenId,
            password: password
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(501).json({
                error: error
            })
        }
    }
}

const createPatient = async (req: Request, res: Response) => {
    try {
        const adminId = req.body.citizenId ;
        const patientId = req.body.patient.citizenId;
        const organization = req.body.organization;
        const user = {
            birthDay: new Date(req.body.patient.birthDay),
            role : "PATIENT",
            organization: organization,
            citizenId: `PATIENT-${patientId}`,
            citizenNumber: patientId,
            fullName: req.body.patient.fullName,
            phoneNumber: req.body.patient.phoneNumber,
            address: req.body.patient.address,
            email: req.body.patient.email,
            ethnicity: req.body.patient.ethnicity,
            gender: req.body.patient.gender,
            password: ''
        }

        const patientInfo ={
            citizenId:  `PATIENT-${patientId}`,
            HICNumber : req.body.patient.HICNumber,
            guardianAddress: req.body.patient.guardianAddress,
            guardianPhone : req.body.patient.guardianPhone,
            guardianName : req.body.patient.guardianName
        };

        const caClient = organization == 'ORG1' ? caClientOrg1 : caClientOrg2;
        const grpcConnection : grpc.Client = organization === 'ORG1' ? await grpcConnectionOrg1 : await grpcConnectionOrg2;

        const adminX509Identity = await userServices.getX509IdentityService(adminId);
        
        
        await registerIdentity(caClient?.caClient, adminX509Identity, caClient?.mspOrg,adminId, `PATIENT-${patientId}`, patientId, 'PATIENT', caClient?.affiliation);
        
        await userServices.createPatientService(user, patientInfo);
        
        await ledgerService.createPRLedgerService(grpcConnection , adminId, `PATIENT-${patientId}`);
        res.status(200).json({
            patient: user
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(501).json({
                error: error
            })
        }
    }
}

const createDoctor = async (req: Request, res: Response) => {
    try {
        const adminId = req.body.citizenId ;
        const doctorId = req.body.doctor.citizenId;
        const doctorInfo ={
            citizenId: `DOCTOR-${doctorId}`,
            hospital : req.body.doctor.hospital,
            specialty: req.body.doctor.specialty,
            position : req.body.doctor.position
        };
        const organization = req.body.organization;
        const caClient = organization == 'ORG1' ? caClientOrg1 : caClientOrg2;

        const adminX509Identity = await userServices.getX509IdentityService(adminId);

        await registerIdentity(caClient?.caClient, adminX509Identity, caClient?.mspOrg,adminId, `DOCTOR-${doctorId}`, doctorId, 'DOCTOR', caClient?.affiliation);
        const newUser = {
            birthDay: new Date(req.body.doctor.birthDay),
            role : "DOCTOR",
            organization: organization,
            citizenId: `DOCTOR-${doctorId}`,
            citizenNumber: doctorId,
            fullName: req.body.doctor.fullName,
            phoneNumber: req.body.doctor.phoneNumber,
            address: req.body.doctor.address,
            email: req.body.doctor.email,
            ethnicity: req.body.doctor.ethnicity,
            gender: req.body.doctor.gender,
            password: ''
        }
        await userServices.createDoctorService(newUser, doctorInfo);

        res.status(200).json({
            doctor: newUser
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(501).json({
                error: error
            })
        }
    }
}

const changePassword =async (req: Request, res: Response) => {
    try {
        const organization = req.body.organization;
        const citizenId = req.body.citizenId;
        const caClient = organization == 'ORG1' ? caClientOrg1 : caClientOrg2;
        const newX509Identity = await changeSecret(caClient?.caClient, caClient?.mspOrg, citizenId, req.body.password, req.body.newPW);
        await userServices.insertX509IdentityService(citizenId, JSON.stringify(newX509Identity));
        res.status(200).json('Thay đổi mật khẩu thành công');
    } catch (error) {
        console.log(error);
        res.status(501).json({error: 'Mật khẩu cũ không chính xác'});
    }
}

const login = async(req: Request, res: Response) => {
    try {
        const citizenId = `${req.body.role}-${req.body.citizenId}`;
        const password = req.body.password;
        let user = await userServices.getUserService(citizenId);
        if(!user) {
            throw new Error('Người dùng chưa được đăng ký')
        }
        
        const caClient = user.organization == 'ORG1' ? caClientOrg1 : caClientOrg2;
        const newX509Identity = await enrollIdentity(caClient?.caClient, caClient?.mspOrg, citizenId, password );
        const accessToken = jwt.sign({ citizenId: user?.citizenId , role: user?.role, organization:user?.organization }, 'secretKey', { expiresIn: '3h' });
        const refreshToken = jwt.sign({ citizenId: user?.citizenId }, 'refreshSecretKey', { expiresIn: '7d' });
        
        await userServices.updateUserService(citizenId, {
            x509Identity : JSON.stringify(newX509Identity),
            refreshToken: refreshToken,
        });
        res.status(200).json({
            accessToken : accessToken,
            refreshToken : refreshToken,
            user : user
        });
    } catch (error) {
        console.log(error)
        if(error instanceof Error && error.message == 'Người dùng chưa được đăng ký') {
            res.status(501).json({
                error: 'Người dùng chưa được đăng ký'
            });
        } else {
            res.status(501).json({
                error: 'Sai mật khẩu, vui lòng thử lại'
            });
        }
    }
}

const refreshToken = async(req: Request, res: Response) => {
    try {
        const refreshToken = req.body.refreshToken;
        const decoded = jwt.verify(refreshToken, 'refreshSecretKey') as {citizenId: string};
        const user = await userServices.getUserService(decoded.citizenId);
        if(refreshToken !== user?.refreshToken) {
            throw new Error('Refresh Token hết hạn vui lòng đăng nhập lại')
        } 
        const accessToken = jwt.sign({ citizenId: user?.citizenId , role: user?.role, organization:user?.organization }, 'secretKey', { expiresIn: '15m' });
        res.status(200).json({
            accessToken: accessToken
        });
        
    } catch (error) {
        res.status(501).json({ error: error });
    }
}

const getUser = async(req: Request, res: Response) => {
    try {
        console.log(req.params.userId)
        const user = await userServices.getUserService(req.params.userId);
        res.status(200).json({
            user: user
        });
    } catch (error) {
        res.status(501).json({error: error});
    }
}

const getUserList = async(req: Request, res: Response) => {
    try {
        const page = Number(req.params.page);
        const result = await userServices.getUserListService(page);
        res.status(200).json({
            userList: result
        });
    } catch (error) {
        res.status(501).json({error: error});
    }
}

const getUserListBySearch = async(req: Request, res: Response) => {
    try {
        const search = req.params.searchContent;
        const result = await userServices.getUserListBySearchService(search);
        res.status(200).json({
            userList: result
        });
    } catch (error) {
        res.status(501).json({error: error});
    }
}

const getDoctorById = async(req: Request, res: Response) => {
    try {
        const doctorId = req.body.doctorId;
        const result = await userServices.getDoctorByIdService(doctorId);
        res.status(200).json({
         doctor: result
        });
    } catch (error) {
        res.status(501).json(error);
    }
}

const getDoctorList = async(req: Request, res: Response) => {
    try {
        const page = Number(req.params.page);
        const result = await userServices.getDoctorListService(page);
        res.status(200).json({
            doctorList : result
        });
    } catch (error) {
        res.status(500).json({error: error});
    }
}

const getPatientList = async(req: Request, res: Response) => {
    try {
        const page = Number(req.params.page);
        const result = await userServices.getPatientListService(page);
        res.status(200).json({
            patientList: result
        });
    } catch (error) {
        res.status(500).json({error: error});
    }
}

const getPatientById = async(req: Request, res: Response) => {
    try {
        const patientId = req.body.patientId;
        const doctorId = req.body.doctorId;
        const result = await userServices.getPatientByIdService(patientId, doctorId);
        res.status(200).send({
            patient: result
        });
    } catch (error) {
        res.status(500).send({
            error: error
        });
    }
}

const findPatientBySearch = async(req: Request, res: Response) => {
    try {
        const searchContent = req.params.searchContent;
        const result = await userServices.findPatientService(searchContent);
        res.status(200).json({
            patientList: result
        })
    } catch (error) {
        res.status(500).send({
            error: error
        });
    }
}

const updateAdminInfo = async (req: Request, res: Response) => {
    try {
        const {patient, doctor, ...adminInfo }= req.body.admin;
        await userServices.updateAdminInfoService(adminInfo);
        res.send(`success update admin ${req.body.citizenId}`);
    } catch (error) {
        console.log(error)
        res.send(error);
    }
}


const updatePatientInfo = async (req: Request, res: Response) => {
    try {
        const userInfo = req.body.user;
        const patientInfo = req.body.patient;
        await userServices.updatePatientInfoService(userInfo, patientInfo);
        res.send(`success update patient ${req.body.citizenId}`);
    } catch (error) {
        res.send(error);
    }
}


const updateDoctorInfo = async (req: Request, res: Response) => {
    try {
        const userInfo = req.body.user
        const doctorInfo = req.body.doctor;
        await userServices.updateDoctorInfoService(userInfo, doctorInfo);
        res.send(`success update doctor ${req.body.citizenId}`);
    } catch (error) {
        res.send(error);
    }
}

const requestAccess = async (req: Request, res: Response) => {
    try {
        const patientId = req.body.patientId;
        const doctorId = req.body.citizenId;
        const grpcConnection : grpc.Client = req.body.organization === 'ORG1' ? await grpcConnectionOrg1 : await grpcConnectionOrg2;
        const checkAccess = JSON.parse(await ledgerService.checkAccessLedgerService(grpcConnection, doctorId, doctorId, patientId ));
        if(!checkAccess){
            await userServices.requestAccessService(doctorId, patientId);
            res.send({
                patientId: patientId,
                doctorId: doctorId
            });
        } else {
            res.status(500).send(`Ban da co quyen truy cap voi benh nhan ${patientId}`)
        }  
    } catch (error) {
        if(error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
}

const getRequestDoctorList = async (req: Request, res: Response) => {
    try {
        const patientId = req.body.citizenId;
        const page = Number(req.params.page);
        const result = await userServices.getRequestDoctorListService(patientId, page);
        res.status(200).send({
            accessRequestList: result
        });
    } catch (error) {
        res.send(error);
    }
}

const getRequestedList = async (req: Request, res: Response) => {
    try {
        const doctorId = req.body.citizenId;
        const page = Number(req.params.page);
        const result = await userServices.getRequestedListService(doctorId, page);
        res.status(200).send({
            accessRequestList : result
        });
    } catch (error) {
        res.send(error);
    }
}

const grantAccess = async (req: Request, res: Response) => {
    try {
        const doctorId = req.body.doctorId;
        const patientId = req.body.citizenId;
        const grpcConnection : grpc.Client = req.body.organization === 'ORG1' ? await grpcConnectionOrg1 : await grpcConnectionOrg2;
        
        await ledgerService.grantAccessLedgerService(grpcConnection, patientId, doctorId );
        await userServices.grantAccessService(doctorId, patientId);

        res.status(200).send({
            doctorId: doctorId,
            patientId: patientId
        });
    } catch (error) {
        console.log('error');
        console.log(error)
        res.status(500).send(error);
    }
}

const getAccessibleDoctorList = async (req: Request, res: Response) => {
    try {
        const patientId = req.body.citizenId;
        const page = Number(req.params.page);
        const result = await userServices.getAccessibleDoctorListService(patientId, page);
        res.status(200).send({
            accessList : result
        });
    } catch (error) {
        res.send(error);
    }
}

const getAuthorizedAccessList = async (req: Request, res: Response) => {
    try {
        const doctorId = req.body.citizenId;
        const page = Number(req.params.page);
        const result = await userServices.getAuthorizedAccessListService(doctorId, page);
        res.status(200).send({
            accessList : result
        });
    } catch (error) {
        res.send(error);
    }
}

const refuseRequest = async (req: Request, res: Response) => {
    try {
        const doctorId = req.body.doctorId ? req.body.doctorId : req.body.citizenId;
        const patientId = req.body.patientId ? req.body.patientId : req.body.citizenId;
        const result = await userServices.refuseRequestService(doctorId, patientId);
        res.status(200).send({
            doctorId: doctorId,
            patientId: patientId
        });
    } catch (error) {
        res.send(error);
    }
}

const revokeAccess = async (req: Request, res: Response) => {
    try {
        const doctorId = req.body.doctorId;
        const patientId = req.body.citizenId;
        const grpcConnection : grpc.Client = req.body.organization === 'ORG1' ? await grpcConnectionOrg1 : await grpcConnectionOrg2;
        await ledgerService.revokeAccessLedgerService(grpcConnection, patientId, doctorId );
        
        await userServices.revokeAccessService(doctorId, patientId);
        res.status(200).send({
            doctorId : doctorId,
            patientId: patientId
        });
    } catch (error) {
        if(error instanceof GatewayError) {
            const e = new GatewayError(error);
            if(e?.details[0]?.message?.includes('has an unfinished medical record'))
            {
                res.status(500).json({
                    error: 'Bác sĩ đang có bệnh án chưa hoàn thành'
                })
            }
        }
        else if(error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
}

const testConnectLedger = async (req: Request, res: Response) => {
    try {
        const citizenId = req.body.citizenId;
        const grpcConnection : grpc.Client = req.body.organization === 'ORG1' ? await grpcConnectionOrg1 : await grpcConnectionOrg2;
        const result = await ledgerService.initLedger(grpcConnection, citizenId  );
        res.status(200).send(`success test connect ledger doctor ${citizenId};
        testleger : ${result}
        `);
    } catch (error) {
        if(error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
}
const readPatientRecord = async (req: Request, res: Response) => {
    try {
        const citizenId = req.body.citizenId;
        const grpcConnection : grpc.Client = req.body.organization === 'ORG1' ? await grpcConnectionOrg1 : await grpcConnectionOrg2;
        const result = await ledgerService.readPRLedgerService(grpcConnection, citizenId, "bn06"  );
        res.status(200).send(`success test connect ledger doctor ${JSON.stringify(result)};
        testleger : ${result}
        `);
    } catch (error) {
        if(error instanceof Error) {
            res.status(500).send(error.message);
        }
    }
}

export const userController = {
    createAdmin,
    createPatient,
    login,
    changePassword,
    updatePatientInfo,
    createDoctor,
    updateDoctorInfo,
    getDoctorList,
    getPatientList,
    getPatientById,
    getDoctorById,
    requestAccess,
    getRequestDoctorList,
    getRequestedList,
    grantAccess,
    getAccessibleDoctorList,
    getAuthorizedAccessList,
    refuseRequest,
    revokeAccess,
    testConnectLedger,
    readPatientRecord,
    refreshToken,
    getUser,
    getUserList,
    getUserListBySearch,
    updateAdminInfo,
    findPatientBySearch
}