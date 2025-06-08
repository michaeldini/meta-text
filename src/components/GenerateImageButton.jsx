import React from 'react';
import { Button } from '@mui/material';
import LoadingIndicator from './LoadingIndicator';

/**
 * GenerateImageButton - reusable button for image generation with loading state
 * Props:
 *   loading: boolean
 *   onClick: function
 *   disabled: boolean
 *   sx: style object (optional)
 *   children: button label (optional)
 */
const GenerateImageButton = ({ loading, onClick, disabled, sx, children }) => (
    <Button
        variant="contained"
        color="primary"
        sx={sx}
        onClick={onClick}
        disabled={disabled || loading}
    >
        {loading ? <LoadingIndicator loading={true} /> : (children || 'Generate Image')}
    </Button>
);

export default GenerateImageButton;
