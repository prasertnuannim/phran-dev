-- AlterTable
ALTER TABLE "PM25Reading" ALTER COLUMN "createdAt" SET DEFAULT now() AT TIME ZONE 'Asia/Bangkok';

-- AlterTable
ALTER TABLE "SensorReading" ALTER COLUMN "createdAt" SET DEFAULT now() AT TIME ZONE 'Asia/Bangkok';
