/*
 * Minimal Vitest setup file.
 * Purpose: provide only the mocks actually needed by current components.
 * Remove or extend cautiously; keep deterministic & idempotent.
 */
import "@testing-library/jest-dom/vitest";
import "vitest-axe/extend-expect";
import { vi } from "vitest";

// ----------------------------------------------------------------------------
// Clipboard (needed by CopyTool)
// ----------------------------------------------------------------------------
if (!navigator.clipboard) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn() },
    configurable: true,
  });
} else if (!(navigator as any).clipboard?.writeText) {
  (navigator as any).clipboard.writeText = vi.fn();
}

// ----------------------------------------------------------------------------
// Blob URL APIs (needed by downloadJsonAsFile)
// ----------------------------------------------------------------------------
if (!window.URL.createObjectURL) {
  window.URL.createObjectURL = vi.fn(() => "blob:mock-url");
}
if (!window.URL.revokeObjectURL) {
  window.URL.revokeObjectURL = vi.fn();
}

// ----------------------------------------------------------------------------
// requestAnimationFrame shim (common in UI libs / animations)
// ----------------------------------------------------------------------------
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 16);
}

// ----------------------------------------------------------------------------
// Scroll stubs (occasionally invoked by components; keep spies for assertions)
// ----------------------------------------------------------------------------
window.scrollTo ||= vi.fn();
Element.prototype.scrollIntoView ||= vi.fn();

// ----------------------------------------------------------------------------
// Lightweight, no-op observers (avoid errors if a dependency probes them)
// ----------------------------------------------------------------------------
class NoopResizeObserver {
  observe() { /* no-op */ }
  unobserve() { /* no-op */ }
  disconnect() { /* no-op */ }
}
class NoopIntersectionObserver {
  observe() { /* no-op */ }
  unobserve() { /* no-op */ }
  disconnect() { /* no-op */ }
  takeRecords() { return []; }
}
(window as any).ResizeObserver ||= NoopResizeObserver;
(window as any).IntersectionObserver ||= NoopIntersectionObserver;

// ----------------------------------------------------------------------------
// Optional matchMedia stub (uncomment if a component branches on it later)
// ----------------------------------------------------------------------------
// if (!window.matchMedia) {
//   window.matchMedia = (() => ({
//     matches: false,
//     addListener: () => {},
//     removeListener: () => {},
//     addEventListener: () => {},
//     removeEventListener: () => {},
//     dispatchEvent: () => false,
//   })) as any;
// }

// Keep file free of side-effect console noise
// (Add custom global test helpers here if needed.)