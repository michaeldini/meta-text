import { Button } from '@mui/material';
import React from 'react';

export function AiGenerationBtn(props: React.ComponentProps<typeof Button>) {
    return (
        <Button variant="contained" color="secondary" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, py: 1.5 }} {...props} />
    );
}
