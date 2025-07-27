import { Box, Spinner } from '@chakra-ui/react';
import type { ReactElement } from 'react';

/**
 * LoadingSpinner Component Props
 */
export interface LoadingSpinnerProps {
    /** Size of the circular progress indicator */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Color of the spinner */
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';

    /** Minimum height of the loading container */
    minHeight?: number | string;
    /** Accessibility label for the spinner */
    'aria-label'?: string;
}


export function LoadingSpinner(props: LoadingSpinnerProps): ReactElement {
    const {
        size = 'lg',
        color = 'primary',
        'aria-label': ariaLabel = 'Loading content'
    } = props;

    return (
        <Box >
            <Spinner color={color} size={size} aria-label={ariaLabel} />
        </Box>
    );
}
