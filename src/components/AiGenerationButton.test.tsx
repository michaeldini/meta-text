import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { vi } from 'vitest';
import AiGenerationButton, { AiGenerationButtonProps } from './AiGenerationButton';
import theme from '../styles/themes';

const defaultProps: AiGenerationButtonProps = {
    label: 'Generate',
    onClick: vi.fn(),
};

const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AiGenerationButton', () => {
    it('renders the button with label', () => {
        renderWithTheme(<AiGenerationButton {...defaultProps} />);
        expect(screen.getByTestId('ai-generation-button')).toBeInTheDocument();
        expect(screen.getByText('Generate')).toBeInTheDocument();
    });

    it('shows tooltip when provided', async () => {
        renderWithTheme(<AiGenerationButton {...defaultProps} toolTip="Test tooltip" />);
        fireEvent.mouseOver(screen.getByTestId('ai-generation-button'));
        expect(await screen.findByText('Test tooltip')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const onClick = vi.fn();
        renderWithTheme(<AiGenerationButton {...defaultProps} onClick={onClick} />);
        fireEvent.click(screen.getByTestId('ai-generation-button'));
        expect(onClick).toHaveBeenCalled();
    });

    it('shows loading spinner and disables button when loading', () => {
        renderWithTheme(<AiGenerationButton {...defaultProps} loading />);
        expect(screen.getByLabelText(/loading ai generation/i)).toBeInTheDocument();
        expect(screen.getByTestId('ai-generation-button')).toBeDisabled();
    });

    it('disables button when disabled', () => {
        renderWithTheme(<AiGenerationButton {...defaultProps} disabled />);
        expect(screen.getByTestId('ai-generation-button')).toBeDisabled();
    });
});
