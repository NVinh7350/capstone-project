import path from "path";
import envOrDefault from "../Utils/envOrDefault";
import { promises as fs } from 'fs';
import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { userServices } from "./userServices";

const channelName = envOrDefault('CHANNEL_NAME', 'mychannel');
const chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic');
const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(__dirname, '..', '..', '..', 'organizations', 'peerOrganizations'));
const tlsCertPathOrg1 = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'org1.example.com', 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));
const peerEndpointOrg1 = envOrDefault('PEER_ENDPOINT', 'localhost:7051');
const peerHostAliasOrg1 = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');

const tlsCertPathOrg2 = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'org2.example.com', 'peers', 'peer0.org2.example.com', 'tls', 'ca.crt'));
const peerEndpointOrg2 = envOrDefault('PEER_ENDPOINT', 'localhost:9051');
const peerHostAliasOrg2 = envOrDefault('PEER_HOST_ALIAS', 'peer0.org2.example.com');
const utf8Decoder = new TextDecoder();

const newGrpcConnection = async (organization: string): Promise<grpc.Client> => {
    try {
        console.log('grpc', organization);
        const tlsRootCert = organization === 'ORG1' ? await fs.readFile(tlsCertPathOrg1) : await fs.readFile(tlsCertPathOrg2) ;
        const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
        const client = organization === 'ORG1' ?
            new grpc.Client(peerEndpointOrg1, tlsCredentials, {
                'grpc.ssl_target_name_override': peerHostAliasOrg1,
            }) 
            :
            new grpc.Client(peerEndpointOrg2, tlsCredentials, {
                'grpc.ssl_target_name_override': peerHostAliasOrg2,
            }) 
        return client;
    } catch (error) {
        throw error;
    }
}

const  newIdentity = async (mspId: string, credentials: Buffer): Promise<Identity> => {
    return { mspId, credentials };
}

const newSigner = async (privateKeyPem: Buffer): Promise<Signer> => {
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}


async function initLedger(client : grpc.Client ,citizenId: string): Promise<void> {
    const {gateway, contract} = await connectLedger(client ,citizenId);
    try {
        console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
        await contract.submitTransaction('InitLedger');
        console.log('*** Transaction initledger committed successfully');
    } catch (error) {
        throw error;
    } finally {
        gateway.close();
    }
}

const createPRLedgerService = async(client: grpc.Client,adminId : string, patientId: string) => {
    const {gateway, contract} = await connectLedger(client ,adminId);
    try {
        console.log('\n--> Submit Transaction: Create Patient Record');
        const resultBytes = await contract.submitTransaction('createPatientRecord', patientId);
        const result = utf8Decoder.decode(resultBytes)
        console.log('*** Transaction create patient record committed successfully', result);
        return JSON.parse(result);
    } catch (error) {
        console.log(error)
        throw error;
    } finally {
        gateway.close();
    }
}

const grantAccessLedgerService = async(client: grpc.Client,patientId: string, doctorId: string) => {
    const {gateway, contract} = await connectLedger(client ,patientId);
    try {
        console.log('\n--> Submit Transaction: Grant access');
        const resultBytes = await contract.submitTransaction('grantAccess', doctorId);
        const result = utf8Decoder.decode(resultBytes)
        console.log('*** Transaction grant access committed successfully', result);
        return JSON.parse(result);
    } catch (error) {
        throw error;
    } finally {
        gateway.close();
    }
}

const revokeAccessLedgerService = async(client: grpc.Client,patientId: string, doctorId: string) => {
    const {gateway, contract} = await connectLedger(client ,patientId);
    try {
        console.log('\n--> Submit Transaction: Revoke Access');
        const resultBytes = await contract.submitTransaction('revokeAccess', doctorId);
        const result = utf8Decoder.decode(resultBytes)
        console.log('*** Transaction revoke access committed successfully', result);
        return JSON.parse(result);
    } catch (error) {
        throw error;
    } finally {
        gateway.close();
    }
}

const createMRLedgerService = async(client: grpc.Client , doctorId: string ,patientId: string, medicalRecordId : string, medicalRecordHashValue: string ) => {
    const {gateway, contract} = await connectLedger(client ,doctorId);
    try {
        console.log('\n--> Submit Transaction: Create medical record');
        const resultBytes = await contract.submitTransaction('createMedicalRecord', patientId, medicalRecordId, medicalRecordHashValue);
        const result = utf8Decoder.decode(resultBytes)
        console.log('*** Transaction create medical record committed successfully', result);
        return JSON.parse(result);
    } catch (error) {
        throw error;
    } finally {
        gateway.close();
    }
}

const updateMRLedgerService = async(client: grpc.Client , doctorId: string ,patientId: string, medicalRecordId : string, medicalRecordHashValue: string ) => {
    const {gateway, contract} = await connectLedger(client ,doctorId);
    try {
        console.log('\n--> Submit Transaction: Update medical record');
        const resultBytes = await contract.submitTransaction('updateMedicalRecord', patientId, medicalRecordId, medicalRecordHashValue);
        const result = utf8Decoder.decode(resultBytes)
        console.log('*** Transaction update medical record committed successfully', result);
        return JSON.parse(result);
    } catch (error) {
        throw error;
    } finally {
        gateway.close();
    }
}

const finishMRLedgerService = async(client: grpc.Client , doctorId: string ,patientId: string, medicalRecordId : string, medicalRecordHashValue: string ) => {
    const {gateway, contract} = await connectLedger(client ,doctorId);
    try {
        console.log('\n--> Submit Transaction: Finish medical record');
        const resultBytes = await contract.submitTransaction('finishMedicalRecord', patientId, medicalRecordId, medicalRecordHashValue);
        const result = utf8Decoder.decode(resultBytes)
        console.log('*** Transaction finish medical record committed successfully', result);
        return JSON.parse(result);
    } catch (error) {
        throw error;
    } finally {
        gateway.close();
    }
}


const readPRLedgerService = async(client: grpc.Client,citizenId: string, patientId: string) => {
    const {gateway, contract} = await connectLedger(client ,citizenId);
    try {
        console.log('\n--> Request Ledger: read Patient Record', citizenId, patientId);
        const resultBytes = await contract.evaluateTransaction('readPatientRecord', patientId);
        const result = utf8Decoder.decode(resultBytes);
        console.log('*** request read patient record committed successfully');
        return JSON.parse(result);
    } catch (error) {
        throw error;
    } finally {
        gateway.close();
    }
}

const readMRLedgerService = async(client: grpc.Client,citizenId: string, MRId: string , patientId: string) => {
    const {gateway, contract} = await connectLedger(client ,citizenId);
    try {
        console.log('\n--> Request Ledger: read Medical Record');
        const resultBytes = await contract.evaluateTransaction('readMedicalRecord',MRId, patientId);
        const result = utf8Decoder.decode(resultBytes);
        console.log('*** request read patient record committed successfully');
        return JSON.parse(result);
    } catch (error) {
        throw error;
    } finally {
        gateway.close();
    }
}

const checkAccessLedgerService = async(client: grpc.Client,citizenId: string,  doctorId:string, patientId: string) => {
    const {gateway, contract} = await connectLedger(client ,citizenId);
    try {
        console.log('\n--> Request Ledger: Check Access Ledger');
        const resultBytes = await contract.evaluateTransaction('checkAccessDoctor',doctorId , patientId);
        const result = utf8Decoder.decode(resultBytes);
        console.log('*** request check access committed successfully', result);
        return result;
    } catch (error) {
        throw error;
    } finally {
        gateway.close();
    }
}


const connectLedger = async (client : grpc.Client ,citizenId: string) => {
    try {
        const userIdentity = await userServices.getX509IdentityService(citizenId);
        const credentials = Buffer.from(userIdentity?.credentials.certificate, 'utf-8');
        const mspID = userIdentity.mspId;
        const privateKeyPem = Buffer.from(userIdentity?.credentials.privateKey, 'utf-8');

        const gateway = connect({
            client,
            identity: await newIdentity(mspID, credentials),
            signer: await newSigner(privateKeyPem),
            // Default timeouts for different gRPC calls
            evaluateOptions: () => {
                return { deadline: Date.now() + 5000 }; // 5 seconds
            },
            endorseOptions: () => {
                return { deadline: Date.now() + 15000 }; // 15 seconds
            },
            submitOptions: () => {
                return { deadline: Date.now() + 5000 }; // 5 seconds
            },
            commitStatusOptions: () => {
                return { deadline: Date.now() + 60000 }; // 1 minute
            },
        });
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        // await initLedger(contract);
        return {
            gateway: gateway,
            contract: contract
        }
    } catch (error) {
        throw error;
    }
}

export const ledgerService = {
    connectLedger,
    newGrpcConnection,
    initLedger,
    createPRLedgerService,
    readPRLedgerService,
    checkAccessLedgerService,
    grantAccessLedgerService,
    revokeAccessLedgerService,
    createMRLedgerService,
    updateMRLedgerService,
    finishMRLedgerService,
    readMRLedgerService
}