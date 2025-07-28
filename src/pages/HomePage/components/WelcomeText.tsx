// WelcomeText - A highly emotive greeting and instruction for Meta-Text users.
// Displayed on the HomePage, it introduces the concept of Meta-Text and guides users on how to engage with their documents meaningfully.


import React from 'react';
import { Heading } from "@chakra-ui/react"
import { Highlight } from "@chakra-ui/react/highlight"



export function WelcomeText() {
    return (
        <>
            <Heading size="5xl" color="primary" >
                Welcome!
            </Heading>
            <Heading size="2xl" mt="4" mb="8" lineHeight="1.5" >
                <Highlight query={["Meta-Text empowers", "Upload a document", "Transform passive reading"]} styles={{ px: '2', py: '1', bg: 'accent' }}>
                    Imagine unlocking the true depth of every document you read. Meta-Text empowers you to upload, dissect, and truly engage with your texts—one meaningful section at a time.
                    How does it work? Upload a document that sparks your curiosity. Break it into sections that matter to you. Annotate each part with your thoughts, questions, and insights.
                    Transform passive reading into an active, personal journey of discovery. Your ideas belong here.
                </Highlight>
            </Heading>
        </>
    );
};

export default WelcomeText;
