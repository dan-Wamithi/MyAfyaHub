import { render, screen } from "@testing-library/react"
import ErrorBoundary from "@/app/components/ErrorBoundary"
import jest from "jest" // Import jest to declare the variable

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error("Test error")
  }
  return <div>No error</div>
}

describe("ErrorBoundary", () => {
  // Suppress console.error for these tests
  const originalError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })
  afterAll(() => {
    console.error = originalError
  })

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    )

    expect(screen.getByText("No error")).toBeInTheDocument()
  })

  it("renders error UI when there is an error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
    expect(screen.getByText("An unexpected error occurred in the application.")).toBeInTheDocument()
    expect(screen.getByText("Try Again")).toBeInTheDocument()
    expect(screen.getByText("Reload Page")).toBeInTheDocument()
  })

  it("shows error details in development mode", () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = "development"

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Error Details:")).toBeInTheDocument()
    expect(screen.getByText(/Test error/)).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })

  it("hides error details in production mode", () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = "production"

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.queryByText("Error Details:")).not.toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })
})
