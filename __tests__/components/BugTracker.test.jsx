import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import BugTracker from "@/app/page"
import jest from "jest" // Import jest to declare it

// Mock the toast hook
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

// Mock fetch
global.fetch = jest.fn()

const mockFetch = fetch

const mockBugs = [
  {
    _id: "1",
    title: "Test Bug 1",
    description: "Description 1",
    severity: "high",
    status: "open",
    reporter: "John Doe",
    assignee: "Jane Smith",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    _id: "2",
    title: "Test Bug 2",
    description: "Description 2",
    severity: "medium",
    status: "resolved",
    reporter: "Jane Doe",
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  },
]

beforeEach(() => {
  mockFetch.mockClear()
})

describe("BugTracker Component", () => {
  it("renders the bug tracker title", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bugs: [] }),
    })

    render(<BugTracker />)

    expect(screen.getByText("Bug Tracker")).toBeInTheDocument()
    expect(screen.getByTestId("add-bug-button")).toBeInTheDocument()
  })

  it("fetches and displays bugs on mount", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bugs: mockBugs }),
    })

    render(<BugTracker />)

    await waitFor(() => {
      expect(screen.getByText("Test Bug 1")).toBeInTheDocument()
      expect(screen.getByText("Test Bug 2")).toBeInTheDocument()
    })

    expect(mockFetch).toHaveBeenCalledWith("/api/bugs")
  })

  it("displays loading state initially", () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<BugTracker />)

    expect(screen.getByText("Loading bugs...")).toBeInTheDocument()
  })

  it("displays error message when fetch fails", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    render(<BugTracker />)

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument()
    })
  })

  it("opens bug form when add button is clicked", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bugs: [] }),
    })

    render(<BugTracker />)

    await waitFor(() => {
      expect(screen.queryByText("Loading bugs...")).not.toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId("add-bug-button"))

    expect(screen.getByText("Report New Bug")).toBeInTheDocument()
    expect(screen.getByTestId("bug-form")).toBeInTheDocument()
  })

  it("submits new bug form successfully", async () => {
    const user = userEvent.setup()

    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bugs: [] }),
    })

    render(<BugTracker />)

    await waitFor(() => {
      expect(screen.queryByText("Loading bugs...")).not.toBeInTheDocument()
    })

    // Open form
    fireEvent.click(screen.getByTestId("add-bug-button"))

    // Fill form
    await user.type(screen.getByTestId("title-input"), "New Bug")
    await user.type(screen.getByTestId("description-input"), "Bug description")
    await user.type(screen.getByTestId("reporter-input"), "John Doe")

    // Mock form submission
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, bug: mockBugs[0] }),
    })

    // Mock refetch after submission
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bugs: [mockBugs[0]] }),
    })

    // Submit form
    fireEvent.click(screen.getByTestId("submit-button"))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Bug",
          description: "Bug description",
          severity: "medium",
          status: "open",
          reporter: "John Doe",
          assignee: "",
        }),
      })
    })
  })

  it("validates required fields in form", async () => {
    const user = userEvent.setup()

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bugs: [] }),
    })

    render(<BugTracker />)

    await waitFor(() => {
      expect(screen.queryByText("Loading bugs...")).not.toBeInTheDocument()
    })

    // Open form
    fireEvent.click(screen.getByTestId("add-bug-button"))

    // Try to submit without filling required fields
    fireEvent.click(screen.getByTestId("submit-button"))

    // Form should not submit (HTML5 validation will prevent it)
    expect(mockFetch).toHaveBeenCalledTimes(1) // Only the initial fetch
  })

  it("deletes a bug when delete button is clicked", async () => {
    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bugs: mockBugs }),
    })

    // Mock window.confirm
    window.confirm = jest.fn(() => true)

    render(<BugTracker />)

    await waitFor(() => {
      expect(screen.getByText("Test Bug 1")).toBeInTheDocument()
    })

    // Mock delete request
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    // Mock refetch after deletion
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bugs: [mockBugs[1]] }),
    })

    // Click delete button
    const deleteButtons = screen.getAllByTestId("delete-button")
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/bugs/1", {
        method: "DELETE",
      })
    })
  })

  it("cancels delete when user clicks cancel in confirm dialog", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bugs: mockBugs }),
    })

    // Mock window.confirm to return false
    window.confirm = jest.fn(() => false)

    render(<BugTracker />)

    await waitFor(() => {
      expect(screen.getByText("Test Bug 1")).toBeInTheDocument()
    })

    // Click delete button
    const deleteButtons = screen.getAllByTestId("delete-button")
    fireEvent.click(deleteButtons[0])

    // Should not make delete request
    expect(mockFetch).toHaveBeenCalledTimes(1) // Only initial fetch
  })

  it("opens edit form when edit button is clicked", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bugs: mockBugs }),
    })

    render(<BugTracker />)

    await waitFor(() => {
      expect(screen.getByText("Test Bug 1")).toBeInTheDocument()
    })

    // Click edit button
    const editButtons = screen.getAllByTestId("edit-button")
    fireEvent.click(editButtons[0])

    // Should show edit form with pre-filled data
    expect(screen.getByText("Edit Bug")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Test Bug 1")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Description 1")).toBeInTheDocument()
  })

  it("displays empty state when no bugs exist", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bugs: [] }),
    })

    render(<BugTracker />)

    await waitFor(() => {
      expect(screen.getByText('No bugs reported yet. Click "Report Bug" to get started.')).toBeInTheDocument()
    })
  })
})
