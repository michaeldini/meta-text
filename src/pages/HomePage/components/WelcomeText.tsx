// WelcomeText - A highly emotive greeting and instruction for Meta-Text users.
// Displayed on the HomePage, it introduces the concept of Meta-Text and guides users on how to engage with their documents meaningfully.


import React from 'react';
import { Heading } from "@chakra-ui/react"
import { Stack } from "@chakra-ui/react/stack"



export function WelcomeText() {
    return (
        <Stack>
            <Heading size="5xl" color="primary">
                Welcome!
            </Heading>
            <Heading size="2xl">
                Imagine unlocking the true depth of every document you read. <b>Meta-Text</b> empowers you to upload, dissect, and truly engage with your texts—one meaningful section at a time. <br /><br />
                <b>How does it work?</b> Upload a document that sparks your curiosity. Break it into sections that matter to you. Annotate each part with your thoughts, questions, and insights. <br /><br />
                <i>Transform passive reading into an active, personal journey of discovery. Your ideas belong here.</i>
            </Heading>
        </Stack>
    );
};

export default WelcomeText;
