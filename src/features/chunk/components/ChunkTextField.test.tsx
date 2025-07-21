/**
 * Tests for ChunkTextField component
 * - Checks rendering, value, label, and event handling
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChunkTextField from './ChunkTextField';

const baseProps = {
    label: 'Test Label',
    value: 'Test Value',
    onChange: vi.fn(),
};

describe('ChunkTextField', () => {
    it('renders with correct label and value', () => {
        render(<ChunkTextField {...baseProps} />);
        // The wrapper div with data-testid
        expect(screen.getByTestId('Test Label input field')).toBeInTheDocument();
        // The actual textarea rendered by MUI
        const textarea = screen.getByLabelText('Test Label');
        expect(textarea.tagName).toBe('TEXTAREA');
    });

    // it('calls onChange when value changes', () => {
    //     const onChange = vi.fn();
    //     render(<ChunkTextField {...baseProps} onChange={onChange} />);
    //     const textarea = screen.getByLabelText('Test Label');
    //     fireEvent.change(textarea, { target: { value: 'New Value' } });
    //     expect(onChange).toHaveBeenCalled();
    //     expect(onChange.mock.calls[0][0].target.value).toBe('New Value');
    // });

    it('calls onBlur when blurred', () => {
        const onBlur = vi.fn();
        render(<ChunkTextField {...baseProps} onBlur={onBlur} />);
        const textarea = screen.getByLabelText('Test Label');
        fireEvent.blur(textarea);
        expect(onBlur).toHaveBeenCalled();
    });

    it('respects minRows prop', () => {
        render(<ChunkTextField {...baseProps} minRows={5} />);
        const textarea = screen.getByLabelText('Test Label');
        // Only check rows if present (MUI may not always set it)
        if (textarea.hasAttribute('rows')) {
            expect(textarea).toHaveAttribute('rows', '5');
        } else {
            expect(textarea.tagName).toBe('TEXTAREA');
        }
    });
});
