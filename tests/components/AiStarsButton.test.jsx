import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import AiStarsButton from '../../src/components/AiStarsButton.jsx';

describe('AiStarsButton', () => {
    it('renders with label', () => {
        render(<AiStarsButton label="AI Stars" onClick={() => { }} />);
        expect(screen.getByAltText('AI')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<AiStarsButton label="AI Stars" onClick={handleClick} />);
        screen.getByAltText('AI').click();
        expect(handleClick).toHaveBeenCalled();
    });
});
