import React from 'react';
import DangerIconButton from './DangerIconButton';
import SectionHeader from './SectionHeader';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function DocumentTable({
    title,
    items,
    loading,
    emptyMessage,
    onDelete
}) {
    return (
        <div className="labels-list">
            <SectionHeader>{title}</SectionHeader>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Label</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="3">Loading...</td></tr>
                    ) : items.length === 0 ? (
                        <tr><td colSpan="3">{emptyMessage}</td></tr>
                    ) : (
                        items.map((label, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{label}</td>
                                <td>
                                    <DangerIconButton onClick={() => onDelete(label)} disabled={loading} icon={faTrash} label="Delete" />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
