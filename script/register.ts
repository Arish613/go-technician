import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function registerUser() {
  try {
    console.log("\n📝 User Registration\n");

    const name = await question("Enter name: ");
    const email = await question("Enter email: ");
    const password = await question("Enter password: ");

    if (!name || !email || !password) {
      console.error("❌ All fields are required!");
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error("❌ User with this email already exists!");
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    console.log("\n✅ User registered successfully!");
    console.log(`\nUser Details:`);
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Created: ${user.createdAt}\n`);
  } catch (error) {
    console.error("❌ Error registering user:", error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

registerUser();
