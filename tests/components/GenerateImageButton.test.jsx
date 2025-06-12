import { render, screen, fireEvent, describe, it, expect } from '@testing-library/react';
import { vi } from 'vitest';
import GenerateImageButton from '../../src/components/GenerateImageButton.jsx';

describe('GenerateImageButton', () => {
    it('renders with label', () => {
        render(<GenerateImageButton label="Generate" onClick={() => { }} />);
        expect(screen.getByText('Generate Image')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<GenerateImageButton label="Generate" onClick={handleClick} />);
        fireEvent.click(screen.getByText('Generate Image'));
        expect(handleClick).toHaveBeenCalled();
    });
});
