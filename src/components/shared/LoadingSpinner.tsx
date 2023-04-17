import React from "react";

// Viewmodel for component
export interface ILoadingSpinner {

    // Message to display
    message?: string,

    // Current progress
    current?: number,

    // Total progress
    total?: number,

    // Show progress
    showprogress?: boolean
}

export function LoadingSpinner({message, current, total, showprogress}: ILoadingSpinner) {
    return (
        <div className="spinner-container">
            <div className="loading-spinner">
            </div>
            { message && <span>{message}</span> }
            { showprogress && <span>{current} / {total}</span> }
        </div>
    );
}