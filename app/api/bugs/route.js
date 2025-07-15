import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/mongodb"

// Debug logging utility
const debugLog = (message, data) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[API Debug] ${message}`, data || "")
  }
}

// Error handling utility
const handleError = (error, context) => {
  debugLog(`Error in ${context}`, error)

  if (error.name === "ValidationError") {
    return NextResponse.json({ error: "Validation failed", details: error.message }, { status: 400 })
  }

  if (error.name === "MongoError" || error.name === "MongoServerError") {
    return NextResponse.json(
      {
        error: "Database error",
        details: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }

  return NextResponse.json(
    {
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
    },
    { status: 500 },
  )
}

// Validation utility
const validateBugData = (data) => {
  const errors = []

  if (!data.title || typeof data.title !== "string" || data.title.trim().length === 0) {
    errors.push("Title is required and must be a non-empty string")
  }

  if (!data.description || typeof data.description !== "string" || data.description.trim().length === 0) {
    errors.push("Description is required and must be a non-empty string")
  }

  if (!data.reporter || typeof data.reporter !== "string" || data.reporter.trim().length === 0) {
    errors.push("Reporter is required and must be a non-empty string")
  }

  const validSeverities = ["low", "medium", "high", "critical"]
  if (!data.severity || !validSeverities.includes(data.severity)) {
    errors.push("Severity must be one of: low, medium, high, critical")
  }

  const validStatuses = ["open", "in-progress", "resolved", "closed"]
  if (!data.status || !validStatuses.includes(data.status)) {
    errors.push("Status must be one of: open, in-progress, resolved, closed")
  }

  if (errors.length > 0) {
    const error = new Error(errors.join(", "))
    error.name = "ValidationError"
    throw error
  }
}

// GET /api/bugs - Fetch all bugs
export async function GET() {
  try {
    debugLog("GET /api/bugs - Fetching all bugs")

    const { db } = await connectToDatabase()
    const bugs = await db.collection("bugs").find({}).sort({ createdAt: -1 }).toArray()

    debugLog("Bugs fetched successfully", { count: bugs.length })

    return NextResponse.json({
      success: true,
      bugs: bugs.map((bug) => ({
        ...bug,
        _id: bug._id.toString(),
      })),
    })
  } catch (error) {
    return handleError(error, "GET /api/bugs")
  }
}

// POST /api/bugs - Create a new bug
export async function POST(request) {
  try {
    debugLog("POST /api/bugs - Creating new bug")

    const body = await request.json()
    debugLog("Request body", body)

    // Validate input data
    validateBugData(body)

    const { db } = await connectToDatabase()

    const bugData = {
      title: body.title.trim(),
      description: body.description.trim(),
      severity: body.severity,
      status: body.status,
      reporter: body.reporter.trim(),
      assignee: body.assignee ? body.assignee.trim() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("bugs").insertOne(bugData)

    if (!result.insertedId) {
      throw new Error("Failed to create bug")
    }

    const createdBug = await db.collection("bugs").findOne({ _id: result.insertedId })

    debugLog("Bug created successfully", { id: result.insertedId })

    return NextResponse.json(
      {
        success: true,
        bug: {
          ...createdBug,
          _id: createdBug._id.toString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    return handleError(error, "POST /api/bugs")
  }
}
