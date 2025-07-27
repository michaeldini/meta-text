
// Toggle component for showing/hiding chunk positions
// Placed next to BookmarkNavigateButton in MetatextDetailPage

import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { Tooltip } from 'components';

import { HiHashtag } from "react-icons/hi2";

interface ChunkPositionToggleButtonProps {
    value: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
}


export function ChunkPositionToggleButton(props: ChunkPositionToggleButtonProps) {
    const { value: checked, onChange, disabled } = props;
    return (
        <Tooltip content={checked ? "Hide chunk positions" : "Show chunk positions"}>
            <IconButton
                onClick={() => onChange(!checked)}
                color={checked ? "primary" : "default"}
                data-testid="chunk-position-toggle"
                disabled={disabled}
                variant="ghost"
            >
                <HiHashtag />
            </IconButton>
        </Tooltip>
    );
}

export default ChunkPositionToggleButton;
