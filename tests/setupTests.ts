// tests/setupTests.ts
import '@testing-library/jest-dom';

// You can add more global setup here if needed

// Mock scrollIntoView globally for jsdom compatibility
if (typeof window !== 'undefined' && window.HTMLElement && !window.HTMLElement.prototype.scrollIntoView) {
    window.HTMLElement.prototype.scrollIntoView = function () { };
}
