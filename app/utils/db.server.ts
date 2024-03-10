/* eslint-disable no-var */
import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient({
    errorFormat: "pretty",
  });
  db.$connect();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient({
      errorFormat: "pretty",
    });
    global.__db.$connect();
  }
  db = global.__db;
}

export { db };
