import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { Tooltip } from 'components'
import { HiPencilSquare } from 'react-icons/hi2';

// Props for RewriteToolButton (local, not shared)
export interface RewriteToolButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export function RewriteToolButton(props: RewriteToolButtonProps) {
    const { onClick, disabled } = props;

    return (
        <Tooltip content="Rewrite chunk">
            <IconButton onClick={onClick} aria-label="Rewrite chunk" disabled={disabled} color="fg">
                <HiPencilSquare />
            </IconButton>
        </Tooltip >
    );
}

export default RewriteToolButton;
