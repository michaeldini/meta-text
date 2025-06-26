import React from 'react';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { StarsIcon } from '../components/icons'; // Adjust the import path as necessary
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
            sx={{ ...sx, opacity: loading ? 0.7 : 1, flex: 1 }}
            onClick={onClick}
            disabled={disabled || loading}
            aria-label={toolTip || 'AI Generation Button'}
        >
            {loading ? <CircularProgress size={20} aria-label="Loading AI generation" /> :
                <>
                    <StarsIcon style={{ marginRight: 8 }} />
                    {label}
                </>
            }
        </Button>
    </Tooltip>
);

export default AiGenerationButton;
