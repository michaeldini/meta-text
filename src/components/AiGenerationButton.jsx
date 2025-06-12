import React from 'react';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import aiStars from '../assets/ai-stars.png';
import { AiGenerationBtn } from '../styles/pageStyles';
/**
 * A reusable AI generation button with loading state and AI stars icon.
 * Props:
 * - label: string (button text)
 * - onClick: function (click handler)
 * - loading: boolean (shows spinner if true)
 * - disabled: boolean (disables button if true)
 * - dataTestid: string (for testing purposes)
 * - ariaLabel: string (for accessibility)
 * - sx: object (MUI style overrides)
 */
const AiGenerationButton = ({ label, toolTip, onClick, loading, disabled, dataTestid, ariaLabel, sx }) => (
    <Tooltip title={toolTip || ''} arrow disableHoverListener={!toolTip}>
        <span>
            <Button
                variant="contained"
                color="primary"
                sx={{ ...sx, textTransform: 'none', ...AiGenerationBtn, opacity: loading ? 0.7 : 1 }}
                onClick={onClick}
                disabled={disabled || loading}
                data-testid={dataTestid}
                aria-label={ariaLabel}
                className={dataTestid}
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
