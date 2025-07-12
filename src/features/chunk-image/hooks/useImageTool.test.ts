/**
 * Test Suite for useImageTool Hook
 * 
 * This test suite provides comprehensive coverage for the useImageTool custom React hook,
 * including state management, API integration, error handling, and user interactions.
 * 
 * Test Categories:
 * - Initial state and setup
 * - Chunk data synchronization
 * - Image generation workflow
 * - Error handling scenarios
 * - Helper functions
 * - Dialog state management
 * - Performance optimizations
 * 
 * @author Meta Text Team
 * @since 2025-07-08
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useImageTool } from './useImageTool';
import { generateAiImage } from '../../../services';
import { log } from '../../../utils';
import { pollImageAvailability } from '../utils/imagePolling';
import type { ChunkType, AiImage } from '../../../types';

// Mock external dependencies
vi.mock('../../../services', () => ({
    generateAiImage: vi.fn(),
}));

vi.mock('../../../utils', () => ({
    log: {
        error: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
    },
}));

vi.mock('./utils/imagePolling', () => ({
    pollImageAvailability: vi.fn(),
}));

// Type the mocked functions
const mockGenerateAiImage = vi.mocked(generateAiImage);
const mockLog = vi.mocked(log);
const mockPollImageAvailability = vi.mocked(pollImageAvailability);

describe('useImageTool', () => {
    // Test data setup
    const mockChunk: ChunkType = {
        id: 1,
        text: 'This is a test chunk for image generation',
        position: 0,
        notes: '',
        summary: '',
        comparison: '',
        explanation: '',
        meta_text_id: 100,
        ai_images: [],
        compressions: [],
    };

    const mockAiImage: AiImage = {
        id: 1,
        path: 'generated-images/test-image.jpg',
        prompt: 'A beautiful landscape',
        chunk_id: 1,
    };

    const mockApiResponse = {
        id: 1,
        path: 'generated-images/new-image.jpg',
        prompt: 'A serene mountain view',
        chunk_id: 1,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Default successful polling behavior
        mockPollImageAvailability.mockResolvedValue();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Initial State', () => {
        it('should initialize with correct default state', () => {
            const { result } = renderHook(() => useImageTool());

            expect(result.current.state.loading).toBe(false);
            expect(result.current.state.error).toBe(null);
            expect(result.current.state.data).toBe(null);
            expect(result.current.state.prompt).toBe('');
            expect(result.current.state.dialogOpen).toBe(false);
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe(null);
        });

        it('should provide all required functions in return object', () => {
            const { result } = renderHook(() => useImageTool());

            expect(typeof result.current.generateImage).toBe('function');
            expect(typeof result.current.getImgSrc).toBe('function');
            expect(typeof result.current.openDialog).toBe('function');
            expect(typeof result.current.closeDialog).toBe('function');
            expect(typeof result.current.handlePromptChange).toBe('function');
            expect(result.current.state).toBeTypeOf('object');
        });

        it('should initialize with empty chunk data', () => {
            const { result } = renderHook(() => useImageTool());

            expect(result.current.getImgSrc()).toBe('');
            expect(result.current.state.data).toBe(null);
            expect(result.current.state.prompt).toBe('');
        });
    });

    describe('Chunk Data Synchronization', () => {
        it('should sync with chunk data when chunk has AI images', () => {
            const chunkWithImage: ChunkType = {
                ...mockChunk,
                ai_images: [mockAiImage],
            };

            const { result } = renderHook(() => useImageTool(chunkWithImage));

            expect(result.current.state.data).toBe(mockAiImage.path);
            expect(result.current.state.prompt).toBe(mockAiImage.prompt);
            expect(result.current.getImgSrc()).toBe(`/${mockAiImage.path}`);
        });

        it('should use the latest AI image when multiple images exist', () => {
            const olderImage: AiImage = {
                ...mockAiImage,
                id: 1,
                path: 'old-image.jpg',
                prompt: 'Old prompt',
            };

            const newerImage: AiImage = {
                ...mockAiImage,
                id: 2,
                path: 'new-image.jpg',
                prompt: 'New prompt',
            };

            const chunkWithMultipleImages: ChunkType = {
                ...mockChunk,
                ai_images: [olderImage, newerImage],
            };

            const { result } = renderHook(() => useImageTool(chunkWithMultipleImages));

            expect(result.current.state.data).toBe(newerImage.path);
            expect(result.current.state.prompt).toBe(newerImage.prompt);
        });

        it('should clear state when chunk has no valid AI images', () => {
            const chunkWithoutImages: ChunkType = {
                ...mockChunk,
                ai_images: [],
                compressions: [],
            };

            const { result } = renderHook(() => useImageTool(chunkWithoutImages));

            expect(result.current.state.data).toBe(null);
            expect(result.current.state.prompt).toBe('');
            expect(result.current.getImgSrc()).toBe('');
        });

        it('should handle invalid image data gracefully', () => {
            const invalidImage: AiImage = {
                ...mockAiImage,
                path: null as any, // Invalid path
            };

            const chunkWithInvalidImage: ChunkType = {
                ...mockChunk,
                ai_images: [invalidImage],
            };

            const { result } = renderHook(() => useImageTool(chunkWithInvalidImage));

            expect(result.current.state.data).toBe(null);
            expect(result.current.state.prompt).toBe('');
        });

        it('should re-sync when chunk AI images are updated', () => {
            const initialChunk: ChunkType = {
                ...mockChunk,
                ai_images: [],
                compressions: [],
            };

            const { result, rerender } = renderHook(
                ({ chunk }) => useImageTool(chunk),
                { initialProps: { chunk: initialChunk } }
            );

            // Initially no images
            expect(result.current.state.data).toBe(null);

            // Update with new image
            const updatedChunk: ChunkType = {
                ...mockChunk,
                ai_images: [mockAiImage],
            };

            rerender({ chunk: updatedChunk });

            expect(result.current.state.data).toBe(mockAiImage.path);
            expect(result.current.state.prompt).toBe(mockAiImage.prompt);
        });
    });

    describe('Image Generation', () => {
        it('should generate image successfully', async () => {
            mockGenerateAiImage.mockResolvedValue(mockApiResponse);

            const { result } = renderHook(() => useImageTool(mockChunk));

            let generateResult: any;

            await act(async () => {
                generateResult = await result.current.generateImage({
                    chunk: mockChunk,
                    prompt: 'Test prompt',
                });
            });

            expect(mockGenerateAiImage).toHaveBeenCalledWith('Test prompt', mockChunk.id);
            expect(mockPollImageAvailability).toHaveBeenCalledWith(
                `/${mockApiResponse.path}`,
                10000,
                300
            );
            expect(generateResult.success).toBe(true);
            expect(generateResult.data).toEqual({
                imagePath: mockApiResponse.path,
                prompt: mockApiResponse.prompt,
            });

            // Check state updates
            expect(result.current.state.loading).toBe(false);
            expect(result.current.state.error).toBe(null);
            expect(result.current.state.data).toBe(mockApiResponse.path);
            expect(result.current.state.prompt).toBe(mockApiResponse.prompt);
            expect(result.current.state.dialogOpen).toBe(false);
        });

        it('should handle loading state during generation', async () => {
            // Create a promise that won't resolve immediately
            let resolveGenerate: (value: typeof mockApiResponse) => void;
            const pendingGenerate = new Promise<typeof mockApiResponse>((resolve) => {
                resolveGenerate = resolve;
            });

            mockGenerateAiImage.mockReturnValue(pendingGenerate);

            const { result } = renderHook(() => useImageTool(mockChunk));

            // Start generation (don't await)
            act(() => {
                result.current.generateImage({
                    chunk: mockChunk,
                    prompt: 'Test prompt',
                });
            });

            // Should be loading
            expect(result.current.state.loading).toBe(true);
            expect(result.current.loading).toBe(true);
            expect(result.current.state.error).toBe(null);

            // Resolve the promise
            await act(async () => {
                resolveGenerate!(mockApiResponse);
            });

            // Should no longer be loading
            expect(result.current.state.loading).toBe(false);
            expect(result.current.loading).toBe(false);
        });

        it('should validate chunk ID before generation', async () => {
            const invalidChunk: ChunkType = {
                ...mockChunk,
                id: null as any,
            };

            const { result } = renderHook(() => useImageTool(invalidChunk));

            let generateResult: any;

            await act(async () => {
                generateResult = await result.current.generateImage({
                    chunk: invalidChunk,
                    prompt: 'Test prompt',
                });
            });

            expect(mockGenerateAiImage).not.toHaveBeenCalled();
            expect(generateResult.success).toBe(false);
            expect(generateResult.error).toBe('Invalid chunk ID');
            expect(result.current.state.loading).toBe(false);
        });

        it('should handle API errors gracefully', async () => {
            const apiError = new Error('API service unavailable');
            mockGenerateAiImage.mockRejectedValue(apiError);

            const { result } = renderHook(() => useImageTool(mockChunk));

            let generateResult: any;

            await act(async () => {
                generateResult = await result.current.generateImage({
                    chunk: mockChunk,
                    prompt: 'Test prompt',
                });
            });

            expect(mockLog.error).toHaveBeenCalledWith('API service unavailable');
            expect(generateResult.success).toBe(false);
            expect(generateResult.error).toBe('API service unavailable');
            expect(result.current.state.loading).toBe(false);
            expect(result.current.state.error).toBe('API service unavailable');
        });

        it('should handle polling errors', async () => {
            mockGenerateAiImage.mockResolvedValue(mockApiResponse);
            mockPollImageAvailability.mockRejectedValue(new Error('Image not available'));

            const { result } = renderHook(() => useImageTool(mockChunk));

            let generateResult: any;

            await act(async () => {
                generateResult = await result.current.generateImage({
                    chunk: mockChunk,
                    prompt: 'Test prompt',
                });
            });

            expect(generateResult.success).toBe(false);
            expect(generateResult.error).toBe('Image not available');
            expect(result.current.state.loading).toBe(false);
            expect(result.current.state.error).toBe('Image not available');
        });

        it('should handle errors without message property', async () => {
            mockGenerateAiImage.mockRejectedValue('String error');

            const { result } = renderHook(() => useImageTool(mockChunk));

            let generateResult: any;

            await act(async () => {
                generateResult = await result.current.generateImage({
                    chunk: mockChunk,
                    prompt: 'Test prompt',
                });
            });

            expect(generateResult.success).toBe(false);
            expect(generateResult.error).toBe('Failed to generate image');
            expect(result.current.state.error).toBe('Failed to generate image');
        });

        it('should use empty string as default prompt', async () => {
            mockGenerateAiImage.mockResolvedValue(mockApiResponse);

            const { result } = renderHook(() => useImageTool(mockChunk));

            await act(async () => {
                await result.current.generateImage({
                    chunk: mockChunk,
                    // No prompt provided
                });
            });

            expect(mockGenerateAiImage).toHaveBeenCalledWith('', mockChunk.id);
        });
    });

    describe('Helper Functions', () => {
        describe('getImgSrc', () => {
            it('should return correct image source URL', () => {
                const chunkWithImage: ChunkType = {
                    ...mockChunk,
                    ai_images: [mockAiImage],
                };

                const { result } = renderHook(() => useImageTool(chunkWithImage));

                expect(result.current.getImgSrc()).toBe(`/${mockAiImage.path}`);
            });

            it('should return empty string when no image data', () => {
                const { result } = renderHook(() => useImageTool(mockChunk));

                expect(result.current.getImgSrc()).toBe('');
            });

            it('should be memoized and not change on re-renders', () => {
                const chunkWithImage: ChunkType = {
                    ...mockChunk,
                    ai_images: [mockAiImage],
                };

                const { result, rerender } = renderHook(() => useImageTool(chunkWithImage));

                const firstGetImgSrc = result.current.getImgSrc;
                rerender();
                const secondGetImgSrc = result.current.getImgSrc;

                expect(firstGetImgSrc).toBe(secondGetImgSrc);
            });
        });

        describe('openDialog', () => {
            it('should open dialog and reset state', () => {
                const { result } = renderHook(() => useImageTool(mockChunk));

                // Set some initial state
                act(() => {
                    result.current.state.error = 'Some error';
                    result.current.state.prompt = 'Some prompt';
                });

                act(() => {
                    result.current.openDialog();
                });

                expect(result.current.state.dialogOpen).toBe(true);
                expect(result.current.state.error).toBe(null);
                expect(result.current.state.prompt).toBe('');
            });

            it('should be memoized', () => {
                const { result, rerender } = renderHook(() => useImageTool(mockChunk));

                const firstOpenDialog = result.current.openDialog;
                rerender();
                const secondOpenDialog = result.current.openDialog;

                expect(firstOpenDialog).toBe(secondOpenDialog);
            });
        });

        describe('closeDialog', () => {
            it('should close dialog and reset state', () => {
                const { result } = renderHook(() => useImageTool(mockChunk));

                // First open dialog and set state
                act(() => {
                    result.current.openDialog();
                    result.current.state.error = 'Some error';
                    result.current.state.prompt = 'Some prompt';
                });

                act(() => {
                    result.current.closeDialog();
                });

                expect(result.current.state.dialogOpen).toBe(false);
                expect(result.current.state.error).toBe(null);
                expect(result.current.state.prompt).toBe('');
            });

            it('should be memoized', () => {
                const { result, rerender } = renderHook(() => useImageTool(mockChunk));

                const firstCloseDialog = result.current.closeDialog;
                rerender();
                const secondCloseDialog = result.current.closeDialog;

                expect(firstCloseDialog).toBe(secondCloseDialog);
            });
        });

        describe('handlePromptChange', () => {
            it('should update prompt state', () => {
                const { result } = renderHook(() => useImageTool(mockChunk));

                const mockEvent = {
                    target: { value: 'New prompt text' },
                } as React.ChangeEvent<HTMLInputElement>;

                act(() => {
                    result.current.handlePromptChange(mockEvent);
                });

                expect(result.current.state.prompt).toBe('New prompt text');
            });

            it('should handle empty prompt', () => {
                const { result } = renderHook(() => useImageTool(mockChunk));

                const mockEvent = {
                    target: { value: '' },
                } as React.ChangeEvent<HTMLInputElement>;

                act(() => {
                    result.current.handlePromptChange(mockEvent);
                });

                expect(result.current.state.prompt).toBe('');
            });

            it('should be memoized', () => {
                const { result, rerender } = renderHook(() => useImageTool(mockChunk));

                const firstHandlePromptChange = result.current.handlePromptChange;
                rerender();
                const secondHandlePromptChange = result.current.handlePromptChange;

                expect(firstHandlePromptChange).toBe(secondHandlePromptChange);
            });
        });
    });

    describe('State Management', () => {
        it('should maintain state consistency during multiple operations', async () => {
            mockGenerateAiImage.mockResolvedValue(mockApiResponse);

            const { result } = renderHook(() => useImageTool(mockChunk));

            // Open dialog
            act(() => {
                result.current.openDialog();
            });

            expect(result.current.state.dialogOpen).toBe(true);

            // Generate image
            await act(async () => {
                await result.current.generateImage({
                    chunk: mockChunk,
                    prompt: 'Test prompt',
                });
            });

            // Dialog should be closed, but other state should be preserved
            expect(result.current.state.dialogOpen).toBe(false);
            expect(result.current.state.data).toBe(mockApiResponse.path);
            expect(result.current.state.loading).toBe(false);
            expect(result.current.state.error).toBe(null);
        });

        it('should handle rapid state changes', () => {
            const { result } = renderHook(() => useImageTool(mockChunk));

            act(() => {
                result.current.openDialog();
                result.current.closeDialog();
                result.current.openDialog();
            });

            expect(result.current.state.dialogOpen).toBe(true);
            expect(result.current.state.error).toBe(null);
            expect(result.current.state.prompt).toBe('');
        });

        it('should preserve loading state isolation', async () => {
            // Create a promise that won't resolve immediately
            let resolveGenerate: (value: typeof mockApiResponse) => void;
            const pendingGenerate = new Promise<typeof mockApiResponse>((resolve) => {
                resolveGenerate = resolve;
            });

            mockGenerateAiImage.mockReturnValue(pendingGenerate);

            const { result } = renderHook(() => useImageTool(mockChunk));

            // Start generation
            act(() => {
                result.current.generateImage({
                    chunk: mockChunk,
                    prompt: 'Test prompt',
                });
            });

            // Should be loading
            expect(result.current.state.loading).toBe(true);

            // Other operations should still work
            act(() => {
                result.current.openDialog();
            });

            expect(result.current.state.dialogOpen).toBe(true);
            expect(result.current.state.loading).toBe(true); // Still loading

            // Resolve generation
            await act(async () => {
                resolveGenerate!(mockApiResponse);
            });

            expect(result.current.state.loading).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        it('should handle undefined chunk gracefully', () => {
            const { result } = renderHook(() => useImageTool(undefined));

            expect(result.current.state.data).toBe(null);
            expect(result.current.state.prompt).toBe('');
            expect(result.current.getImgSrc()).toBe('');
        });

        it('should handle chunk with undefined ai_images', () => {
            const chunkWithUndefinedImages: ChunkType = {
                ...mockChunk,
                ai_images: undefined as any,
            };

            const { result } = renderHook(() => useImageTool(chunkWithUndefinedImages));

            expect(result.current.state.data).toBe(null);
            expect(result.current.state.prompt).toBe('');
        });

        it('should handle concurrent image generation attempts', async () => {
            mockGenerateAiImage.mockResolvedValue(mockApiResponse);

            const { result } = renderHook(() => useImageTool(mockChunk));

            // Start multiple generations concurrently
            const promise1 = act(async () => {
                return result.current.generateImage({
                    chunk: mockChunk,
                    prompt: 'First prompt',
                });
            });

            const promise2 = act(async () => {
                return result.current.generateImage({
                    chunk: mockChunk,
                    prompt: 'Second prompt',
                });
            });

            const [result1, result2] = await Promise.all([promise1, promise2]);

            // Both should succeed (though the second might override the first)
            expect(result1.success).toBe(true);
            expect(result2.success).toBe(true);
            expect(result.current.state.loading).toBe(false);
        });
    });
});
