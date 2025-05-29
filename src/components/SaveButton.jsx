import React from "react";

/**
 * SaveButton - A reusable save button that can be placed anywhere.
 * @param {object} props
 *   save: Function to trigger save
 *   isSaving: Boolean, true if saving is in progress
 *   isDirty: Boolean, true if there are unsaved changes
 *   children: Optional custom button content
 */
export default function SaveButton({ save, isSaving, isDirty, children }) {
    return (
        <button
            onClick={save}
            disabled={!isDirty || isSaving}
            style={{
                padding: "0.5em 1.2em",
                borderRadius: 6,
                background: isDirty ? "#2563eb" : "#e5e7eb",
                color: isDirty ? "#fff" : "#6b7280",
                border: "none",
                fontWeight: 600,
                cursor: !isDirty || isSaving ? "not-allowed" : "pointer",
                opacity: isSaving ? 0.7 : 1,
                transition: "all 0.2s"
            }}
            aria-busy={isSaving}
        >
            {isSaving ? "Saving..." : children || "Save"}
        </button>
    );
}
