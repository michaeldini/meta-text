// import { useState, useCallback } from 'react';
// import { getErrorMessage } from '../types/error';
// import log from '../utils/logger';

// interface FetchConfig extends RequestInit {
//   url: string;
// }

// interface FetchResponse<T> {
//   data: T;
//   status: number;
//   statusText: string;
//   headers: Headers;
//   ok: boolean;
// }

// interface ApiState<T> {
//   data: T | null;
//   error: string | null;
//   loading: boolean;
// }

// export function useApi<T = unknown>() {
//   const [state, setState] = useState<ApiState<T>>({
//     data: null,
//     error: null,
//     loading: false,
//   });

//   const request = useCallback(
//     async (config: FetchConfig): Promise<FetchResponse<T> | void> => {
//       setState({ data: null, error: null, loading: true });
//       try {
//         const { url, ...fetchOptions } = config;
//         const response = await fetch(url, fetchOptions);

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         // Parse response data
//         let data: T;
//         const contentType = response.headers.get('content-type');

//         if (contentType && contentType.includes('application/json')) {
//           data = await response.json();
//         } else if (response.status === 204 || response.headers.get('content-length') === '0') {
//           data = {} as T;
//         } else {
//           data = await response.text() as T;
//         }

//         const fetchResponse: FetchResponse<T> = {
//           data,
//           status: response.status,
//           statusText: response.statusText,
//           headers: response.headers,
//           ok: response.ok,
//         };

//         setState({ data, error: null, loading: false });
//         return fetchResponse;
//       } catch (err: unknown) {
//         const errorMsg = getErrorMessage(err, 'API request failed');
//         setState({ data: null, error: errorMsg, loading: false });
//         log.error('API Error:', errorMsg);
//       }
//     },
//     []
//   );

//   return { ...state, request };
// }
