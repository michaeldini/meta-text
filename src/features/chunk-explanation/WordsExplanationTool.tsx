
import React, { useState, useCallback, useMemo } from 'react';
import {
    IconButton,
    Tooltip,
    Drawer,
    Box,
    Typography,
    Divider,
} from '@mui/material';
import { QuestionMarkIcon } from 'icons';
import { useExplanation } from './hooks/useExplanation';
// import { ChunkType } from 'types';
// import { ExplanationResponse } from 'services';
import { LoadingSpinner, AppAlert } from 'components';
import type { ExplanationToolProps } from 'features/chunk-shared/types';

const DRAWER_WIDTH = 500; // Width of the explanation drawer on desktop (px)
const DRAWER_Z_INDEX = 1300; // Z-index to ensure drawer appears above other content


const stripPunctuation = (text: string): string => {
    return text.replace(/[^\u0000-\u007F\w\s]/g, '').trim();
};

const WordsExplanationTool: React.FC<ExplanationToolProps> = React.memo(({
    word,
    chunk,
    onComplete
}) => {

    // Trim away whitespace and ensure word is not empty
    if (!word?.trim() || !chunk?.text) {
        return null;
    }
    // Custom hook to manage explanation logic
    const { explain, explanation, loading, error } = useExplanation();


    const [showDefinition, setShowDefinition] = useState(false);
    const cleanedWord = useMemo(() => stripPunctuation(word), [word]);

    const handleDefine = useCallback(async () => {
        console.log(`Requesting explanation for meta text ID: ${chunk}, word: ${cleanedWord}`);
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
                        <LoadingSpinner />
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
                        <AppAlert severity="error">
                            {error}
                        </AppAlert>
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
