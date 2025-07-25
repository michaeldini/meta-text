import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import { PencilSquareIcon } from 'icons';
import type { RewriteToolButtonProps } from 'features/chunk-shared/types';

export function RewriteToolButton(props: RewriteToolButtonProps) {
    const { onClick, disabled } = props;

    return (
        <Tooltip title="Rewrite chunk" arrow enterDelay={200} placement="left">
            <IconButton onClick={onClick} size="small" aria-label="Rewrite chunk" disabled={disabled}>
                <PencilSquareIcon />
            </IconButton>
        </Tooltip>
    );
}

export default RewriteToolButton;
