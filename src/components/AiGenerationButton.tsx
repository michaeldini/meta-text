import React from 'react';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { LoadingSpinner } from 'components';
import { Button, Text } from '@chakra-ui/react';
import { Tooltip } from 'components';
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
        disabled = false
    } = props;
    return (
        <Tooltip content={toolTip || ''}>
            <Button
                variant="ghost"
                color="primary"
                onClick={onClick}
                disabled={disabled || loading}
                aria-label={toolTip || 'AI Generation Button'}
                data-testid="ai-generation-button"
            >
                {loading ? (
                    <LoadingSpinner aria-label="Loading AI generation" />
                ) : (
                    <>
                        <HiOutlineSparkles style={{ marginRight: 8 }} />
                        {label}
                    </>
                )}
            </Button>
        </Tooltip>
    );
}

export default AiGenerationButton;
