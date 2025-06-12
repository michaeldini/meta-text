import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import AiGenerationButton from '../../src/components/AiGenerationButton.jsx';

describe('AiGenerationButton', () => {
    it('renders with label and icon', () => {
        render(
            <AiGenerationButton label="Generate" onClick={() => { }} />
        );
        expect(screen.getByText('Generate')).toBeInTheDocument();
        expect(screen.getByAltText('AI')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(
            <AiGenerationButton label="Generate" onClick={handleClick} dataTestid="ai-gen-btn" />
        );
        fireEvent.click(screen.getByText('Generate'));
        expect(handleClick).toHaveBeenCalled();
    });

    it('shows loading spinner and disables button when loading', () => {
        render(
            <AiGenerationButton label="Generate" onClick={() => { }} loading />
        );
        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    }
    );
    it('does not show loading spinner when not loading', () => {
        render(
            <AiGenerationButton label="Generate" onClick={() => { }} />
        );
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        render(
            <AiGenerationButton label="Generate" onClick={() => { }} disabled />
        );
        expect(screen.getByText('Generate')).toBeDisabled();
    });

    it('shows tooltip when hovered', async () => {
        render(
            <AiGenerationButton label="Generate" onClick={() => { }} toolTip="AI generates content" />
        );
        // Hover over the button's span wrapper
        fireEvent.mouseOver(screen.getByText('Generate').parentElement);
        // Tooltip text should appear
        expect(await screen.findByText('AI generates content')).toBeInTheDocument();
    });
});
