import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText, CircularProgress, Box, SelectChangeEvent } from '@mui/material';
import { SourceDocument } from '../types';
import { FORM_DEFAULTS, FORM_STYLES } from '../constants';

export interface SourceDocSelectProps {
    value: string;
    onChange: (event: SelectChangeEvent) => void;
    sourceDocs?: SourceDocument[];
    loading?: boolean;
    error?: string | null;
    label?: string;
    required?: boolean;
    sx?: object;
    id?: string;
    'aria-label'?: string;
    [key: string]: any;
}

const SourceDocSelect: React.FC<SourceDocSelectProps> = React.memo(({
    value,
    onChange,
    sourceDocs = [],
    loading = false,
    error = null,
    label = 'Source Document',
    required = false,
    sx = {},
    id,
    'aria-label': ariaLabel,
    ...props
}) => {
    const controlStyles = {
        minWidth: FORM_DEFAULTS.SELECT_MIN_WIDTH,
        ...sx
    };

    const selectStyles = {
        height: FORM_STYLES.INPUT_HEIGHT,
        padding: FORM_STYLES.STANDARD_PADDING
    };

    const loadingStyles = {
        display: 'flex',
        alignItems: 'center',
        mt: 1
    };

    const spinnerStyles = {
        mr: 1,
        size: FORM_STYLES.LOADING_SPINNER_SIZE
    };

    return (
        <FormControl
            sx={controlStyles}
            disabled={loading || !!error}
            error={!!error}
        >
            <InputLabel id="source-doc-label">{label}</InputLabel>
            <Select
                labelId="source-doc-label"
                value={value}
                label={label}
                onChange={onChange}
                required={required}
                sx={selectStyles}
                id={id}
                aria-label={ariaLabel}
                aria-describedby={error ? 'select-error' : loading ? 'select-loading' : undefined}
                {...props}
            >
                {/* Only show menu items when not loading */}
                {!loading && (
                    sourceDocs.length === 0 ? (
                        <MenuItem value="" disabled>No documents found</MenuItem>
                    ) : (
                        sourceDocs.map((doc) => (
                            <MenuItem key={String(doc.id)} value={String(doc.id)}>
                                {doc.title}
                            </MenuItem>
                        ))
                    )
                )}
            </Select>
            {loading && (
                <Box sx={loadingStyles} data-testid="loading-indicator" id="select-loading">
                    <CircularProgress sx={spinnerStyles} />
                    Loading...
                </Box>
            )}
            {error && <FormHelperText id="select-error">{error}</FormHelperText>}
        </FormControl>
    );
});

export default SourceDocSelect;
