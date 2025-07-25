import React from 'react';
import { FormControl, Select, MenuItem, Typography } from '@mui/material';
import type { RewriteSelectProps } from 'features/chunk-shared/types';



export function RewriteSelect({ rewrites, selectedId, setSelectedId, styles }: RewriteSelectProps) {
    return (
        <>
            <Typography variant="subtitle1" id="rewrite-select-label">
                Rewrite
            </Typography>
            <FormControl sx={styles.horizontalForm} margin="none">
                <Select
                    labelId="rewrite-select-label"
                    value={selectedId}
                    onChange={e => setSelectedId(Number(e.target.value))}
                    aria-labelledby="rewrite-select-label"
                    sx={styles.selectField}
                >
                    {rewrites.map(c => (
                        <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
}

export default RewriteSelect;