import { useCallback, useState, useEffect, useRef } from 'react';

import { useNotifications } from 'store';

import log from '../../../utils/logger';
import { FORM_MODES, FORM_MESSAGES } from '../constants';
import { validateCreateForm } from '../utils/validation';
import { createFormService } from '../services/createFormService';
import { CreateFormResult, CreateFormOptions, FormMode, CreateFormData } from '../types';

const INITIAL_DATA: CreateFormData = {
    title: '',
    file: null,
    sourceDocId: ''
};

export function useCreateForm(options: CreateFormOptions = {}): CreateFormResult {
    const {
        initialMode = FORM_MODES.UPLOAD,
        mode: controlledMode, // NEW: controlled mode
        onSuccess,
        sourceDocs = []
    } = options;

    // Global notifications for user feedback
    const { showSuccess, showError } = useNotifications();

    // State
    const isControlled = controlledMode !== undefined;
    const [uncontrolledMode, setUncontrolledMode] = useState<FormMode>(initialMode);
    const mode = isControlled ? controlledMode! : uncontrolledMode;
    const [data, setData] = useState<CreateFormData>(INITIAL_DATA);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Track previous mode to detect changes
    const prevModeRef = useRef<FormMode>(mode);
    useEffect(() => {
        if (prevModeRef.current !== mode) {
            setData(INITIAL_DATA);
            setError(null);
            setSuccess(null);
            prevModeRef.current = mode;
        }
    }, [mode]);

    // Actions
    const setTitle = useCallback((title: string) => {
        setData(prev => ({ ...prev, title }));
        if (error || success) {
            setError(null);
            setSuccess(null);
        }
    }, [error, success]);

    const setFile = useCallback((file: File | null) => {
        setData(prev => ({ ...prev, file }));
        if (error || success) {
            setError(null);
            setSuccess(null);
        }
    }, [error, success]);

    const setSourceDocId = useCallback((sourceDocId: string) => {
        setData(prev => ({ ...prev, sourceDocId }));
        if (error || success) {
            setError(null);
            setSuccess(null);
        }
    }, [error, success]);

    const handleSetMode = useCallback((newMode: FormMode) => {
        if (!isControlled) {
            setUncontrolledMode(newMode);
            setData(INITIAL_DATA);
            setError(null);
            setSuccess(null);
        }
        // If controlled, do nothing (parent controls mode)
    }, [isControlled]);

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
        clearMessages();
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
            const successMessage = FORM_MESSAGES.SUCCESS[mode];
            showSuccess(successMessage);
            setSuccess(successMessage);
            setData(INITIAL_DATA);
            setError(null);
            if (onSuccess) {
                onSuccess();
            }
            log.info(`Form submission successful for mode: ${mode}`);
        } catch (err: any) {
            const errorMessage = err?.message || 'An error occurred during submission';
            showError(errorMessage);
            setError(errorMessage);
            log.error(`Form submission failed for mode: ${mode}`, err);
        } finally {
            setLoading(false);
        }
    }, [mode, data, onSuccess, showSuccess, showError]);

    // Compute isSubmitDisabled based on current form state
    const isSubmitDisabled = loading ||
        !data.title.trim() ||
        (mode === FORM_MODES.UPLOAD ? !data.file : !data.sourceDocId);

    return {
        mode,
        data,
        loading,
        error,
        success,
        setTitle,
        setFile,
        setSourceDocId,
        setMode: handleSetMode,
        submit,
        reset,
        clearMessages,
        isSubmitDisabled // NEW: for single-source-of-truth
    };
}
