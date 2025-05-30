import React from 'react';
import { Button, CircularProgress } from '@mui/material';

export default function GenerateSummaryButton({ loading, onClick, icon, children, ...props }) {
    return (
        <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : icon}
            onClick={onClick}
            disabled={loading}
            sx={{ minWidth: 0, px: 1 }}
            {...props}
        >
            {loading ? 'Generating...' : children}
        </Button>
    );
}
