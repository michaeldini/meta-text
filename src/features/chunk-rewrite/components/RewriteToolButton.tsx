import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { HiPencilSquare } from 'react-icons/hi2';
import { Tooltip } from '@components/ui/tooltip'

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
