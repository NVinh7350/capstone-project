import { Context, Contract } from "fabric-contract-api";
import { PatientRecord } from "./patientRecord";
export declare class PatientRecordTransferContract extends Contract {
    InitLedger(ctx: Context): Promise<void>;
    createPatientRecord(ctx: Context, patientId: string): Promise<string>;
    grantAccess(ctx: Context, doctorId: string): Promise<string>;
    revokeAccess(ctx: Context, doctorId: string): Promise<string>;
    createMedicalRecord(ctx: Context, patientId: string, medicalRecordId: string, medicalRecordHashValue: string): Promise<string>;
    updateMedicalRecord(ctx: Context, patientId: string, medicalRecordId: string, medicalRecordHashValue: string): Promise<string>;
    finishMedicalRecord(ctx: Context, patientId: string, medicalRecordId: string, medicalRecordHashValue: string): Promise<string>;
    readPatientRecord(ctx: Context, patientId: string): Promise<string>;
    checkAccessDoctor(ctx: Context, doctorId: string, patientId: string): Promise<boolean>;
    readMedicalRecord(ctx: Context, MRId: string, patientId: string): Promise<string>;
    getPatientRecord(ctx: Context, patientId: string): Promise<PatientRecord>;
    PatientRecordExists(ctx: Context, patientId: string): Promise<boolean>;
    deletePatientRecord(ctx: Context, patientId: string): Promise<boolean>;
}
