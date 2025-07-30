import React, { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';

interface PageContainerProps {
    children: ReactNode;
    loading: boolean;
}

/**
 * Generic page container for consistent layout.
 * Wraps children in a Container with error boundary and theme-based styles.
 */
export function PageContainer(props: PageContainerProps): React.ReactElement {
    const { children, loading } = props;

    return (
        <Flex justify="center" color="fg"  >
            {children}
        </Flex>
    );
}

export default PageContainer;
