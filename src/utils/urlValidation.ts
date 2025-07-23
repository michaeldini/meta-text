
import { useMemo } from 'react';

/**
 * Result interface for ID validation
 */
export interface ValidatedIdResult {
    /** The validated and parsed ID, or undefined if invalid/not provided */
    id: number | undefined;
    /** Whether the provided parameter is valid (true for undefined parameters) */
    isValid: boolean;
    /** The original parameter value for error reporting */
    originalValue?: string;
}

/**
 * Validates and parses a URL parameter as a positive integer ID
 * 
 * @param idParam - The URL parameter string to validate
 * @returns ValidatedIdResult object containing the parsed ID, validation status, and original value
 * 
 * @example
 * ```typescript
 * // Valid cases
 * validateIdParameter("123") // { id: 123, isValid: true, originalValue: "123" }
 * validateIdParameter(undefined) // { id: undefined, isValid: true }
 * 
 * // Invalid cases
 * validateIdParameter("abc") // { id: undefined, isValid: false, originalValue: "abc" }
 * validateIdParameter("0") // { id: undefined, isValid: false, originalValue: "0" }
 * validateIdParameter("-5") // { id: undefined, isValid: false, originalValue: "-5" }
 * ```
 */
export function validateIdParameter(idParam?: string): ValidatedIdResult {
    // No parameter provided is considered valid (could be optional)
    if (!idParam) {
        return { id: undefined, isValid: true };
    }

    // Parse the parameter as an integer
    const parsed = parseInt(idParam, 10);

    // Validate that:
    // 1. The parsed value is not NaN
    // 2. The parsed value is positive (> 0)
    // 3. The parsed value converts back to the original string (strict validation)
    const isValid = !isNaN(parsed) && parsed > 0 && parsed.toString() === idParam;

    return {
        id: isValid ? parsed : undefined,
        isValid,
        originalValue: idParam
    };
}

/**
 * Hook-friendly wrapper for validateIdParameter that includes memoization logic
 * This is useful when you want to use the validation inside a React component
 * with useMemo but want to keep the memoization logic separate from the validation
 * 
 * @param idParam - The URL parameter string to validate
 * @returns ValidatedIdResult object
 */
export function useValidatedId(idParam?: string): ValidatedIdResult {
    return validateIdParameter(idParam);
}

/**
 * Custom hook for validating ID parameters with automatic memoization
 * Provides a cleaner API for React components
 * It is very important to use `useValidatedIdParam` for validation in your codebase. The `useParams` hook from React Router only extracts parameters from the URL as strings—it does not perform any validation, type checking, or parsing. This means `useParams` will return whatever is present in the URL, including invalid, missing, or malformed values.

The custom hook `useValidatedIdParam` (from your `urlValidation.ts`) adds robust validation logic:
- It checks if the parameter is a positive integer.
- It returns a structured result indicating validity, the parsed ID, and the original value.
- It uses memoization for performance in React components.

Without this validation, your app could receive invalid IDs (e.g., "abc", "0", "-5") and potentially cause errors or unexpected behavior when fetching or updating documents.

In summary:  
- `useParams` does not validate—only extracts.
- `useValidatedIdParam` ensures the ID is valid and safe to use.
- Always use `useValidatedIdParam` (or similar validation) when working with URL parameters that must be numbers or have specific constraints.
 * 
 * @param idParam - The URL parameter string to validate
 * @returns ValidatedIdResult object with automatic memoization
 */
export function useValidatedIdParam(idParam?: string): ValidatedIdResult {
    return useMemo(() => validateIdParameter(idParam), [idParam]);
}
