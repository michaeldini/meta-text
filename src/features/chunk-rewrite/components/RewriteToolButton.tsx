import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import { PencilSquareIcon } from 'icons';
import type { RewriteToolButtonProps } from 'features/chunk-shared/types';

const RewriteToolButton: React.FC<RewriteToolButtonProps> = ({ onClick, disabled }) => (
    <Tooltip title="Rewrite chunk" arrow enterDelay={200} placement="left">
        <IconButton onClick={onClick} size="small" aria-label="Rewrite chunk" disabled={disabled}>
            <PencilSquareIcon />
        </IconButton>
    </Tooltip>
);

export default RewriteToolButton;
