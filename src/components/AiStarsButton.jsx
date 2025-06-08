import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LoadingIndicator from './LoadingIndicator';
import aiStars from '../assets/ai-stars.png';

/**
 * A reusable AI action button with the AI stars icon and loading state.
 * Props:
 * - loading: boolean (shows spinner if true)
 * - onClick: function
 * - label: string (tooltip and aria-label)
 * - size: 'small' | 'medium' | 'large' (default: 'large')
 * - disabled: boolean
 * - sx: MUI style overrides
 */
export default function AiStarsButton({ loading, onClick, label = 'AI Action', size = 'large', disabled = false, sx, ...props }) {
    return (
        <Tooltip title={label} placement="top">
            <span>
                <IconButton
                    color="primary"
                    size={size}
                    onClick={onClick}
                    disabled={loading || disabled}
                    aria-label={label}
                    sx={sx}
                    {...props}
                >
                    {loading ? (
                        <LoadingIndicator loading={true} />
                    ) : (
                        <img src={aiStars} alt="AI" style={{ width: size === 'small' ? 20 : 28, height: size === 'small' ? 20 : 28 }} />
                    )}
                </IconButton>
            </span>
        </Tooltip>
    );
}
