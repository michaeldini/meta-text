import React from 'react';
import { Button, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { AcademicCapIcon } from './icons'; // Use a random icon for now
import { useNavigate } from 'react-router-dom';

export interface ReviewButtonProps {
    metatextId: number;
    label?: string;
    toolTip?: string;
    disabled?: boolean;
    sx?: SxProps<Theme>;
}

const ReviewButton: React.FC<ReviewButtonProps> = ({ metatextId, label = "Review", toolTip = "Review this metatext", disabled = false, sx }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/metatext/${metatextId}/review`);
    };
    return (
        <Tooltip title={toolTip || ''} arrow disableHoverListener={!toolTip}>
            <Button
                variant="outlined"
                sx={{ ...sx }}
                onClick={handleClick}
                disabled={disabled}
                aria-label={toolTip || 'Review Button'}
            >
                <AcademicCapIcon style={{ marginRight: 8 }} />
                {label}
            </Button>
        </Tooltip>
    );
};

export default ReviewButton;
