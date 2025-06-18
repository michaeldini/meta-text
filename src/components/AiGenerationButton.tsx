// Extracted shared styles for AI Generation buttons
// export const aiGenerationBtnStyles = {
//     borderRadius: 2,
//     textTransform: 'none',
//     fontWeight: 600,
//     px: 3,
//     py: 1.5,
// };

import React from 'react';
import { Button, CircularProgress, Tooltip } from '@mui/material';

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
                sx={{ ...sx, opacity: loading ? 0.7 : 1 }}
                onClick={onClick}
                disabled={disabled || loading}
                aria-label={toolTip || 'AI Generation Button'}
            >
                {loading ? <CircularProgress /> :
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
