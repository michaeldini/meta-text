import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../src/components/ErrorBoundary.jsx';
import { Button } from '@mui/material';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
describe('ErrorBoundary', () => {
    it('renders children when no error', () => {
        render(
            <ErrorBoundary>
                <div>Test Child</div>
            </ErrorBoundary>
        );
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('catches errors and displays fallback UI', () => {
        // Component that throws
        function ProblemChild() {
            throw new Error('Test error');
        }
        // Suppress error output in test
        const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
        render(
            <ErrorBoundary>
                <ProblemChild />
            </ErrorBoundary>
        );
        expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
        expect(screen.getByText(/Test error/)).toBeInTheDocument();
        spy.mockRestore();
    });

    it('reloads the page when reload button is clicked', () => {
        // Simulate error
        function ProblemChild() {
            throw new Error('Test error');
        }
        // Mock window.location.reload
        const reloadMock = vi.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reloadMock },
            writable: true,
        });
        // Suppress error output
        const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
        render(
            <ErrorBoundary>
                <ProblemChild />
            </ErrorBoundary>
        );
        const button = screen.getByRole('button', { name: /reload page/i });
        button.click();
        expect(reloadMock).toHaveBeenCalled();
        spy.mockRestore();
    });
});
