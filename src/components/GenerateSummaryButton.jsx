import React from 'react';
import { Button, CircularProgress, Tooltip, IconButton } from '@mui/material';

export default function GenerateSourceDocInfoButton({ loading, onClick, icon, label }) {
    return (
        <Tooltip title={label || "Generate Summary"} placement="top">
            <span>
                <IconButton
                    color="primary"
                    size="large"
                    onClick={onClick}
                    disabled={loading}
                    aria-label={label}
                >
                    {loading ? <CircularProgress size={24} /> : icon}
                </IconButton>
            </span>
        </Tooltip>
    );
}
