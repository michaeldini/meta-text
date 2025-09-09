/* eslint-disable */
// Test setup for Vitest + JSDOM
// Purpose: provide DOM APIs and common browser mocks used across the test suite.
// Tweaks below are project-specific: idempotent guards, use `globalThis`, and
// expose spies (vi.fn) so tests can assert calls where needed.
import "@testing-library/jest-dom/vitest"
import { JSDOM } from "jsdom"
import ResizeObserver from "resize-observer-polyfill"
import { vi } from "vitest"
import "vitest-axe/extend-expect"
// 
// Ensure we don't clobber an existing JSDOM (Vitest may already provide one).
let window: any
if (typeof (globalThis as any).window === "undefined") {
  const { window: _window } = new JSDOM()
  window = _window
} else {
  window = (globalThis as any).window
}

// ResizeObserver mock (idempotent)
if (!(globalThis as any).ResizeObserver) {
  vi.stubGlobal("ResizeObserver", ResizeObserver)
  window.ResizeObserver = ResizeObserver
}

// IntersectionObserver mock (idempotent)
if (!(globalThis as any).IntersectionObserver) {
  const IntersectionObserverMock = vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    takeRecords: vi.fn(),
    unobserve: vi.fn(),
  }))
  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock)
  window.IntersectionObserver = IntersectionObserverMock
}

// Scroll method spies so tests can assert calls
if (!window.Element.prototype.scrollTo || (window.Element.prototype.scrollTo && !(window.Element.prototype.scrollTo as any)._isViFn)) {
  window.Element.prototype.scrollTo = vi.fn()
}
if (!window.Element.prototype.scrollIntoView || (window.Element.prototype.scrollIntoView && !(window.Element.prototype.scrollIntoView as any)._isViFn)) {
  window.Element.prototype.scrollIntoView = vi.fn()
}

// requestAnimationFrame: keep a small deterministic delay (about 16ms)
window.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 16)

// URL object mocks as spies
if (!window.URL.createObjectURL || !(window.URL.createObjectURL as any)._isViFn) {
  window.URL.createObjectURL = vi.fn(() => "https://i.pravatar.cc/300")
}
if (!window.URL.revokeObjectURL || !(window.URL.revokeObjectURL as any)._isViFn) {
  window.URL.revokeObjectURL = vi.fn()
}

// navigator.clipboard mock (idempotent)
// If navigator doesn't exist, create a minimal object with clipboard.
// If it exists, add a clipboard property without overwriting other properties
// (preserves userAgent and other fields that libraries like react-dom may read).
if (typeof (globalThis as any).navigator === "undefined") {
  Object.defineProperty(globalThis, "navigator", {
    value: {
      clipboard: {
        writeText: vi.fn(),
      },
    },
    configurable: true,
  })
} else if (!(globalThis as any).navigator?.clipboard) {
  try {
    // Prefer defining the clipboard property directly on the existing navigator
    Object.defineProperty((globalThis as any).navigator, "clipboard", {
      value: {
        writeText: vi.fn(),
      },
      configurable: true,
    })
  } catch {
    // Fallback: assign if defineProperty fails in some environments
    ; (globalThis as any).navigator.clipboard = {
      writeText: vi.fn(),
    }
  }
}

// Expose window/document on globalThis so tests and libraries can access them
Object.assign(globalThis as any, { window, document: window.document })

// window.matchMedia mock for Chakra UI (idempotent)
if (!window.matchMedia) {
  window.matchMedia = function () {
    return {
      matches: false,
      addListener: () => { },
      removeListener: () => { },
      addEventListener: () => { },
      removeEventListener: () => { },
      dispatchEvent: () => false,
    }
  } as any
}

// Tip: To centralize document hooks mocks across tests, import once at the top of a suite:
// import '../tests/__mocks__/documentsData.mock'
// Then override specific spies per test using docsSpies.<hook>.mockImplementation(...)