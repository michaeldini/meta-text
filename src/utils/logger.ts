/**
 * Logger utility for the application
 * Use when you need to debug.
 * Logs messages to the console and optionally sends them to a backend service.
 * 
 * Usage:
 * import log from '@utils/logger';
 * log.info('This is an info message');
 * log.error('This is an error message');
 */

import log from 'loglevel';

// Set log level based on environment
let mode = 'development';
try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE) {
        mode = import.meta.env.MODE;
    }
} catch {
    // fallback to 'development'
}
if (mode === 'production') {
    log.setLevel('warn'); // Only warnings and errors in production
} else {
    log.setLevel('info'); // Info, warn, error, debug in dev
}

// Optionally, create named loggers for features/modules
// const apiLogger = log.getLogger('api');
// apiLogger.setLevel('info');

// Utility to also send logs to backend for centralization
async function sendLogToBackend(level: string, message: string, context: Record<string, unknown> = {}) {
    try {
        await fetch('/api/frontend-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ level, message, context }),
        });
    } catch {
        // Don't throw if logging fails
    }
}

// Helper function to safely convert log arguments to string
function stringifyArgs(args: unknown[]): string {
    return args.map(arg => {
        if (typeof arg === 'string') return arg;
        if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
        try {
            return JSON.stringify(arg);
        } catch {
            return String(arg);
        }
    }).join(' ');
}

// Wrap loglevel to also send error/warn/info logs to backend
const originalError = log.error;
log.error = function (...args: unknown[]) {
    originalError.apply(log, args);
    sendLogToBackend('error', stringifyArgs(args));
};
const originalWarn = log.warn;
log.warn = function (...args: unknown[]) {
    originalWarn.apply(log, args);
    sendLogToBackend('warn', stringifyArgs(args));
};
const originalInfo = log.info;
log.info = function (...args: unknown[]) {
    originalInfo.apply(log, args);
    sendLogToBackend('info', stringifyArgs(args));
};

export default log;
