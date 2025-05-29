import React from 'react';

export default function SuccessMessage({ children }) {
    if (!children) return null;
    return <div className="success-msg">{children}</div>;
}
