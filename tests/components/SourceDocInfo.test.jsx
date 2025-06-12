import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SourceDocInfo from '../../src/components/SourceDocInfo';
import '@testing-library/jest-dom';

// Mock props for the component
const mockDoc = {
    id: 1,
    title: 'Test Document',
    summary: 'A test document for unit testing.'
};

describe('SourceDocInfo', () => {
    it('renders summary from doc with prefix', () => {
        render(<SourceDocInfo doc={mockDoc} />);
        expect(screen.getByText('Summary:', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('A test document for unit testing.', { exact: false })).toBeInTheDocument();
    });
});
