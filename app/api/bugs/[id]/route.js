import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/mongodb"
import { ObjectId } from "mongodb"

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

  if (error.message === "Invalid ObjectId") {
    return NextResponse.json({ error: "Invalid bug ID format" }, { status: 400 })
  }

  if (error.message === "Bug not found") {
    return NextResponse.json({ error: "Bug not found" }, { status: 404 })
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

// Validation utility for updates
const validateUpdateData = (data) => {
  const errors = []

  if (data.title !== undefined) {
    if (typeof data.title !== "string" || data.title.trim().length === 0) {
      errors.push("Title must be a non-empty string")
    }
  }

  if (data.description !== undefined) {
    if (typeof data.description !== "string" || data.description.trim().length === 0) {
      errors.push("Description must be a non-empty string")
    }
  }

  if (data.reporter !== undefined) {
    if (typeof data.reporter !== "string" || data.reporter.trim().length === 0) {
      errors.push("Reporter must be a non-empty string")
    }
  }

  if (data.severity !== undefined) {
    const validSeverities = ["low", "medium", "high", "critical"]
    if (!validSeverities.includes(data.severity)) {
      errors.push("Severity must be one of: low, medium, high, critical")
    }
  }

  if (data.status !== undefined) {
    const validStatuses = ["open", "in-progress", "resolved", "closed"]
    if (!validStatuses.includes(data.status)) {
      errors.push("Status must be one of: open, in-progress, resolved, closed")
    }
  }

  if (errors.length > 0) {
    const error = new Error(errors.join(", "))
    error.name = "ValidationError"
    throw error
  }
}

// GET /api/bugs/[id] - Fetch a specific bug
export async function GET(request, { params }) {
  try {
    debugLog("GET /api/bugs/[id] - Fetching bug", { id: params.id })

    if (!ObjectId.isValid(params.id)) {
      throw new Error("Invalid ObjectId")
    }

    const { db } = await connectToDatabase()
    const bug = await db.collection("bugs").findOne({ _id: new ObjectId(params.id) })

    if (!bug) {
      throw new Error("Bug not found")
    }

    debugLog("Bug fetched successfully", { id: params.id })

    return NextResponse.json({
      success: true,
      bug: {
        ...bug,
        _id: bug._id.toString(),
      },
    })
  } catch (error) {
    return handleError(error, "GET /api/bugs/[id]")
  }
}

// PUT /api/bugs/[id] - Update a specific bug
export async function PUT(request, { params }) {
  try {
    debugLog("PUT /api/bugs/[id] - Updating bug", { id: params.id })

    if (!ObjectId.isValid(params.id)) {
      throw new Error("Invalid ObjectId")
    }

    const body = await request.json()
    debugLog("Update request body", body)

    // Validate input data
    validateUpdateData(body)

    const { db } = await connectToDatabase()

    // Check if bug exists
    const existingBug = await db.collection("bugs").findOne({ _id: new ObjectId(params.id) })
    if (!existingBug) {
      throw new Error("Bug not found")
    }

    // Prepare update data
    const updateData = {
      updatedAt: new Date(),
    }

    // Only update provided fields
    if (body.title !== undefined) updateData.title = body.title.trim()
    if (body.description !== undefined) updateData.description = body.description.trim()
    if (body.severity !== undefined) updateData.severity = body.severity
    if (body.status !== undefined) updateData.status = body.status
    if (body.reporter !== undefined) updateData.reporter = body.reporter.trim()
    if (body.assignee !== undefined) updateData.assignee = body.assignee ? body.assignee.trim() : null

    const result = await db.collection("bugs").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      throw new Error("Bug not found")
    }

    const updatedBug = await db.collection("bugs").findOne({ _id: new ObjectId(params.id) })

    debugLog("Bug updated successfully", { id: params.id })

    return NextResponse.json({
      success: true,
      bug: {
        ...updatedBug,
        _id: updatedBug._id.toString(),
      },
    })
  } catch (error) {
    return handleError(error, "PUT /api/bugs/[id]")
  }
}

// DELETE /api/bugs/[id] - Delete a specific bug
export async function DELETE(request, { params }) {
  try {
    debugLog("DELETE /api/bugs/[id] - Deleting bug", { id: params.id })

    if (!ObjectId.isValid(params.id)) {
      throw new Error("Invalid ObjectId")
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("bugs").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      throw new Error("Bug not found")
    }

    debugLog("Bug deleted successfully", { id: params.id })

    return NextResponse.json({
      success: true,
      message: "Bug deleted successfully",
    })
  } catch (error) {
    return handleError(error, "DELETE /api/bugs/[id]")
  }
}
