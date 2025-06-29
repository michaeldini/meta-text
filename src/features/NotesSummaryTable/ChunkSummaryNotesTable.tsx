import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { ChunkImageDisplay } from 'features/chunk';

export interface ChunkSummaryNotesTableProps {
    chunks: Array<{
        id: number;
        summary?: string;
        notes?: string;
        ai_image?: {
            path: string;
            prompt: string;
            created_at?: string;
        } | null;
        [key: string]: any;
    }>;
}

export default function ChunkSummaryNotesTable({ chunks }: ChunkSummaryNotesTableProps) {
    const [lightboxOpenStates, setLightboxOpenStates] = React.useState<Record<number, boolean>>({});

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
            <Typography variant="h5" gutterBottom>Summaries & Notes</Typography>
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
                                            imgLoaded={true}
                                            onLoad={() => { }}
                                            onError={() => { }}
                                            lightboxOpen={!!lightboxOpenStates[chunk.id]}
                                            setLightboxOpen={(open: boolean) => setLightboxOpenStates(s => ({ ...s, [chunk.id]: open }))}
                                            createdAt={chunk.ai_image.created_at}
                                            height="100px"
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
