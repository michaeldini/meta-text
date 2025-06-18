import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateForm from './Form';

describe('CreateForm', () => {
  const baseProps = {
    sourceDocs: [
      { id: 1, title: 'Doc 1' },
      { id: 2, title: 'Doc 2' }
    ],
    sourceDocsLoading: false,
    sourceDocsError: null,
    onSuccess: jest.fn(),
  };

  it('renders upload mode by default', () => {
    render(<CreateForm {...baseProps} />);
    expect(screen.getByLabelText('form mode')).toBeInTheDocument();
    expect(screen.getByLabelText('upload')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('Enter the title of your document')).toBeInTheDocument();
  });

  it('switches to metaText mode when toggled', () => {
    render(<CreateForm {...baseProps} />);
    fireEvent.click(screen.getByLabelText('metaText'));
    expect(screen.getByLabelText('meta-text-title')).toBeInTheDocument();
    expect(screen.getByLabelText('Choose a title for your meta text')).toBeInTheDocument();
  });

  it('disables submit button if title is empty', () => {
    render(<CreateForm {...baseProps} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
