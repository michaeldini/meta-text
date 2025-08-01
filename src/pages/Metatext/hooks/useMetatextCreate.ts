// TODO I don't know how this file works. 
// Custom hook for managing Metatext creation form state and operations
import { useState, useCallback } from 'react';
import { createMetatext } from '@services/metatextService';
import { useNotifications } from '@store/notificationStore';
import log from '@utils/logger';

// i don't know why this is needed.
export interface UseMetatextCreateOptions {
    onSuccess?: () => void;
}


// Form data structure for Metatext creation
export interface MetatextCreateData {
    title: string;
    sourceDocId: number | null;
}

// Return type for the useMetatextCreate hook
export interface UseMetatextCreateResult {
    // Form data
    title: string;
    sourceDocId: number | null;

    // Form state
    loading: boolean;
    error: string | null;
    success: string | null;
    isSubmitDisabled: boolean;

    // Form handlers
    handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSourceDocChange: (event: any) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    clearMessages: () => void;
}

export function useMetatextCreate({ onSuccess }: UseMetatextCreateOptions = {}): UseMetatextCreateResult {

    // Initial form data state
    const [data, setData] = useState<MetatextCreateData>({
        title: '',
        sourceDocId: null
    });

    // Form state management
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Notification system integration
    const { showSuccess, showError } = useNotifications();

    // Handle title input changes
    const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const title = event.target.value;
        setData(prev => ({ ...prev, title }));

        // Clear messages when user types
        if (error || success) {
            setError(null);
            setSuccess(null);
        }
    }, [error, success]);

    // Handle source document selection changes
    const handleSourceDocChange = useCallback((event: any) => {
        const sourceDocId = event.target.value ? Number(event.target.value) : null;
        setData(prev => ({ ...prev, sourceDocId }));

        // Clear messages when user selects a source document
        if (error || success) {
            setError(null);
            setSuccess(null);
        }
    }, [error, success]);

    // Validate form data
    const validateForm = useCallback((): string | null => {
        if (!data.title.trim()) {
            return 'Please enter a title for your Metatext';
        }

        if (!data.sourceDocId) {
            return 'Please select a source document';
        }

        return null;
    }, [data]);

    // Handle form submission
    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Clear previous messages
        setError(null);
        setSuccess(null);

        // Validate form
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        if (!data.sourceDocId) {
            setError('No source document selected');
            return;
        }

        try {
            setLoading(true);
            log.info('Starting Metatext creation', {
                title: data.title,
                sourceDocId: data.sourceDocId
            });

            // Submit the creation request
            await createMetatext(data.sourceDocId, data.title.trim());

            // Show success message
            const successMessage = `Successfully created Metatext "${data.title}"`;
            setSuccess(successMessage);
            showSuccess(successMessage);

            // Reset form
            setData({ title: '', sourceDocId: null });

            // Call success callback
            if (onSuccess) {
                onSuccess();
            }

            log.info('Metatext creation completed successfully');

        } catch (createError: unknown) {
            const errorMessage = createError instanceof Error
                ? createError.message
                : 'Failed to create Metatext. Please try again.';

            setError(errorMessage);
            showError(errorMessage);

            log.error('Metatext creation failed', {
                error: createError,
                title: data.title,
                sourceDocId: data.sourceDocId
            });
        } finally {
            setLoading(false);
        }
    }, [data, validateForm, onSuccess, showSuccess, showError]);

    /**
     * Clear success and error messages
     */
    const clearMessages = useCallback(() => {
        setError(null);
        setSuccess(null);
    }, []);

    /**
     * Determine if submit button should be disabled
     */
    const isSubmitDisabled = loading || !data.title.trim() || !data.sourceDocId;

    return {
        // Form data
        title: data.title,
        sourceDocId: data.sourceDocId,

        // Form state
        loading,
        error,
        success,
        isSubmitDisabled,

        // Form handlers
        handleTitleChange,
        handleSourceDocChange,
        handleSubmit,
        clearMessages,
    };
}
