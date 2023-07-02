
import FabricCAServices from 'fabric-ca-client';
import { Wallets } from 'fabric-network';
import { buildCCPOrg1, buildCCPOrg2 } from '../Utils/fabricCaUtils';

export const buildCAClient =(organization:string) => {
    try {
        const caHostName = organization === 'ORG1' ? 'ca.org1.example.com': 'ca.org2.example.com';
        const mspOrg = organization === 'ORG1' ? 'Org1MSP' : 'Org2MSP';
        const ccp =  organization === 'ORG1' ? buildCCPOrg1() : buildCCPOrg2();
        const affiliation = organization === 'ORG1' ? 'org1.department1' : 'org2.department1';

        const caInfo = ccp.certificateAuthorities[caHostName]; // lookup CA details from config
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
        return {
            mspOrg: mspOrg,
            caClient: caClient,
            affiliation: affiliation
        }
    } catch (error) {
        throw error;
    }
}

export const enrollIdentity = async (caClient: FabricCAServices, orgMspId: string, userId: string , userPW: string): Promise<any> => {
    try {
        const enrollment = await caClient.enroll({ enrollmentID: userId, enrollmentSecret: userPW });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
                rootCert: enrollment.rootCertificate
            },
            mspId: orgMspId,
            type: 'X.509',
        };
        return x509Identity;
    } catch (err) { 
        if(err instanceof Error) {
            throw err;
        }
    }
}

export const changeSecret = async (caClient: FabricCAServices,orgMspId: string, userId: string , userPW: string, newPW: string) => {
    try {
        const enroll = await caClient.enroll({enrollmentID: userId, enrollmentSecret: userPW});
        const x509Identity = {
            credentials: {
                certificate: enroll.certificate,
                privateKey: enroll.key.toBytes(),
                rootCert: enroll.rootCertificate
            },
            mspId: orgMspId,
            type: 'X.509',
            };
        const provider = (await Wallets.newInMemoryWallet()).getProviderRegistry().getProvider(x509Identity?.type);
        const user = await provider.getUserContext(x509Identity, userId);
        await caClient.newIdentityService().update(userId,{enrollmentSecret: newPW, affiliation: user.getAffiliation(),enrollmentID: userId}, user );
        const enrollment = await caClient.enroll({ enrollmentID: userId, enrollmentSecret: newPW });
        const newX509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
            rootCert: enrollment.rootCertificate
        },
        mspId: orgMspId,
        type: 'X.509',
        };
        return newX509Identity;
    } catch (error) {
        throw error;
    }
}

export const registerIdentity = async (caClient: FabricCAServices, adminX509Identity: any, orgMspId: string,adminId:string,  userId: string, userPW: string, role: string ,affiliation: string) => {
    try {
        const provider = (await Wallets.newInMemoryWallet()).getProviderRegistry().getProvider(adminX509Identity?.type);
        const adminUser = await provider.getUserContext(adminX509Identity, adminId);
        
        const secret = await caClient.register({
            affiliation,
            enrollmentID: userId,
            enrollmentSecret: userPW,
            role: 'client',
            maxEnrollments: -1,
            attrs: [
                {
                name: 'hf.Registrar.Roles',
                value: 'client',
                ecert: true
            },
            {
                name: 'userRole',
                value: role,
                ecert: true
            },
            {
                name: 'hf.Revoker',
                value: 'true',
                ecert: true
            },
            {
                name: 'caname',
                value: caClient.getCaName(),
                ecert: true
            },
            ]
        }, adminUser);
    } catch (error) {
        console.error(`Failed to register user : ${error}`);
        throw error;
    }
}
