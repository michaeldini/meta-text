import { vi } from 'vitest';
import { render, screen, describe, it, expect } from '@testing-library/react';
import ChunkImageDisplay from '../../src/components/ChunkImageDisplay.jsx';

describe('ChunkImageDisplay', () => {
    it('renders image with alt text', () => {
        render(<ChunkImageDisplay src="/test.png" imgPrompt="Test Image" />);
        expect(screen.getByAltText('Test Image')).toBeInTheDocument();
    });
});
