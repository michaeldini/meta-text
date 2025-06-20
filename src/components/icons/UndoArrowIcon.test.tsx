import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import UndoArrowIcon from './UndoArrowIcon';

describe('UndoArrowIcon', () => {
    it('should render SVG with correct dimensions', () => {
        const { container } = render(<UndoArrowIcon />);

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '20');
        expect(svg).toHaveAttribute('height', '20');
        expect(svg).toHaveAttribute('viewBox', '0 0 20 20');
    });

    it('should accept custom props', () => {
        const { container } = render(<UndoArrowIcon className="custom-class" data-testid="undo-icon" />);

        const svg = container.querySelector('svg');
        expect(svg).toHaveClass('custom-class');
        expect(svg).toHaveAttribute('data-testid', 'undo-icon');
    });

    it('should have correct path elements for undo arrow shape', () => {
        const { container } = render(<UndoArrowIcon />);

        const paths = container.querySelectorAll('path');
        expect(paths).toHaveLength(2);

        // First path should be the arrow
        expect(paths[0]).toHaveAttribute('d', 'M8 4L3 9L8 14');

        // Second path should be the curved line
        expect(paths[1]).toHaveAttribute('d', 'M3 9H13C15.7614 9 18 11.2386 18 14C18 16.7614 15.7614 19 13 19H11');
    });

    it('should use currentColor for stroke', () => {
        const { container } = render(<UndoArrowIcon />);

        const paths = container.querySelectorAll('path');
        paths.forEach(path => {
            expect(path).toHaveAttribute('stroke', 'currentColor');
        });
    });
});
