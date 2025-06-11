import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import ChunkImageDisplay from './ChunkImageDisplay';

/**
 * Displays chunk summaries and notes side by side in a modern, clean table.
 * @param {Object[]} chunks - Array of chunk objects with summary and notes fields.
 */
export default function ChunkSummaryNotesTable({ chunks }) {
    const [lightboxOpenStates, setLightboxOpenStates] = React.useState({});

    if (!chunks || chunks.length === 0) {
        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">No chunk summaries or notes found.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Chunk Summaries & Notes</Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, width: '50%' }}>Summary</TableCell>
                            <TableCell sx={{ fontWeight: 600, width: '50%' }}>Notes</TableCell>
                            <TableCell sx={{ fontWeight: 600, width: '100px' }}>Image</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {chunks.map(chunk => (
                            <TableRow key={chunk.id}>
                                <TableCell sx={{ whiteSpace: 'pre-line' }}>{chunk.summary || <span style={{ color: '#aaa' }}>No summary</span>}</TableCell>
                                <TableCell sx={{ whiteSpace: 'pre-line' }}>{chunk.notes || <span style={{ color: '#aaa' }}>No notes</span>}</TableCell>
                                <TableCell sx={{ whiteSpace: 'pre-line' }}>
                                    {chunk.ai_image && chunk.ai_image.path ? (
                                        <ChunkImageDisplay
                                            imgSrc={chunk.ai_image.path.startsWith('/') ? chunk.ai_image.path : `/${chunk.ai_image.path}`}
                                            imgPrompt={chunk.ai_image.prompt}
                                            imgLoaded={true} // For table, always show thumbnail immediately
                                            onLoad={() => { }}
                                            onError={() => { }}
                                            lightboxOpen={!!lightboxOpenStates[chunk.id]}
                                            setLightboxOpen={open => setLightboxOpenStates(s => ({ ...s, [chunk.id]: open }))}
                                            createdAt={chunk.ai_image.created_at}
                                            height="100px" // Fixed height for thumbnails
                                        />
                                    ) : (
                                        <span style={{ color: '#aaa' }}>No image</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
