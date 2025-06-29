import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, IconButton, Tooltip } from '@mui/material';
import { fetchWordlist } from '../../services/reviewService';
import { fetchChunks } from '../../services/chunkService';
import logger from '../../utils/logger';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBackIcon } from '../../components/icons';
import { metaTextDetailRoute } from '../../routes';
import FlashCards from '../../features/flashcards/FlashCards';
import ChunkSummaryNotesTable from '../../features/NotesSummaryTable/ChunkSummaryNotesTable';
import { usePageLogger } from '../../hooks/usePageLogger';
import { useTheme } from '@mui/material/styles';
import { getMetaTextPageStyles } from './MetaTextPage.styles';
import Flexbox from '../../components/FlexBox';

interface WordlistRow {
    id: number;
    word: string;
    definition: string;
    definition_with_context: string;
    context?: string; // Added context field for flashcard
}

interface ChunkSummaryNote {
    id: number;
    // Add more fields as needed based on your chunk summary/notes structure
    [key: string]: any;
}

function LoadingIndicator({ styles }: { styles: ReturnType<typeof getMetaTextPageStyles> }) {
    return <Box sx={styles.loadingBox}><CircularProgress /></Box>;
}

function ErrorAlert({ message }: { message: string }) {
    return <Alert severity="error">{message}</Alert>;
}

function Header({ metatextId, navigate, styles }: { metatextId?: number; navigate: (path: string) => void; styles: ReturnType<typeof getMetaTextPageStyles> }) {
    return (
        <Flexbox sx={styles.header}>
            {metatextId && (
                <Tooltip title="Back to MetaText Detail">
                    <IconButton onClick={() => navigate(metaTextDetailRoute(String(metatextId)))}>
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
            )}
            <Typography variant="h4" gutterBottom sx={metatextId ? styles.title : undefined}>Review</Typography>
        </Flexbox>
    );
}

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
    const theme = useTheme();
    const styles = getMetaTextPageStyles(theme);

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
                setWordlist(Array.isArray(wordlistData) ? wordlistData : []);
                setChunkSummariesNotes(Array.isArray(chunkData) ? chunkData : []);
            } catch (err) {
                setError('Failed to load wordlist or chunk summaries/notes.');
                logger.error('Failed to load wordlist or chunk summaries/notes', err);
            } finally {
                setLoading(false);
            }
        }
        if (metatextId) loadData();
    }, [metatextId]);

    if (loading) return <Box sx={styles.root}><LoadingIndicator styles={styles} /></Box>;
    if (error) return <Box sx={styles.root}><ErrorAlert message={error} /></Box>;

    return (
        <Box sx={styles.root}>
            <Header metatextId={metatextId} navigate={navigate} styles={styles} />
            <FlashCards wordlist={wordlist} />
            <ChunkSummaryNotesTable chunks={chunkSummariesNotes} />
        </Box>
    );
}
