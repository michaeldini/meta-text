import React, { ReactElement, ReactNode, forwardRef } from 'react';
import { Box, Typography } from '@mui/material';
import { getAppStyles } from '../styles/styles';
import { useTheme } from '@mui/material/styles';

interface DocumentManagementLayoutProps {
    title: string;
    subtitle: string;
    formComponent: ReactNode;
    listComponent: ReactNode;
}

const DocumentManagementLayout = forwardRef<HTMLDivElement, DocumentManagementLayoutProps>(
    ({ title, subtitle, formComponent, listComponent }, ref): ReactElement => {
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

DocumentManagementLayout.displayName = 'DocumentListLayout';

export default DocumentManagementLayout;
