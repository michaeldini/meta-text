import { FORM_MODES } from '../constants';

export type FormMode = typeof FORM_MODES.UPLOAD | typeof FORM_MODES.META_TEXT;

export interface SourceDocument {
    id: string | number;
    title: string;
}

export interface CreateFormData {
    title: string;
    file: File | null;
    sourceDocId: string;
}

export interface CreateFormState {
    mode: FormMode;
    data: CreateFormData;
    loading: boolean;
    error: string | null;
    success: string | null;
}

export interface CreateFormActions {
    setTitle: (title: string) => void;
    setFile: (file: File | null) => void;
    setSourceDocId: (id: string) => void;
    setMode: (mode: FormMode) => void;
    submit: () => Promise<void>;
    reset: () => void;
    clearMessages: () => void;
}

export interface CreateFormResult extends CreateFormState, CreateFormActions {
    isSubmitDisabled: boolean;
}

export interface CreateFormOptions {
    initialMode?: FormMode;
    mode?: FormMode; // NEW: controlled mode
    onSuccess?: () => void;
    sourceDocs?: SourceDocument[];
}

export interface CreateFormValidationResult {
    isValid: boolean;
    error?: string;
}

export interface FormSubmissionService {
    submitUpload: (title: string, file: File) => Promise<void>;
    submitMetaText: (sourceDocId: number, title: string) => Promise<void>;
}
