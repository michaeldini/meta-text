// Main component for managing documents, including a form and a list of documents.
// Reused across both SourceDocs and MetaText landing pages.
// This component is designed to be flexible and reusable, allowing for different forms and lists to be
// passed in as props, making it suitable for various document management scenarios.

import React, { ReactElement, ReactNode, forwardRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { getAppStyles } from 'styles';

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

        // Use the theme to get styles from the top-level style function 
        // This allows for consistent styling across the SourceDocs and MetaText landing pages
        const theme = useTheme();
        const styles = getAppStyles(theme);

        return (
            <Box
                ref={ref}
                data-testid={`${title
                    .toLowerCase()
                    .replace(/ /g, '-')}-list-content`}
                sx={styles.sharedStyles.container}
            >
                <Box sx={styles.sharedStyles.container}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={styles.sharedStyles.title}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={styles.sharedStyles.subtitle}
                    >
                        {subtitle}
                    </Typography>
                </Box>
                <Box sx={styles.sharedStyles.containerBreakpoint}>
                    {formComponent}
                    {listComponent}
                </Box>
            </Box>
        );
    }
);

export default DocumentManagementLayout;
