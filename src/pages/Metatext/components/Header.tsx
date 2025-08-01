import { Heading, IconButton } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react/box';
import { Tooltip } from '@components/ui/tooltip';
import type { ReactElement } from 'react';
import { HiArrowLeft } from 'react-icons/hi2';

interface HeaderProps {
    metatextId?: number;
    navigate: (path: string) => void;
}

/**
 * Header component for the Metatext Review page.
 * Displays a back button to navigate to the Metatext Detail page and the title "Review".
 *
 * @returns {ReactElement} The rendered Header component.
 */
export function Header({ metatextId, navigate }: HeaderProps): ReactElement {
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
