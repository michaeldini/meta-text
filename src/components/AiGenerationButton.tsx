import React from 'react';
import { Button, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { StarsIcon } from 'icons';
import { LoadingSpinner } from 'components';

/**
 * Props for the AiGenerationButton component.
 * Defines the configuration and behavior for the AI generation action button.
 */
export interface AiGenerationButtonProps {
    /** The button label text. */
    label: string;
    /** Optional tooltip text shown on hover. */
    toolTip?: string;
    /** Click handler for the button action. */
    onClick: () => void;
    /** If true, shows a loading spinner and disables the button. */
    loading?: boolean;
    /** If true, disables the button. */
    disabled?: boolean;
    /** Optional custom styles for the button. */
    sx?: SxProps<Theme>;
}

/**
 * Button component for AI generation actions.
 * Consistent star icon and label across the application.
 * Displays a loading spinner when the action is in progress.
 */
export function AiGenerationButton(props: AiGenerationButtonProps): React.ReactElement {
    const {
        label,
        toolTip,
        onClick,
        loading = false,
        disabled = false,
        sx
    } = props;
    return (
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
                {loading ? (
                    <LoadingSpinner aria-label="Loading AI generation" />
                ) : (
                    <>
                        <StarsIcon style={{ marginRight: 8 }} />
                        {label}
                    </>
                )}
            </Button>
        </Tooltip>
    );
}

export default AiGenerationButton;
