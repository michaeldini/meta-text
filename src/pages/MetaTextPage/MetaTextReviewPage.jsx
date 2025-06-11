import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, IconButton, Tooltip } from '@mui/material';
import { fetchWordlist, fetchChunkSummariesNotes } from '../../services/reviewService';
import logger from '../../utils/logger';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { metaTextDetailRoute } from '../../routes';
import ChunkSummaryNotesTable from '../../components/ChunkSummaryNotesTable';

const columns = [
    { id: 'word', label: 'Word' },
    // { id: 'context', label: 'Context' },
    { id: 'definition', label: 'Definition' },
    { id: 'definition_with_context', label: 'Definition (with Context)' },
    // { id: 'created_at', label: 'Created At' },
];

export default function MetaTextReviewPage() {
    const [wordlist, setWordlist] = useState([]);
    const [chunkSummariesNotes, setChunkSummariesNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id: metatextId } = useParams();

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const [wordlistData, chunkData] = await Promise.all([
                    fetchWordlist(metatextId),
                    fetchChunkSummariesNotes(metatextId)
                ]);
                setWordlist(Array.isArray(wordlistData) ? wordlistData : []);
                setChunkSummariesNotes(Array.isArray(chunkData) ? chunkData : []);
                logger.info('Wordlist and chunk summaries/notes loaded', { wordlistData, chunkData });
            } catch (err) {
                setError('Failed to load wordlist or chunk summaries/notes.');
                logger.error('Failed to load wordlist or chunk summaries/notes', err);
            } finally {
                setLoading(false);
            }
        }
        if (metatextId) loadData();
    }, [metatextId]);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {metatextId && (
                    <Tooltip title="Back to MetaText Detail">
                        <IconButton onClick={() => navigate(metaTextDetailRoute(metatextId))}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                )}
                <Typography variant="h4" gutterBottom sx={{ ml: metatextId ? 1 : 0 }}>Wordlist</Typography>
            </Box>
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && (
                wordlist.length === 0 ? (
                    <Alert severity="info">No words found in the wordlist.</Alert>
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns.map(col => (
                                        <TableCell key={col.id}>{col.label}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {wordlist.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.word}</TableCell>
                                        {/* <TableCell>{row.context}</TableCell> */}
                                        <TableCell>{row.definition}</TableCell>
                                        <TableCell>{row.definition_with_context}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
            )}
            {/* Chunk summaries/notes table below wordlist */}
            {!loading && !error && (
                <ChunkSummaryNotesTable chunks={chunkSummariesNotes} />
            )}
        </Box>
    );
}
