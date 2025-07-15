import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/mongodb"
import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Helper function to verify admin access
async function verifyAdmin(request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({
      _id: new ObjectId(decoded.userId),
    })

    if (!user || user.role !== "admin") {
      return null
    }

    return user
  } catch (error) {
    return null
  }
}

// GET /api/articles/[id] - Fetch a specific article
export async function GET(request, { params }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid article ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const article = await db.collection("articles").findOne({ _id: new ObjectId(id) })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      article: {
        ...article,
        _id: article._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/articles/[id] - Update a specific article (Admin only)
export async function PUT(request, { params }) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid article ID format" }, { status: 400 })
    }

    const body = await request.json()
    const { title, content, category, featured } = body

    // Basic validation
    if (!title || !content || !category) {
      return NextResponse.json({ error: "Title, content, and category are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("articles").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          content,
          category,
          featured: Boolean(featured),
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const updatedArticle = await db.collection("articles").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      success: true,
      article: {
        ...updatedArticle,
        _id: updatedArticle._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/articles/[id] - Delete a specific article (Admin only)
export async function DELETE(request, { params }) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid article ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("articles").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
