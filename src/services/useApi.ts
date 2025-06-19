import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import log from '../utils/logger';

interface ApiState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useApi<T = any>() {
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
      } catch (err: any) {
        const errorMsg = err.response?.data?.detail || err.message || 'Unknown error';
        setState({ data: null, error: errorMsg, loading: false });
        log.error('API Error:', errorMsg);
      }
    },
    []
  );

  return { ...state, request };
}
