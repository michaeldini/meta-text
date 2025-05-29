import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function DangerIconButton({ onClick, disabled, icon, label }) {
    return (
        <button onClick={onClick} disabled={disabled} className="danger-btn" aria-label={label}>
            <FontAwesomeIcon icon={icon} />
        </button>
    );
}
