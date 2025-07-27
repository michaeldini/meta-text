import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { Tooltip } from 'components'
import { HiPencilSquare } from 'react-icons/hi2';
import type { RewriteToolButtonProps } from 'features/chunk-shared/types';

export function RewriteToolButton(props: RewriteToolButtonProps) {
    const { onClick, disabled } = props;

    return (
        <Tooltip content="Rewrite chunk">
            <IconButton onClick={onClick} aria-label="Rewrite chunk" disabled={disabled}>
                <HiPencilSquare />
            </IconButton>
        </Tooltip>
    );
}

export default RewriteToolButton;
