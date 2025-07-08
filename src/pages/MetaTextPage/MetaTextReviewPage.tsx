import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, IconButton, Tooltip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ExpandMoreIcon } from 'icons';

import { fetchWordlist, fetchChunks, fetchPhraseExplanations, PhraseExplanation } from 'services';
import { usePageLogger } from 'hooks';

import { FlashCards, ChunkSummaryNotesTable, Phrases } from 'features';
import { ArrowBackIcon } from 'icons';
import { FlexBox } from 'components';
import { log } from 'utils';
import { ChunkType } from 'types';

import { getMetaTextReviewStyles } from './MetaText.styles';

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

function LoadingIndicator({ styles }: { styles: ReturnType<typeof getMetaTextReviewStyles> }) {
    return <Box sx={styles.loadingBox}><CircularProgress /></Box>;
}

function ErrorAlert({ message }: { message: string }) {
    return <Alert severity="error">{message}</Alert>;
}

function Header({ metatextId, navigate, styles }: { metatextId?: number; navigate: (path: string) => void; styles: ReturnType<typeof getMetaTextReviewStyles> }) {
    return (
        <FlexBox sx={styles.header}>
            {metatextId && (
                <Tooltip title="Back to MetaText Detail">
                    <IconButton onClick={() => navigate(`/metaText/${metatextId}`)}>
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
            )}
            <Typography variant="h4" gutterBottom sx={metatextId ? styles.title : undefined}>Review</Typography>
        </FlexBox>
    );
}

export default function MetaTextReviewPage() {
    const { metaTextId: metatextIdParam } = useParams<{ metaTextId?: string }>();
    const metatextId = metatextIdParam ? Number(metatextIdParam) : undefined;

    const [wordlist, setWordlist] = useState<WordlistRow[]>([]);
    const [chunkSummariesNotes, setChunkSummariesNotes] = useState<ChunkType[]>([]);
    const [phraseExplanations, setPhraseExplanations] = useState<PhraseExplanation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const theme = useTheme();
    const styles = getMetaTextReviewStyles(theme);

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
            try {
                setLoading(true);
                log.info('Starting to load wordlist and chunk summaries/notes', { metatextId });
                if (!metatextId || isNaN(metatextId)) {
                    setError('Invalid MetaText ID.');
                    setLoading(false);
                    return;
                }
                log.info('Fetching wordlist...');
                const wordlistPromise = fetchWordlist(metatextId);
                log.info('Fetching chunk summaries/notes...');
                const chunkPromise = fetchChunks(metatextId);
                log.info('Fetching phrase explanations...');
                const phraseExplanationsPromise = fetchPhraseExplanations(metatextId);
                const [wordlistData, chunkData, phraseExplanationsData] = await Promise.all([
                    wordlistPromise,
                    chunkPromise,
                    phraseExplanationsPromise
                ]);
                setWordlist(Array.isArray(wordlistData) ? wordlistData : []);
                setChunkSummariesNotes(Array.isArray(chunkData) ? chunkData : []);
                setPhraseExplanations(Array.isArray(phraseExplanationsData) ? phraseExplanationsData : []);
            } catch (err) {
                setError('Failed to load wordlist or chunk summaries/notes.');
                log.error('Failed to load wordlist or chunk summaries/notes', err);
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
            <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">Phrases & Explanations</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Phrases data={phraseExplanations} />
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">Flashcards</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FlashCards wordlist={wordlist} />
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">Chunk Summary & Notes</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ChunkSummaryNotesTable chunks={chunkSummariesNotes} />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}
