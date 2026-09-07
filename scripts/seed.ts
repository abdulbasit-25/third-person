import { MongoClient } from "mongodb";
import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import { z } from "zod";

loadEnvConfig(process.cwd());

const adminUsername = "basit@archer.com";
const adminPassword = "TheSh@dowMon@rch";

async function main() {
  const env = z.object({ MONGODB_URI: z.string().min(1) }).parse(process.env);
  const client = new MongoClient(env.MONGODB_URI);

  try {
    await client.connect();
    const users = client.db().collection("third-person");
    await users.createIndex(
      { username: 1 },
      {
        unique: true,
        partialFilterExpression: { username: { $type: "string" } },
      },
    );
    await client
      .db()
      .collection("reviews")
      .createIndex({ reviewerId: 1, isCurrent: 1 });
    await client
      .db()
      .collection("reviews")
      .createIndex({ reviewerId: 1, version: 1 });
    await users.updateOne(
      { username: adminUsername },
      {
        $set: {
          username: adminUsername,
          displayName: "Abdul Basit",
          passwordHash: await bcrypt.hash(adminPassword, 12),
          role: "admin",
          status: null,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );
    console.log("Mirror admin account seeded.");
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
