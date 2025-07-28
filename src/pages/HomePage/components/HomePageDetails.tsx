// Simple About Page Component
// This component provides information about the application and its usage.


/**
 * AboutSection component
 * Provides information about the application and its usage.
 * Intended for placement at the end of the HomePage.
 */
import React from 'react';
import { Heading } from "@chakra-ui/react"
import { List } from "@chakra-ui/react/list"
export function AboutSection() {
    return (
        <>
            <Heading py="4" >Instructions</Heading>
            <List.Root >
                <List.Item>
                    Use the create form to upload a text file you want to read. Use the create form again to create a meta-Text from the text file you uploaded (source document).
                </List.Item>
                <List.Item>
                    Open your meta-Text to read it. You can also use the search bar to search for specific text in your meta-Text.
                </List.Item>
                <List.Item>
                    Your meta-Text is broken up into Chunks. Click on a word in a Chunk to see tools to act on that word: Split the chunk at that word, Look up the word, and at the end of each chunk is a merge arrow to merge chunks. Split your meta-Text into meaningful chunks.
                </List.Item>
                <List.Item>
                    Use tools that act on the chunk to add metadata to the chunk: Generate a summary, Generate an image from a prompt that represents the chunk, write notes, write a summary, ask a literature agent to comment on the chunk and your notes.
                </List.Item>
            </List.Root>
        </>
    );
}

export default AboutSection;
