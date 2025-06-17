import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText, CircularProgress, Box, SelectChangeEvent } from '@mui/material';

export interface SourceDoc {
    id: string | number;
    title: string;
}

export interface SourceDocSelectProps {
    value: string;
    onChange: (event: SelectChangeEvent) => void;
    sourceDocs?: SourceDoc[];
    loading?: boolean;
    error?: string | null;
    label?: string;
    required?: boolean;
    sx?: object;
    [key: string]: any;
}

const SourceDocSelect: React.FC<SourceDocSelectProps> = ({
    value,
    onChange,
    sourceDocs = [],
    loading = false,
    error = null,
    label = 'Source Document',
    required = false,
    sx = {},
    ...props
}) => {
    return (
        <FormControl sx={{ minWidth: 200, ...sx }} disabled={loading || !!error} error={!!error}>
            <InputLabel id="source-doc-label">{label}</InputLabel>
            <Select
                labelId="source-doc-label"
                value={value}
                label={label}
                onChange={onChange}
                required={required}
                {...props}
            >
                {/* Only show menu items when not loading */}
                {!loading && (
                    sourceDocs.length === 0 ? (
                        <MenuItem value="" disabled>No documents found</MenuItem>
                    ) : (
                        sourceDocs.map((doc) => (
                            <MenuItem key={String(doc.id)} value={String(doc.id)}>{doc.title}</MenuItem>
                        ))
                    )
                )}
            </Select>
            {loading && (
                <Box display="flex" alignItems="center" mt={1} data-testid="loading-indicator">
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading...
                </Box>
            )}
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
};

export default SourceDocSelect;
