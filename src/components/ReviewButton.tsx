import React from 'react';
import { Button, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { UndoArrowIcon } from './icons'; // Use a random icon for now

export interface ReviewButtonProps {
    label: string;
    toolTip?: string;
    onClick: () => void;
    disabled?: boolean;
    sx?: SxProps<Theme>;
}

const ReviewButton: React.FC<ReviewButtonProps> = ({ label, toolTip, onClick, disabled = false, sx }) => (
    <Tooltip title={toolTip || ''} arrow disableHoverListener={!toolTip}>
        <Button
            variant="outlined"
            color="primary"
            sx={{ ...sx, opacity: disabled ? 0.5 : 1, flex: 1 }}
            onClick={onClick}
            disabled={disabled}
            aria-label={toolTip || 'Review Button'}
        >
            <UndoArrowIcon style={{ marginRight: 8 }} />
            {label}
        </Button>
    </Tooltip>
);

export default ReviewButton;
