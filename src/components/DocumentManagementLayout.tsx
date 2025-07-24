// Main component for managing documents, including a form and a list of documents.
// Reused across both SourceDocs and Metatext landing pages.
// This component is designed to be flexible and reusable, allowing for different forms and lists to be
// passed in as props, making it suitable for various document management scenarios.

import { ReactElement, ReactNode, forwardRef } from 'react';

import { Stack, Typography } from '@mui/material';

// Styling constants for DocumentManagementLayout
const styles = {
    container: {
        alignItems: 'center',
        padding: 2,
    },
    headerStack: {
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        mb: 1,
        color: 'text.primary',
    },
    subtitle: {
        mb: 2,
        color: 'text.secondary',
    },
    contentStack: {
        // Responsive direction handled in prop, not style
    },
};


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
                spacing={4}
                sx={styles.container}
                ref={ref}
                data-testid={`${title
                    .toLowerCase()
                    .replace(/ /g, '-')}-list-content`}
            >
                <Stack sx={styles.headerStack}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={styles.title}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={styles.subtitle}
                    >
                        {subtitle}
                    </Typography>
                </Stack>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={4}
                    sx={styles.contentStack}
                >
                    {formComponent}
                    {listComponent}
                </Stack>
            </Stack>
        );
    }
);

export default DocumentManagementLayout;
