import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, IconButton, Tooltip } from '@mui/material';
import { fetchWordlist } from '../../services/reviewService';
import { fetchChunks } from '../../services/chunkService';
import logger from '../../utils/logger';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBackIcon } from '../../components/icons';
import { metaTextDetailRoute } from '../../routes';
import ChunkSummaryNotesTable from '../../features/chunks/review/ChunkSummaryNotesTable';
import { usePageLogger } from '../../hooks/usePageLogger';

interface WordlistRow {
    id: number;
    word: string;
    definition: string;
    definition_with_context: string;
}

interface ChunkSummaryNote {
    id: number;
    // Add more fields as needed based on your chunk summary/notes structure
    [key: string]: any;
}

const columns = [
    { id: 'word', label: 'Word' },
    { id: 'definition', label: 'Definition' },
    { id: 'definition_with_context', label: 'Definition (with Context)' },
];

export default function MetaTextReviewPage() {
    console.log('MetaTextReviewPage mounted');

    const { metaTextId: metatextIdParam } = useParams<{ metaTextId?: string }>();
    const metatextId = metatextIdParam ? Number(metatextIdParam) : undefined;
    console.log('MetaTextReviewPage mounted, metatextId:', metatextId);

    const [wordlist, setWordlist] = useState<WordlistRow[]>([]);
    const [chunkSummariesNotes, setChunkSummariesNotes] = useState<ChunkSummaryNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    usePageLogger('MetaTextReviewPage', {
        watched: [
            ['metatextId', metatextId],
            ['loading', loading],
            ['error', error],
            ['wordlist', wordlist.length],
            ['chunkSummariesNotes', chunkSummariesNotes.length]
        ]
    });

    useEffect(() => {
        async function loadData() {
            console.log('loadData called, metatextId:', metatextId);
            try {
                setLoading(true);
                logger.info('Starting to load wordlist and chunk summaries/notes', { metatextId });
                if (!metatextId || isNaN(metatextId)) {
                    setError('Invalid MetaText ID.');
                    setLoading(false);
                    return;
                }
                logger.info('Fetching wordlist...');
                const wordlistPromise = fetchWordlist(metatextId);
                logger.info('Fetching chunk summaries/notes...');
                const chunkPromise = fetchChunks(metatextId);
                const [wordlistData, chunkData] = await Promise.all([
                    wordlistPromise,
                    chunkPromise
                ]);
                logger.info('Fetch complete', { wordlistData, chunkData });
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
                        <IconButton onClick={() => navigate(metaTextDetailRoute(String(metatextId)))}>
                            <ArrowBackIcon style={{ width: 24, height: 24, color: 'currentColor' }} />
                        </IconButton>
                    </Tooltip>
                )}
                <Typography variant="h4" gutterBottom sx={{ ml: metatextId ? 1 : 0 }}>Review</Typography>
            </Box>

            <Typography variant="h5" gutterBottom>Wordlist</Typography>
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
                                        <TableCell sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '1.3rem' }}>{row.word}</TableCell>
                                        <TableCell sx={{ color: 'text.primary', fontSize: '1.2rem', lineHeight: 1.5 }}>{row.definition}</TableCell>
                                        <TableCell sx={{ color: 'text.primary', fontSize: '1rem', lineHeight: 1.5 }}>{row.definition_with_context}</TableCell>
                                        {/* <TableCell>{row.context}</TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
            )}

            {/* summaries/notes table */}
            {!loading && !error && (
                <ChunkSummaryNotesTable chunks={chunkSummariesNotes} />
            )}
        </Box>
    );
}
