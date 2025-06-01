import React from 'react';
import { Button, CircularProgress } from '@mui/material';

export default function GenerateSummaryButton({ loading, onClick, icon, children, ...props }) {
    return (
        <Button

            size="small"
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : icon}
            onClick={onClick}
            disabled={loading}

            {...props}
        >
            {loading ? 'Generating...' : children}
        </Button>
    );
}
