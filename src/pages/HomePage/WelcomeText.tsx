import React from 'react';
import { Paper, Typography } from '@mui/material';

/**
 * WelcomeText - A highly emotive greeting and instruction for Meta-Text users.
 */
const WelcomeText: React.FC = () => (
    <Paper elevation={10} width="100%">
        <Typography variant="h3" color="secondary" gutterBottom fontWeight={700}>
            Welcome to Meta-Text!
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, fontSize: 20, color: 'text.primary' }}>
            Imagine unlocking the true depth of every document you read. <b>Meta-Text</b> empowers you to upload, dissect, and truly engage with your texts—one meaningful section at a time. <br /><br />
            <b>How does it work?</b> Upload a document that sparks your curiosity. Break it into sections that matter to you. Annotate each part with your thoughts, questions, and insights. <br /><br />
            <i>Transform passive reading into an active, personal journey of discovery. Your ideas belong here.</i>
        </Typography>
    </Paper>
);

export default WelcomeText;
