import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'Event_M';

export async function connectToDatabase() {
  if (!client.isConnected()) await client.connect();
  const db = client.db(dbName);
  return { db, client };
}
