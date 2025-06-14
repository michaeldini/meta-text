import { renderHook, act, waitFor } from '@testing-library/react';
import { useMetaTexts } from '../../src/hooks/useMetaTexts';
import * as metaTextService from '../../src/services/metaTextService';
import { describe, it, beforeEach, expect, vi } from 'vitest';

// Mock fetchMetaTexts
const mockMetaTexts = [
  { id: 1, title: 'MetaText 1' },
  { id: 2, title: 'MetaText 2' },
];

describe('useMetaTexts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and return metaTexts', async () => {
    vi.spyOn(metaTextService, 'fetchMetaTexts').mockResolvedValueOnce(mockMetaTexts);
    const { result } = renderHook(() => useMetaTexts());

    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.metaTexts).toEqual(mockMetaTexts);
    expect(result.current.error).toBe('');
  });

  it('should handle fetch error', async () => {
    vi.spyOn(metaTextService, 'fetchMetaTexts').mockRejectedValueOnce(new Error('Failed'));
    const { result } = renderHook(() => useMetaTexts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('Failed');
    expect(result.current.metaTexts).toEqual([]);
  });

  it('should refresh metaTexts when refresh is called', async () => {
    const spy = vi.spyOn(metaTextService, 'fetchMetaTexts');
    spy.mockResolvedValueOnce(mockMetaTexts);
    const { result } = renderHook(() => useMetaTexts());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.metaTexts).toEqual(mockMetaTexts);

    const newMetaTexts = [{ id: 3, title: 'MetaText 3' }];
    spy.mockResolvedValueOnce(newMetaTexts);
    act(() => {
      result.current.refresh();
    });
    await waitFor(() => {
      expect(result.current.metaTexts).toEqual(newMetaTexts);
    });
  });
});
