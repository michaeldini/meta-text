import React, { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';

interface PageContainerProps {
    children: ReactNode;
}

/**
 * Generic page container for consistent layout.
 * Wraps children in a Container with error boundary and theme-based styles.
 */
export function PageContainer(props: PageContainerProps): React.ReactElement {
    const { children } = props;

    return (
        <Flex
            paddingX={{ base: 4, md: 8 }}
            paddingY={{ base: 4, md: 8 }}
            maxWidth="6xl"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            marginX="auto"
            data-testid="page-container"
            bgGradient="to-r"
            gradientFrom="gray.700"
            gradientTo="gray.800"
        >
            {children}
        </Flex>
    );
}

export default PageContainer;
