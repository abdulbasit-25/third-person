import { MongoClient } from "mongodb";
import { getEnv } from "./env";
const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };
export async function getDb() {
  const client =
    globalForMongo.mongoClient ?? new MongoClient(getEnv().MONGODB_URI);
  if (!globalForMongo.mongoClient) {
    globalForMongo.mongoClient = client;
    await client.connect();
  }
  return client.db();
}
