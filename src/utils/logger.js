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
async function sendLogToBackend(level, message, context = {}) {
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

// Wrap loglevel to also send error/warn/info logs to backend
const originalError = log.error;
log.error = function (...args) {
    originalError.apply(log, args);
    sendLogToBackend('error', args.map(String).join(' '));
};
const originalWarn = log.warn;
log.warn = function (...args) {
    originalWarn.apply(log, args);
    sendLogToBackend('warn', args.map(String).join(' '));
};
const originalInfo = log.info;
log.info = function (...args) {
    originalInfo.apply(log, args);
    sendLogToBackend('info', args.map(String).join(' '));
};

export default log;
