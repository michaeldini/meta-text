
import { useMemo } from 'react';

/**
 * Result interface for ID validation
 */
export interface ValidatedIdResult {
    /** The validated and parsed ID, or null if invalid/not provided */
    id: number | null;
    /** Whether the provided parameter is valid (true for undefined parameters) */
    isValid: boolean;
    /** The original parameter value for error reporting */
    originalValue?: string;
}

export function validateIdParameter(idParam?: string): ValidatedIdResult {
    // No parameter provided is considered valid (could be optional)
    if (!idParam) {
        return { id: null, isValid: true };
    }

    // Parse the parameter as an integer
    const parsed = parseInt(idParam, 10);

    // Validate that:
    // 1. The parsed value is not NaN
    // 2. The parsed value is positive (> 0)
    // 3. The parsed value converts back to the original string (strict validation)
    const isValid = !isNaN(parsed) && parsed > 0 && parsed.toString() === idParam;

    return {
        id: isValid ? parsed : null,
        isValid,
        originalValue: idParam
    };
}

export function useValidatedId(idParam?: string): ValidatedIdResult {
    return validateIdParameter(idParam);
}

export function useValidatedIdParam(idParam?: string): ValidatedIdResult {
    return useMemo(() => validateIdParameter(idParam), [idParam]);
}
