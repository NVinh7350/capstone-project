import { PrismaClient, User, Patient, Doctor } from '@prisma/client'
import * as grpc from '@grpc/grpc-js';
import { ledgerService } from './ledgerServices';
import { prisma } from '../Config/configConnection';

const createUserService = async (user: User) => {
    try {
        await prisma.user.create({
                data : user
            })
    } catch (error) {
        if(error instanceof Error) {
            throw error;
        }
    }
}

const getUserService = async (citizenId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                citizenId: citizenId
            },
            select: {
                patient: {
                    select: {
                        accessList: {
                            select: {
                                doctorId: true
                            }
                        },
                        accessRequestList: {
                            select: {
                                doctorId: true
                            }
                        },
                        guardianAddress: true,
                        guardianName: true,
                        guardianPhone: true,
                        HICNumber: true

                    }
                },
                doctor: {
                    select: {
                        accessList: {
                            select: {
                                patientId: true
                            }
                        },
                        accessRequestList: {
                            select: {
                                patientId: true
                            }
                        },
                        hospital: true,
                        position: true,
                        specialty: true
                    }
                },
                address: true,
                birthDay: true,
                citizenId: true,
                citizenNumber: true,
                email: true,
                ethnicity: true,
                fullName: true,
                gender: true,
                organization: true,
                phoneNumber: true,
                role: true,
                refreshToken: true,
                avatar: true
            }
        })        
        return user;
    } catch (error) {
        throw error;
    }
} 

const getUserListService = async (page: number) => {
    try {
        const user = await prisma.user.findMany({
            where: {
                role: {
                    not : 'ADMIN'
                }
            },
            select: {
                address: true,
                birthDay: true,
                citizenId: true,
                citizenNumber: true,
                email: true,
                ethnicity: true,
                fullName: true,
                gender: true,
                organization: true,
                phoneNumber: true,
                role: true,
                createDate: true,
                avatar: true
            },
            orderBy: {
                createDate : 'desc'
            },
            
            
        })        
        return user;
    } catch (error) {
        throw error;
    }
} 
const getUserListBySearchService = async (searchContent: any) => {
    try {
        const user = await prisma.user.findMany({
            where: {
                OR : [
                    {
                        citizenId: searchContent
                    },
                    {
                        fullName: {
                            contains: searchContent
                        }
                    },
                    {
                        citizenNumber: {
                            contains: searchContent
                        }
                    }
                ]
            },
            select: {
                address: true,
                birthDay: true,
                citizenId: true,
                citizenNumber: true,
                email: true,
                ethnicity: true,
                fullName: true,
                gender: true,
                organization: true,
                phoneNumber: true,
                role: true,
                createDate: true,
                avatar: true
            },
            orderBy: {
                createDate : 'desc'
            }
        })        
        return user;
    } catch (error) {
        throw error;
    }
} 

const updateUserService = async (citizenId:string , user: any) => {
    try {
        await prisma.user.update({
            where: {
                citizenId : citizenId
            },
            data: {
                ...user
            }
        })
    }catch (error) {
        throw error
    }
}

const getX509IdentityService = async (citizenIds:string) => {
    try {
        const result = await prisma.user.findUnique({
            where: {
                citizenId : citizenIds
            }
        })
        if(result?.x509Identity)
            return JSON.parse(result.x509Identity);
        else {
            throw new Error('X509Identity is empty');
        }
    } catch (error) {
        throw error;
    }
}

const insertX509IdentityService = async (citizenId: string, x509Identity : string) => {
    try {
        await prisma.user.update({
            data: {
                x509Identity : x509Identity
            },
            where: {
                citizenId: citizenId
            }
        })
        return true;
    } catch (error) {
        throw error;
    }
}

const deleteX509IdentityService = async (citizenIds:string) => {
    try {
        await prisma.user.delete({
            where: {
                citizenId : citizenIds
            }
        })
        return true;
    } catch (error) {
        throw error;
    }
}

const createPatientService = async (user: any, patient: Patient) => {
    try {
        await prisma.$transaction([
            prisma.user.create({
                data : user,
            }),
            prisma.patient.create({
                data : {
                    citizenId: user.citizenId,
                    guardianAddress: patient.guardianAddress,
                    guardianName: patient.guardianName,
                    guardianPhone: patient.guardianPhone,
                    HICNumber: patient.HICNumber
                }
            })
        ])
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const deletePatientService = async (citizenId: string) => {
    try {
        await prisma.user.delete({
            where: {
                citizenId: citizenId
            }
        })
    } catch (error) {
        console.log('error');
        console.log(error);
    }
}

const getPatientListService =async (page: number) => {
    try {
        const result = await prisma.patient.findMany({
            select : {
                citizenId: true,
                user : {
                    select : {
                        fullName: true,
                        birthDay: true,
                        gender: true,
                        ethnicity: true,
                        role: true,
                        citizenNumber: true,
                        avatar: true
                    }
                }
            }, 
            
            
        })
        return result
    } catch (error) {
        throw error;
    }
} 

const getRequestedListService = async (doctorId : string ,page: number) => {
    try{
        const result = await prisma.accessRequest.findMany({
            select: {
                patient: {
                    select: {
                        citizenId: true,
                        HICNumber: true,
                        user: {
                            select: {
                                fullName: true,
                                birthDay: true,
                                address: true,
                                gender: true,
                                citizenNumber: true,
                                avatar: true
                            }
                        }
                    }
                },
                requestTime: true
            }, where: {
                doctorId: doctorId
            },
            
            
        })
        return result;
    } catch (error) {
        throw error
    }
}

const getAuthorizedAccessListService = async (doctorId : string ,page: number) => {
    try{
        const result = await prisma.access.findMany({
            select: {
                patient: {
                    select: {
                        citizenId: true,
                        HICNumber: true,
                        user: {
                            select: {
                                fullName: true,
                                address: true,
                                birthDay: true,
                                email: true,
                                citizenNumber : true,
                                avatar: true,
                                gender:true
                            }
                        }
                    }
                }
            },
            where: {
                doctorId: doctorId
            },
            
            
        })
        return result;
    } catch (error) {
        throw error
    }
}
const findPatientService = async (searchContent: string) => {
    try {
        const result = await prisma.patient.findMany({
            where : {
                OR : [
                    {
                        citizenId: {
                            contains: searchContent
                        }
                    },
                    {
                        user: {
                            fullName: {
                                contains: searchContent
                            }
                        }
                    },
                    {
                        user: {
                            citizenNumber: {
                                contains: searchContent
                            }
                        }
                    }
                ]
            },
            select : {
                accessRequestList : true,
                accessList: true,
                citizenId: true,
                HICNumber: true,
                user: {
                    select: {
                        fullName: true,
                        address: true,
                        birthDay: true,
                        gender: true,
                        citizenNumber : true,
                        avatar: true
                    }
                }
            }
        })
        return result;
    } catch (error) {
        throw error;
    }
}

const getPatientByIdService =async (patientId : string, doctorId: string) => {
    try {
        let access = await prisma.patient.findMany({
            where: {
                accessList : {
                    some : {
                        doctorId : doctorId
                    }
                }
            }
        })
        if(access.length > 0) {
            return await prisma.patient.findMany({
                select : {
                    citizenId: true,
                    guardianAddress: true,
                    guardianName: true,
                    guardianPhone: true,
                    HICNumber: true,
                    user : {
                        select : {
                            fullName: true,
                            phoneNumber: true,
                            email: true,
                            address: true,
                            birthDay: true,
                            gender: true,
                            ethnicity: true,
                            citizenNumber : true,
                            avatar: true
                        }
                    },
                    MROwned: {
                        select: {
                            MRId: true,
                            comeTime: true,
                            status: true,
                            finishTime: true,
                            creator: {
                                select : {
                                    user: {
                                        select: {
                                            fullName:true
                                        }
                                    },
                                    position: true,
                                    specialty: true,
                                    hospital: true                        
                                }    
                            }
                        }
                    }
                }, 
                where : {
                    citizenId: patientId,
                    accessList: {
                        some: {
                            doctorId : doctorId
                        }
                    }
                }
            })
        } else {
            return await prisma.patient.findUnique({
                select: {
                    citizenId: true,
                    user: {
                        select: {
                            fullName : true,
                            birthDay : true,
                            address : true,
                            gender : true,
                            citizenNumber : true
                        }
                    }
                },
                where: {
                    citizenId : patientId
                }
            })
        }
    } catch (error) {
        throw error;
    }
} 

const updateAdminInfoService = async (admin : User) => {
    try {
        await prisma.user.update({
            where: {
                citizenId : admin.citizenId
            },
            data: {
                ...admin
            }
        })
    } catch (error) {
        throw error
    }
}

const updatePatientInfoService = async (user: User, patient: Patient) => {
    try {
        await prisma.$transaction([
            prisma.user.update({
                data: {
                    ...user,
                    role: undefined,
                },
                where: {
                    citizenId: user.citizenId
                }
            }),
            prisma.patient.update({
                data : {
                    ...patient,
                    accessList: undefined,
                    MROwned: undefined,
                    accessRequestList: undefined
                },

                where: {
                    citizenId: user.citizenId
                }
            })
        ])
        
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const createDoctorService = async (user: any, doctor: Doctor) => {
    try {
        await prisma.$transaction([
            prisma.user.create({
                data : user,
            }),
            prisma.doctor.create({
                data : {
                    citizenId: user.citizenId,
                    hospital: doctor.hospital,
                    position: doctor.position,
                    specialty: doctor.specialty
                }
            })
        ])
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const getDoctorListService =async (page: number) => {
    try {
        const result = await prisma.doctor.findMany({
            select : {
                hospital: true,
                citizenId: true,
                position: true,
                specialty: true,
                user : {
                    select : {
                        fullName: true,
                        phoneNumber: true,
                        email: true,
                        address: true,
                        birthDay: true,
                        gender: true,
                        ethnicity: true,
                        role: true,
                        avatar: true
                    }
                }
            }, 
            
            
        })
        return result
    } catch (error) {
        return error;
    }
} 

const getRequestDoctorListService = async (patientId : string ,page: number) => {
    try{
        const result = await prisma.accessRequest.findMany({
            select: {
                doctor: {
                    select: {
                        hospital: true,
                        specialty: true,
                        position: true,
                        citizenId: true,
                        user: {
                            select: {
                                fullName: true,
                                gender: true,
                                birthDay: true,
                                address: true,
                                avatar: true,
                                citizenNumber: true
                            }
                        }
                    }
                },
                requestTime: true
            }, where: {
                patientId: patientId
            },
            
            
        })
        return result;
    } catch (error) {
        throw error
    }
}

const getAccessibleDoctorListService = async (patientId : string ,page: number) => {
    try{
        const result = await prisma.access.findMany({
            select: {
                doctor: {
                    select: {
                        citizenId: true,
                        hospital: true,
                        position: true,
                        specialty: true,
                        user: {
                            select: {
                                fullName: true,
                                birthDay: true,
                                address: true,
                                email: true,
                                gender: true,
                                phoneNumber: true,
                                avatar: true,
                                citizenNumber: true
                                
                            }
                        }
                    }
                }
            }, where: {
                patientId: patientId
            },
            
            
        })
        return result;
    } catch (error) {
        throw error
    }
}

const getDoctorByIdService =async (doctorId: string) => {
    try {
        const result = await prisma.doctor.findUnique({
            select : {
                hospital: true,
                citizenId: true,
                position: true,
                specialty: true,
                user : {
                    select : {
                        fullName: true,
                        phoneNumber: true,
                        email: true,
                        address: true,
                        birthDay: true,
                        gender: true,
                        ethnicity: true,
                        role: true,
                        citizenNumber : true,
                        avatar: true
                    }
                }
            }, 
            where : {
                citizenId: doctorId
            }
        })
        return result
    } catch (error) {
        return error;
    }
} 

const updateDoctorInfoService = async (user: User, doctor: Doctor) => {
    try {
        await prisma.$transaction([
            prisma.user.update({
                data: {
                    ...user,
                    role: undefined
                },
                where: {
                    citizenId: user.citizenId
                }
            }),
            prisma.doctor.update({
                data : doctor,
                where: {
                    citizenId: user.citizenId
                }
            })
        ])
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const requestAccessService = async (doctorId: string, patientId: string) => {
    try {
        await prisma.$transaction([
            prisma.accessRequest.create({
                data: {
                    status: 'PENDING',
                    doctorId: doctorId,
                    patientId: patientId,
                    requestTime: new Date()
                }
            })
        ])
    } catch (error) {
        throw error;
    }
}

const refuseRequestService = async (doctorId: string, patientId: string) => {
    try {
        await prisma.accessRequest.delete({
            where: {
                doctorId_patientId: {
                    doctorId: doctorId,
                    patientId: patientId
                }
            }
        })
    } catch (error) {
        throw error;
    }
}

const grantAccessService = async (doctorId: string, patientId: string) => {
    try {
        await prisma.$transaction([
            prisma.access.create({
                data: {
                    doctorId: doctorId,
                    patientId: patientId,
                    requestTime: new Date()
                }
            }),
            
            prisma.accessRequest.delete({
                where: {
                    doctorId_patientId: {
                        doctorId: doctorId,
                        patientId: patientId
                    }
                }
            })
        ])
    } catch (error) {
        throw error;
    }
}

const revokeAccessService = async (doctorId: string, patientId: string) => {
    try {
        await prisma.access.delete({
                where: {
                    doctorId_patientId: {
                        doctorId: doctorId,
                        patientId: patientId
                    }
                }
            })
    } catch (error) {
        throw error;
    }
}

const checkAccess =async (doctorId: string, patientId: string) => {
    try {
        const check = await prisma.access.findUnique({
            where: {
                doctorId_patientId : {
                    doctorId: doctorId,
                    patientId: patientId
                }
            }
        })
        return check;
    } catch (error) {
        throw error
    }
}

export const userServices = {
    createDoctorService,
    createPatientService,
    deletePatientService,
    createUserService,
    deleteX509IdentityService,
    getDoctorByIdService,
    getDoctorListService,
    getPatientByIdService,
    getPatientListService,
    getX509IdentityService,
    insertX509IdentityService,
    updateDoctorInfoService,
    updatePatientInfoService,
    getAccessibleDoctorListService,
    grantAccessService,
    revokeAccessService,
    refuseRequestService,
    requestAccessService,
    getRequestDoctorListService,
    getAuthorizedAccessListService,
    getRequestedListService,
    checkAccess,
    getUserService,
    updateUserService,
    getUserListService,
    getUserListBySearchService,
    updateAdminInfoService,
    findPatientService
}