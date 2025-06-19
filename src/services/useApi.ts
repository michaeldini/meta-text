import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getErrorMessage } from '../types/error';
import log from '../utils/logger';

interface ApiState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useApi<T = unknown>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const request = useCallback(
    async (config: AxiosRequestConfig): Promise<AxiosResponse<T> | void> => {
      setState({ data: null, error: null, loading: true });
      try {
        const response = await axios(config);
        setState({ data: response.data, error: null, loading: false });
        return response;
      } catch (err: unknown) {
        const errorMsg = getErrorMessage(err, 'API request failed');
        setState({ data: null, error: errorMsg, loading: false });
        log.error('API Error:', errorMsg);
      }
    },
    []
  );

  return { ...state, request };
}
