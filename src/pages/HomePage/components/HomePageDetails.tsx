// Simple About Page Component
// This component provides information about the application and its usage.


/**
 * AboutSection component
 * Provides information about the application and its usage.
 * Intended for placement at the end of the HomePage.
 */
import React from 'react';
import { Box, Typography } from '@mui/material';

const AboutSection: React.FC = () => (
    <Box sx={{ pt: 20 }} data-testid="about-section">
        <Typography variant="h4" gutterBottom>
            Instructions
        </Typography>
        <Typography variant="body1" color="text.secondary">
            Use the create form to upload a text file you want to read. Use the create form again to create a meta-Text from the text file you uploaded (source document).
            <br />
            <br />
            Open your meta-Text to read it. You can also use the search bar to search for specific text in your meta-Text.
            <br />
            <br />
            Your meta-Text is broken up into Chunks. Click on a word in a Chunk to see tools to act on that word: Split the chunk at that word, Look up the word, and at the end of each chunk is a merge arrow to merge chunks. Split your meta-Text into meaningful chunks.
            <br />
            <br />
            Use tools that act on the chunk to add metadata to the chunk: Generate a summary, Generate an image from a prompt that represents the chunk, write notes, write a summary, ask a literature agent to comment on the chunk and your notes.
        </Typography>
    </Box>
);

export default AboutSection;
