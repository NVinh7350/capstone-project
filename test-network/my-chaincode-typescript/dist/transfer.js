"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRecordTransferContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const json_stringify_deterministic_1 = __importDefault(require("json-stringify-deterministic"));
const sort_keys_recursive_1 = __importDefault(require("sort-keys-recursive"));
let PatientRecordTransferContract = class PatientRecordTransferContract extends fabric_contract_api_1.Contract {
    async InitLedger(ctx) {
        const patientRecords = [
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
            await ctx.stub.putState(patientRecord.patientId, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(patientRecord))));
            console.info(`patientRecord ${patientRecord.patientId} initialized`);
        }
    }
    async createPatientRecord(ctx, patientId) {
        try {
            // Kiểm tra quyền truy cập admin
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            if (userRole == "ADMIN") {
                throw new Error(`Only admin have the right to create medical records`);
            }
            // Kiểm tra patient record đã tồn tại hay chưa
            const exists = await this.PatientRecordExists(ctx, patientId);
            if (exists) {
                throw new Error(`The patient record ${patientId} does exist`);
            }
            // Tạo mới một patient record sau khi đã đủ các điều kiện
            const newPatientRecord = {
                patientId: patientId,
                accessDoctorList: [],
                medicalRecordList: []
            };
            // Thêm mới patient record vào sổ cái
            await ctx.stub.putState(patientId, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(newPatientRecord))));
            return `${JSON.stringify(newPatientRecord)}`;
        }
        catch (error) {
            throw error;
        }
    }
    async grantAccess(ctx, doctorId) {
        try {
            const clientIdentity = ctx.clientIdentity.getAttributeValue("hf.EnrollmentID");
            // Kiểm tra quyền truy cập patient
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            if (userRole != "PATIENT") {
                throw new Error(`Only patient have the right to grant access`);
            }
            const patientRecord = await this.getPatientRecord(ctx, clientIdentity);
            const currentAccessList = patientRecord.accessDoctorList;
            // Kiểm tra doctor đã có quyền try cập trước đó hay chưa
            const checkDoctor = currentAccessList.some(dt => dt === doctorId);
            if (checkDoctor) {
                throw new Error(`The doctor ${doctorId} has been granted access before`);
            }
            // cấp quyền cho doctor sau khi đã đủ các điều kiện
            currentAccessList.push(doctorId);
            const updatePatientRecord = Object.assign(Object.assign({}, patientRecord), { accessDoctorList: currentAccessList });
            // Cập nhật lại patient record vào sổ cái
            await ctx.stub.putState(clientIdentity, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(updatePatientRecord))));
            return `${JSON.stringify(updatePatientRecord)}`;
        }
        catch (error) {
            throw error;
        }
    }
    async revokeAccess(ctx, doctorId) {
        try {
            const clientIdentity = ctx.clientIdentity.getAttributeValue("hf.EnrollmentID");
            // Kiểm tra quyền truy cập patient
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            if (userRole != "PATIENT") {
                throw new Error(`Only patients have the right to revoke access`);
            }
            const patientRecord = await this.getPatientRecord(ctx, clientIdentity);
            // Kiểm tra doctor đã có quyền try cập trước đó hay chưa
            const checkAccessDoctorList = patientRecord.accessDoctorList.some((dt) => dt === doctorId);
            if (!checkAccessDoctorList) {
                throw new Error(`The doctor ${doctorId} has not been granted access before`);
            }
            // Kiểm tra doctor này đang có bệnh án nào chưa hoàn thành không
            const checkMedicalRecordList = patientRecord.medicalRecordList.some((medicalRecord) => {
                return medicalRecord.doctorCreator === doctorId && medicalRecord.medicalRecordStatus === "CREATING";
            });
            if (checkMedicalRecordList) {
                throw new Error(`The doctor ${doctorId} has an unfinished medical record`);
            }
            // Thu hồi quyền truy cập sau khi đã kiểm tra các điều kiện
            const updatePatientRecord = Object.assign(Object.assign({}, patientRecord), { accessDoctorList: patientRecord.accessDoctorList.filter(dt => dt !== doctorId) });
            // Cập nhật lại patient record vào sổ cái
            await ctx.stub.putState(clientIdentity, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(updatePatientRecord))));
            return `${JSON.stringify(updatePatientRecord)}`;
        }
        catch (error) {
            throw error;
        }
    }
    async createMedicalRecord(ctx, patientId, medicalRecordId, medicalRecordHashValue) {
        try {
            const clientIdentity = ctx.clientIdentity.getAttributeValue("hf.EnrollmentID");
            // Kiểm tra quyền truy cập Doctor
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            if (userRole != "DOCTOR") {
                throw new Error(`Only doctors have the right to update medical records`);
            }
            const patientRecord = await this.getPatientRecord(ctx, patientId);
            const currentMedicalRecord = patientRecord.medicalRecordList;
            // Kiểm tra quyền truy cập vào patient record này
            const checkAccessDoctorList = patientRecord.accessDoctorList.some((dt) => dt === clientIdentity);
            if (!checkAccessDoctorList) {
                throw new Error(`You must request access to patient records ${patientId} before creating`);
            }
            // Kiểm tra medical record đã tồn tại hay chưa
            const checkMedicalRecord = currentMedicalRecord.find((medicalRecord) => medicalRecord.medicalRecordId === medicalRecordId);
            if (checkMedicalRecord) {
                throw new Error(`The medical record ${medicalRecordId} was created before`);
            }
            // Tạo một medical record mới khi đã đủ điều kiện
            const newMedicalRecord = {
                doctorCreator: clientIdentity,
                medicalRecordId: medicalRecordId,
                medicalRecordUpdateTime: ctx.stub.getTxTimestamp().nanos,
                medicalRecordHashData: medicalRecordHashValue,
                patientId: patientId,
                medicalRecordStatus: "CREATING"
            };
            // Thêm medical record vào medical record list của patient record
            currentMedicalRecord.push(newMedicalRecord);
            const updatePatientRecord = Object.assign(Object.assign({}, patientRecord), { medicalRecordList: currentMedicalRecord });
            // Cập nhật patient record vào sổ cái
            await ctx.stub.putState(patientId, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(updatePatientRecord))));
            return `${JSON.stringify(updatePatientRecord)}`;
        }
        catch (error) {
            throw error;
        }
    }
    async updateMedicalRecord(ctx, patientId, medicalRecordId, medicalRecordHashValue) {
        try {
            const clientIdentity = ctx.clientIdentity.getAttributeValue("hf.EnrollmentID");
            // kiểm tra quyền truy cập Doctor
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            if (userRole != "DOCTOR") {
                throw new Error(`Only doctors have the right to update medical records`);
            }
            const patientRecord = await this.getPatientRecord(ctx, patientId);
            // Kiểm tra quyền truy cập vào Patient record
            const checkAccessDoctorList = patientRecord.accessDoctorList.some((dt) => dt === clientIdentity);
            if (!checkAccessDoctorList) {
                throw new Error(`You must request access to patient records ${patientId} before creating`);
            }
            // Biến checked dùng để kiểm tra medical record có tồn tại trong patient record trước đó chưa
            let checked = false;
            const updateMedicalRecord = patientRecord.medicalRecordList.map((medicalRecord) => {
                if (medicalRecord.medicalRecordId === medicalRecordId) {
                    // Kiểm tra bác sĩ này có phải là người đã tạo bệnh án không
                    const checkDoctorCreator = medicalRecord.doctorCreator === clientIdentity;
                    if (!checkDoctorCreator) {
                        throw new Error(`You are not the creator of medical record ${medicalRecordId}, so you will not have the right to update`);
                    }
                    // Kiểm tra bệnh án đã hoàn thành chưa
                    const checkFinish = medicalRecord.medicalRecordStatus === "CREATING";
                    if (!checkFinish) {
                        throw new Error(`Completed medical record ${medicalRecordId}, no editing rights`);
                    }
                    // Kiểm tra dữ liệu bệnh án có gì thay đổi không
                    const checkMedicalRecordHashValue = medicalRecord.medicalRecordHashData === medicalRecordHashValue;
                    if (checkMedicalRecordHashValue) {
                        throw new Error(`Medical record data ${medicalRecordId} has not changed, so it will not be updated`);
                    }
                    // nếu bệnh án có tồn tại trong danh sách bệnh án của bệnh nhân thì checked bằng true
                    checked = true;
                    // trả về một bệnh án được cập nhật sau khi hoàn thành các bước kiểm tra 
                    return Object.assign(Object.assign({}, medicalRecord), { medicalRecordUpdateTime: ctx.stub.getTxTimestamp().nanos, medicalRecordHashData: medicalRecordHashValue });
                }
                else {
                    return medicalRecord;
                }
            });
            // kiểm tra bệnh án có tồn tại trong danh sách bệnh án của bệnh nhânh không
            if (!checked) {
                throw new Error(`Medical record  ${medicalRecordId} does not exist`);
            }
            // Cập nhật lại patient record
            const updatePatientRecord = Object.assign(Object.assign({}, patientRecord), { medicalRecordList: updateMedicalRecord });
            // Cập nhật patient record vào sổ cái
            await ctx.stub.putState(patientId, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(updatePatientRecord))));
            return `${JSON.stringify(updatePatientRecord)}`;
        }
        catch (error) {
            throw error;
        }
    }
    async finishMedicalRecord(ctx, patientId, medicalRecordId, medicalRecordHashValue) {
        try {
            const clientIdentity = ctx.clientIdentity.getAttributeValue("hf.EnrollmentID");
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            if (userRole != "DOCTOR") {
                throw new Error(`Only doctors have the right to finish medical records`);
            }
            const patientRecord = await this.getPatientRecord(ctx, patientId);
            const checkAccessDoctorList = patientRecord.accessDoctorList.some((dt) => dt === clientIdentity);
            if (!checkAccessDoctorList) {
                throw new Error(`You must request access to patient records ${patientId} before creating`);
            }
            let checked = false;
            const updateMedicalRecord = patientRecord.medicalRecordList.map((medicalRecord) => {
                if (medicalRecord.medicalRecordId === medicalRecordId) {
                    // Kiểm tra bác sĩ này có phải là người đã tạo bệnh án không
                    const checkDoctorCreator = medicalRecord.doctorCreator === clientIdentity;
                    if (!checkDoctorCreator) {
                        throw new Error(`You are not the creator of medical record ${medicalRecordId}, so you will not have the right to finish`);
                    }
                    // Kiểm tra bệnh án đã hoàn thành chưa
                    const checkFinish = medicalRecord.medicalRecordStatus === "CREATING";
                    if (!checkFinish) {
                        throw new Error(`The medical record ${medicalRecordId} has completed`);
                    }
                    // Kiểm tra dữ liệu bệnh án có gì thay đổi không
                    const checkMedicalRecordHashValue = medicalRecord.medicalRecordHashData === medicalRecordHashValue;
                    if (checkMedicalRecordHashValue) {
                        throw new Error(`Medical record data ${medicalRecordId} has not changed, so it will not be updated`);
                    }
                    // nếu bệnh án có tồn tại trong danh sách bệnh án của bệnh nhân thì checked bằng true
                    checked = true;
                    // trả về một bệnh án được cập nhật sau khi hoàn thành các bước kiểm tra 
                    return Object.assign(Object.assign({}, medicalRecord), { medicalRecordUpdateTime: ctx.stub.getTxTimestamp().nanos, medicalRecordHashData: medicalRecordHashValue, medicalRecordStatus: "COMPLETED" });
                }
                else {
                    return medicalRecord;
                }
            });
            // kiểm tra bệnh án có tồn tại trong danh sách bệnh án của bệnh nhânh không
            if (!checked) {
                throw new Error(`Medical record  ${medicalRecordId} does not exist`);
            }
            // cập nhật lại patient record
            const updatePatientRecord = Object.assign(Object.assign({}, patientRecord), { medicalRecordList: updateMedicalRecord });
            // cập nhật patient record vào sổ cái
            await ctx.stub.putState(patientId, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(updatePatientRecord))));
            return `${JSON.stringify(updatePatientRecord)}`;
        }
        catch (error) {
            throw error;
        }
    }
    async readPatientRecord(ctx, patientId) {
        try {
            const clientIdentity = ctx.clientIdentity.getAttributeValue("hf.EnrollmentID");
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            // Kiểm tra nếu là patient đọc thì đây phải là người sở hữu patient record này
            if ((userRole === "PATIENT" && clientIdentity !== patientId)) {
                throw new Error(`You are not the owner of patient record ${patientId}`);
            }
            const patientRecord = await this.getPatientRecord(ctx, patientId);
            // Kiểm tra nếu là doctor đọc thì đây phải là người có quyền truy cập patient record
            const checkAccessDoctorList = patientRecord.accessDoctorList.some((dt) => dt === clientIdentity);
            if (userRole === "DOCTOR" && !checkAccessDoctorList) {
                throw new Error(`The doctor ${clientIdentity} has not been granted access before`);
            }
            return `${JSON.stringify(patientRecord)}`;
        }
        catch (error) {
            throw error;
        }
    }
    async checkAccessDoctor(ctx, doctorId, patientId) {
        try {
            // kiểm tra một bác sĩ có quyền truy cập vào patient record hay không
            const patientRecord = await this.getPatientRecord(ctx, patientId);
            const checkAccessDoctorList = patientRecord.accessDoctorList.some((dt) => dt === doctorId);
            return checkAccessDoctorList;
        }
        catch (error) {
            throw error;
        }
    }
    async readMedicalRecord(ctx, MRId, patientId) {
        try {
            const clientIdentity = ctx.clientIdentity.getAttributeValue("hf.EnrollmentID");
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            // Kiểm tra nếu là patient đọc thì đây phải là người sở hữu patient record này
            if ((userRole === "PATIENT" && clientIdentity !== patientId)) {
                throw new Error(`You are not the owner of patient record ${patientId}`);
            }
            const patientRecord = await this.getPatientRecord(ctx, patientId);
            // Kiểm tra nếu là doctor đọc thì đây phải là người có quyền truy cập patient record
            if (userRole === "DOCTOR") {
                const checkAccessDoctorList = patientRecord.accessDoctorList.some((dt) => dt === clientIdentity);
                if (!checkAccessDoctorList) {
                    throw new Error(`The doctor ${clientIdentity} has not been granted access before`);
                }
            }
            const medicalRecord = patientRecord.medicalRecordList.find((medicalRecord) => medicalRecord.medicalRecordId === MRId);
            if (!medicalRecord) {
                throw new Error(`medical record ${MRId} does not exist`);
            }
            return `${JSON.stringify(medicalRecord)}`;
        }
        catch (error) {
            throw error;
        }
    }
    async getPatientRecord(ctx, patientId) {
        try {
            const exists = await this.PatientRecordExists(ctx, patientId);
            if (!exists) {
                throw new Error(`The patient record ${patientId} does not exist`);
            }
            const patientRecord = JSON.parse((await ctx.stub.getState(patientId)).toString());
            return patientRecord;
        }
        catch (error) {
            throw error;
        }
    }
    async PatientRecordExists(ctx, patientId) {
        const assetJSON = await ctx.stub.getState(patientId);
        return assetJSON && assetJSON.length > 0;
    }
    async deletePatientRecord(ctx, patientId) {
        try {
            // kiểm tra một bác sĩ có quyền truy cập vào patient record hay không
            const userRole = ctx.clientIdentity.getAttributeValue("userRole");
            if (userRole != "ADMIN") {
                throw new Error(`Only admin have the right to create medical records`);
            }
            // Kiểm tra patient record đã tồn tại hay chưa
            const exists = await this.PatientRecordExists(ctx, patientId);
            if (exists) {
                throw new Error(`The patient record ${patientId} does exist`);
            }
            await ctx.stub.deleteState(patientId);
            return true;
        }
        catch (error) {
            throw error;
        }
    }
};
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], PatientRecordTransferContract.prototype, "InitLedger", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    (0, fabric_contract_api_1.Returns)("string"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], PatientRecordTransferContract.prototype, "createPatientRecord", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    (0, fabric_contract_api_1.Returns)("string"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], PatientRecordTransferContract.prototype, "grantAccess", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    (0, fabric_contract_api_1.Returns)("string"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], PatientRecordTransferContract.prototype, "revokeAccess", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    (0, fabric_contract_api_1.Returns)("string"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String]),
    __metadata("design:returntype", Promise)
], PatientRecordTransferContract.prototype, "createMedicalRecord", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    (0, fabric_contract_api_1.Returns)("string"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String]),
    __metadata("design:returntype", Promise)
], PatientRecordTransferContract.prototype, "updateMedicalRecord", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    (0, fabric_contract_api_1.Returns)("string"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String]),
    __metadata("design:returntype", Promise)
], PatientRecordTransferContract.prototype, "finishMedicalRecord", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    (0, fabric_contract_api_1.Returns)("string"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], PatientRecordTransferContract.prototype, "readPatientRecord", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    (0, fabric_contract_api_1.Returns)("boolean"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], PatientRecordTransferContract.prototype, "checkAccessDoctor", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    (0, fabric_contract_api_1.Returns)("string"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], PatientRecordTransferContract.prototype, "readMedicalRecord", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    (0, fabric_contract_api_1.Returns)("boolean"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], PatientRecordTransferContract.prototype, "PatientRecordExists", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], PatientRecordTransferContract.prototype, "deletePatientRecord", null);
PatientRecordTransferContract = __decorate([
    (0, fabric_contract_api_1.Info)({ title: "PatientRecordTransfer", description: "Smart contract for trading patient record" })
], PatientRecordTransferContract);
exports.PatientRecordTransferContract = PatientRecordTransferContract;
//# sourceMappingURL=transfer.js.map