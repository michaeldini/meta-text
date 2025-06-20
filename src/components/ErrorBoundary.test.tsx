import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';
import ErrorBoundary from './ErrorBoundary';

// Create a component that throws an error for testing
const ThrowError = ({ shouldThrow, errorMessage }: { shouldThrow: boolean; errorMessage?: string }) => {
    if (shouldThrow) {
        throw new Error(errorMessage || faker.lorem.sentence());
    }
    return <div data-testid="success-content">No error</div>;
};

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
    value: {
        reload: mockReload,
    },
    writable: true,
});

// Mock global logger
const mockLogger = {
    error: vi.fn(),
};

Object.defineProperty(window, 'logger', {
    value: mockLogger,
    writable: true,
});

describe('ErrorBoundary', () => {
    beforeEach(() => {
        mockReload.mockClear();
        mockLogger.error.mockClear();
    });

    it('should render children when no error occurs', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={false} />
            </ErrorBoundary>
        );

        expect(screen.getByTestId('success-content')).toBeInTheDocument();
        expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument();
    });

    it('should render error UI when error occurs', () => {
        // Suppress console.error for this test since we expect an error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        const testErrorMessage = 'Test error message';

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} errorMessage={testErrorMessage} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
        expect(screen.getByText(`Error: ${testErrorMessage}`)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reload Page' })).toBeInTheDocument();
        expect(screen.queryByTestId('success-content')).not.toBeInTheDocument();

        consoleSpy.mockRestore();
    });

    it('should call reload when reload button is clicked', async () => {
        const user = userEvent.setup();
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        const reloadButton = screen.getByRole('button', { name: 'Reload Page' });
        await user.click(reloadButton);

        expect(mockReload).toHaveBeenCalledTimes(1);

        consoleSpy.mockRestore();
    });

    it('should log error to global logger when available', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(mockLogger.error).toHaveBeenCalledWith(
            'ErrorBoundary caught an error',
            expect.any(Error),
            expect.any(Object)
        );

        consoleSpy.mockRestore();
    });

    it('should display error message in error UI', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        const testErrorMessage = 'Test error message';

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} errorMessage={testErrorMessage} />
            </ErrorBoundary>
        );

        expect(screen.getByText(`Error: ${testErrorMessage}`)).toBeInTheDocument();

        consoleSpy.mockRestore();
    });

    it('should handle random error messages correctly', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        // Generate random error message with faker
        const randomErrorMessage = faker.lorem.words(faker.number.int({ min: 3, max: 8 }));

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} errorMessage={randomErrorMessage} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
        expect(screen.getByText(`Error: ${randomErrorMessage}`)).toBeInTheDocument();

        consoleSpy.mockRestore();
    });

    it('should have proper alert severity', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        const { container } = render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        const alert = container.querySelector('.MuiAlert-root');
        expect(alert).toBeInTheDocument();

        consoleSpy.mockRestore();
    });
});
