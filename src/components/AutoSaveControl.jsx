import React, { useEffect, useRef, useState } from "react";
import { Button, Box, Typography, Stack } from "@mui/material";

/**
 * AutoSaveControl component
 * Props:
 *   value: the value to watch for changes
 *   delay: ms delay before autosave (default 3000)
 *   onSave: function to call to save
 *   deps: extra dependencies to watch
 */
export default function AutoSaveControl({ value, delay = 3000, onSave, deps = [] }) {
    const timeout = useRef();
    const prevValue = useRef(value);
    const [lastSaved, setLastSaved] = useState(Date.now());
    const [minutesSinceSave, setMinutesSinceSave] = useState(0);

    // Autosave effect
    useEffect(() => {
        if (prevValue.current !== value) {
            if (timeout.current) clearTimeout(timeout.current);
            timeout.current = setTimeout(() => {
                onSave();
                setLastSaved(Date.now());
                prevValue.current = value;
                timeout.current = null;
            }, delay);
        }
        return () => timeout.current && clearTimeout(timeout.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, delay, ...deps]);

    // Timer for minutes since last save
    useEffect(() => {
        const interval = setInterval(() => {
            setMinutesSinceSave(Math.floor((Date.now() - lastSaved) / 60000));
        }, 1000);
        return () => clearInterval(interval);
    }, [lastSaved]);

    // Manual save handler
    const handleManualSave = () => {
        if (timeout.current) clearTimeout(timeout.current);
        onSave();
        setLastSaved(Date.now());
        prevValue.current = value;
        timeout.current = null;
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                    {minutesSinceSave === 0
                        ? "Just saved"
                        : `${minutesSinceSave} minute${minutesSinceSave > 1 ? "s" : ""} since last save`}
                </Typography>
                <Button variant="outlined" size="small" onClick={handleManualSave}>
                    Save Now
                </Button>
            </Stack>
        </Box>
    );
}
