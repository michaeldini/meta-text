/**
 * @fileoverview MetaTextReviewPage component for the MetaText application
 * 
 * This page component provides a comprehensive review interface for MetaText documents,
 * offering multiple learning and analysis tools including flashcards, phrase explanations,
 * and chunk summaries. It serves as a study and analysis hub for processed MetaText content.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-08
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, IconButton, Tooltip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';
import { ExpandMoreIcon } from 'icons';

import { fetchWordlist, fetchChunks, fetchPhraseExplanations, PhraseExplanation } from 'services';

import { FlashCards, ChunkSummaryNotesTable, ExplanationReview } from 'features';
import { ArrowBackIcon } from 'icons';
import { FlexBox } from 'components';
import { log } from 'utils';
import { ChunkType } from 'types';

import { getMetaTextReviewStyles } from './MetaText.styles';

/**
 * WordlistRow Interface
 * 
 * Represents a single word entry in the wordlist for flashcard generation.
 * Contains the word, its definition, contextual definition, and optional context.
 * 
 * @interface WordlistRow
 * @example
 * ```typescript
 * const wordEntry: WordlistRow = {
 *   id: 1,
 *   word: "exemplify",
 *   definition: "to serve as a typical example of",
 *   definition_with_context: "to exemplify the principles discussed in the text",
 *   context: "The author uses this example to exemplify the main concept."
 * };
 * ```
 */
interface WordlistRow {
    /** Unique identifier for the word entry */
    id: number;
    /** The word or term */
    word: string;
    /** Standard definition of the word */
    definition: string;
    /** Definition with contextual usage */
    definition_with_context: string;
    /** Optional context where the word appears in the document */
    context?: string;
}

/**
 * ChunkSummaryNote Interface
 * 
 * Represents a chunk summary or note entry for the review table.
 * Uses a flexible structure to accommodate various chunk data formats.
 * 
 * @interface ChunkSummaryNote
 * @example
 * ```typescript
 * const chunkNote: ChunkSummaryNote = {
 *   id: 1,
 *   summary: "Introduction to key concepts",
 *   notes: "Important foundational material"
 * };
 * ```
 */
interface ChunkSummaryNote {
    /** Unique identifier for the chunk */
    id: number;
    /** Additional chunk properties with flexible typing */
    [key: string]: any;
}

/**
 * LoadingIndicator Component
 * 
 * A simple loading indicator component that displays a centered circular progress spinner.
 * Used to show loading state while data is being fetched.
 * 
 * @param props - Component props
 * @param props.styles - Computed styles object from getMetaTextReviewStyles
 * @returns {ReactElement} The loading indicator component
 */
function LoadingIndicator({ styles }: { styles: ReturnType<typeof getMetaTextReviewStyles> }): ReactElement {
    return <Box sx={styles.loadingBox}><CircularProgress /></Box>;
}

/**
 * ErrorAlert Component
 * 
 * A standardized error alert component for displaying error messages to users.
 * Provides consistent error UI throughout the review page.
 * 
 * @param props - Component props
 * @param props.message - The error message to display
 * @returns {ReactElement} The error alert component
 */
function ErrorAlert({ message }: { message: string }): ReactElement {
    return <Alert severity="error">{message}</Alert>;
}

/**
 * Header Component
 * 
 * The page header component that displays the review page title and optional
 * back navigation button. Provides consistent navigation and branding.
 * 
 * @param props - Component props
 * @param props.metatextId - Optional MetaText ID for navigation context
 * @param props.navigate - React Router navigation function
 * @param props.styles - Computed styles object from getMetaTextReviewStyles
 * @returns {ReactElement} The header component
 */
function Header({
    metatextId,
    navigate,
    styles
}: {
    metatextId?: number;
    navigate: (path: string) => void;
    styles: ReturnType<typeof getMetaTextReviewStyles>
}): ReactElement {
    return (
        <FlexBox sx={styles.header}>
            {metatextId && (
                <Tooltip title="Back to MetaText Detail">
                    <IconButton onClick={() => navigate(`/metaText/${metatextId}`)}>
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
            )}
            <Typography variant="h4" gutterBottom sx={metatextId ? styles.title : undefined}>
                Review
            </Typography>
        </FlexBox>
    );
}

/**
 * ReviewSection Component
 * 
 * A reusable component that wraps content in a consistent accordion structure.
 * Eliminates code duplication and provides a standard layout for review sections.
 * 
 * @param props - Component props
 * @param props.title - The section title displayed in the accordion header
 * @param props.testId - Test ID for the accordion element
 * @param props.children - The content to display inside the accordion
 * @returns {ReactElement} The accordion section component
 */
function ReviewSection({
    title,
    testId,
    children
}: {
    title: string;
    testId: string;
    children: ReactElement
}): ReactElement {
    return (
        <Accordion sx={{ mb: 2 }} data-testid={testId}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    );
}

/**
 * ReviewContent Component
 * 
 * Renders the main content sections of the review page in a clean, organized layout.
 * Separates the content structure from the main component logic.
 * 
 * @param props - Component props
 * @param props.phraseExplanations - Array of phrase explanations to display
 * @param props.wordlist - Array of words for flashcard generation
 * @param props.chunkSummariesNotes - Array of chunk summaries and notes
 * @returns {ReactElement} The review content sections
 */
function ReviewContent({
    phraseExplanations,
    wordlist,
    chunkSummariesNotes
}: {
    phraseExplanations: PhraseExplanation[];
    wordlist: WordlistRow[];
    chunkSummariesNotes: ChunkType[];
}): ReactElement {
    return (
        <>
            <ReviewSection
                title="Explanations"
                testId="explanations-accordion"
            >
                <ExplanationReview data={phraseExplanations} />
            </ReviewSection>

            <ReviewSection
                title="Flashcards"
                testId="flashcards-accordion"
            >
                <FlashCards wordlist={wordlist} />
            </ReviewSection>

            <ReviewSection
                title="ReviewTable"
                testId="chunks-accordion"
            >
                <ChunkSummaryNotesTable chunks={chunkSummariesNotes} />
            </ReviewSection>
        </>
    );
}

/**
 * MetaTextReviewPage Component
 * 
 * A comprehensive review page that provides multiple learning and analysis tools
 * for MetaText documents. This component serves as a study hub, offering flashcards,
 * phrase explanations, and chunk summaries in an organized, collapsible interface.
 * 
 * Features:
 * - Dynamic route parameter handling for MetaText ID
 * - Concurrent data fetching for wordlist, chunks, and phrase explanations
 * - Interactive flashcard system for vocabulary learning
 * - Phrase explanations for contextual understanding
 * - Chunk summary and notes table for content overview
 * - Collapsible accordion interface for organized content
 * - Loading states and comprehensive error handling
 * - Navigation integration with back button
 * - Responsive design for various screen sizes
 * 
 * @category Components
 * @subcategory Pages
 * @component
 * @example
 * ```tsx
 * // Used in React Router configuration
 * <Route 
 *   path="/metaText/:metaTextId/review" 
 *   component={MetaTextReviewPage} 
 * />
 * 
 * // Direct usage (not recommended - use routing)
 * <MetaTextReviewPage />
 * ```
 * 
 * @returns {ReactElement} The rendered MetaTextReviewPage component
 */
function MetaTextReviewPage(): ReactElement {
    /**
     * Extract MetaText ID from URL parameters and convert to number
     */
    const { metaTextId: metatextIdParam } = useParams<{ metaTextId?: string }>();
    const metatextId: number | undefined = metatextIdParam ? Number(metatextIdParam) : undefined;

    /**
     * State management for wordlist data
     * Contains vocabulary words with definitions for flashcard generation
     */
    const [wordlist, setWordlist] = useState<WordlistRow[]>([]);

    /**
     * State management for chunk summaries and notes
     * Contains processed chunks with summaries and analysis notes
     */
    const [chunkSummariesNotes, setChunkSummariesNotes] = useState<ChunkType[]>([]);

    /**
     * State management for phrase explanations
     * Contains contextual explanations for important phrases in the document
     */
    const [phraseExplanations, setPhraseExplanations] = useState<PhraseExplanation[]>([]);

    /**
     * Loading state for data fetching operations
     */
    const [loading, setLoading] = useState<boolean>(true);

    /**
     * Error state for handling and displaying fetch errors
     */
    const [error, setError] = useState<string | null>(null);

    /**
     * React Router navigation function for programmatic navigation
     */
    const navigate = useNavigate();

    /**
     * Material-UI theme object for accessing design tokens
     */
    const theme: Theme = useTheme();

    /**
     * Computed styles for the MetaTextReviewPage based on the current theme
     */
    const styles = getMetaTextReviewStyles(theme);

    /**
     * Data loading effect
     * 
     * Fetches all required data concurrently when the component mounts or
     * when the MetaText ID changes. Handles loading states, error conditions,
     * and data validation.
     */
    useEffect(() => {
        /**
         * Async function to load all review data concurrently
         * 
         * Fetches wordlist, chunk data, and phrase explanations in parallel
         * for optimal performance. Includes comprehensive error handling
         * and data validation.
         */
        async function loadData() {
            try {
                setLoading(true);
                log.info('Starting to load wordlist and chunk summaries/notes', { metatextId });

                // Validate MetaText ID
                if (!metatextId || isNaN(metatextId)) {
                    setError('Invalid MetaText ID.');
                    setLoading(false);
                    return;
                }

                // Fetch all data concurrently for better performance
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

                // Validate and set data with fallbacks
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

    // Early returns for loading and error states
    if (loading) return (
        <Box sx={styles.root} data-testid="metatext-review-loading">
            <LoadingIndicator styles={styles} />
        </Box>
    );

    if (error) return (
        <Box sx={styles.root} data-testid="metatext-review-error">
            <ErrorAlert message={error} />
        </Box>
    );

    return (
        <Box sx={styles.root} data-testid="metatext-review-page">
            {/* Page header with navigation and title */}
            <Header metatextId={metatextId} navigate={navigate} styles={styles} />

            {/* Review content sections */}
            <ReviewContent
                phraseExplanations={phraseExplanations}
                wordlist={wordlist}
                chunkSummariesNotes={chunkSummariesNotes}
            />
        </Box>
    );
}

// Export with a more descriptive name for TypeDoc
export { MetaTextReviewPage };

// Default export for React component usage
export default MetaTextReviewPage;
