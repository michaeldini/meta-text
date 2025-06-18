import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateFormContainer from './Container';

// Basic test for rendering and showing description

describe('CreateFormContainer', () => {
    it('renders the description and children', () => {
        render(
            <CreateFormContainer description="Test description">
                <div>Child content</div>
            </CreateFormContainer>
        );
        expect(screen.getByText('Test description')).toBeInTheDocument();
        expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('shows error snackbar when error prop is set', () => {
        render(
            <CreateFormContainer description="desc" error="Error occurred">
                <div>Child</div>
            </CreateFormContainer>
        );
        expect(screen.getByText('Error occurred')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('MuiAlert-standardError');
    });

    it('shows success snackbar when success prop is set', () => {
        render(
            <CreateFormContainer description="desc" success="Success!">
                <div>Child</div>
            </CreateFormContainer>
        );
        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('MuiAlert-standardSuccess');
    });

    it('shows loading spinner when loading is true', () => {
        render(
            <CreateFormContainer description="desc" loading>
                <div>Child</div>
            </CreateFormContainer>
        );
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
});
