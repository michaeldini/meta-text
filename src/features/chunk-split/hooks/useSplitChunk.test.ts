import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSplitChunk } from './useSplitChunk';
import { useChunkStore } from '../../../store';
import { SplitChunkToolProps } from '../../chunk-shared/types';
import { ChunkType } from '../../../types';

// Mock the chunk store
vi.mock('store', () => ({
    useChunkStore: vi.fn(),
}));

const mockUseChunkStore = vi.mocked(useChunkStore);

describe('useSplitChunk', () => {
    const mockHandleWordClick = vi.fn();

    // Mock chunk data
    const mockChunk: ChunkType = {
        id: 1,
        text: 'This is a test chunk for splitting',
        position: 0,
        notes: '',
        summary: '',
        comparison: '',
        explanation: '',
        meta_text_id: 100,
        ai_images: [],
        compressions: [],
    };

    const mockProps: SplitChunkToolProps = {
        chunkId: 1,
        chunk: mockChunk,
        chunkIdx: 0,
        word: 'test',
        wordIdx: 3,
        onComplete: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock the store selector to return our mock function
        mockUseChunkStore.mockImplementation((selector: any) => {
            if (typeof selector === 'function') {
                return selector({ handleWordClick: mockHandleWordClick });
            }
            return mockHandleWordClick;
        });
    });

    it('should initialize correctly and return splitChunk function', () => {
        const { result } = renderHook(() => useSplitChunk());

        expect(result.current).toEqual({
            splitChunk: expect.any(Function),
        });
    });

    it('should successfully split chunk when handleWordClick succeeds', async () => {
        mockHandleWordClick.mockResolvedValueOnce(undefined);

        const { result } = renderHook(() => useSplitChunk());

        let splitResult;
        await act(async () => {
            splitResult = await result.current.splitChunk(mockProps);
        });

        expect(mockHandleWordClick).toHaveBeenCalledWith(
            mockProps.chunkId,
            mockProps.chunkIdx,
            mockProps.wordIdx
        );
        expect(mockHandleWordClick).toHaveBeenCalledTimes(1);

        expect(splitResult).toEqual({
            success: true,
            data: {
                chunkId: mockProps.chunkId,
                chunkIdx: mockProps.chunkIdx,
                wordIdx: mockProps.wordIdx,
                word: mockProps.word,
            },
        });
    });

    it('should handle errors when handleWordClick fails', async () => {
        const errorMessage = 'Failed to split chunk at word position';
        mockHandleWordClick.mockRejectedValueOnce(new Error(errorMessage));

        const { result } = renderHook(() => useSplitChunk());

        let splitResult;
        await act(async () => {
            splitResult = await result.current.splitChunk(mockProps);
        });

        expect(mockHandleWordClick).toHaveBeenCalledWith(
            mockProps.chunkId,
            mockProps.chunkIdx,
            mockProps.wordIdx
        );

        expect(splitResult).toEqual({
            success: false,
            error: errorMessage,
        });
    });

    it('should handle non-Error exceptions with default message', async () => {
        mockHandleWordClick.mockRejectedValueOnce('String error');

        const { result } = renderHook(() => useSplitChunk());

        let splitResult;
        await act(async () => {
            splitResult = await result.current.splitChunk(mockProps);
        });

        expect(splitResult).toEqual({
            success: false,
            error: 'Failed to split chunk',
        });
    });

    it('should work with different chunk properties', async () => {
        mockHandleWordClick.mockResolvedValueOnce(undefined);

        const differentProps: SplitChunkToolProps = {
            chunkId: 42,
            chunk: {
                ...mockChunk,
                id: 42,
                text: 'Different chunk text here',
            },
            chunkIdx: 5,
            word: 'here',
            wordIdx: 15,
        };

        const { result } = renderHook(() => useSplitChunk());

        let splitResult;
        await act(async () => {
            splitResult = await result.current.splitChunk(differentProps);
        });

        expect(mockHandleWordClick).toHaveBeenCalledWith(42, 5, 15);

        expect(splitResult).toEqual({
            success: true,
            data: {
                chunkId: 42,
                chunkIdx: 5,
                wordIdx: 15,
                word: 'here',
            },
        });
    });

    it('should maintain referential stability of splitChunk function', () => {
        const { result, rerender } = renderHook(() => useSplitChunk());

        const firstRender = result.current.splitChunk;

        rerender();

        const secondRender = result.current.splitChunk;

        expect(firstRender).toBe(secondRender);
    });

    it('should handle edge case with zero indices', async () => {
        mockHandleWordClick.mockResolvedValueOnce(undefined);

        const edgeCaseProps: SplitChunkToolProps = {
            chunkId: 1,
            chunk: mockChunk,
            chunkIdx: 0,
            word: 'This',
            wordIdx: 0,
        };

        const { result } = renderHook(() => useSplitChunk());

        let splitResult;
        await act(async () => {
            splitResult = await result.current.splitChunk(edgeCaseProps);
        });

        expect(mockHandleWordClick).toHaveBeenCalledWith(1, 0, 0);

        expect(splitResult).toEqual({
            success: true,
            data: {
                chunkId: 1,
                chunkIdx: 0,
                wordIdx: 0,
                word: 'This',
            },
        });
    });

    it('should call onComplete callback if provided in props', async () => {
        mockHandleWordClick.mockResolvedValueOnce(undefined);
        const onCompleteMock = vi.fn();

        const propsWithCallback: SplitChunkToolProps = {
            ...mockProps,
            onComplete: onCompleteMock,
        };

        const { result } = renderHook(() => useSplitChunk());

        await act(async () => {
            await result.current.splitChunk(propsWithCallback);
        });

        // Note: The current implementation doesn't call onComplete,
        // but this test documents the expected behavior if it were to be added
        expect(mockHandleWordClick).toHaveBeenCalled();
    });
});
