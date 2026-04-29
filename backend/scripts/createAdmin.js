import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Empire2026@", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Luc Tshinkobo",
      phone: "0990000000",
      email: "luctshinkobo@gmail.com",
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  console.log(admin);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });