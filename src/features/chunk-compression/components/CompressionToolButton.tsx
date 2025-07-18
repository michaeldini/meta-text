import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import { CompressionIcon } from 'icons';
import type { CompressionToolButtonProps } from 'features/chunk-shared/types';

const CompressionToolButton: React.FC<CompressionToolButtonProps> = ({ onClick, disabled }) => (
    <Tooltip title="Compress chunk" arrow enterDelay={200} placement="left">
        <IconButton onClick={onClick} size="small" aria-label="Compress chunk" disabled={disabled}>
            <CompressionIcon fontSize="small" />
        </IconButton>
    </Tooltip>
);

export default CompressionToolButton;
