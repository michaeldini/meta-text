import { renderHook, act } from '@testing-library/react';
import { useCreateForm } from './useCreateForm';
import { createFormService } from '../services/createFormService';

// Mock the service
jest.mock('../services/createFormService', () => ({
    createFormService: {
        submitUpload: jest.fn(),
        submitMetaText: jest.fn(),
    },
}));

// Mock logger
jest.mock('../../../utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

const mockService = createFormService as jest.Mocked<typeof createFormService>;

describe('useCreateForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('initializes with correct default state', () => {
        const { result } = renderHook(() => useCreateForm());

        expect(result.current.mode).toBe('upload');
        expect(result.current.data.title).toBe('');
        expect(result.current.data.file).toBe(null);
        expect(result.current.data.sourceDocId).toBe('');
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.success).toBe(null);
    });

    it('updates title and clears messages', () => {
        const { result } = renderHook(() => useCreateForm());

        // Set an error first
        act(() => {
            result.current.submit(); // This will trigger validation error
        });

        expect(result.current.error).toBeTruthy();

        // Update title should clear error
        act(() => {
            result.current.setTitle('New Title');
        });

        expect(result.current.data.title).toBe('New Title');
        expect(result.current.error).toBe(null);
    });

    it('validates form before submission', async () => {
        const { result } = renderHook(() => useCreateForm());

        await act(async () => {
            await result.current.submit();
        });

        expect(result.current.error).toBe('Title is required.');
        expect(mockService.submitUpload).not.toHaveBeenCalled();
    });

    it('submits upload form successfully', async () => {
        const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
        const onSuccess = jest.fn();

        mockService.submitUpload.mockResolvedValueOnce();

        const { result } = renderHook(() => useCreateForm({ onSuccess }));

        act(() => {
            result.current.setTitle('Test Title');
            result.current.setFile(mockFile);
        });

        await act(async () => {
            await result.current.submit();
        });

        expect(mockService.submitUpload).toHaveBeenCalledWith('Test Title', mockFile);
        expect(result.current.success).toBe('Upload successful!');
        expect(result.current.error).toBe(null);
        expect(onSuccess).toHaveBeenCalled();
    });

    it('submits metaText form successfully', async () => {
        const onSuccess = jest.fn();
        const sourceDocs = [{ id: 1, title: 'Doc 1' }];

        mockService.submitMetaText.mockResolvedValueOnce();

        const { result } = renderHook(() => useCreateForm({
            initialMode: 'metaText',
            onSuccess,
            sourceDocs
        }));

        act(() => {
            result.current.setTitle('Test Meta Text');
            result.current.setSourceDocId('1');
        });

        await act(async () => {
            await result.current.submit();
        });

        expect(mockService.submitMetaText).toHaveBeenCalledWith(1, 'Test Meta Text');
        expect(result.current.success).toBe('Meta-text created!');
        expect(result.current.error).toBe(null);
        expect(onSuccess).toHaveBeenCalled();
    });

    it('handles submission errors', async () => {
        const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
        const errorMessage = 'Upload failed';

        mockService.submitUpload.mockRejectedValueOnce(new Error(errorMessage));

        const { result } = renderHook(() => useCreateForm());

        act(() => {
            result.current.setTitle('Test Title');
            result.current.setFile(mockFile);
        });

        await act(async () => {
            await result.current.submit();
        });

        expect(result.current.error).toBe(errorMessage);
        expect(result.current.success).toBe(null);
        expect(result.current.loading).toBe(false);
    });

    it('resets form correctly', () => {
        const { result } = renderHook(() => useCreateForm());

        act(() => {
            result.current.setTitle('Test');
            result.current.setFile(new File([''], 'test.txt'));
            result.current.setSourceDocId('1');
        });

        act(() => {
            result.current.reset();
        });

        expect(result.current.data.title).toBe('');
        expect(result.current.data.file).toBe(null);
        expect(result.current.data.sourceDocId).toBe('');
        expect(result.current.error).toBe(null);
        expect(result.current.success).toBe(null);
        expect(result.current.loading).toBe(false);
    });

    it('switches modes and resets data', () => {
        const { result } = renderHook(() => useCreateForm());

        act(() => {
            result.current.setTitle('Test');
            result.current.setFile(new File([''], 'test.txt'));
        });

        act(() => {
            result.current.setMode('metaText');
        });

        expect(result.current.mode).toBe('metaText');
        expect(result.current.data.title).toBe('');
        expect(result.current.data.file).toBe(null);
    });
});
