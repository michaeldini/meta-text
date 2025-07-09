/**
 * @fileoverview HomePage component for the MetaText application
 * 
 * The HomePage serves as the main landing page for users, providing a clean
 * navigation interface to dedicated document management pages. This simplified
 * component focuses on branding and quick navigation to Source Documents and
 * MetaTexts pages.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-08
 */

import { Box, Slide, useTheme } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';

import { PageContainer } from 'components';

import { getAppStyles } from '../../styles/styles';
import WelcomeText from './components/WelcomeText';
import NavigationButtons from './components/NavigationButtons';

/**
 * HomePage Component
 * 
 * The main landing page component that provides the primary interface for users
 * to interact with the MetaText application. This simplified version focuses on
 * navigation to dedicated pages for document management.
 * 
 * Features:
 * - Welcome message and branding
 * - Quick navigation buttons to dedicated document pages
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
     * Computed styles for the HomePage component based on the current theme
     * @type {ReturnType<typeof getAppStyles>}
     */
    const styles = getAppStyles(theme);

    return (
        <PageContainer
            loading={false}
            data-testid="homepage-container"
        >
            {/* Smooth slide-up animation for the entire page content */}
            <Slide in={true} direction="up" timeout={500}>
                <Box sx={styles.homePage.container} data-testid="homepage-content">
                    {/* Welcome section with branding and introductory text */}
                    <WelcomeText welcomeTextStyles={styles.welcomeText} />

                    {/* Quick navigation section */}
                    <NavigationButtons styles={styles.homePage.navigationButtons} />


                </Box>
            </Slide>
        </PageContainer>
    );
}

// Export with a more descriptive name for TypeDoc

// Default export for React component usage
export default HomePage;
