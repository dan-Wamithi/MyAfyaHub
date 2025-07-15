import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/mongodb"

export async function POST(request) {
  try {
    const { name, email, phone, category, subject, message } = await request.json()

    // Validation
    if (!name || !email || !category || !subject || !message) {
      return NextResponse.json({ error: "Name, email, category, subject, and message are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Save contact inquiry
    const result = await db.collection("contacts").insertOne({
      name,
      email,
      phone: phone || null,
      category,
      subject,
      message,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        success: true,
        message: "Your question has been submitted successfully",
        id: result.insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
