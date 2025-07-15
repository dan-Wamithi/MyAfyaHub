// Database seeding script for Bug Tracker
// This script creates sample data for testing and development

const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "bugtracker"

const sampleBugs = [
  {
    title: "Login page not responsive on mobile",
    description:
      "The login form elements are not properly aligned on mobile devices. The submit button is cut off on screens smaller than 375px.",
    severity: "medium",
    status: "open",
    reporter: "Alice Johnson",
    assignee: "Bob Smith",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T10:30:00Z"),
  },
  {
    title: "Database connection timeout",
    description:
      "Users are experiencing intermittent database connection timeouts during peak hours. This affects user authentication and data retrieval.",
    severity: "high",
    status: "in-progress",
    reporter: "Charlie Brown",
    assignee: "Diana Prince",
    createdAt: new Date("2024-01-14T14:20:00Z"),
    updatedAt: new Date("2024-01-16T09:15:00Z"),
  },
  {
    title: "Memory leak in image processing",
    description:
      "The image upload feature is causing memory leaks when processing large files. Server memory usage increases continuously until restart.",
    severity: "critical",
    status: "open",
    reporter: "Eve Wilson",
    assignee: "Frank Miller",
    createdAt: new Date("2024-01-13T16:45:00Z"),
    updatedAt: new Date("2024-01-13T16:45:00Z"),
  },
  {
    title: "Typo in welcome email",
    description: 'There is a spelling error in the welcome email template. "Wellcome" should be "Welcome".',
    severity: "low",
    status: "resolved",
    reporter: "Grace Lee",
    assignee: "Henry Davis",
    createdAt: new Date("2024-01-12T11:00:00Z"),
    updatedAt: new Date("2024-01-14T13:30:00Z"),
  },
  {
    title: "API rate limiting not working",
    description:
      "The API rate limiting middleware is not properly throttling requests. Users can exceed the 100 requests per minute limit.",
    severity: "high",
    status: "closed",
    reporter: "Ian Thompson",
    assignee: "Julia Roberts",
    createdAt: new Date("2024-01-10T08:15:00Z"),
    updatedAt: new Date("2024-01-12T17:20:00Z"),
  },
  {
    title: "Dark mode toggle not persisting",
    description: "When users toggle dark mode, the preference is not saved and reverts to light mode on page refresh.",
    severity: "medium",
    status: "open",
    reporter: "Kevin Park",
    assignee: null,
    createdAt: new Date("2024-01-16T12:00:00Z"),
    updatedAt: new Date("2024-01-16T12:00:00Z"),
  },
]

async function seedDatabase() {
  let client

  try {
    console.log("Connecting to MongoDB...")
    client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(DB_NAME)
    const bugsCollection = db.collection("bugs")

    // Clear existing data
    console.log("Clearing existing bugs...")
    await bugsCollection.deleteMany({})

    // Insert sample data
    console.log("Inserting sample bugs...")
    const result = await bugsCollection.insertMany(sampleBugs)

    console.log(`Successfully inserted ${result.insertedCount} bugs`)

    // Create indexes for better performance
    console.log("Creating indexes...")
    await bugsCollection.createIndex({ status: 1 })
    await bugsCollection.createIndex({ severity: 1 })
    await bugsCollection.createIndex({ reporter: 1 })
    await bugsCollection.createIndex({ assignee: 1 })
    await bugsCollection.createIndex({ createdAt: -1 })

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
    }
  }
}

// Run the seeding function
seedDatabase()
