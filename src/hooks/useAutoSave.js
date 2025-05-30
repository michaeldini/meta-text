import { useEffect, useRef } from "react";

// Simple value-based autosave hook for MetaTextPage
export function useAutoSave({ value, delay = 1500, onSave, deps = [] }) {
    const timeout = useRef();
    const prevValue = useRef(value);
    useEffect(() => {
        if (prevValue.current !== value) {
            if (timeout.current) clearTimeout(timeout.current);
            timeout.current = setTimeout(() => {
                onSave();
                timeout.current = null;
                prevValue.current = value;
            }, delay);
        }
        return () => timeout.current && clearTimeout(timeout.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, delay, ...deps]);
}
