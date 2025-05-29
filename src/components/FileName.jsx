import React from 'react';

export default function FileName({ name }) {
    if (!name) return null;
    return <span className="file-name">{name}</span>;
}
