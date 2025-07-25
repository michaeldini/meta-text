import "@testing-library/jest-dom/vitest"
import { JSDOM } from "jsdom"
import ResizeObserver from "resize-observer-polyfill"
import { vi } from "vitest"
import "vitest-axe/extend-expect"

const { window } = new JSDOM()

// ResizeObserver mock
vi.stubGlobal("ResizeObserver", ResizeObserver)
window["ResizeObserver"] = ResizeObserver

// IntersectionObserver mock
const IntersectionObserverMock = vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    takeRecords: vi.fn(),
    unobserve: vi.fn(),
}))
vi.stubGlobal("IntersectionObserver", IntersectionObserverMock)
window["IntersectionObserver"] = IntersectionObserverMock

// Scroll Methods mock
window.Element.prototype.scrollTo = () => { }
window.Element.prototype.scrollIntoView = () => { }

// requestAnimationFrame mock
window.requestAnimationFrame = (cb) => setTimeout(cb, 1000 / 60)

// URL object mock
window.URL.createObjectURL = () => "https://i.pravatar.cc/300"
window.URL.revokeObjectURL = () => { }

// navigator mock
Object.defineProperty(window, "navigator", {
    value: {
        clipboard: {
            writeText: vi.fn(),
        },
    },
})

// Override globalThis
Object.assign(global, { window, document: window.document })

/**
 * This setup file configures your test environment for React component testing with Vitest and React Testing Library. Here’s what each part does and why it’s useful:

1. **JSDOM Setup**  
   - `const { window } = new JSDOM()`  
   Creates a simulated browser environment so your React components can run as if in a real browser.

2. **Global Mocks for Browser APIs**  
   - **ResizeObserver** and **IntersectionObserver**:  
     These are browser APIs often used by UI libraries (like Chakra UI, Material UI, etc.) for layout and visibility calculations.  
     The mocks (`vi.stubGlobal(...)`) prevent errors when these APIs are called in tests, since JSDOM doesn’t implement them.
   - **Scroll Methods**:  
     Mocks `scrollTo` and `scrollIntoView` so components using these won’t throw errors.
   - **requestAnimationFrame**:  
     Mocks this animation API for smoother test execution.
   - **URL.createObjectURL / revokeObjectURL**:  
     Mocks file URL creation, useful for components handling images/files.
   - **navigator.clipboard.writeText**:  
     Mocks clipboard API for tests involving copy-to-clipboard features.

3. **Testing Library Extensions**  
   - `@testing-library/jest-dom/vitest` and `vitest-axe/extend-expect`:  
     Adds custom matchers for better assertions (e.g., `.toBeInTheDocument()`, accessibility checks).

4. **Global Assignment**  
   - `Object.assign(global, { window, document: window.document })`  
   Ensures global objects (`window`, `document`) are available everywhere in your tests.

**Do you need this?**  
Yes, if your components (or Chakra UI, Material UI, etc.) use any of these browser APIs, or if you want robust, error-free tests. This setup is standard and recommended for modern React UI testing. If you remove it, you may encounter errors about missing browser features.

**Summary:**  
This file ensures your tests run smoothly by simulating a browser and mocking APIs that JSDOM doesn’t support. It’s best practice for UI testing in React projects using libraries like Chakra UI or Material UI.
 */