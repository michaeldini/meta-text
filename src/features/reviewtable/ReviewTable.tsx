import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { ImageDisplay } from 'features/chunk';
import { ChunkType } from 'types';
export interface ReviewTableProps {
    chunks: ChunkType[];
}

export default function ReviewTable({ chunks }: ReviewTableProps) {
    // const [lightboxOpenStates, setLightboxOpenStates] = React.useState<Record<number, boolean>>({});

    if (!chunks || chunks.length === 0) {
        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant="h5" gutterBottom>Summaries & Notes</Typography>
                <Typography variant="body2" color="text.secondary">No chunk summaries or notes found.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4 }}>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Summary</TableCell>
                            <TableCell>Notes</TableCell>
                            <TableCell>Image</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {chunks.map(chunk => {
                            // Get the latest AI image from the chunk
                            const latestImage = chunk.ai_images && chunk.ai_images.length > 0
                                ? chunk.ai_images[chunk.ai_images.length - 1]
                                : null;

                            return (
                                <TableRow key={chunk.id}>
                                    <TableCell sx={{ whiteSpace: 'pre-line' }}>{chunk.summary || <span style={{ color: '#aaa' }}>No summary</span>}</TableCell>
                                    <TableCell sx={{ whiteSpace: 'pre-line' }}>{chunk.notes || <span style={{ color: '#aaa' }}>No notes</span>}</TableCell>
                                    <TableCell>
                                        {latestImage ? (
                                            <ImageDisplay
                                                src={`/${latestImage.path}`}
                                                alt={latestImage.prompt}
                                                height="200px"
                                                showModal={true}
                                            />
                                        ) : (
                                            <span style={{ color: '#aaa' }}>No image</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
