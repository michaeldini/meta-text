import React from 'react';

export default function ErrorMessage({ children }) {
    if (!children) return null;
    return <div className="error-msg">{children}</div>;
}
