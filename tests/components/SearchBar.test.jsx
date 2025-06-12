import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../../src/components/SearchBar.jsx';

describe('SearchBar', () => {
    it('renders with label and value', () => {
        render(<SearchBar label="Search" value="foo" onChange={() => { }} />);
        expect(screen.getByLabelText('Search')).toBeInTheDocument();
        expect(screen.getByDisplayValue('foo')).toBeInTheDocument();
    });

    it('calls onChange when typing', () => {
        const handleChange = vi.fn();
        render(<SearchBar label="Search" value="" onChange={handleChange} />);
        fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'bar' } });
        expect(handleChange).toHaveBeenCalledWith('bar');
    });
});
