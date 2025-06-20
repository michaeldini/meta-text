import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingBoundary from './LoadingBoundary';

describe('LoadingBoundary', () => {
    it('should render children when not loading', () => {
        render(
            <LoadingBoundary loading={false}>
                <div data-testid="child-content">Test Content</div>
            </LoadingBoundary>
        );

        expect(screen.getByTestId('child-content')).toBeInTheDocument();
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('should render loading spinner when loading is true', () => {
        render(
            <LoadingBoundary loading={true}>
                <div data-testid="child-content">Test Content</div>
            </LoadingBoundary>
        );

        const spinner = screen.getByRole('progressbar');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveAttribute('aria-label', 'Loading content');
        expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
    });

    it('should have correct layout styles when loading', () => {
        const { container } = render(
            <LoadingBoundary loading={true}>
                <div>Test</div>
            </LoadingBoundary>
        );

        const box = container.firstChild as HTMLElement;
        expect(box).toHaveStyle({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        });
    });
});
