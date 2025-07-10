/**
 * @fileoverview WordsExplanationTool Component
 * 
 * A React component that provides an interactive tool for explaining words or phrases
 * within a document chunk context. Features a question mark icon that triggers an
 * AI-powered explanation displayed in a responsive side drawer.
 * 
 * Key Features:
 * - Context-aware word/phrase explanations using AI
 * - Responsive side drawer UI with Material-UI components
 * - Performance optimized with React.memo and memoized callbacks
 * - Full accessibility support with ARIA attributes
 * - Input validation and error handling
 * - Mobile-responsive design
 * 
 * @author Meta-Text Development Team
 * @since 1.0.0
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
    IconButton,
    Tooltip,
    Drawer,
    Box,
    Typography,
    Divider,
    Alert
} from '@mui/material';
import { QuestionMarkIcon } from 'icons';
import { useExplanation } from './useExplanation';
import { ChunkType } from 'types';
import { ExplanationResponse } from 'services';
import { LoadingSpinner } from 'components';

/**
 * UI Configuration Constants
 * 
 * These constants define the visual appearance and behavior of the component.
 * Extracted for maintainability and consistency across the application.
 */
const DRAWER_WIDTH = 500; // Width of the explanation drawer on desktop (px)
const DRAWER_Z_INDEX = 1300; // Z-index to ensure drawer appears above other content
const SPINNER_SIZE = 20; // Size of the loading spinner icon (px)

/**
 * Utility function to clean text input by removing non-ASCII punctuation
 * 
 * This function is placed outside the component to prevent recreation on every render,
 * improving performance. It removes special characters and punctuation while preserving
 * basic ASCII characters, words, and whitespace.
 * 
 * @param text - The input text to clean
 * @returns The cleaned text with punctuation removed and whitespace trimmed
 * 
 * @example
 * ```typescript
 * stripPunctuation("Hello, world!") // Returns: "Hello world"
 * stripPunctuation("café") // Returns: "caf"
 * stripPunctuation("  test  ") // Returns: "test"
 * ```
 */
const stripPunctuation = (text: string): string => {
    return text.replace(/[^\u0000-\u007F\w\s]/g, '').trim();
};

/**
 * Props interface for the WordsExplanationTool component
 * 
 * @interface ExplanationToolProps
 */
interface ExplanationToolProps {
    /** 
     * The word or phrase to explain
     * 
     * This can be a single word or multiple words that the user wants to understand.
     * The component will automatically clean punctuation from this input.
     * 
     * @example "hello" | "machine learning" | "café!"
     */
    word: string;

    /** 
     * The chunk containing context for the explanation
     * 
     * Provides the surrounding text context that helps the AI generate more accurate
     * and contextually relevant explanations. Must contain at least the `text` and
     * `meta_text_id` properties.
     */
    chunk: ChunkType;

    /** 
     * Optional callback fired when explanation interaction completes
     * 
     * Called when the user closes the explanation drawer. Provides feedback about
     * whether the explanation was successful and includes the explanation data.
     * 
     * @param success - Whether the explanation was successfully retrieved
     * @param result - The explanation data (undefined if unsuccessful)
     * 
     * @example
     * ```typescript
     * const handleComplete = (success: boolean, result?: ExplanationResponse) => {
     *   if (success && result) {
     *     console.log('Explanation retrieved:', result.explanation);
     *   } else {
     *     console.log('Explanation failed or was cancelled');
     *   }
     * };
     * ```
     */
    onComplete?: (success: boolean, result?: ExplanationResponse) => void;
}

/**
 * WordsExplanationTool Component
 * 
 * An interactive tool that provides AI-powered explanations for words or phrases
 * within a document context. The component renders as a question mark icon that,
 * when clicked, fetches and displays contextual explanations in a side drawer.
 * 
 * ## Features
 * 
 * - **Context-Aware Explanations**: Uses surrounding text to provide relevant explanations
 * - **Responsive Design**: Adapts to mobile and tablet screen sizes
 * - **Performance Optimized**: Uses React.memo and memoized callbacks to prevent unnecessary re-renders
 * - **Accessibility**: Full ARIA support for screen readers and keyboard navigation
 * - **Error Handling**: Graceful error handling with user-friendly error messages
 * - **Loading States**: Clear visual feedback during explanation fetching
 * 
 * ## Usage
 * 
 * ```typescript
 * import WordsExplanationTool from './WordsExplanationTool';
 * 
 * function MyComponent() {
 *   const handleExplanationComplete = (success: boolean, result?: ExplanationResponse) => {
 *     if (success) {
 *       console.log('Explanation completed successfully');
 *     }
 *   };
 * 
 *   return (
 *     <WordsExplanationTool
 *       word="artificial intelligence"
 *       chunk={myChunk}
 *       onComplete={handleExplanationComplete}
 *     />
 *   );
 * }
 * ```
 * 
 * ## Component Behavior
 * 
 * 1. **Initialization**: Validates input props and returns null for invalid inputs
 * 2. **User Interaction**: Shows tooltip on hover, processes click to fetch explanation
 * 3. **AI Processing**: Displays loading state while fetching explanation from AI service
 * 4. **Results Display**: Shows explanation in responsive drawer with proper formatting
 * 5. **Cleanup**: Calls completion callback when user closes the drawer
 * 
 * ## Performance Considerations
 * 
 * - Component is wrapped in `React.memo` to prevent unnecessary re-renders
 * - Event handlers are memoized with `useCallback` to maintain referential equality
 * - Word cleaning is memoized with `useMemo` to avoid repeated computation
 * - Utility functions are defined outside component scope to prevent recreation
 * 
 * @param props - The component props
 * @returns JSX.Element | null - Returns null if validation fails, otherwise renders the tool
 * 
 * @example
 * ```typescript
 * // Basic usage
 * <WordsExplanationTool word="quantum" chunk={chunk} />
 * 
 * // With completion callback
 * <WordsExplanationTool 
 *   word="photosynthesis" 
 *   chunk={chunk} 
 *   onComplete={(success, result) => {
 *     if (success) analytics.track('explanation_viewed', { word: 'photosynthesis' });
 *   }}
 * />
 * ```
 */
const WordsExplanationTool: React.FC<ExplanationToolProps> = React.memo(({
    word,
    chunk,
    onComplete
}) => {
    /**
     * Input Validation
     * 
     * Ensures the component only renders with valid inputs. This prevents:
     * - API calls with empty or invalid words
     * - Errors from missing chunk data
     * - Unnecessary rendering of non-functional components
     */
    if (!word?.trim() || !chunk?.text) {
        return null;
    }

    /**
     * Hook Integration
     * 
     * Uses the custom useExplanation hook to manage:
     * - AI service communication
     * - Loading and error states
     * - Explanation data storage
     */
    const { explain, explanation, loading, error } = useExplanation();

    /**
     * Local State Management
     * 
     * Controls the visibility of the explanation drawer.
     * Separate from the explanation loading state to provide smooth UX.
     */
    const [showDefinition, setShowDefinition] = useState(false);

    /**
     * Memoized Word Cleaning
     * 
     * Processes the input word to remove punctuation and normalize formatting.
     * Memoized to prevent recalculation on every render, improving performance
     * when the component re-renders due to parent updates.
     */
    const cleanedWord = useMemo(() => stripPunctuation(word), [word]);

    /**
     * Explanation Request Handler
     * 
     * Initiates the AI explanation process when the user clicks the question mark icon.
     * 
     * Process Flow:
     * 1. Calls the AI service with cleaned word and chunk context
     * 2. Shows loading state in the icon
     * 3. Opens drawer only if explanation is successfully retrieved
     * 4. Error handling is managed by the useExplanation hook
     * 
     * @async
     * @function handleDefine
     */
    const handleDefine = useCallback(async () => {
        const result = await explain({
            words: cleanedWord,
            context: chunk.text,
            metaTextId: chunk.meta_text_id,
            chunkId: null
        });
        if (result) {
            setShowDefinition(true);
        }
    }, [cleanedWord, chunk.text, chunk.meta_text_id, explain]);

    /**
     * Drawer Close Handler
     * 
     * Handles the user closing the explanation drawer and provides completion feedback.
     * 
     * Behavior:
     * - Always closes the drawer
     * - Calls onComplete callback with success status based on explanation availability
     * - Provides explanation data to parent component if available
     * 
     * @function handleCloseDefinition
     */
    const handleCloseDefinition = useCallback(() => {
        setShowDefinition(false);
        // Only call onComplete if we have a valid explanation
        if (explanation) {
            onComplete?.(true, explanation);
        } else {
            onComplete?.(false, undefined);
        }
    }, [explanation, onComplete]);

    return (
        <>
            {/* 
                Question Mark Icon Button
                
                The primary interaction element that users click to request explanations.
                Features:
                - Tooltip showing the word to be explained
                - Loading state with spinner during AI processing
                - Disabled state during loading to prevent multiple requests
                - Accessibility support with aria-label
            */}
            <Tooltip title={`Define "${cleanedWord}"`}>
                <IconButton
                    onClick={handleDefine}
                    size="small"
                    disabled={loading}
                    aria-label={`Define ${cleanedWord}`}
                >
                    {loading ? (
                        <LoadingSpinner size={SPINNER_SIZE} />
                    ) : (
                        <QuestionMarkIcon />
                    )}
                </IconButton>
            </Tooltip>

            {/* 
                Explanation Drawer
                
                A responsive side panel that displays the AI-generated explanations.
                
                Features:
                - Responsive width (full width on mobile, fixed width on desktop)
                - Proper ARIA attributes for accessibility
                - High z-index to appear above other content
                - Smooth open/close animations via Material-UI
            */}
            <Drawer
                anchor="right"
                open={showDefinition}
                onClose={handleCloseDefinition}
                role="dialog"
                aria-labelledby="explanation-title"
                aria-describedby="explanation-content"
                sx={{
                    zIndex: DRAWER_Z_INDEX,
                    '& .MuiDrawer-paper': {
                        width: { xs: '100vw', sm: DRAWER_WIDTH },
                        maxWidth: '90vw'
                    }
                }}
            >
                <Box sx={{ p: 3 }}>
                    {/* 
                        Drawer Header
                        
                        Shows the word being explained with proper semantic markup.
                        The ID is referenced by aria-labelledby for accessibility.
                    */}
                    <Typography
                        id="explanation-title"
                        variant="h6"
                        gutterBottom
                    >
                        Explaining: {cleanedWord}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {/* 
                        Error State Display
                        
                        Shows user-friendly error messages when explanation fails.
                        Uses Material-UI Alert component for consistent styling.
                    */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* 
                        Loading State Display
                        
                        Shows a centered spinner while explanation is being fetched.
                        Separate from the icon loading state for better UX.
                    */}
                    {loading && (
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                            <LoadingSpinner size={SPINNER_SIZE} />
                        </Box>
                    )}

                    {/* 
                        Explanation Content Area
                        
                        Displays the AI-generated explanations with semantic structure.
                        The ID is referenced by aria-describedby for screen readers.
                        
                        Two types of explanations may be shown:
                        1. General explanation - Basic definition/meaning
                        2. Contextual explanation - Meaning within the specific document context
                    */}
                    <Box id="explanation-content">
                        {explanation?.explanation && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    General Explanation:
                                </Typography>
                                <Typography variant="body2" paragraph>
                                    {explanation.explanation}
                                </Typography>
                            </Box>
                        )}

                        {explanation?.explanationWithContext && (
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Explanation in Context:
                                </Typography>
                                <Typography variant="body2">
                                    {explanation.explanationWithContext}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Drawer>
        </>
    );
});

/**
 * Component Display Name
 * 
 * Set for better debugging experience in React DevTools.
 * Helps identify the component in stack traces and profiling.
 */
WordsExplanationTool.displayName = 'WordsExplanationTool';

export default WordsExplanationTool;

/**
 * ## Technical Implementation Notes
 * 
 * ### Performance Optimizations
 * 
 * 1. **React.memo**: Prevents re-renders when props haven't changed
 * 2. **useCallback**: Memoizes event handlers to maintain referential equality
 * 3. **useMemo**: Caches expensive word cleaning operations
 * 4. **External utility functions**: Prevents function recreation on each render
 * 
 * ### Accessibility Features
 * 
 * - **ARIA Labels**: Proper labeling for screen readers
 * - **Semantic HTML**: Uses appropriate HTML elements and roles
 * - **Keyboard Navigation**: Full keyboard accessibility via Material-UI
 * - **Focus Management**: Proper focus handling in modal context
 * 
 * ### Error Handling Strategy
 * 
 * - **Input Validation**: Graceful handling of invalid props
 * - **API Error Display**: User-friendly error messages
 * - **Fallback States**: Appropriate fallbacks for missing data
 * - **Loading States**: Clear visual feedback during async operations
 * 
 * ### Mobile Responsiveness
 * 
 * - **Adaptive Width**: Full width on mobile, fixed width on desktop
 * - **Touch-Friendly**: Appropriate touch targets and spacing
 * - **Viewport Constraints**: Prevents overflow on small screens
 * 
 * ### Dependencies
 * 
 * - **@mui/material**: UI components and theming
 * - **icons**: Custom icon components
 * - **services**: AI explanation API integration
 * - **types**: TypeScript type definitions
 * - **./useExplanation**: Custom hook for explanation logic
 * 
 * ### Browser Support
 * 
 * This component supports all modern browsers that support:
 * - ES6+ features (arrow functions, destructuring, etc.)
 * - CSS Grid and Flexbox
 * - Modern React features (hooks, memo, etc.)
 * 
 * ### Future Enhancements
 * 
 * Potential improvements that could be added:
 * - Keyboard shortcuts for quick explanations
 * - Explanation history/caching
 * - Multiple language support
 * - Custom explanation templates
 * - Integration with pronunciation APIs
 * - Bookmarking favorite explanations
 */
