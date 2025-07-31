// Main component for managing documents, including a form and a list of documents.
// Reused across both SourceDocs and Metatext landing pages.
// This component is designed to be flexible and reusable, allowing for different forms and lists to be
// passed in as props, making it suitable for various document management scenarios.


import React, { ReactElement, ReactNode, forwardRef } from 'react';

import { Heading } from '@chakra-ui/react';
import { Stack, StackSeparator } from '@chakra-ui/react/stack';


interface DocumentManagementLayoutProps {
    title: string;
    subtitle: string;
    formComponent: ReactNode;
    listComponent: ReactNode;
}

// Main component for managing documents
// forwardRef is used to allow the parent component to access the ref of the container
//  The ref is used for scrolling or other DOM manipulations if needed (in our case it is used by a Slide component)
const DocumentManagementLayout = forwardRef<HTMLDivElement, DocumentManagementLayoutProps>(
    ({ title, subtitle, formComponent, listComponent }, ref): ReactElement => {

        return (
            <Stack
                ref={ref}
                data-testid={`${title
                    .toLowerCase()
                    .replace(/ /g, '-')}-list-content`}
            >
                <Stack>
                    <Heading size="6xl">
                        {title}
                    </Heading>
                    <Heading size="md">
                        {subtitle}
                    </Heading>
                </Stack>
                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    separator={<StackSeparator />}
                    gap={12}
                    p={12}
                >
                    {formComponent}
                    {listComponent}
                </Stack>
            </Stack>
        );
    }
);

export default DocumentManagementLayout;
