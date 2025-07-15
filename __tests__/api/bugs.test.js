import { createMocks } from "node-mocks-http"
import { GET, POST } from "@/app/api/bugs/route"
import { GET as getById, PUT, DELETE } from "@/app/api/bugs/[id]/route"
import jest from "jest" // Declare the jest variable

// Mock MongoDB
jest.mock("@/server/mongodb", () => ({
  connectToDatabase: jest.fn(),
}))

const mockDb = {
  collection: jest.fn(() => ({
    find: jest.fn(() => ({
      sort: jest.fn(() => ({
        toArray: jest.fn(),
      })),
    })),
    findOne: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  })),
}

const { connectToDatabase } = require("@/server/mongodb")

beforeEach(() => {
  jest.clearAllMocks()
  connectToDatabase.mockResolvedValue({ db: mockDb })
})

describe("/api/bugs", () => {
  describe("GET", () => {
    it("should fetch all bugs successfully", async () => {
      const mockBugs = [
        {
          _id: { toString: () => "507f1f77bcf86cd799439011" },
          title: "Test Bug",
          description: "Test Description",
          severity: "medium",
          status: "open",
          reporter: "John Doe",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockDb.collection().find().sort().toArray.mockResolvedValue(mockBugs)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.bugs).toHaveLength(1)
      expect(data.bugs[0].title).toBe("Test Bug")
    })

    it("should handle database errors", async () => {
      mockDb.collection().find().sort().toArray.mockRejectedValue(new Error("Database error"))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Internal server error")
    })
  })

  describe("POST", () => {
    it("should create a new bug successfully", async () => {
      const bugData = {
        title: "New Bug",
        description: "Bug description",
        severity: "high",
        status: "open",
        reporter: "Jane Doe",
        assignee: "John Smith",
      }

      const mockInsertResult = { insertedId: { toString: () => "507f1f77bcf86cd799439012" } }
      const mockCreatedBug = {
        _id: { toString: () => "507f1f77bcf86cd799439012" },
        ...bugData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockDb.collection().insertOne.mockResolvedValue(mockInsertResult)
      mockDb.collection().findOne.mockResolvedValue(mockCreatedBug)

      const { req } = createMocks({
        method: "POST",
        body: bugData,
      })

      // Mock request.json()
      const mockRequest = {
        json: jest.fn().mockResolvedValue(bugData),
      }

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.bug.title).toBe("New Bug")
    })

    it("should validate required fields", async () => {
      const invalidBugData = {
        title: "",
        description: "Bug description",
        severity: "high",
        status: "open",
        reporter: "Jane Doe",
      }

      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidBugData),
      }

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
    })

    it("should validate severity values", async () => {
      const invalidBugData = {
        title: "Test Bug",
        description: "Bug description",
        severity: "invalid",
        status: "open",
        reporter: "Jane Doe",
      }

      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidBugData),
      }

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
    })
  })
})

describe("/api/bugs/[id]", () => {
  const validId = "507f1f77bcf86cd799439011"
  const mockBug = {
    _id: { toString: () => validId },
    title: "Test Bug",
    description: "Test Description",
    severity: "medium",
    status: "open",
    reporter: "John Doe",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  describe("GET", () => {
    it("should fetch a specific bug successfully", async () => {
      mockDb.collection().findOne.mockResolvedValue(mockBug)

      const mockRequest = {}
      const response = await getById(mockRequest, { params: { id: validId } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.bug.title).toBe("Test Bug")
    })

    it("should return 404 for non-existent bug", async () => {
      mockDb.collection().findOne.mockResolvedValue(null)

      const mockRequest = {}
      const response = await getById(mockRequest, { params: { id: validId } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Bug not found")
    })

    it("should return 400 for invalid ObjectId", async () => {
      const mockRequest = {}
      const response = await getById(mockRequest, { params: { id: "invalid-id" } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Invalid bug ID format")
    })
  })

  describe("PUT", () => {
    it("should update a bug successfully", async () => {
      const updateData = { status: "resolved" }
      const updatedBug = { ...mockBug, status: "resolved", updatedAt: new Date() }

      mockDb.collection().findOne.mockResolvedValueOnce(mockBug).mockResolvedValueOnce(updatedBug)
      mockDb.collection().updateOne.mockResolvedValue({ matchedCount: 1 })

      const mockRequest = {
        json: jest.fn().mockResolvedValue(updateData),
      }

      const response = await PUT(mockRequest, { params: { id: validId } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.bug.status).toBe("resolved")
    })

    it("should validate update data", async () => {
      const invalidUpdateData = { severity: "invalid" }

      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidUpdateData),
      }

      const response = await PUT(mockRequest, { params: { id: validId } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Validation failed")
    })
  })

  describe("DELETE", () => {
    it("should delete a bug successfully", async () => {
      mockDb.collection().deleteOne.mockResolvedValue({ deletedCount: 1 })

      const mockRequest = {}
      const response = await DELETE(mockRequest, { params: { id: validId } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe("Bug deleted successfully")
    })

    it("should return 404 for non-existent bug", async () => {
      mockDb.collection().deleteOne.mockResolvedValue({ deleted: 0 })

      const mockRequest = {}
      const response = await DELETE(mockRequest, { params: { id: validId } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Bug not found")
    })
  })
})
