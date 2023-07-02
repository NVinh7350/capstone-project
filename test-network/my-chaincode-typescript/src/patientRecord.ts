import {Object, Property} from 'fabric-contract-api';
import { Timestamp } from 'fabric-shim';
import { MedicalRecord } from './medicalRecord';
@Object() 
export class PatientRecord {
    @Property()
    public patientId: string;

    @Property()
    public accessDoctorList: string[];

    @Property()
    public medicalRecordList: MedicalRecord[];
    
}