/**
 * @fileoverview Custom hook for source document upload functionality
 * 
 * A streamlined hook that manages the state and logic for uploading source documents.
 * This hook is simplified compared to the original CreateForm hooks and focuses
 * solely on file upload operations.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-09
 */

import { useState, useCallback } from 'react';
import { createSourceDocument } from 'services';
import { useNotifications } from 'store';
import { log } from 'utils';

/**
 * Options for the useSourceDocUpload hook
 */
export interface UseSourceDocUploadOptions {
    /** Callback function called when upload succeeds */
    onSuccess?: () => void;
}

/**
 * Form data structure for source document upload
 */
export interface SourceDocUploadData {
    title: string;
    file: File | null;
}

/**
 * Return type for the useSourceDocUpload hook
 */
export interface UseSourceDocUploadResult {
    // Form data
    title: string;
    file: File | null;

    // Form state
    loading: boolean;
    error: string | null;
    success: string | null;
    isSubmitDisabled: boolean;

    // Form handlers
    handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    clearMessages: () => void;
}

/**
 * Custom hook for managing source document upload
 * 
 * This hook provides a complete solution for handling file uploads to create
 * source documents. It manages form state, validation, submission, and user feedback.
 * 
 * Features:
 * - Form state management (title, file, loading, errors)
 * - Form validation (required fields, file type checking)
 * - File upload submission with API integration
 * - Success/error notifications
 * - Loading states during upload
 * - Form reset after successful submission
 * 
 * @category Hooks
 * @subcategory Forms
 * @hook
 * @example
 * ```tsx
 * function UploadForm() {
 *   const {
 *     title,
 *     file,
 *     loading,
 *     handleTitleChange,
 *     handleFileChange,
 *     handleSubmit,
 *     isSubmitDisabled
 *   } = useSourceDocUpload({
 *     onSuccess: () => refetchDocuments()
 *   });
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input value={title} onChange={handleTitleChange} />
 *       <input type="file" onChange={handleFileChange} />
 *       <button disabled={isSubmitDisabled}>Upload</button>
 *     </form>
 *   );
 * }
 * ```
 * 
 * @param options - Configuration options for the hook
 * @returns {UseSourceDocUploadResult} Hook state and handlers
 */
export function useSourceDocUpload(options: UseSourceDocUploadOptions = {}): UseSourceDocUploadResult {
    const { onSuccess } = options;
    const { showSuccess, showError } = useNotifications();

    // Form state
    const [data, setData] = useState<SourceDocUploadData>({
        title: '',
        file: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    /**
     * Handle title input changes
     */
    const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const title = event.target.value;
        setData(prev => ({ ...prev, title }));

        // Clear messages when user starts typing
        if (error || success) {
            setError(null);
            setSuccess(null);
        }
    }, [error, success]);

    /**
     * Handle file selection
     */
    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;

        // Basic file validation
        if (file) {
            const allowedTypes = ['.txt', '.doc', '.docx', '.pdf'];
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

            if (!allowedTypes.includes(fileExtension)) {
                setError('Please select a valid file type (.txt, .doc, .docx, .pdf)');
                return;
            }

            // Check file size (limit to 10MB)
            const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSizeInBytes) {
                setError('File size must be less than 10MB');
                return;
            }
        }

        setData(prev => ({ ...prev, file }));

        // Clear messages when user selects a file
        if (error || success) {
            setError(null);
            setSuccess(null);
        }
    }, [error, success]);

    /**
     * Validate form data
     */
    const validateForm = useCallback((): string | null => {
        if (!data.title.trim()) {
            return 'Please enter a title for your document';
        }

        if (!data.file) {
            return 'Please select a file to upload';
        }

        return null;
    }, [data]);

    /**
     * Handle form submission
     */
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

        if (!data.file) {
            setError('No file selected');
            return;
        }

        try {
            setLoading(true);
            log.info('Starting source document upload', {
                title: data.title,
                fileName: data.file.name,
                fileSize: data.file.size
            });

            // Submit the upload
            await createSourceDocument(data.title.trim(), data.file);

            // Show success message
            const successMessage = `Successfully uploaded "${data.title}"`;
            setSuccess(successMessage);
            showSuccess(successMessage);

            // Reset form
            setData({ title: '', file: null });

            // Call success callback
            if (onSuccess) {
                onSuccess();
            }

            log.info('Source document upload completed successfully');

        } catch (uploadError: unknown) {
            const errorMessage = uploadError instanceof Error
                ? uploadError.message
                : 'Failed to upload document. Please try again.';

            setError(errorMessage);
            showError(errorMessage);

            log.error('Source document upload failed', {
                error: uploadError,
                title: data.title,
                fileName: data.file.name
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
    const isSubmitDisabled = loading || !data.title.trim() || !data.file;

    return {
        // Form data
        title: data.title,
        file: data.file,

        // Form state
        loading,
        error,
        success,
        isSubmitDisabled,

        // Form handlers
        handleTitleChange,
        handleFileChange,
        handleSubmit,
        clearMessages,
    };
}
