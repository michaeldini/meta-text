import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HomePage from './HomePage';
import { vi } from 'vitest';
import * as useApiModule from '../../services/useApi';
import { BrowserRouter } from 'react-router-dom';

const mockSourceDocs = [
    { id: 1, title: 'Doc 1' },
    { id: 2, title: 'Doc 2' }
];
const mockMetaTexts = [
    { id: 1, title: 'Meta 1' },
    { id: 2, title: 'Meta 2' }
];

function renderWithRouter(ui: React.ReactElement) {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('HomePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders source documents and meta texts', async () => {
        let call = 0;
        vi.spyOn(useApiModule, 'useApi').mockImplementation(() => {
            call++;
            if (call === 1) {
                return {
                    data: mockSourceDocs,
                    error: null,
                    loading: false,
                    request: vi.fn()
                };
            }
            return {
                data: mockMetaTexts,
                error: null,
                loading: false,
                request: vi.fn()
            };
        });

        renderWithRouter(<HomePage />);

        expect(screen.getByText('Doc 1')).toBeInTheDocument();
        expect(screen.getByText('Doc 2')).toBeInTheDocument();

        // Switch to meta texts
        fireEvent.click(screen.getByLabelText('Meta-Text'));
        await waitFor(() => {
            expect(screen.getByText('Meta 1')).toBeInTheDocument();
            expect(screen.getByText('Meta 2')).toBeInTheDocument();
        });
    });
});
