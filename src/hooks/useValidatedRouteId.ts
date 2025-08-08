// useValidatedRouteId
// Small React hook to read a route param, validate it as a positive integer ID,
// and redirect to a fallback path if invalid. Returns the numeric id or null
// (null while/after redirect so callers can render nothing).
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Validates a route param as a positive integer and redirects if invalid.
 * @param paramKey The key of the route param to read (e.g., 'metatextId').
 * @param redirectTo Path to navigate to when the param is invalid. Defaults to '/'.
 * @returns number | null - The parsed id when valid; otherwise null.
 */
export function useValidatedRouteId(paramKey: string, redirectTo: string = '/'): number | null {
    const params = useParams<Record<string, string | undefined>>();
    const navigate = useNavigate();

    const raw = params[paramKey];
    const parsed = raw ? Number(raw) : NaN;
    const isValid = Number.isInteger(parsed) && parsed > 0;

    React.useEffect(() => {
        if (!isValid) {
            navigate(redirectTo, { replace: true });
        }
    }, [isValid, navigate, redirectTo]);

    return isValid ? parsed : null;
}
