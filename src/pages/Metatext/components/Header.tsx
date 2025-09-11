import { HiArrowLeft } from 'react-icons/hi2';
import { Box, Heading, Button } from '@styles';
import type { ReactElement } from 'react';

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
        <Box>
            {metatextId && (
                <Button
                    size="sm"
                    tone="default"
                    onClick={() => navigate(`/metatext/${metatextId}`)}
                    title="Back to Metatext Detail"
                    css={{ marginRight: 8, padding: 4, borderRadius: 6 }}
                >
                    <HiArrowLeft />
                </Button>
            )}
            <Heading>
                Review
            </Heading>
        </Box>
    );
}
