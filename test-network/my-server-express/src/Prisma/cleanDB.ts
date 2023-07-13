import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const tableNames = [
    "Medicine",
    "Treatment",
    "MedicalRecord",
    "access",
    "accessRequest",
    "Doctor",
    "Patient",
    "User",
];
async function main() {
    for (const tableName of tableNames) {
        try {
            await prisma.$queryRawUnsafe(`DELETE FROM ${tableName}`);
        } catch (error) {
            console.log(error);
        }
    }
}

main().finally(async () => {
    await prisma.$disconnect();
});
