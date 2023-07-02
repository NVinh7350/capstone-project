export interface Medicine {
    totalDay: number;
    drugDosage: string;
    drugFrequency: number;
    specify: string;
    medicineName: string;
}

export interface Test {
    typeTest: string;
    resultTest: string;
}

export interface Treatment {
    diseaseProgression: string;
    medicine: Medicine[];
}

export interface MedicalRecord {
    doctorId: string;
    patientId: string;
    specialty: string;
    bed: string;
    status: string;
    typeMR: string;
    personalMH: string;
    familyMH: string;
    majorReason: string;
    pathogenesis: string;
    body: string;
    organs: string;
    pulse: number;
    maxBP: number;
    minBP: number;
    temperature: number;
    breathing: number;
    weight: number;
    summaryMR: string;
    diagnosis: string;
    prognosis: string;
    directionTreatment: string;
    tests: Test[];
    treatments: Treatment[];
}

export interface MedicalRecordData {
    medicalRecord: MedicalRecord;
}