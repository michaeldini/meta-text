// A button component styled with a StarIcon for AI generation actions, with loading and tooltip support.
// Designed to be reusable.
// Used wherever the app requires a button to trigger AI generation tasks, such as generating summaries, explanations, or other AI-driven content. 

import React from 'react';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { StarsIcon } from 'icons';

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
        <Button
            variant="outlined"
            color="secondary"
            sx={{ ...sx }}
            onClick={onClick}
            disabled={disabled || loading}
            aria-label={toolTip || 'AI Generation Button'}
            data-testid="ai-generation-button"
        >
            {loading ? <CircularProgress aria-label="Loading AI generation" /> :
                <>
                    <StarsIcon style={{ marginRight: 8 }} />
                    {label}
                </>
            }
        </Button>
    </Tooltip>
);

export default AiGenerationButton;
