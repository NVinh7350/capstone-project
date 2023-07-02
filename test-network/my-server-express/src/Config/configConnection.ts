import { PrismaClient } from "@prisma/client";
import { buildCAClient } from "../Sevices/fabricCAServices";
import { ledgerService } from "../Sevices/ledgerServices";

export const caClientOrg1 = buildCAClient('ORG1');
export const caClientOrg2 = buildCAClient('ORG2');

export const grpcConnectionOrg1 = ledgerService.newGrpcConnection('ORG1');

export const grpcConnectionOrg2 = ledgerService.newGrpcConnection('ORG2');

export const prisma = new PrismaClient();