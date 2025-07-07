import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../../../styles/themes';
import { HomePageToggles, DOC_TYPE_OPTIONS, VIEW_MODE_OPTIONS } from './HomePageToggles';
import { DocType, ViewMode } from '../../../types';

// Mock the ToggleSelector component
vi.mock('../../../components', () => ({
    ToggleSelector: vi.fn(({ value, onChange, options }) => (
        <div data-testid="toggle-selector">
            <span data-testid="current-value">{value}</span>
            {options.map((option: any) => (
                <button
                    key={option.value}
                    data-testid={`option-${option.value}`}
                    onClick={() => onChange(option.value)}
                    aria-label={option.ariaLabel}
                >
                    {option.label}
                </button>
            ))}
        </div>
    ))
}));

const defaultProps = {
    docType: DocType.MetaText,
    setDocType: vi.fn(),
    viewMode: ViewMode.Search,
    setViewMode: vi.fn(),
    styles: {
        toggleContainer: {
            display: 'flex',
            gap: 2,
            alignItems: 'center'
        }
    }
};

const renderComponent = (props = {}) => {
    return render(
        <ThemeProvider theme={lightTheme}>
            <HomePageToggles {...defaultProps} {...props} />
        </ThemeProvider>
    );
};

describe('HomePageToggles', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render the component with default props', () => {
            renderComponent();

            const toggleSelectors = screen.getAllByTestId('toggle-selector');
            expect(toggleSelectors).toHaveLength(2);
        });

        it('should render with correct current values', () => {
            renderComponent();

            const currentValues = screen.getAllByTestId('current-value');
            expect(currentValues[0]).toHaveTextContent(DocType.MetaText);
            expect(currentValues[1]).toHaveTextContent(ViewMode.Search);
        });

        it('should render with different initial values', () => {
            renderComponent({
                docType: DocType.SourceDoc,
                viewMode: ViewMode.Create
            });

            const currentValues = screen.getAllByTestId('current-value');
            expect(currentValues[0]).toHaveTextContent(DocType.SourceDoc);
            expect(currentValues[1]).toHaveTextContent(ViewMode.Create);
        });


    });

    describe('DocType Toggle', () => {
        it('should render all doc type options', () => {
            renderComponent();

            expect(screen.getByTestId('option-metaText')).toBeInTheDocument();
            expect(screen.getByTestId('option-sourceDoc')).toBeInTheDocument();

            expect(screen.getByText('Meta-Text')).toBeInTheDocument();
            expect(screen.getByText('Source Document')).toBeInTheDocument();
        });

        it('should call setDocType when MetaText option is clicked', async () => {
            const setDocType = vi.fn();
            const user = userEvent.setup();

            renderComponent({
                docType: DocType.SourceDoc,
                setDocType
            });

            const metaTextOption = screen.getByTestId('option-metaText');
            await user.click(metaTextOption);

            expect(setDocType).toHaveBeenCalledWith(DocType.MetaText);
            expect(setDocType).toHaveBeenCalledTimes(1);
        });

        it('should call setDocType when SourceDoc option is clicked', async () => {
            const setDocType = vi.fn();
            const user = userEvent.setup();

            renderComponent({ setDocType });

            const sourceDocOption = screen.getByTestId('option-sourceDoc');
            await user.click(sourceDocOption);

            expect(setDocType).toHaveBeenCalledWith(DocType.SourceDoc);
            expect(setDocType).toHaveBeenCalledTimes(1);
        });

        it('should have correct aria-labels for doc type options', () => {
            renderComponent();

            expect(screen.getByLabelText('Meta-Text')).toBeInTheDocument();
            expect(screen.getByLabelText('Source Document')).toBeInTheDocument();
        });
    });

    describe('ViewMode Toggle', () => {
        it('should render all view mode options', () => {
            renderComponent();

            expect(screen.getByTestId('option-search')).toBeInTheDocument();
            expect(screen.getByTestId('option-create')).toBeInTheDocument();

            expect(screen.getByText('Search')).toBeInTheDocument();
            expect(screen.getByText('Create')).toBeInTheDocument();
        });

        it('should call setViewMode when Search option is clicked', async () => {
            const setViewMode = vi.fn();
            const user = userEvent.setup();

            renderComponent({
                viewMode: ViewMode.Create,
                setViewMode
            });

            const searchOption = screen.getByTestId('option-search');
            await user.click(searchOption);

            expect(setViewMode).toHaveBeenCalledWith(ViewMode.Search);
            expect(setViewMode).toHaveBeenCalledTimes(1);
        });

        it('should call setViewMode when Create option is clicked', async () => {
            const setViewMode = vi.fn();
            const user = userEvent.setup();

            renderComponent({ setViewMode });

            const createOption = screen.getByTestId('option-create');
            await user.click(createOption);

            expect(setViewMode).toHaveBeenCalledWith(ViewMode.Create);
            expect(setViewMode).toHaveBeenCalledTimes(1);
        });

        it('should have correct aria-labels for view mode options', () => {
            renderComponent();

            expect(screen.getByLabelText('Search')).toBeInTheDocument();
            expect(screen.getByLabelText('Create')).toBeInTheDocument();
        });
    });

    describe('Integration', () => {
        it('should handle multiple rapid clicks correctly', async () => {
            const setDocType = vi.fn();
            const setViewMode = vi.fn();
            const user = userEvent.setup();

            renderComponent({ setDocType, setViewMode });

            const sourceDocOption = screen.getByTestId('option-sourceDoc');
            const createOption = screen.getByTestId('option-create');

            await user.click(sourceDocOption);
            await user.click(createOption);
            await user.click(sourceDocOption);

            expect(setDocType).toHaveBeenCalledTimes(2);
            expect(setViewMode).toHaveBeenCalledTimes(1);
            expect(setDocType).toHaveBeenNthCalledWith(1, DocType.SourceDoc);
            expect(setDocType).toHaveBeenNthCalledWith(2, DocType.SourceDoc);
            expect(setViewMode).toHaveBeenCalledWith(ViewMode.Create);
        });

        it('should not interfere between different toggle groups', async () => {
            const setDocType = vi.fn();
            const setViewMode = vi.fn();
            const user = userEvent.setup();

            renderComponent({ setDocType, setViewMode });

            const sourceDocOption = screen.getByTestId('option-sourceDoc');
            const createOption = screen.getByTestId('option-create');

            await user.click(sourceDocOption);
            await user.click(createOption);

            expect(setDocType).toHaveBeenCalledWith(DocType.SourceDoc);
            expect(setViewMode).toHaveBeenCalledWith(ViewMode.Create);
            expect(setDocType).toHaveBeenCalledTimes(1);
            expect(setViewMode).toHaveBeenCalledTimes(1);
        });
    });

    describe('Event Handling', () => {
        it('should handle fireEvent clicks for doc type', () => {
            const setDocType = vi.fn();

            renderComponent({ setDocType });

            const sourceDocOption = screen.getByTestId('option-sourceDoc');
            fireEvent.click(sourceDocOption);

            expect(setDocType).toHaveBeenCalledWith(DocType.SourceDoc);
        });

        it('should handle fireEvent clicks for view mode', () => {
            const setViewMode = vi.fn();

            renderComponent({ setViewMode });

            const createOption = screen.getByTestId('option-create');
            fireEvent.click(createOption);

            expect(setViewMode).toHaveBeenCalledWith(ViewMode.Create);
        });
    });

    describe('Constants', () => {
        it('should export correct DOC_TYPE_OPTIONS', () => {
            expect(DOC_TYPE_OPTIONS).toEqual([
                { value: DocType.MetaText, label: 'Meta-Text', ariaLabel: 'Meta-Text' },
                { value: DocType.SourceDoc, label: 'Source Document', ariaLabel: 'Source Document' },
            ]);
        });

        it('should export correct VIEW_MODE_OPTIONS', () => {
            expect(VIEW_MODE_OPTIONS).toEqual([
                { value: ViewMode.Search, label: 'Search', ariaLabel: 'Search' },
                { value: ViewMode.Create, label: 'Create', ariaLabel: 'Create' },
            ]);
        });

        it('should have options with all required properties', () => {
            DOC_TYPE_OPTIONS.forEach(option => {
                expect(option).toHaveProperty('value');
                expect(option).toHaveProperty('label');
                expect(option).toHaveProperty('ariaLabel');
                expect(typeof option.value).toBe('string');
                expect(typeof option.label).toBe('string');
                expect(typeof option.ariaLabel).toBe('string');
            });

            VIEW_MODE_OPTIONS.forEach(option => {
                expect(option).toHaveProperty('value');
                expect(option).toHaveProperty('label');
                expect(option).toHaveProperty('ariaLabel');
                expect(typeof option.value).toBe('string');
                expect(typeof option.label).toBe('string');
                expect(typeof option.ariaLabel).toBe('string');
            });
        });
    });

    describe('TypeScript Types', () => {
        it('should accept all required props without TypeScript errors', () => {
            // This test ensures the component compiles correctly with TypeScript
            const requiredProps = {
                docType: DocType.MetaText,
                setDocType: vi.fn() as (value: DocType) => void,
                viewMode: ViewMode.Search,
                setViewMode: vi.fn() as (value: ViewMode) => void,
                styles: {} as any
            };

            expect(() => renderComponent(requiredProps)).not.toThrow();
        });
    });

    describe('Accessibility', () => {
        it('should have proper accessibility attributes', () => {
            renderComponent();

            // Check that all options have aria-labels
            expect(screen.getByLabelText('Meta-Text')).toBeInTheDocument();
            expect(screen.getByLabelText('Source Document')).toBeInTheDocument();
            expect(screen.getByLabelText('Search')).toBeInTheDocument();
            expect(screen.getByLabelText('Create')).toBeInTheDocument();
        });

        it('should be keyboard accessible', async () => {
            const setDocType = vi.fn();
            const user = userEvent.setup();

            renderComponent({ setDocType });

            const sourceDocOption = screen.getByTestId('option-sourceDoc');

            // Tab to the button and press Enter
            sourceDocOption.focus();
            await user.keyboard('{Enter}');

            expect(setDocType).toHaveBeenCalledWith(DocType.SourceDoc);
        });
    });

    describe('Edge Cases', () => {
        it('should handle undefined styles gracefully', () => {
            expect(() => {
                renderComponent({ styles: undefined });
            }).not.toThrow();
        });

        it('should handle empty styles object', () => {
            expect(() => {
                renderComponent({ styles: {} });
            }).not.toThrow();
        });

        it('should maintain function reference stability', () => {
            const setDocType = vi.fn();
            const setViewMode = vi.fn();

            const { rerender } = renderComponent({ setDocType, setViewMode });

            // Re-render with same props
            rerender(
                <ThemeProvider theme={lightTheme}>
                    <HomePageToggles {...defaultProps} setDocType={setDocType} setViewMode={setViewMode} />
                </ThemeProvider>
            );

            // Functions should remain stable between renders
            expect(setDocType).toHaveBeenCalledTimes(0);
            expect(setViewMode).toHaveBeenCalledTimes(0);
        });
    });
});
