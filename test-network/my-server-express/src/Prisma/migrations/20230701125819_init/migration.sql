-- CreateTable
CREATE TABLE `User` (
    `citizenId` VARCHAR(191) NOT NULL,
    `citizenNumber` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `x509Identity` TEXT NULL,
    `email` VARCHAR(191) NULL,
    `birthDay` DATE NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `role` ENUM('DOCTOR', 'PATIENT', 'ADMIN') NOT NULL,
    `ethnicity` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `refreshToken` VARCHAR(191) NULL,
    `organization` VARCHAR(191) NULL,
    `avatar` LONGTEXT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`citizenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `citizenId` VARCHAR(191) NOT NULL,
    `HICNumber` VARCHAR(191) NULL,
    `guardianName` VARCHAR(191) NULL,
    `guardianPhone` VARCHAR(191) NULL,
    `guardianAddress` VARCHAR(191) NULL,

    PRIMARY KEY (`citizenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctor` (
    `citizenId` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `specialty` VARCHAR(191) NOT NULL,
    `hospital` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`citizenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `access` (
    `doctorId` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `requestTime` DATETIME(3) NOT NULL,

    INDEX `access_patientId_fkey`(`patientId`),
    PRIMARY KEY (`doctorId`, `patientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accessRequest` (
    `doctorId` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `requestTime` DATETIME(3) NOT NULL,
    `status` ENUM('AGREE', 'REFUSE', 'PENDING') NOT NULL,

    INDEX `accessRequest_patientId_fkey`(`patientId`),
    PRIMARY KEY (`doctorId`, `patientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicalRecord` (
    `MRId` VARCHAR(191) NOT NULL,
    `status` ENUM('COMPLETED', 'CREATING') NOT NULL,
    `doctorId` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `comeTime` DATETIME NOT NULL,
    `personalMH` VARCHAR(191) NOT NULL,
    `familyMH` VARCHAR(191) NOT NULL,
    `majorReason` VARCHAR(191) NOT NULL,
    `pathogenesis` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `organs` VARCHAR(191) NOT NULL,
    `pulse` VARCHAR(191) NOT NULL,
    `temperature` VARCHAR(191) NOT NULL,
    `maxBP` VARCHAR(191) NOT NULL,
    `minBP` VARCHAR(191) NOT NULL,
    `breathing` VARCHAR(191) NOT NULL,
    `weight` VARCHAR(191) NOT NULL,
    `summaryMR` VARCHAR(191) NOT NULL,
    `diagnosis` VARCHAR(191) NOT NULL,
    `prognosis` VARCHAR(191) NOT NULL,
    `directionTreatment` VARCHAR(191) NOT NULL,
    `finishTime` DATETIME(3) NULL,

    INDEX `MedicalRecord_doctorId_fkey`(`doctorId`),
    INDEX `MedicalRecord_patientId_fkey`(`patientId`),
    PRIMARY KEY (`MRId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Treatment` (
    `treatmentId` INTEGER NOT NULL AUTO_INCREMENT,
    `diseaseProgression` VARCHAR(191) NULL,
    `treatmentTime` DATETIME(3) NULL,
    `MRId` VARCHAR(191) NOT NULL,

    INDEX `Treatment_MRId_fkey`(`MRId`),
    PRIMARY KEY (`treatmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medicine` (
    `treatmentId` INTEGER NOT NULL,
    `medicineId` INTEGER NOT NULL AUTO_INCREMENT,
    `medicineName` VARCHAR(191) NOT NULL,
    `drugDosage` VARCHAR(191) NOT NULL,
    `drugFrequency` VARCHAR(191) NOT NULL,
    `totalDay` VARCHAR(191) NOT NULL,
    `specify` VARCHAR(191) NOT NULL,

    INDEX `Medicine_treatmentId_fkey`(`treatmentId`),
    PRIMARY KEY (`medicineId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_citizenId_fkey` FOREIGN KEY (`citizenId`) REFERENCES `User`(`citizenId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_citizenId_fkey` FOREIGN KEY (`citizenId`) REFERENCES `User`(`citizenId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `access` ADD CONSTRAINT `access_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`citizenId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `access` ADD CONSTRAINT `access_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`citizenId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accessRequest` ADD CONSTRAINT `accessRequest_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`citizenId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accessRequest` ADD CONSTRAINT `accessRequest_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`citizenId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalRecord` ADD CONSTRAINT `MedicalRecord_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`citizenId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalRecord` ADD CONSTRAINT `MedicalRecord_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`citizenId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Treatment` ADD CONSTRAINT `Treatment_MRId_fkey` FOREIGN KEY (`MRId`) REFERENCES `MedicalRecord`(`MRId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medicine` ADD CONSTRAINT `Medicine_treatmentId_fkey` FOREIGN KEY (`treatmentId`) REFERENCES `Treatment`(`treatmentId`) ON DELETE RESTRICT ON UPDATE CASCADE;
