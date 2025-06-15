import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export interface SourceDocSelectProps {
    value: string | number;
    onChange: (event: any) => void;
    sourceDocs?: Array<{ id: string | number; title: string } | string>;
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
        <FormControl sx={{ minWidth: 200, ...sx }} disabled={loading || !!error}>
            <InputLabel id="source-doc-label">{label}</InputLabel>
            <Select
                labelId="source-doc-label"
                value={value}
                label={label}
                onChange={onChange}
                required={required}
                {...props}
            >
                {loading ? (
                    <MenuItem value="" disabled>Loading...</MenuItem>
                ) : error ? (
                    <MenuItem value="" disabled>Error loading documents</MenuItem>
                ) : sourceDocs.length === 0 ? (
                    <MenuItem value="" disabled>No documents found</MenuItem>
                ) : (
                    sourceDocs.map((doc, idx) => {
                        let key, value, label;
                        if (typeof doc === 'object' && doc !== null) {
                            key = doc.id || idx;
                            value = doc.id || String(idx);
                            label = doc.title || String(idx);
                        } else {
                            key = doc;
                            value = doc;
                            label = doc;
                        }
                        return (
                            <MenuItem key={key} value={value}>{label}</MenuItem>
                        );
                    })
                )}
            </Select>
        </FormControl>
    );
};

export default SourceDocSelect;
