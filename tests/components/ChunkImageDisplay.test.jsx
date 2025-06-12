import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChunkImageDisplay from '../../src/components/ChunkImageDisplay.jsx';

describe('ChunkImageDisplay', () => {
    it('renders image with alt text', () => {
        render(<ChunkImageDisplay src="/test.png" imgPrompt="Test Image" />);
        expect(screen.getByAltText('Test Image')).toBeInTheDocument();
    });
});
