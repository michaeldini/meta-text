import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';

/**
 * useDebouncedField - manages a field value and debounced callback
 * @param initialValue
 * @param onDebouncedChange - called with value after delay
 * @param delay - debounce ms
 */
export function useDebouncedField(
    initialValue: string,
    onDebouncedChange: (value: string) => void,
    delay: number = 800
): [string, Dispatch<SetStateAction<string>>] {
    const [value, setValue] = useState(initialValue || '');
    const firstRun = useRef(true);

    useEffect(() => {
        setValue(initialValue || '');
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
    }, [value, initialValue, onDebouncedChange, delay]);

    return [value, setValue];
}
