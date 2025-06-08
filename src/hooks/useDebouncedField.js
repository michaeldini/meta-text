import { useState, useEffect, useRef } from 'react';

/**
 * useDebouncedField - manages a field value and debounced callback
 * @param {string} initialValue
 * @param {function} onDebouncedChange - called with value after delay
 * @param {number} delay - debounce ms
 */
export function useDebouncedField(initialValue, onDebouncedChange, delay = 800) {
    const [value, setValue] = useState(initialValue || '');
    const firstRun = useRef(true);

    useEffect(() => {
        setValue(initialValue || '');
        // eslint-disable-next-line
    }, [initialValue]);

    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            return;
        }
        const handler = setTimeout(() => {
            if (value !== initialValue) {
                onDebouncedChange(value);
            }
        }, delay);
        return () => clearTimeout(handler);
        // eslint-disable-next-line
    }, [value, initialValue, onDebouncedChange, delay]);

    return [value, setValue];
}
