import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useAutoSave - A reusable hook for auto-saving form or input data.
 * @param {object} params
 *   data: The data object to watch for changes
 *   onSave: Function to call to save the data (should return a Promise)
 *   debounceMs: Debounce time in ms (default: 1000)
 * @returns {object} { isSaving, isDirty, save, setData, data }
 */
export function useAutoSave({ data: initialData, onSave, debounceMs = 1000 }) {
    const [data, setData] = useState(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const saveTimeout = useRef(null);
    const isMounted = useRef(true);

    // Update data and mark as dirty
    const updateData = useCallback(
        (updater) => {
            setData((prev) => {
                const next = typeof updater === "function" ? updater(prev) : updater;
                setIsDirty(true);
                return next;
            });
        },
        []
    );

    // Auto-save effect
    useEffect(() => {
        if (!isDirty) return;
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
            save();
        }, debounceMs);
        return () => clearTimeout(saveTimeout.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    // Manual save
    const save = useCallback(async () => {
        if (!isDirty || isSaving) return;
        setIsSaving(true);
        try {
            await onSave(data);
            if (isMounted.current) setIsDirty(false);
        } finally {
            if (isMounted.current) setIsSaving(false);
        }
    }, [data, isDirty, isSaving, onSave]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
            if (saveTimeout.current) clearTimeout(saveTimeout.current);
        };
    }, []);

    return { data, setData: updateData, isSaving, isDirty, save };
}

// Simple value-based autosave hook for MetaTextPage
export function useSimpleAutoSave({ value, delay = 1500, onSave, deps = [] }) {
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
