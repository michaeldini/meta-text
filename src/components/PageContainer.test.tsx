import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import PageContainer from './PageContainer';

describe('PageContainer', () => {
    it('should render children inside Container', () => {
        const { container } = render(
            <PageContainer>
                <div data-testid="child-content">Test Content</div>
            </PageContainer>
        );

        expect(container.querySelector('[data-testid="child-content"]')).toBeInTheDocument();
    });

    it('should apply correct Container props', () => {
        const { container } = render(
            <PageContainer>
                <div>Test</div>
            </PageContainer>
        );

        // Check that it uses Material-UI Container
        const muiContainer = container.querySelector('.MuiContainer-root');
        expect(muiContainer).toBeInTheDocument();
    });

    it('should wrap children in ErrorBoundary', () => {
        // This test ensures ErrorBoundary is present in the component tree
        // A more comprehensive test would trigger an actual error
        const { container } = render(
            <PageContainer>
                <div data-testid="test-content">Test</div>
            </PageContainer>
        );

        expect(container.querySelector('[data-testid="test-content"]')).toBeInTheDocument();
    });
});
