-- CreateEnum
CREATE TYPE "VendorPaymentType" AS ENUM ('MPESA', 'AIRTEL', 'ORANGE', 'VISA', 'BANK');

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "bankAccount" TEXT,
ADD COLUMN     "bankHolder" TEXT,
ADD COLUMN     "bankIban" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "paymentMethod" "VendorPaymentType",
ADD COLUMN     "paymentNumber" TEXT,
ADD COLUMN     "phoneBusiness" TEXT,
ADD COLUMN     "slogan" TEXT,
ADD COLUMN     "whatsapp" TEXT;
