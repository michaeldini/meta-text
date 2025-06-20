import React from 'react';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

export interface AiGenerationButtonProps {
    label: string;
    toolTip?: string;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
    sx?: SxProps<Theme>;
}

const AiGenerationButton: React.FC<AiGenerationButtonProps> = ({ label, toolTip, onClick, loading = false, disabled = false, sx }) => (
    <Tooltip title={toolTip || ''} arrow disableHoverListener={!toolTip}>
        <span>
            <Button
                variant="outlined"
                color="secondary"
                sx={{ ...sx, opacity: loading ? 0.7 : 1 }}
                onClick={onClick}
                disabled={disabled || loading}
                aria-label={toolTip || 'AI Generation Button'}
            >
                {loading ? <CircularProgress size={20} aria-label="Loading AI generation" /> :
                    <>
                        {label}
                        <img src="/ai-stars.png" alt="AI" style={{ width: 20, height: 20, marginLeft: 8 }} />
                    </>
                }
            </Button>
        </span>
    </Tooltip>
);

export default AiGenerationButton;
