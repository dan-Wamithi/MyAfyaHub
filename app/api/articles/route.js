import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/mongodb"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"

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

// GET /api/articles - Fetch articles
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")
    const search = searchParams.get("search")
    const category = searchParams.get("category")

    const { db } = await connectToDatabase()

    const query = {}

    if (featured === "true") {
      query.featured = true
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ]
    }

    if (category && category !== "all") {
      query.category = category
    }

    let articlesQuery = db.collection("articles").find(query).sort({ createdAt: -1 })

    if (limit) {
      articlesQuery = articlesQuery.limit(Number.parseInt(limit))
    }

    const articles = await articlesQuery.toArray()

    return NextResponse.json({
      success: true,
      articles: articles.map((article) => ({
        ...article,
        _id: article._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/articles - Create article (Admin only)
export async function POST(request) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { title, content, category, featured = false } = await request.json()

    // Validation
    if (!title || !content || !category) {
      return NextResponse.json({ error: "Title, content, and category are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("articles").insertOne({
      title,
      content,
      category,
      author: admin.name,
      featured: Boolean(featured),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const article = await db.collection("articles").findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        success: true,
        article: {
          ...article,
          _id: article._id.toString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
