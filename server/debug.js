// Debug utilities for the AfyaHub application

export class DebugLogger {
  static instance
  isEnabled

  constructor() {
    this.isEnabled = process.env.NODE_ENV === "development"
  }

  static getInstance() {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger()
    }
    return DebugLogger.instance
  }

  log(message, data, level = "info") {
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

  info(message, data) {
    this.log(message, data, "info")
  }

  warn(message, data) {
    this.log(message, data, "warn")
  }

  error(message, data) {
    this.log(message, data, "error")
  }

  // Performance monitoring
  time(label) {
    if (this.isEnabled) {
      console.time(label)
    }
  }

  timeEnd(label) {
    if (this.isEnabled) {
      console.timeEnd(label)
    }
  }

  // API request/response logging
  logApiRequest(method, url, data) {
    this.info(`API Request: ${method} ${url}`, data)
  }

  logApiResponse(method, url, status, data) {
    const level = status >= 400 ? "error" : "info"
    this.log(`API Response: ${method} ${url} - ${status}`, data, level)
  }

  // Component lifecycle logging
  logComponentMount(componentName) {
    this.info(`Component mounted: ${componentName}`)
  }

  logComponentUnmount(componentName) {
    this.info(`Component unmounted: ${componentName}`)
  }

  // State change logging
  logStateChange(componentName, stateName, oldValue, newValue) {
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
  exposeToWindow: (name, value) => {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      window[name] = value
    }
  },

  // Performance marks for Chrome DevTools
  mark: (name) => {
    if (typeof performance !== "undefined" && process.env.NODE_ENV === "development") {
      performance.mark(name)
    }
  },

  measure: (name, startMark, endMark) => {
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
