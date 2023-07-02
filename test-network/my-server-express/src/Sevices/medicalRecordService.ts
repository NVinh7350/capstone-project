import { MedicalRecord, Medicine, PrismaClient, Treatment } from "@prisma/client";
import { grpcConnectionOrg1 } from "../Config/configConnection";
const prisma = new PrismaClient();
const createMRService = async (mr: MedicalRecord , treatments : Treatment[]) => {
    try {   
        await prisma.$transaction([
            prisma.medicalRecord.create({
                data: {
                    ...mr
                }
            }),
            ...treatments.map((treatment: any) => (
                prisma.treatment.create({
                    data: {
                        ...treatment,
                        medicines: {
                            createMany: {
                                data:  [ ...treatment.medicines?.map((medicine: Medicine) => ({
                                        ...medicine
                                }))]
                            }
                        }
                    }
                })
            ))
    ])
    } catch (error) {
        throw error;
    }
}

const updateMRService = async (treatments: any[] ) => {
    try {   
        prisma.$transaction([
            ...treatments.map((treatment: any) => (
                prisma.treatment.create({
                    data: {
                        ...treatment,
                        medicines: {
                            createMany: {
                                data:  [ ...treatment.medicines?.map((medicine: Medicine) => ({
                                        ...medicine
                                }))]
                            }
                        }
                    }
                })
            ))
        ])
    } catch (error) {
        console.log(error)
        throw error;
    }
}

// const allowEditingService = async (MRId: string,doctorId: string) => {
//     try {
//         const allowEditing = await prisma.medicalRecord.findMany({
//             where: {
//                 AND : {
//                     MRId: MRId,
//                     status: 'CREATING',
//                     doctorId: doctorId
//                 }
//             }
//         }) 
//         if(allowEditing.length >0){
//             return true
//         }
//         return false;
//     } catch (error) {
//         throw error;
//     }
// }

const completedMRService = async (mr: MedicalRecord) => {
    try {
            await prisma.medicalRecord.update({
                data: {
                    status: 'COMPLETED',
                    finishTime: mr.finishTime
                },
                where: {
                    MRId: mr.MRId
                }
            })

    } catch (error) {
        throw error;
    }
}

const getDetailMRService = async (MRId : string) => {
    try {
        const medicalRecord = await prisma.medicalRecord.findUnique({
            where: {
                MRId: MRId
            }
        })


        const treatments = await prisma.treatment.findMany({
            where: {
                MRId: MRId
            },
            select: {
                diseaseProgression: true,
                treatmentTime: true,
                medicines: {
                    select: {
                        medicineName: true,
                        drugDosage: true,
                        drugFrequency: true,
                        totalDay: true,
                        specify: true
                    },
                    orderBy: {
                        medicineId: 'asc'
                    }
                },
                MRId: true,
            },
            orderBy: {
                treatmentId: 'asc'
            }
        })

        return {
            medicalRecord, 
            treatments
        }
    } catch (error) {
        throw error
    }
}

const getMRListService = async (patientId: string) => {
    try {
        const MRList = await prisma.medicalRecord.findMany({
            select:{
                creator: {
                    select: {
                        citizenId: true,
                        user: {
                            select: {
                                fullName : true,
                                citizenNumber: true
                            }
                        },
                        hospital: true,
                        position: true,
                        specialty: true
                    }
                },
                comeTime: true,
                prognosis: true,
                diagnosis: true,
                status: true,
                finishTime: true,
                MRId: true,
                majorReason:true
            }
            ,where: {
                patientId: patientId
            }
        })
        return MRList;
    } catch (error) {
        throw error;
    }
}
const checkAccessMRService = async (MRId: string, citizenId: string) => {
    try{
        const checkAccess = await prisma.medicalRecord.findMany({
            where: {
                OR: [{
                    patientId: citizenId
                },
                {
                    owner: {
                        accessList: {
                            some: {
                                doctorId: citizenId
                            }
                        }
                    }
                }
            ]
            }
        })
        if(checkAccess.length > 0) {
            return true;
        }
        return false;
    } catch(error) {
        throw error
    }
}

export const testMR = async () => {
    try {
        await grpcConnectionOrg1;
    } catch (error) {
        throw error;
    }
}

export const medicalRecordServices = {
    createMRService,
    updateMRService,
    completedMRService,
    getDetailMRService,
    getMRListService
}

