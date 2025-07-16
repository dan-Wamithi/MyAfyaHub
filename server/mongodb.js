import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = "afyahub" // Your database name

let cachedClient = null
let cachedDb = null

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(uri, {
    // useNewUrlParser: true, // Deprecated, remove
    // useUnifiedTopology: true, // Deprecated, remove
  })

  cachedClient = await client.connect()
  cachedDb = cachedClient.db(dbName)

  return { client: cachedClient, db: cachedDb }
}
