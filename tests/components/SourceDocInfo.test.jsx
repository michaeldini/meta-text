import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SourceDocInfo from '../../src/components/SourceDocInfo';

// Mock props for the component
const mockDoc = {
    id: 1,
    title: 'Test Document',
    details: JSON.stringify({
        summary: 'A test document for unit testing.',
    })
};

describe('SourceDocInfo', () => {
    it('renders summary from details with prefix', () => {
        render(<SourceDocInfo doc={mockDoc} />);
        expect(screen.getByText('Summary:', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('A test document for unit testing.', { exact: false })).toBeInTheDocument();
    });
});
