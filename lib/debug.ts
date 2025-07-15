// Debug utilities for the Bug Tracker application

export class DebugLogger {
  private static instance: DebugLogger
  private isEnabled: boolean

  private constructor() {
    this.isEnabled = process.env.NODE_ENV === "development"
  }

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger()
    }
    return DebugLogger.instance
  }

  log(message: string, data?: any, level: "info" | "warn" | "error" = "info") {
    if (!this.isEnabled) return

    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`

    switch (level) {
      case "warn":
        console.warn(`${prefix} ${message}`, data || "")
        break
      case "error":
        console.error(`${prefix} ${message}`, data || "")
        break
      default:
        console.log(`${prefix} ${message}`, data || "")
    }
  }

  info(message: string, data?: any) {
    this.log(message, data, "info")
  }

  warn(message: string, data?: any) {
    this.log(message, data, "warn")
  }

  error(message: string, data?: any) {
    this.log(message, data, "error")
  }

  // Performance monitoring
  time(label: string) {
    if (this.isEnabled) {
      console.time(label)
    }
  }

  timeEnd(label: string) {
    if (this.isEnabled) {
      console.timeEnd(label)
    }
  }

  // API request/response logging
  logApiRequest(method: string, url: string, data?: any) {
    this.info(`API Request: ${method} ${url}`, data)
  }

  logApiResponse(method: string, url: string, status: number, data?: any) {
    const level = status >= 400 ? "error" : "info"
    this.log(`API Response: ${method} ${url} - ${status}`, data, level)
  }

  // Component lifecycle logging
  logComponentMount(componentName: string) {
    this.info(`Component mounted: ${componentName}`)
  }

  logComponentUnmount(componentName: string) {
    this.info(`Component unmounted: ${componentName}`)
  }

  // State change logging
  logStateChange(componentName: string, stateName: string, oldValue: any, newValue: any) {
    this.info(`State change in ${componentName}: ${stateName}`, {
      from: oldValue,
      to: newValue,
    })
  }
}

// Export singleton instance
export const debugLogger = DebugLogger.getInstance()

// Chrome DevTools integration helpers
export const chromeDevTools = {
  // Add custom properties to window for debugging
  exposeToWindow: (name: string, value: any) => {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      ;(window as any)[name] = value
    }
  },

  // Performance marks for Chrome DevTools
  mark: (name: string) => {
    if (typeof performance !== "undefined" && process.env.NODE_ENV === "development") {
      performance.mark(name)
    }
  },

  measure: (name: string, startMark: string, endMark: string) => {
    if (typeof performance !== "undefined" && process.env.NODE_ENV === "development") {
      performance.measure(name, startMark, endMark)
    }
  },
}

// Node.js inspector integration (for backend debugging)
export const nodeInspector = {
  // Enable inspector for debugging
  enable: () => {
    if (process.env.NODE_ENV === "development" && typeof process !== "undefined") {
      try {
        const inspector = require("inspector")
        if (!inspector.url()) {
          inspector.open()
          console.log("Node.js inspector enabled. Open chrome://inspect in Chrome.")
        }
      } catch (error) {
        console.warn("Could not enable Node.js inspector:", error)
      }
    }
  },

  // Add breakpoint programmatically
  debugger: () => {
    if (process.env.NODE_ENV === "development") {
      debugger // This will trigger a breakpoint when inspector is attached
    }
  },
}
