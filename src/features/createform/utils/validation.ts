import { CreateFormData, CreateFormValidationResult, FormMode } from '../types';
import { FORM_MODES, FORM_MESSAGES } from '../constants';

export function validateCreateForm(
    mode: FormMode,
    data: CreateFormData
): CreateFormValidationResult {
    // Check title
    if (!data.title?.trim()) {
        return {
            isValid: false,
            error: FORM_MESSAGES.VALIDATION.TITLE_REQUIRED
        };
    }

    // Mode-specific validation
    if (mode === FORM_MODES.UPLOAD) {
        if (!data.file) {
            return {
                isValid: false,
                error: FORM_MESSAGES.VALIDATION.FILE_REQUIRED
            };
        }
    } else if (mode === FORM_MODES.META_TEXT) {
        if (!data.sourceDocId) {
            return {
                isValid: false,
                error: FORM_MESSAGES.VALIDATION.SOURCE_DOC_REQUIRED
            };
        }

        const sourceDocIdNum = Number(data.sourceDocId);
        if (isNaN(sourceDocIdNum)) {
            return {
                isValid: false,
                error: FORM_MESSAGES.VALIDATION.INVALID_SOURCE_DOC
            };
        }
    }

    return { isValid: true };
}
