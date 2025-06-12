import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, } from 'vitest';
import FileUploadWidget from '../../src/components/FileUploadWidget.jsx';

describe('FileUploadWidget', () => {
    it('renders upload button', () => {
        render(<FileUploadWidget onFileUpload={() => { }} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    // it('calls onFileUpload when file is selected', () => {
    //     const handleFileUpload = vi.fn();
    //     render(<FileUploadWidget onFileUpload={handleFileUpload} />);
    //     const input = screen.getByTestId('file-upload-input');
    //     const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' });
    //     fireEvent.change(input, { target: { files: [file] } });
    //     expect(handleFileUpload).toHaveBeenCalled();
    // });
});
