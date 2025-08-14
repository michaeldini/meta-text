
import type { ReactElement } from 'react';

import { Collapsible } from "@chakra-ui/react/collapsible";


interface ReviewSectionProps {
    title: string;
    children: ReactElement;
}

/**
 * A reusable section component for displaying review content.
 * It uses an accordion to allow users to expand and collapse sections.
 *
 * @param {string} title - The title of the section.
 * @param {string} testId - The data-testid for testing purposes.
 * @param {ReactElement} children - The content to display within the section.
 * @returns {ReactElement} The rendered ReviewSection component.
 */
export function ReviewSection({ title, children }: ReviewSectionProps): ReactElement {
    return (
        <Collapsible.Root p="4" open={true}>
            <Collapsible.Trigger>Toggle {title}</Collapsible.Trigger>
            <Collapsible.Content>
                {children}
            </Collapsible.Content>
        </Collapsible.Root>
    );
}

