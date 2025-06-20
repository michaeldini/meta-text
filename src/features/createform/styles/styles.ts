import { FORM_STYLES } from '../constants';

export const uploadFormInner = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'start' as const,
    gap: FORM_STYLES.FORM_SPACING,
};

// Screen reader only styles
export const srOnly = {
    position: 'absolute' as const,
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden' as const,
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap' as const,
    border: 0,
};