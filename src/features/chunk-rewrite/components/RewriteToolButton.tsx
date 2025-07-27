import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import { HiPencilSquare } from 'react-icons/hi2';
import type { RewriteToolButtonProps } from 'features/chunk-shared/types';

export function RewriteToolButton(props: RewriteToolButtonProps) {
    const { onClick, disabled } = props;

    return (
        <Tooltip title="Rewrite chunk" arrow enterDelay={200} placement="left">
            <IconButton onClick={onClick} size="small" aria-label="Rewrite chunk" disabled={disabled}>
                <HiPencilSquare />
            </IconButton>
        </Tooltip>
    );
}

export default RewriteToolButton;
