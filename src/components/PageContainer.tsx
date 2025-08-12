import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react/box';

interface PageContainerProps {
    children: ReactNode;
}
/**
 * PageContainer component
 * This component wraps the main content of the page with consistent padding and layout.
 * It is used to ensure that all pages have a uniform look and feel.
 */
export function PageContainer(props: PageContainerProps): React.ReactElement {
    const { children } = props;

    return (
        <Box
            px={{ base: 2, lg: 4 }}
            py={{ base: 4, lg: 8 }}
            maxWidth="6xl"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            marginX="auto"
            data-testid="page-container"
        >
            {children}
        </Box>
    );
}

export default PageContainer;
