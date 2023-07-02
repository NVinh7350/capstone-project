/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

@Object()
export class MedicalRecord {
    @Property()
    public medicalRecordId: string;

    @Property()
    public patientId: string;

    @Property()
    public doctorCreator: string;

    @Property()
    public medicalRecordHashData: string;

    @Property()
    public medicalRecordStatus: string;

    @Property()
    public medicalRecordUpdateTime: number;

}
