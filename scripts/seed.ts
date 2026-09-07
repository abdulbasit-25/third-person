import { MongoClient } from "mongodb";
import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import { z } from "zod";

loadEnvConfig(process.cwd());

async function main() {
  const env = z
    .object({
      MONGODB_URI: z.string().min(1),
      ADMIN_SEED_USERNAME: z.string().min(3),
      ADMIN_SEED_PASSWORD: z.string().min(8),
    })
    .parse(process.env);
  const client = new MongoClient(env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db("third-person");
    const users = db.collection("user");
    await users.createIndex(
      { username: 1 },
      {
        unique: true,
        partialFilterExpression: { username: { $type: "string" } },
      },
    );
    await db.collection("reviews").createIndex({ reviewerId: 1, isCurrent: 1 });
    await db.collection("reviews").createIndex({ reviewerId: 1, version: 1 });
    await users.updateOne(
      { username: env.ADMIN_SEED_USERNAME.toLowerCase() },
      {
        $set: {
          username: env.ADMIN_SEED_USERNAME.toLowerCase(),
          displayName: "Abdul Basit",
          passwordHash: await bcrypt.hash(env.ADMIN_SEED_PASSWORD, 12),
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
