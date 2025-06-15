import React from 'react';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import aiStars from '../assets/ai-stars.png';
import { AiGenerationBtn } from './AiGenerationBtn';

export interface AiGenerationButtonProps {
    label: string;
    toolTip?: string;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
    sx?: object;
}

const AiGenerationButton: React.FC<AiGenerationButtonProps> = ({ label, toolTip, onClick, loading = false, disabled = false, sx }) => (
    <Tooltip title={toolTip || ''} arrow disableHoverListener={!toolTip}>
        <span>
            <Button
                variant="outlined"
                color="secondary"
                sx={{ ...sx, ...AiGenerationBtn, opacity: loading ? 0.7 : 1 }}
                onClick={onClick}
                disabled={disabled || loading}
                aria-label={toolTip || 'AI Generation Button'}
            >
                {loading ? <CircularProgress /> :
                    <>
                        {label}
                        <img src={aiStars} alt="AI" style={{ width: 20, height: 20, marginLeft: 8 }} />
                    </>
                }
            </Button>
        </span>
    </Tooltip>
);

export default AiGenerationButton;
