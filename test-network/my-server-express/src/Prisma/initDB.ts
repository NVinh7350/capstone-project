import { Gender, PrismaClient, Role } from "@prisma/client";
import { ledgerService } from "../Sevices/ledgerServices";
import { caClientOrg1, caClientOrg2, grpcConnectionOrg1, grpcConnectionOrg2 } from "../Config/configConnection";
import { userServices } from "../Sevices/userServices";
import { enrollIdentity, registerIdentity } from "../Sevices/fabricCAServices";

const prisma = new PrismaClient();
const patients = [
    {
        user: {
            citizenId: 'PATIENT-123456789199',
            citizenNumber: '123456789199',
            birthDay: new Date('2001-10-23'),
            fullName: 'Nguyễn Văn Vĩnh',
            gender: 'MALE',
            password: '',
            role: "PATIENT",
            address: "Lệ Bắc, Duy Châu, Duy Xuyên, Quảng Nam",
            email: 'vinh2001@gmail.com',
            phoneNumber: '0908706099',
            ethnicity: 'kinh',
            organization: 'ORG1',
            createDate: new Date()
        },
        patient: {
            citizenId: 'PATIENT-123456789199',
            guardianName: 'Nguyễn Văn Loan',
            guardianPhone: '0908706199',
            guardianAddress: 'Lệ Bắc, Duy Châu, Duy Xuyên, Quảng Nam',
            HICNumber: 'hs5123456789199'
        }
    },
    {
        user: {
            citizenId: 'PATIENT-123456789198',
            citizenNumber: '123456789198',
            birthDay: new Date('2006-06-05'),
            fullName: 'Nguyễn Văn Hảo',
            gender: 'MALE',
            password: '',
            role: "PATIENT",
            address: "Lệ Bắc, Duy Châu, Duy Xuyên, Quảng Nam",
            email: 'hao2005@gmail.com',
            phoneNumber: '0908706098',
            ethnicity: 'kinh',
            organization: 'ORG1',
            createDate: new Date()
        },
        patient: {
            citizenId: 'PATIENT-123456789198',
            guardianName: 'Nguyễn Văn Loan',
            guardianPhone: '0908706198',
            guardianAddress: 'Lệ Bắc, Duy Châu, Duy Xuyên, Quảng Nam',
            HICNumber: 'hs5123456789198'
        }
    },
    {
        user: {
            citizenId: 'PATIENT-123456789197',
            citizenNumber: '123456789197',
            birthDay: new Date('2001-06-07'),
            fullName: 'Đỗ Văn Xinh',
            gender: 'MALE',
            password: '',
            role: "PATIENT",
            address: "Đội 1, Duy Tân, Duy Xuyên, Quảng Nam",
            email: 'xinh2001@gmail.com',
            phoneNumber: '0908706097',
            ethnicity: 'kinh',
            organization: 'ORG1',
            createDate: new Date()
        },
        patient: {
            citizenId: 'PATIENT-123456789197',
            guardianName: 'Đỗ Văn Long',
            guardianPhone: '0908706197',
            guardianAddress: 'Đội 1, Duy Tân, Duy Xuyên, Quảng Nam',
            HICNumber: 'hs5123456789197'
        }
    },
    {
        user: {
            citizenId: 'PATIENT-123456789196',
            citizenNumber: '123456789196',
            birthDay: new Date('2001-06-08'),
            fullName: 'Trần Nguyễn Anh Trình',
            gender: 'MALE',
            password: '',
            role: "PATIENT",
            address: "Đội 1, Duy Thu, Duy Xuyên, Quảng Nam",
            email: 'trinh2001@gmail.com',
            phoneNumber: '0908706096',
            ethnicity: 'kinh',
            organization: 'ORG2',
            createDate: new Date()
        },
        patient: {
            citizenId: 'PATIENT-123456789196',
            guardianName: 'Trần Văn Tường',
            guardianPhone: '0908706196',
            guardianAddress: 'Đội 1, Duy Thu, Duy Xuyên, Quảng Nam',
            HICNumber: 'hs5123456789196'
        }
    },
    {
        user: {
            citizenId: 'PATIENT-123456789195',
            citizenNumber: '123456789195',
            birthDay: new Date('2001-06-08'),
            fullName: 'Nguyễn Văn Hòa',
            gender: 'MALE',
            password: '',
            role: "PATIENT",
            address: "Bàn Nam, Duy Châu, Duy Xuyên, Quảng Nam",
            email: 'hoa2001@gmail.com',
            phoneNumber: '0908706095',
            ethnicity: 'kinh',
            organization: 'ORG2',
            createDate: new Date()
        },
        patient: {
            citizenId: 'PATIENT-123456789195',
            guardianName: 'Nguyễn Thị Thu',
            guardianPhone: '0908706195',
            guardianAddress: 'Bàn Nam, Duy Châu, Duy Xuyên, Quảng Nam',
            HICNumber: 'hs5123456789195'
        }
    },
    {
        user: {
            citizenId: 'PATIENT-123456789194',
            citizenNumber: '123456789194',
            birthDay: new Date('2004-02-08'),
            fullName: 'Phan Trần Ngọc Khuê',
            gender: 'FEMALE',
            password: '',
            role: "PATIENT",
            address: "91/1 Cù Chính Lan, Hòa Khê, Thanh Khê, Đà Nẵng",
            email: 'khuê2004@gmail.com',
            phoneNumber: '0908706094',
            ethnicity: 'kinh',
            organization: 'ORG2',
            createDate: new Date()
        },
        patient: {
            citizenId: 'PATIENT-123456789194',
            guardianName: 'Trần Thị Xuân',
            guardianPhone: '0908706194',
            guardianAddress: '91/1 Cù Chính Lan, Hòa Khê, Thanh Khê, Đà Nẵng',
            HICNumber: 'hs5123456789194'
        }
    },
    {
        user: {
            citizenId: 'PATIENT-123456789193',
            citizenNumber: '123456789193',
            birthDay: new Date('2001-12-15'),
            fullName: 'Trần Thị Thùy Dương',
            gender: 'FEMALE',
            password: '',
            role: "PATIENT",
            address: "Phú nhuận 1, Duy Phú, Duy Xuyên, Quảng Nam",
            email: 'duong2001@gmail.com',
            phoneNumber: '0908706093',
            ethnicity: 'kinh',
            organization: 'ORG2',
            createDate: new Date()
        },
        patient: {
            citizenId: 'PATIENT-123456789193',
            guardianName: 'Trần Thị Xuân',
            guardianPhone: '0908706193',
            guardianAddress: 'Phú nhuận 1, Duy Phú, Duy Xuyên, Quảng Nam',
            HICNumber: 'hs5123456789193'
        }
    },
    {
        user: {
            citizenId: 'PATIENT-123456789192',
            citizenNumber: '123456789192',
            birthDay: new Date('2002-10-21'),
            fullName: 'Lê Thị Ngân Hà',
            gender: 'FEMALE',
            password: '',
            role: "PATIENT",
            address: "Tân Xuân, Cam Thành, Cam Lộ, Quảng Trị",
            email: 'ha2002@gmail.com',
            phoneNumber: '0908706092',
            ethnicity: 'kinh',
            organization: 'ORG2',
            createDate: new Date()
        },
        patient: {
            citizenId: 'PATIENT-123456789192',
            guardianName: 'Lê Văn Hùng',
            guardianPhone: '0908706192',
            guardianAddress: 'Tân Xuân, Cam Thành, Cam Lộ, Quảng Trị',
            HICNumber: 'hs5123456789192'
        }
    },
    {
        user: {
            citizenId: 'PATIENT-123456789191',
            citizenNumber: '123456789191',
            birthDay: new Date('2000-09-21'),
            fullName: 'Lê Thị Hồng Nhung',
            gender: 'FEMALE',
            password: '',
            role: "PATIENT",
            address: "91/2 Cù Chính Lan, Hòa Khê, Thanh Khê, Đà Nẵng",
            email: 'nhung2000@gmail.com',
            phoneNumber: '0908706091',
            ethnicity: 'kinh',
            organization: 'ORG2',
            createDate: new Date()
        },
        patient: {
            citizenId: 'PATIENT-123456789191',
            guardianName: 'Lê Văn Hưng',
            guardianPhone: '0908706191',
            guardianAddress: '91/2 Cù Chính Lan, Hòa Khê, Thanh Khê, Đà Nẵng',
            HICNumber: 'hs512345678991'
        }
    },
]
const doctors = [
    {
        user: {
            citizenId: 'DOCTOR-123456789101',
            citizenNumber: '123456789101',
            birthDay: new Date('1957-07-01'),
            fullName: 'Nguyễn Văn Bảy',
            gender: 'MALE',
            password: '',
            role: "DOCTOR",
            address: "Lệ Bắc, Duy Châu, Duy Xuyên, Quảng Nam",
            email: 'bay1957@gmail.com',
            phoneNumber: '0908706101',
            ethnicity: 'kinh',
            organization: 'ORG1',
            createDate: new Date()
        },
        doctor: {
            citizenId: 'DOCTOR-123456789101',
            hospital: "Vĩnh Đức",
            position: "Bác sĩ",
            specialty: "Tim mạch"
        }
    },
    {
        user: {
            citizenId: 'DOCTOR-123456789102',
            citizenNumber: '123456789102',
            birthDay: new Date('1960-08-09'),
            fullName: 'Nguyễn Thị Tuyết Liên',
            gender: 'FEMALE',
            password: '',
            role: "DOCTOR",
            address: "Lệ Bắc, Duy Châu, Duy Xuyên, Quảng Nam",
            email: 'lien1960@gmail.com',
            phoneNumber: '0908706102',
            ethnicity: 'kinh',
            organization: 'ORG1',
            createDate: new Date()
        },
        doctor: {
            citizenId: 'DOCTOR-123456789102',
            hospital: "Vĩnh Đức",
            position: "Bác sĩ",
            specialty: "Thần Kinh"
        }
    },
    {
        user: {
            citizenId: 'DOCTOR-123456789103',
            citizenNumber: '123456789103',
            birthDay: new Date('1960-07-01'),
            fullName: 'Nguyễn Văn Sơn',
            gender: 'MALE',
            password: '',
            role: "DOCTOR",
            address: "Thanh Châu, Duy Châu, Duy Xuyên, Quảng Nam",
            email: 'son1960@gmail.com',
            phoneNumber: '0908706103',
            ethnicity: 'kinh',
            organization: 'ORG1',
            createDate: new Date()
        },
        doctor: {
            citizenId: 'DOCTOR-123456789103',
            hospital: "Vĩnh Đức",
            position: "Bác sĩ",
            specialty: "Xương Khớp"
        }
    },
    {
        user: {
            citizenId: 'DOCTOR-123456789104',
            citizenNumber: '123456789104',
            birthDay: new Date('1960-08-09'),
            fullName: 'Nguyễn Thị Lâm',
            gender: 'FEMALE',
            password: '',
            role: "DOCTOR",
            address: "Thanh Châu, Duy Châu, Duy Xuyên, Quảng Nam",
            email: 'lam1960@gmail.com',
            phoneNumber: '0908706104',
            ethnicity: 'kinh',
            organization: 'ORG1',
            createDate: new Date()
        },
        doctor: {
            citizenId: 'DOCTOR-123456789104',
            hospital: "Vĩnh Đức",
            position: "Bác sĩ",
            specialty: "Tai Mũi Họng"
        }
    },
    {
        user: {
            citizenId: 'DOCTOR-123456789105',
            citizenNumber: '123456789105',
            birthDay: new Date('1957-07-11'),
            fullName: 'Nguyễn Văn Hát',
            gender: 'MALE',
            password: '',
            role: "DOCTOR",
            address: "Bàn Nam, Duy Châu, Duy Xuyên, Quảng Nam",
            email: 'hat1957@gmail.com',
            phoneNumber: '0908706105',
            ethnicity: 'kinh',
            organization: 'ORG2',
            createDate: new Date()
        },
        doctor: {
            citizenId: 'DOCTOR-123456789105',
            hospital: "Bình An",
            position: "Bác sĩ",
            specialty: "Tim mạch"
        }
    },
    {
        user: {
            citizenId: 'DOCTOR-123456789106',
            citizenNumber: '123456789106',
            birthDay: new Date('1960-08-09'),
            fullName: 'Lê Thị Sáu',
            gender: 'FEMALE',
            password: '',
            role: "DOCTOR",
            address: "Bàn Nam, Duy Châu, Duy Xuyên, Quảng Nam",
            email: 'sau1960@gmail.com',
            phoneNumber: '0908706106',
            ethnicity: 'kinh',
            organization: 'ORG2',
            createDate: new Date()
        },
        doctor: {
            citizenId: 'DOCTOR-123456789106',
            hospital: "Bình An",
            position: "Bác sĩ",
            specialty: "Thần Kinh"
        }
    },

]

export const initData = async () => {
    try {
        const totalUser = await prisma.user.count({
        })

        if(totalUser !== 0)
        {
            return ;
        }
        console.log('init data');
        await prisma.user.create({
            data: {
                citizenId: 'ADMIN-adminOrg2',
                citizenNumber: 'adminOrg2',
                birthDay: new Date('1982-04-01'),
                fullName: 'Trương Thị Thủy',
                gender: 'FEMALE',
                password: 'adminpw',
                role: "ADMIN",
                address: "Lệ Bắc, Duy Châu, Duy Xuyên, Quảng Nam",
                email: 'thuy@gmail.com',
                phoneNumber: '0908706012',
                ethnicity: 'kinh',
                organization: 'ORG2'
            }
        })
        await prisma.user.create({
            data: {
                citizenId: 'ADMIN-adminOrg1',
                citizenNumber: 'adminOrg1',
                birthDay: new Date('1980-09-19'),
                fullName: 'Nguyễn Văn Loan',
                gender: 'MALE',
                password: 'adminpw',
                role: "ADMIN",
                address: "Lệ Bắc, Duy Châu, Duy Xuyên, Quảng Nam",
                email: 'loan@gmail.com',
                phoneNumber: '0908706011',
                ethnicity: 'kinh',
                organization: 'ORG1'
            }
        })
        patients.map(async (element) => {
            if (element.user.organization === 'ORG1') {
                await userServices.createPatientService(element.user, element.patient);
            } else if (element.user.organization === 'ORG2') {
                await userServices.createPatientService(element.user, element.patient);
            }
        })

        doctors.map(async (element) => {
            if (element.user.organization === 'ORG1') {
                await userServices.createDoctorService(element.user, element.doctor);
            } else if (element.user.organization === 'ORG2') {
                await userServices.createDoctorService(element.user, element.doctor);
            }
        })

        const grpcClient1 = await grpcConnectionOrg1;
        const newX509IdentityAdminOrg1 = await enrollIdentity(caClientOrg1?.caClient, caClientOrg1?.mspOrg, 'ADMIN-adminOrg1', 'adminpw');
        await userServices.updateUserService('ADMIN-adminOrg1', {
            x509Identity: JSON.stringify(newX509IdentityAdminOrg1)
        });

        const grpcClient2 = await grpcConnectionOrg2;
        const newX509IdentityAdminOrg2 = await enrollIdentity(caClientOrg2?.caClient, caClientOrg2?.mspOrg, 'ADMIN-adminOrg2', 'adminpw');
        await userServices.updateUserService('ADMIN-adminOrg2', {
            x509Identity: JSON.stringify(newX509IdentityAdminOrg2)
        });
        
        
        patients.map(async (element) => {
            if (element.user.organization === 'ORG1') {
                await registerIdentity(caClientOrg1?.caClient, newX509IdentityAdminOrg1, caClientOrg1?.mspOrg, 'ADMIN-adminOrg1', element.user.citizenId, element.user.citizenNumber, 'PATIENT', caClientOrg1?.affiliation);
            } else if (element.user.organization === 'ORG2') {
                await registerIdentity(caClientOrg2?.caClient, newX509IdentityAdminOrg2, caClientOrg2?.mspOrg, 'ADMIN-adminOrg2', element.user.citizenId, element.user.citizenNumber, 'PATIENT', caClientOrg2?.affiliation);
            }
        })
        
        doctors.map(async (element) => {
            if (element.user.organization === 'ORG1') { 
                await registerIdentity(caClientOrg1?.caClient, newX509IdentityAdminOrg1, caClientOrg1?.mspOrg, 'ADMIN-adminOrg1', element.user.citizenId, element.user.citizenNumber, 'DOCTOR', caClientOrg1?.affiliation);
            } else if (element.user.organization === 'ORG2') {
                await registerIdentity(caClientOrg2?.caClient, newX509IdentityAdminOrg2, caClientOrg2?.mspOrg, 'ADMIN-adminOrg2', element.user.citizenId, element.user.citizenNumber, 'DOCTOR', caClientOrg2?.affiliation);
            }
        })
        
        
        patients.map(async (element) => {
            if (element.user.organization === 'ORG1') {
                await ledgerService.createPRLedgerService(grpcClient1, 'ADMIN-adminOrg1', element.user.citizenId);
            } else if (element.user.organization === 'ORG2') {
                await ledgerService.createPRLedgerService(grpcClient2, 'ADMIN-adminOrg2', element.user.citizenId);
            }
        })

        for (const doctor of doctors) {
            patients.map(async (patient) => {
                await userServices.requestAccessService(doctor.user.citizenId, patient.user.citizenId);
            })
        };
        console.log('completed init data');
    } catch (error) {
        console.log(error);
    }
}
