import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppSuspenseFallback } from './AppSuspenseFallback';

describe('AppSuspenseFallback', () => {
    it('should render loading spinner with correct aria-label', () => {
        render(<AppSuspenseFallback />);

        const spinner = screen.getByRole('progressbar');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveAttribute('aria-label', 'Loading application');
    });

    it('should have correct layout styles', () => {
        const { container } = render(<AppSuspenseFallback />);

        const box = container.firstChild as HTMLElement;
        expect(box).toHaveStyle({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        });
    });
});
