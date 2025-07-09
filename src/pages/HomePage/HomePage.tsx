/**
 * @fileoverview HomePage component for the MetaText application
 * 
 * The HomePage serves as the main entry point for users, providing a user-friendly
 * interface for managing and interacting with documents. It allows users to create
 * or search for documents, with toggles for switching between document types and
 * view modes.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-08
 */

import { Box, Paper, Slide, useTheme, Button } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageContainer } from 'components';

import { getHomePageStyles } from '../../styles/styles';
import WelcomeText from './components/WelcomeText';
import { HomePageToggles } from './components/HomePageToggles';
import { useHomePageData } from './useHomePageData';
import { useHomePageContent } from './useHomePageContent';

/**
 * HomePage Component
 * 
 * The main landing page component that provides the primary interface for users
 * to interact with the MetaText application. This component orchestrates the
 * display of document management features and handles the overall page layout.
 * 
 * Features:
 * - Welcome message and branding
 * - Document type toggles (Source Documents vs Meta Texts)
 * - View mode toggles (Create vs Search)
 * - Dynamic content rendering based on selected modes
 * - Responsive design for tablet and mobile devices
 * - Smooth animations and transitions
 * 
 * @category Components
 * @subcategory Pages
 * @component
 * @example
 * ```tsx
 * import HomePage from './pages/HomePage/HomePage';
 * 
 * function App() {
 *   return (
 *     <Router>
 *       <Route path="/" component={HomePage} />
 *     </Router>
 *   );
 * }
 * ```
 * 
 * @returns {ReactElement} The rendered HomePage component
 */
function HomePage(): ReactElement {
    /**
     * Material-UI theme object for accessing design tokens and styling utilities
     * @type {Theme}
     */
    const theme: Theme = useTheme();

    /**
     * Navigation hook for programmatic routing
     */
    const navigate = useNavigate();

    /**
     * Computed styles for the HomePage component based on the current theme
     * @type {ReturnType<typeof getHomePageStyles>}
     */
    const styles = getHomePageStyles(theme);

    /**
     * State management and data fetching for the HomePage
     * 
     * This hook provides:
     * - Document type state (Source Documents vs Meta Texts)
     * - View mode state (Create vs Search)
     * - Document data and loading states
     * - Error handling for data fetching
     * - Data refresh functionality
     */
    const {
        docType,
        setDocType,
        viewMode,
        setViewMode,
        sourceDocs,
        sourceDocsLoading,
        sourceDocsError,
        metaTexts,
        metaTextsLoading,
        metaTextsError,
        refreshData,
    } = useHomePageData();

    /**
     * Rendered content for the current view state
     * 
     * This hook determines what content to display based on the current
     * document type and view mode selections, returning the appropriate
     * React component or content.
     * 
     * @type {ReactElement}
     */
    const content = useHomePageContent({
        docType,
        viewMode,
        sourceDocs,
        sourceDocsLoading,
        sourceDocsError,
        metaTexts,
        refreshData,
    });

    /**
     * Navigate to the source documents list page
     */
    const handleNavigateToSourceDocs = () => {
        navigate('/sourcedoc');
    };

    /**
     * Navigate to the MetaText list page
     */
    const handleNavigateToMetaTexts = () => {
        navigate('/metatext');
    };

    return (
        <PageContainer
            loading={sourceDocsLoading || metaTextsLoading}
            data-testid="homepage-container"
        >
            {/* Smooth slide-up animation for the entire page content */}
            <Slide in={true} direction="up" timeout={500}>
                <Box sx={styles.homePageContainer} data-testid="homepage-content">
                    {/* Welcome section with branding and introductory text */}
                    <WelcomeText />

                    {/* Quick navigation section */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        my: 3,
                        gap: 2,
                        flexWrap: 'wrap'
                    }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleNavigateToSourceDocs}
                            data-testid="navigate-to-source-docs"
                            sx={{
                                fontWeight: 'bold',
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                boxShadow: 2,
                                '&:hover': {
                                    boxShadow: 4,
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                        >
                            Browse Source Documents
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="large"
                            onClick={handleNavigateToMetaTexts}
                            data-testid="navigate-to-metatexts"
                            sx={{
                                fontWeight: 'bold',
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                borderWidth: 2,
                                '&:hover': {
                                    borderWidth: 2,
                                    transform: 'translateY(-1px)',
                                    boxShadow: 2,
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                        >
                            Browse MetaTexts
                        </Button>
                    </Box>

                    {/* Control toggles for document type and view mode selection */}
                    <HomePageToggles
                        docType={docType}
                        setDocType={setDocType}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        styles={styles}
                    />

                    {/* Main content area that displays different components based on current state */}
                    <Paper sx={styles.contentContainer} data-testid="homepage-main-content">
                        {content}
                    </Paper>
                </Box>
            </Slide>
        </PageContainer>
    );
}

// Export with a more descriptive name for TypeDoc

// Default export for React component usage
export default HomePage;
