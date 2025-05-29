import React from "react";
import aiStars from '../assets/ai-stars.png';
import ErrorMessage from "./ErrorMessage";
import { SUMMARY_FIELDS } from "../constants/summaryFields";

export default function DocumentSummaryTable({ docs, results, onGenerate }) {
    return (
        <div className="browse-table-outer">
            <table className="browse-table">
                <thead>
                    <tr>
                        <th className="browse-th browse-th-default">Label</th>
                        <th className="browse-th browse-th-default">Generate</th>
                        {SUMMARY_FIELDS.map((f) => (
                            <th
                                key={f.key}
                                className={`browse-th ${f.key === "summary" ? "browse-th-summary" : "browse-th-default"}`}
                            >
                                {f.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {docs.map((label) => {
                        const result = results[label] || {};
                        return (
                            <tr key={label} className="browse-tr">
                                <td className="browse-td browse-label browse-td-default">{label}</td>
                                <td className="browse-td browse-td-default">
                                    <button
                                        className="browse-generate-btn"
                                        onClick={() => onGenerate(label)}
                                        disabled={result.loading}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, background: 'none', border: 'none' }}
                                    >
                                        <img
                                            src={aiStars}
                                            alt="Generate"
                                            style={{ width: 32, height: 32, opacity: result.loading ? 0.5 : 1 }}
                                        />
                                    </button>
                                    {result.error && (
                                        <ErrorMessage>{result.error}</ErrorMessage>
                                    )}
                                </td>
                                {SUMMARY_FIELDS.map((f) => (
                                    <td
                                        key={f.key}
                                        className={`browse-td ${f.key === "summary" ? "browse-td-summary" : "browse-td-default"}`}
                                        style={{ verticalAlign: "top", whiteSpace: "pre-line" }}
                                    >
                                        {result.data ? (
                                            Array.isArray(result.data[f.key])
                                                ? result.data[f.key].length > 0
                                                    ? result.data[f.key].join(", ")
                                                    : <span className="browse-empty">—</span>
                                                : result.data[f.key] || <span className="browse-empty">—</span>
                                        ) : (
                                            <span className="browse-empty">—</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
