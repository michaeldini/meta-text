// A basic review table component to display summaries, notes, and images for chunks

import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { ImageDisplay } from 'features/chunk-image';
import { ChunkType } from 'types';
import { tableContainerStyles, tableCellStyles, noChunksBoxStyles, tableBoxStyles } from './ReviewTable.styles';

export interface ReviewTableProps {
    chunks: ChunkType[];
}

export default function ReviewTable({ chunks }: ReviewTableProps) {
    // If no chunks are provided, display a message
    if (!chunks || chunks.length === 0) {
        return (
            <Box sx={noChunksBoxStyles}>
                <Typography variant="h5" gutterBottom>Summaries & Notes</Typography>
                <Typography variant="body2" color="text.secondary">No chunk summaries or notes found.</Typography>
            </Box>
        );
    }

    // If chunks are provided, render the table
    return (
        <Box sx={tableBoxStyles}>
            <TableContainer component={Paper} sx={tableContainerStyles}>
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
                            const latestImage = chunk.images && chunk.images.length > 0
                                ? chunk.images[chunk.images.length - 1]
                                : null;

                            return (
                                <TableRow key={chunk.id}>
                                    <TableCell sx={tableCellStyles}>{chunk.summary}</TableCell>
                                    <TableCell sx={tableCellStyles}>{chunk.note}</TableCell>
                                    <TableCell>
                                        {latestImage && (
                                            <ImageDisplay
                                                src={`/${latestImage.path}`}
                                                alt={latestImage.prompt}
                                                height="100px"
                                                showModal={true}
                                            />
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
