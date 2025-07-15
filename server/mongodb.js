import { MongoClient } from "mongodb"
import clientPromise from "@/lib/mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let _clientPromise

// In development mode, use a global variable so that the client is not re-created on every hot reload
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  _clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  _clientPromise = client.connect()
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise
    const db = client.db("afyahub") // Replace "afyahub" with your actual database name

    if (process.env.NODE_ENV === "development") {
      console.log("[MongoDB] Connected to database:", db.databaseName)
    }

    return { db, client }
  } catch (error) {
    console.error("[MongoDB] Connection error:", error)
    throw error
  }
}

export default _clientPromise
