import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import AiGenerationButton from '../../src/components/AiGenerationButton.jsx';

describe('AiGenerationButton', () => {
    it('renders with label and icon', () => {
        render(
            <AiGenerationButton label="Generate" onClick={() => { }} dataTestid="ai-gen-btn" />
        );
        expect(screen.getByText('Generate')).toBeInTheDocument();
        expect(screen.getByAltText('AI')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(
            <AiGenerationButton label="Generate" onClick={handleClick} dataTestid="ai-gen-btn" />
        );
        fireEvent.click(screen.getByTestId('ai-gen-btn'));
        expect(handleClick).toHaveBeenCalled();
    });

    it('shows loading spinner and disables button when loading', () => {
        render(
            <AiGenerationButton label="Generate" onClick={() => { }} loading dataTestid="ai-gen-btn" />
        );
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.getByTestId('ai-gen-btn')).toBeDisabled();
    });

    it('is disabled when disabled prop is true', () => {
        render(
            <AiGenerationButton label="Generate" onClick={() => { }} disabled dataTestid="ai-gen-btn" />
        );
        expect(screen.getByTestId('ai-gen-btn')).toBeDisabled();
    });

    it('shows tooltip when hovered', async () => {
        render(
            <AiGenerationButton label="Generate" onClick={() => { }} toolTip="AI generates content" dataTestid="ai-gen-btn" />
        );
        // Hover over the button's span wrapper
        fireEvent.mouseOver(screen.getByTestId('ai-gen-btn').parentElement);
        // Tooltip text should appear
        expect(await screen.findByText('AI generates content')).toBeInTheDocument();
    });
});
