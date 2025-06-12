import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ChunkTextField from '../../src/components/ChunkTextField.jsx';

describe('ChunkTextField', () => {
    it('renders with label and value', () => {
        render(<ChunkTextField label="Chunk" value="abc" onChange={() => { }} />);
        expect(screen.getByLabelText('Chunk')).toBeInTheDocument();
        expect(screen.getByDisplayValue('abc')).toBeInTheDocument();
    });

    it('calls onChange when typing', () => {
        const handleChange = vi.fn();
        render(<ChunkTextField label="Chunk" value="" onChange={handleChange} />);
        fireEvent.change(screen.getByLabelText('Chunk'), { target: { value: 'xyz' } });
        expect(handleChange).toHaveBeenCalled();
    });
});
