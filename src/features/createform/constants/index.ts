// Form mode constants
export const FORM_MODES = {
    UPLOAD: 'upload',
    META_TEXT: 'metaText'
} as const;

// Form messages
export const FORM_MESSAGES = {
    DESCRIPTIONS: {
        [FORM_MODES.UPLOAD]: 'Upload a text file to create a new source document.',
        [FORM_MODES.META_TEXT]: 'Choose a source document to create a new meta text.'
    },
    LABELS: {
        TITLE: {
            [FORM_MODES.UPLOAD]: 'Enter the title of your document',
            [FORM_MODES.META_TEXT]: 'Choose a title for your meta text'
        }
    },
    VALIDATION: {
        TITLE_REQUIRED: 'Title is required.',
        FILE_REQUIRED: 'Please select a file to upload.',
        SOURCE_DOC_REQUIRED: 'Please select a source document.',
        INVALID_SOURCE_DOC: 'Please select a valid source document.'
    },
    SUCCESS: {
        [FORM_MODES.UPLOAD]: 'Upload successful!',
        [FORM_MODES.META_TEXT]: 'Meta-text created!'
    },
    LOADING: {
        [FORM_MODES.UPLOAD]: 'Uploading...',
        [FORM_MODES.META_TEXT]: 'Creating...'
    },
    SUBMIT: {
        [FORM_MODES.UPLOAD]: 'Upload',
        [FORM_MODES.META_TEXT]: 'Create'
    }
} as const;

// Form styling constants
export const FORM_STYLES = {
    INPUT_HEIGHT: '60px',
    STANDARD_PADDING: '16px',
    FORM_SPACING: 2,
    MIN_CONTAINER_HEIGHT: '400px',
    LOADING_SPINNER_SIZE: 20,
    // SUBMIT_BUTTON_SPACING: 2
} as const;

// Form accessibility constants
export const FORM_A11Y = {
    IDS: {
        UPLOAD_TITLE: 'upload-title',
        META_TEXT_TITLE: 'meta-text-title',
        FILE_UPLOAD: 'file-upload',
        SOURCE_DOC_SELECT: 'source-doc-select',
        ERROR_MESSAGE: 'form-error-message',
        SUCCESS_MESSAGE: 'form-success-message'
    },
    LABELS: {
        FORM_MODE: 'form mode',
        FILE_UPLOAD: 'Choose file to upload',
        SOURCE_DOC_SELECT: 'Select source document'
    },
    LIVE_REGION: 'polite'
} as const;

// Default values
export const FORM_DEFAULTS = {
    FILE_ACCEPT: '.txt',
    SELECT_MIN_WIDTH: 200,
    SNACKBAR_AUTO_HIDE: 4000
} as const;
