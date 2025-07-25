// WelcomeText - A highly emotive greeting and instruction for Meta-Text users.
// Displayed on the HomePage, it introduces the concept of Meta-Text and guides users on how to engage with their documents meaningfully.


import React from 'react';
import { Box, Typography, SxProps, Theme, Stack } from '@mui/material';

interface WelcomeTextProps {
    welcomeTextStyles: {
        container: SxProps<Theme>;
        title: SxProps<Theme>;
        text: SxProps<Theme>;
    }
}


export function WelcomeText({ welcomeTextStyles }: WelcomeTextProps) {
    return (
        <Stack sx={welcomeTextStyles.container}>
            <Typography variant="h4" sx={welcomeTextStyles.title} gutterBottom>
                Welcome!
            </Typography>
            <Typography variant="body1" sx={welcomeTextStyles.text} >
                Imagine unlocking the true depth of every document you read. <b>Meta-Text</b> empowers you to upload, dissect, and truly engage with your texts—one meaningful section at a time. <br /><br />
                <b>How does it work?</b> Upload a document that sparks your curiosity. Break it into sections that matter to you. Annotate each part with your thoughts, questions, and insights. <br /><br />
                <i>Transform passive reading into an active, personal journey of discovery. Your ideas belong here.</i>
            </Typography>
        </Stack>
    );
};

export default WelcomeText;
