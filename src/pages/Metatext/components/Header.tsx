import { Heading, IconButton, Box } from '@chakra-ui/react'
import { Tooltip } from 'components';
import type { ReactElement } from 'react';
import { HiArrowLeft } from 'react-icons/hi2';
import { getMetatextReviewStyles } from '../Metatext.styles';

interface HeaderProps {
    metatextId?: number;
    navigate: (path: string) => void;
    styles: ReturnType<typeof getMetatextReviewStyles>;
}

/**
 * Header component for the Metatext Review page.
 * Displays a back button to navigate to the Metatext Detail page and the title "Review".
 *
 * @returns {ReactElement} The rendered Header component.
 */
export function Header({ metatextId, navigate, styles }: HeaderProps): ReactElement {
    return (
        <Box >
            {metatextId && (
                <Tooltip content="Back to Metatext Detail">
                    <IconButton
                        onClick={() => navigate(`/metatext/${metatextId}`)}
                        variant="ghost"
                        color="primary"
                    >
                        <HiArrowLeft />
                    </IconButton>
                </Tooltip>
            )}
            <Heading >
                Review
            </Heading>
        </Box>
    );
}
