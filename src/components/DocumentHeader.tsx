// Component used to display a document header with a title and children components for consistent styling across pages.

import React from 'react';
import { Wrap } from "@chakra-ui/react/wrap"
import { Collapsible } from "@chakra-ui/react/collapsible"
import { Text } from "@chakra-ui/react/text";
interface DocumentHeaderProps {
    title?: string;
    children: React.ReactNode;
}


export function DocumentHeader(props: DocumentHeaderProps): React.ReactElement {

    // was using title earlier, but now just using children for flexibility
    const { children } = props;

    return (
        <Collapsible.Root unmountOnExit>
            <Collapsible.Trigger >
                <Text color="fg" p={4} borderWidth="2px" borderRadius="md">Controls</Text>
            </Collapsible.Trigger>
            <Collapsible.Content>
                <Wrap
                    rowGap={["0px", "24px"]} columnGap={["4px", "20px"]}
                    justify="center"
                    align="center"
                >
                    {children}
                </Wrap>
            </Collapsible.Content>
        </Collapsible.Root>
    );
}

export default DocumentHeader;
