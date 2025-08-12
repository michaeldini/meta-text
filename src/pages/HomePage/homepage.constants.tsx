/**
 * Constants for HomePage layout and heading props
 * - Used to maintain consistency across homepage sections
 */

import { Heading } from "@chakra-ui/react"
import { List } from "@chakra-ui/react/list"
import { Highlight } from "@chakra-ui/react/highlight"


// Note: Former `commonStackProps` has been replaced by the reusable
// `SectionStack` component located at `@components/SectionStack`.

// The WelcomeText component displays a welcome message with a highlight on key phrases.
export function WelcomeText() {
    return (
        <>
            <Heading size="main">
                Welcome!
            </Heading>
            <Heading>
                <Highlight query={["Meta-Text empowers", "Upload a document", "Transform passive reading"]} styles={{ px: '2', py: '1', bg: 'primary' }}>
                    Imagine unlocking the true depth of every document you read. Meta-Text empowers you to upload, dissect, and truly engage with your texts—one meaningful section at a time.
                    How does it work? Upload a document that sparks your curiosity. Break it into sections that matter to you. Annotate each part with your thoughts, questions, and insights.
                    Transform passive reading into an active, personal journey of discovery. Your ideas belong here.
                </Highlight>
            </Heading>
        </>
    );
};


// The AppInstructions component provides a list of instructions for using the app.
export function AppInstructions() {
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

