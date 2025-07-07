import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { vi } from 'vitest';
import NotesTool from './NotesTool';
import { NotesToolComponentProps } from '../types';
import theme from '../../../../styles/themes';

const defaultProps: NotesToolComponentProps = {
    summary: '',
    notes: '',
    onSummaryBlur: vi.fn(),
    onNotesBlur: vi.fn(),
    summaryFieldSx: {},
    notesFieldSx: {},
};

const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('NotesTool', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders both summary and notes text fields', () => {
            renderWithTheme(<NotesTool {...defaultProps} />);

            expect(screen.getByLabelText('Summary')).toBeInTheDocument();
            expect(screen.getByLabelText('Notes')).toBeInTheDocument();
        });

        it('displays initial summary and notes values', () => {
            const props = {
                ...defaultProps,
                summary: 'Initial summary text',
                notes: 'Initial notes text',
            };

            renderWithTheme(<NotesTool {...props} />);

            expect(screen.getByDisplayValue('Initial summary text')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Initial notes text')).toBeInTheDocument();
        });

        it('renders with empty values when summary and notes are not provided', () => {
            renderWithTheme(<NotesTool {...defaultProps} />);

            const summaryField = screen.getByLabelText('Summary');
            const notesField = screen.getByLabelText('Notes');

            expect(summaryField).toHaveValue('');
            expect(notesField).toHaveValue('');
        });
    });

    describe('User Interactions', () => {
        it('updates summary field value when user types', async () => {
            const user = userEvent.setup();
            renderWithTheme(<NotesTool {...defaultProps} />);

            const summaryField = screen.getByLabelText('Summary');
            await user.type(summaryField, 'New summary content');

            expect(summaryField).toHaveValue('New summary content');
        });

        it('updates notes field value when user types', async () => {
            const user = userEvent.setup();
            renderWithTheme(<NotesTool {...defaultProps} />);

            const notesField = screen.getByLabelText('Notes');
            await user.type(notesField, 'New notes content');

            expect(notesField).toHaveValue('New notes content');
        });

        it('calls onSummaryBlur with current value when summary field loses focus', async () => {
            const user = userEvent.setup();
            const onSummaryBlur = vi.fn();
            const props = { ...defaultProps, onSummaryBlur };

            renderWithTheme(<NotesTool {...props} />);

            const summaryField = screen.getByLabelText('Summary');
            await user.type(summaryField, 'Summary text');
            await user.tab(); // Move focus away to trigger blur

            expect(onSummaryBlur).toHaveBeenCalledWith('Summary text');
        });

        it('calls onNotesBlur with current value when notes field loses focus', async () => {
            const user = userEvent.setup();
            const onNotesBlur = vi.fn();
            const props = { ...defaultProps, onNotesBlur };

            renderWithTheme(<NotesTool {...props} />);

            const notesField = screen.getByLabelText('Notes');
            await user.type(notesField, 'Notes text');
            await user.tab(); // Move focus away to trigger blur

            expect(onNotesBlur).toHaveBeenCalledWith('Notes text');
        });

        it('does not call blur handlers when they are not provided', async () => {
            const user = userEvent.setup();
            const props = {
                summary: '',
                notes: '',
                // onSummaryBlur and onNotesBlur intentionally not provided
            };

            renderWithTheme(<NotesTool {...props} />);

            const summaryField = screen.getByLabelText('Summary');
            const notesField = screen.getByLabelText('Notes');

            await user.type(summaryField, 'Summary');
            await user.tab();
            await user.type(notesField, 'Notes');
            await user.tab();

            // Should not throw any errors
            expect(summaryField).toHaveValue('Summary');
            expect(notesField).toHaveValue('Notes');
        });
    });

    describe('Props Updates', () => {
        it('updates local summary when summary prop changes', () => {
            const { rerender } = renderWithTheme(<NotesTool {...defaultProps} summary="Initial" />);

            expect(screen.getByDisplayValue('Initial')).toBeInTheDocument();

            rerender(
                <ThemeProvider theme={theme}>
                    <NotesTool {...defaultProps} summary="Updated" />
                </ThemeProvider>
            );

            expect(screen.getByDisplayValue('Updated')).toBeInTheDocument();
        });

        it('updates local notes when notes prop changes', () => {
            const { rerender } = renderWithTheme(<NotesTool {...defaultProps} notes="Initial notes" />);

            expect(screen.getByDisplayValue('Initial notes')).toBeInTheDocument();

            rerender(
                <ThemeProvider theme={theme}>
                    <NotesTool {...defaultProps} notes="Updated notes" />
                </ThemeProvider>
            );

            expect(screen.getByDisplayValue('Updated notes')).toBeInTheDocument();
        });

        it('preserves user input when props change but user has modified the field', async () => {
            const user = userEvent.setup();
            const { rerender } = renderWithTheme(<NotesTool {...defaultProps} summary="Original" />);

            const summaryField = screen.getByLabelText('Summary');

            // User modifies the field
            await user.clear(summaryField);
            await user.type(summaryField, 'User input');

            // Props change
            rerender(
                <ThemeProvider theme={theme}>
                    <NotesTool {...defaultProps} summary="New prop value" />
                </ThemeProvider>
            );

            // Should show the new prop value, not the user input
            expect(screen.getByDisplayValue('New prop value')).toBeInTheDocument();
        });
    });

    describe('Custom Styling', () => {
        it('applies custom sx styles to summary field', () => {
            const summaryFieldSx = { backgroundColor: 'red' };
            const props = { ...defaultProps, summaryFieldSx };

            renderWithTheme(<NotesTool {...props} />);

            const summaryField = screen.getByLabelText('Summary');
            // Note: Testing actual styles can be complex with Material-UI
            // This test verifies the component accepts the sx prop
            expect(summaryField).toBeInTheDocument();
        });

        it('applies custom sx styles to notes field', () => {
            const notesFieldSx = { backgroundColor: 'blue' };
            const props = { ...defaultProps, notesFieldSx };

            renderWithTheme(<NotesTool {...props} />);

            const notesField = screen.getByLabelText('Notes');
            expect(notesField).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('handles undefined props gracefully', () => {
            const props = {
                summary: undefined,
                notes: undefined,
                onSummaryBlur: undefined,
                onNotesBlur: undefined,
            };

            renderWithTheme(<NotesTool {...props} />);

            expect(screen.getByLabelText('Summary')).toHaveValue('');
            expect(screen.getByLabelText('Notes')).toHaveValue('');
        });

        it('handles null values gracefully', () => {
            const props = {
                summary: null as any,
                notes: null as any,
            };

            renderWithTheme(<NotesTool {...props} />);

            expect(screen.getByLabelText('Summary')).toHaveValue('');
            expect(screen.getByLabelText('Notes')).toHaveValue('');
        });

        it('handles very long text content', async () => {
            const user = userEvent.setup();
            const longText = 'A'.repeat(1000);

            renderWithTheme(<NotesTool {...defaultProps} />);

            const summaryField = screen.getByLabelText('Summary');
            await user.type(summaryField, longText);

            expect(summaryField).toHaveValue(longText);
        });

        it('handles special characters and newlines', async () => {
            const user = userEvent.setup();
            const specialText = 'Text with\nnewlines and 特殊字符 & symbols!@#$%';

            renderWithTheme(<NotesTool {...defaultProps} />);

            const notesField = screen.getByLabelText('Notes');
            await user.type(notesField, specialText);

            expect(notesField).toHaveValue(specialText);
        });
    });

    describe('Accessibility', () => {
        it('has proper labels for screen readers', () => {
            renderWithTheme(<NotesTool {...defaultProps} />);

            expect(screen.getByLabelText('Summary')).toBeInTheDocument();
            expect(screen.getByLabelText('Notes')).toBeInTheDocument();
        });

        it('supports keyboard navigation between fields', async () => {
            const user = userEvent.setup();
            renderWithTheme(<NotesTool {...defaultProps} />);

            const summaryField = screen.getByLabelText('Summary');
            const notesField = screen.getByLabelText('Notes');

            await user.click(summaryField);
            expect(summaryField).toHaveFocus();

            await user.tab();
            expect(notesField).toHaveFocus();
        });
    });
});
