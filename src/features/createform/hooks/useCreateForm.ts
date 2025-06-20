import { useCallback, useState } from 'react';
import { CreateFormResult, CreateFormOptions, FormMode, CreateFormData } from '../types';
import { validateCreateForm } from '../utils/validation';
import { createFormService } from '../services/createFormService';
import { FORM_MODES, FORM_MESSAGES } from '../constants';
import { useNotifications } from '../../../store/notificationStore';
import log from '../../../utils/logger';

const INITIAL_DATA: CreateFormData = {
    title: '',
    file: null,
    sourceDocId: ''
};

export function useCreateForm(options: CreateFormOptions = {}): CreateFormResult {
    const {
        initialMode = FORM_MODES.UPLOAD,
        onSuccess,
        sourceDocs = []
    } = options;

    // Global notifications for user feedback
    const { showSuccess, showError } = useNotifications();

    // State
    const [mode, setMode] = useState<FormMode>(initialMode);
    const [data, setData] = useState<CreateFormData>(INITIAL_DATA);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Actions
    const setTitle = useCallback((title: string) => {
        setData(prev => ({ ...prev, title }));
        // Clear messages when user starts typing
        if (error || success) {
            setError(null);
            setSuccess(null);
        }
    }, [error, success]);

    const setFile = useCallback((file: File | null) => {
        setData(prev => ({ ...prev, file }));
        // Clear messages when file changes
        if (error || success) {
            setError(null);
            setSuccess(null);
        }
    }, [error, success]);

    const setSourceDocId = useCallback((sourceDocId: string) => {
        setData(prev => ({ ...prev, sourceDocId }));
        // Clear messages when selection changes
        if (error || success) {
            setError(null);
            setSuccess(null);
        }
    }, [error, success]);

    const handleSetMode = useCallback((newMode: FormMode) => {
        setMode(newMode);
        // Reset form data when switching modes
        setData(INITIAL_DATA);
        setError(null);
        setSuccess(null);
    }, []);

    const clearMessages = useCallback(() => {
        setError(null);
        setSuccess(null);
    }, []);

    const reset = useCallback(() => {
        setData(INITIAL_DATA);
        setError(null);
        setSuccess(null);
        setLoading(false);
    }, []);

    const submit = useCallback(async () => {
        // Clear previous messages
        clearMessages();

        // Validate form
        const validation = validateCreateForm(mode, data);
        if (!validation.isValid) {
            setError(validation.error || 'Invalid form data');
            return;
        }

        setLoading(true); try {
            if (mode === FORM_MODES.UPLOAD) {
                if (!data.file) throw new Error('File is required for upload');
                await createFormService.submitUpload(data.title, data.file);
            } else {
                if (!data.sourceDocId) throw new Error('Source document is required');
                const sourceDocIdNum = Number(data.sourceDocId);
                if (isNaN(sourceDocIdNum)) throw new Error('Invalid source document ID');
                await createFormService.submitMetaText(sourceDocIdNum, data.title);
            }

            // Success - show global notification for better user feedback
            showSuccess(FORM_MESSAGES.SUCCESS[mode]);

            // Reset form data for new input
            setData(INITIAL_DATA);

            // Clear any existing error/success states
            setError(null);
            setSuccess(null);

            // Call success callback
            if (onSuccess) {
                onSuccess();
            }

            log.info(`Form submission successful for mode: ${mode}`);

        } catch (err: any) {
            const errorMessage = err?.message || 'An error occurred during submission';
            // Use global notification for errors as well for consistency
            showError(errorMessage);
            setError(errorMessage);
            log.error(`Form submission failed for mode: ${mode}`, err);
        } finally {
            setLoading(false);
        }
    }, [mode, data, onSuccess, showSuccess, showError]);

    return {
        // State
        mode,
        data,
        loading,
        error,
        success,
        // Actions  
        setTitle,
        setFile,
        setSourceDocId,
        setMode: handleSetMode,
        submit,
        reset,
        clearMessages
    };
}
