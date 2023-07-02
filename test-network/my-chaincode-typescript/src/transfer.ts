import { Context, Contract, Info, Returns, Transaction } from "fabric-contract-api";
import stringify from "json-stringify-deterministic";
import sortKeysRecursive from "sort-keys-recursive";
import { PatientRecord } from "./patientRecord";
import { MedicalRecord } from "./medicalRecord";

@Info({ title: "PatientRecordTransfer", description: "Smart contract for trading patient record" })
export class PatientRecordTransferContract extends Contract {

    @Transaction()
    public async InitLedger(ctx: Context): Promise<void> {
        const patientRecords: PatientRecord[] = [
            {
                "patientId": "init ledger",
                "accessDoctorList": ["init ledger"],
                "medicalRecordList": [{
                    "medicalRecordId": "init medical record",
                    "patientId": "string",
                    "doctorCreator": "string",
                    "medicalRecordHashData": "string",
                    "medicalRecordStatus": "string",
                    "medicalRecordUpdateTime": ctx.stub.getTxTimestamp().nanos
                }]
            }
        ];
        for (const patientRecord of patientRecords) {
            await ctx.stub.putState(patientRecord.patientId, Buffer.from(stringify(sortKeysRecursive(patientRecord))));
            console.info(`patientRecord ${patientRecord.patientId} initialized`);
        }
    }
    
    @Transaction()
    @Returns("string")
    public async createPatientRecord (ctx: Context, patientId: string) {
        try {
            // Kiểm tra quyền truy cập admin
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            if(userRole == "ADMIN"){
                throw new Error(`Only admin have the right to create medical records`);
            }
            // Kiểm tra patient record đã tồn tại hay chưa
            const exists = await this.PatientRecordExists(ctx, patientId);
            if(exists) {
                throw new Error(`The patient record ${patientId} does exist`);
            }
            // Tạo mới một patient record sau khi đã đủ các điều kiện
            const newPatientRecord : PatientRecord = {
                patientId: patientId,
                accessDoctorList: [],
                medicalRecordList: []
            }
            // Thêm mới patient record vào sổ cái
            await ctx.stub.putState(patientId, Buffer.from(stringify(sortKeysRecursive(newPatientRecord))));
            return `${JSON.stringify(newPatientRecord)}`;
        } catch (error) {
            throw error;
        }
    }

    @Transaction()
    @Returns("string")
    public async grantAccess (ctx: Context, doctorId: string) {
        try {
            const clientIdentity = ctx.clientIdentity.getAttributeValue("hf.EnrollmentID");
            // Kiểm tra quyền truy cập patient
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            if(userRole != "PATIENT"){
                throw new Error(`Only patient have the right to grant access`);
            }
            
            const patientRecord : PatientRecord = await this.getPatientRecord(ctx, clientIdentity);
            const currentAccessList = patientRecord.accessDoctorList;
            // Kiểm tra doctor đã có quyền try cập trước đó hay chưa
            const checkDoctor = currentAccessList.some(dt => dt === doctorId);
            if(checkDoctor){
                throw new Error(`The doctor ${doctorId} has been granted access before`);
            }
            // cấp quyền cho doctor sau khi đã đủ các điều kiện
            currentAccessList.push(doctorId);
            const updatePatientRecord = {
                ...patientRecord,
                accessDoctorList :currentAccessList
            };
            // Cập nhật lại patient record vào sổ cái
            await ctx.stub.putState(clientIdentity, Buffer.from(stringify(sortKeysRecursive(updatePatientRecord))));
            return `${JSON.stringify(updatePatientRecord)}`;
        } catch (error) {
            throw error;
        }
    }

    @Transaction()
    @Returns("string")
    public async revokeAccess (ctx: Context, doctorId: string) {
        try {
            const clientIdentity = ctx.clientIdentity.getAttributeValue("hf.EnrollmentID");
            // Kiểm tra quyền truy cập patient
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            if(userRole != "PATIENT"){
                throw new Error(`Only patients have the right to revoke access`);
            }
            const patientRecord : PatientRecord = await this.getPatientRecord(ctx, clientIdentity);
            
            // Kiểm tra doctor đã có quyền try cập trước đó hay chưa
            const checkAccessDoctorList = patientRecord.accessDoctorList.some((dt: string) => dt === doctorId);
            if(!checkAccessDoctorList){
                throw new Error(`The doctor ${doctorId} has not been granted access before`);
            }
            // Kiểm tra doctor này đang có bệnh án nào chưa hoàn thành không
            const checkMedicalRecordList = patientRecord.medicalRecordList.some((medicalRecord: MedicalRecord) => {
                return medicalRecord.doctorCreator === doctorId && medicalRecord.medicalRecordStatus === "CREATING"
            });
            if(checkMedicalRecordList) {
                throw new Error(`The doctor ${doctorId} has an unfinished medical record`);
            }
            // Thu hồi quyền truy cập sau khi đã kiểm tra các điều kiện
            const updatePatientRecord = {
                ...patientRecord,
                accessDoctorList : patientRecord.accessDoctorList.filter(dt => dt !== doctorId)
            };
            // Cập nhật lại patient record vào sổ cái
            await ctx.stub.putState(clientIdentity, Buffer.from(stringify(sortKeysRecursive(updatePatientRecord))));
            return `${JSON.stringify(updatePatientRecord)}`;
        } catch (error) {
            throw error;
        }
    }

    @Transaction()
    @Returns("string")
    public async createMedicalRecord (ctx: Context, patientId: string, medicalRecordId: string, medicalRecordHashValue: string){
        try {
            const clientIdentity = ctx.clientIdentity.getAttributeValue("hf.EnrollmentID");
            // Kiểm tra quyền truy cập Doctor
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            if(userRole != "DOCTOR"){
                throw new Error(`Only doctors have the right to update medical records`);
            }
            const patientRecord : PatientRecord = await this.getPatientRecord(ctx, patientId);
            const currentMedicalRecord = patientRecord.medicalRecordList;
            // Kiểm tra quyền truy cập vào patient record này
            const checkAccessDoctorList = patientRecord.accessDoctorList.some((dt: string) => dt === clientIdentity);
            if(!checkAccessDoctorList){
                throw new Error(`You must request access to patient records ${patientId} before creating`);
            }
            // Kiểm tra medical record đã tồn tại hay chưa
            const checkMedicalRecord = currentMedicalRecord.find((medicalRecord : MedicalRecord) => medicalRecord.medicalRecordId === medicalRecordId) 
            if(checkMedicalRecord) {
                throw new Error (`The medical record ${medicalRecordId} was created before`);
            }
            // Tạo một medical record mới khi đã đủ điều kiện
            const newMedicalRecord : MedicalRecord = {
                doctorCreator: clientIdentity,
                medicalRecordId: medicalRecordId,
                medicalRecordUpdateTime: ctx.stub.getTxTimestamp().nanos,
                medicalRecordHashData: medicalRecordHashValue,
                patientId: patientId,
                medicalRecordStatus: "CREATING"
            }
            // Thêm medical record vào medical record list của patient record
            currentMedicalRecord.push(newMedicalRecord);
            const updatePatientRecord = {
                ...patientRecord,
                medicalRecordList : currentMedicalRecord
            }
            
            // Cập nhật patient record vào sổ cái
            await ctx.stub.putState(patientId, Buffer.from(stringify(sortKeysRecursive(updatePatientRecord))));
            return `${JSON.stringify(updatePatientRecord)}`;
        } catch (error) {
            throw error;
        }
    }

    @Transaction()
    @Returns("string")
    public async updateMedicalRecord (ctx: Context, patientId: string, medicalRecordId: string, medicalRecordHashValue: string) {
        try {
            const clientIdentity = ctx.clientIdentity.getAttributeValue("hf.EnrollmentID");
            // kiểm tra quyền truy cập Doctor
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            if(userRole != "DOCTOR"){
                throw new Error(`Only doctors have the right to update medical records`);
            }
            const patientRecord : PatientRecord = await this.getPatientRecord(ctx, patientId);
            // Kiểm tra quyền truy cập vào Patient record
            const checkAccessDoctorList = patientRecord.accessDoctorList.some((dt: string) => dt === clientIdentity);
            if(!checkAccessDoctorList){
                throw new Error(`You must request access to patient records ${patientId} before creating`);
            }
            // Biến checked dùng để kiểm tra medical record có tồn tại trong patient record trước đó chưa
            let checked = false;
            const updateMedicalRecord = patientRecord.medicalRecordList.map((medicalRecord: MedicalRecord) => {
                if(medicalRecord.medicalRecordId === medicalRecordId){
                    // Kiểm tra bác sĩ này có phải là người đã tạo bệnh án không
                    const checkDoctorCreator = medicalRecord.doctorCreator === clientIdentity;
                    if(!checkDoctorCreator){
                        throw new Error(`You are not the creator of medical record ${medicalRecordId}, so you will not have the right to update`);
                    }
                    // Kiểm tra bệnh án đã hoàn thành chưa
                    const checkFinish = medicalRecord.medicalRecordStatus === "CREATING";
                    if(!checkFinish){
                        throw new Error(`Completed medical record ${medicalRecordId}, no editing rights`);
                    }
                    // Kiểm tra dữ liệu bệnh án có gì thay đổi không
                    const checkMedicalRecordHashValue = medicalRecord.medicalRecordHashData === medicalRecordHashValue;
                    if(checkMedicalRecordHashValue) {
                        throw new Error(`Medical record data ${medicalRecordId} has not changed, so it will not be updated`);
                    }
                    // nếu bệnh án có tồn tại trong danh sách bệnh án của bệnh nhân thì checked bằng true
                    checked = true;
                    // trả về một bệnh án được cập nhật sau khi hoàn thành các bước kiểm tra 
                    return {
                        ...medicalRecord,
                        medicalRecordUpdateTime: ctx.stub.getTxTimestamp().nanos,
                        medicalRecordHashData: medicalRecordHashValue
                    }
                } else {
                    return medicalRecord;
                }
            })
            // kiểm tra bệnh án có tồn tại trong danh sách bệnh án của bệnh nhânh không
            if(!checked){
                throw new Error(`Medical record  ${medicalRecordId} does not exist`);
            }
            // Cập nhật lại patient record
            const updatePatientRecord = {
                ...patientRecord,
                medicalRecordList: updateMedicalRecord
            }
            // Cập nhật patient record vào sổ cái
            await ctx.stub.putState(patientId, Buffer.from(stringify(sortKeysRecursive(updatePatientRecord))));
            return `${JSON.stringify(updatePatientRecord)}`;
        } catch (error) {
            throw error;
        }
    }

    @Transaction()
    @Returns("string")
    public async finishMedicalRecord (ctx: Context, patientId: string, medicalRecordId: string, medicalRecordHashValue: string) {
        try {
            const clientIdentity = ctx.clientIdentity.getAttributeValue("hf.EnrollmentID");
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            if(userRole != "DOCTOR"){
                throw new Error(`Only doctors have the right to finish medical records`);
            }
            const patientRecord : PatientRecord = await this.getPatientRecord(ctx, patientId);
            const checkAccessDoctorList = patientRecord.accessDoctorList.some((dt: string) => dt === clientIdentity);
            if(!checkAccessDoctorList){
                throw new Error(`You must request access to patient records ${patientId} before creating`);
            }

            let checked = false;
            const updateMedicalRecord = patientRecord.medicalRecordList.map((medicalRecord: MedicalRecord) => {
                if(medicalRecord.medicalRecordId === medicalRecordId){
                    // Kiểm tra bác sĩ này có phải là người đã tạo bệnh án không
                    const checkDoctorCreator = medicalRecord.doctorCreator === clientIdentity;
                    if(!checkDoctorCreator){
                        throw new Error(`You are not the creator of medical record ${medicalRecordId}, so you will not have the right to finish`);
                    }
                    // Kiểm tra bệnh án đã hoàn thành chưa
                    const checkFinish = medicalRecord.medicalRecordStatus === "CREATING";
                    if(!checkFinish){
                        throw new Error(`The medical record ${medicalRecordId} has completed`);
                    }
                    // Kiểm tra dữ liệu bệnh án có gì thay đổi không
                    const checkMedicalRecordHashValue = medicalRecord.medicalRecordHashData === medicalRecordHashValue;
                    if(checkMedicalRecordHashValue) {
                        throw new Error(`Medical record data ${medicalRecordId} has not changed, so it will not be updated`);
                    }
                    // nếu bệnh án có tồn tại trong danh sách bệnh án của bệnh nhân thì checked bằng true
                    checked = true;
                    // trả về một bệnh án được cập nhật sau khi hoàn thành các bước kiểm tra 
                    return {
                        ...medicalRecord,
                        medicalRecordUpdateTime: ctx.stub.getTxTimestamp().nanos,
                        medicalRecordHashData: medicalRecordHashValue,
                        medicalRecordStatus: "COMPLETED"
                    }
                } else {
                    return medicalRecord;
                }
            })
            // kiểm tra bệnh án có tồn tại trong danh sách bệnh án của bệnh nhânh không
            if(!checked){
                throw new Error(`Medical record  ${medicalRecordId} does not exist`);
            }
            // cập nhật lại patient record
            const updatePatientRecord = {
                ...patientRecord,
                medicalRecordList :updateMedicalRecord
            }
            // cập nhật patient record vào sổ cái
            await ctx.stub.putState(patientId, Buffer.from(stringify(sortKeysRecursive(updatePatientRecord))));
            return `${JSON.stringify(updatePatientRecord)}`;
        } catch (error) {
            throw error;
        }
    }

    @Transaction(false)
    @Returns("string")
    public async readPatientRecord (ctx: Context, patientId : string) {
        try {
            const clientIdentity = ctx.clientIdentity.getAttributeValue("hf.EnrollmentID");
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            // Kiểm tra nếu là patient đọc thì đây phải là người sở hữu patient record này
            if((userRole === "PATIENT" && clientIdentity !== patientId)){
                throw new Error(`You are not the owner of patient record ${patientId}`);
            }
            const patientRecord : PatientRecord = await this.getPatientRecord(ctx, patientId);
            // Kiểm tra nếu là doctor đọc thì đây phải là người có quyền truy cập patient record
            const checkAccessDoctorList = patientRecord.accessDoctorList.some((dt: string) => dt === clientIdentity);
            if(userRole === "DOCTOR" && !checkAccessDoctorList) {
                throw new Error(`The doctor ${clientIdentity} has not been granted access before`);
            }
            return `${JSON.stringify(patientRecord)}`;
        } catch (error) {
            throw error;
        }
    }

    @Transaction(false) 
    @Returns("boolean")
    public async checkAccessDoctor (ctx:Context,doctorId: string ,patientId : string) {
        try {
            // kiểm tra một bác sĩ có quyền truy cập vào patient record hay không
            const patientRecord : PatientRecord = await this.getPatientRecord(ctx, patientId);
            const checkAccessDoctorList = patientRecord.accessDoctorList.some((dt: string) => dt === doctorId);
            return checkAccessDoctorList;
        } catch (error) {
            throw error;
        }
    }
    @Transaction(false)
    @Returns("string")
    public async readMedicalRecord (ctx: Context, MRId : string ,patientId: string){
        try {
            const clientIdentity = ctx.clientIdentity.getAttributeValue("hf.EnrollmentID");
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            // Kiểm tra nếu là patient đọc thì đây phải là người sở hữu patient record này
            if((userRole === "PATIENT" && clientIdentity !== patientId)){
                throw new Error(`You are not the owner of patient record ${patientId}`);
            }
            const patientRecord : PatientRecord = await this.getPatientRecord(ctx, patientId);
            // Kiểm tra nếu là doctor đọc thì đây phải là người có quyền truy cập patient record
            if(userRole === "DOCTOR") {
                const checkAccessDoctorList = patientRecord.accessDoctorList.some((dt: string) => dt === clientIdentity);
                if(!checkAccessDoctorList){
                    throw new Error(`The doctor ${clientIdentity} has not been granted access before`);
                }
            }
            const medicalRecord : MedicalRecord = patientRecord.medicalRecordList.find((medicalRecord : MedicalRecord) => medicalRecord.medicalRecordId === MRId);
            if(!medicalRecord) {
                throw new Error(`medical record ${MRId} does not exist`);
            }
            return `${JSON.stringify(medicalRecord)}`;
        } catch (error) {
            throw error;
        }
    }

    public async getPatientRecord (ctx: Context, patientId: string) {
        try {
            const exists = await this.PatientRecordExists(ctx, patientId);
            if(!exists) {
                throw new Error(`The patient record ${patientId} does not exist`);
            }
            const patientRecord : PatientRecord = JSON.parse((await ctx.stub.getState(patientId)).toString());
            return patientRecord;
        } catch (error) {
            throw error;
        }
    }

    @Transaction(false)
    @Returns("boolean" )
    public async PatientRecordExists(ctx: Context, patientId: string): Promise<boolean> {
        const assetJSON = await ctx.stub.getState(patientId);
        return assetJSON && assetJSON.length > 0;
    }

    @Transaction() 
    public async deletePatientRecord (ctx:Context,patientId : string) {
        try {
            // kiểm tra một bác sĩ có quyền truy cập vào patient record hay không
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            if(userRole != "ADMIN"){
                throw new Error(`Only admin have the right to create medical records`);
            }
            // Kiểm tra patient record đã tồn tại hay chưa
            const exists = await this.PatientRecordExists(ctx, patientId);
            if(exists) {
                throw new Error(`The patient record ${patientId} does exist`);
            }
            await ctx.stub.deleteState(patientId);
            return true;
        } catch (error) {
            throw error;
        }
    }
    
}
 