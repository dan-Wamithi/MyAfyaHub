import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: "user", // Default role
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: result.insertedId.toString(),
        email,
        role: "user",
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: result.insertedId.toString(),
        name,
        email,
        role: "user",
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
