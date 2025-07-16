import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/mongodb"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic" // Add this line

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Helper function to get user from token
async function getUserFromToken(request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "No token provided", status: 401 }
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return { userId: decoded.userId }
  } catch (jwtError) {
    return { error: "Invalid token", status: 401 }
  }
}

export async function GET(request) {
  try {
    const { userId, error, status } = await getUserFromToken(request)
    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { userId, error, status } = await getUserFromToken(request)
    if (error) {
      return NextResponse.json({ error }, { status })
    }

    const { name, email, password } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const updateFields = { name, email }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateFields.password = hashedPassword
    }

    const result = await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: updateFields })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
