'use client'
import React from 'react';

export default function ReviewScreen({ data, aiData, onConfirm, onBack, isGenerating }: any) {
    return (
        <div className="card animate-fade-in">
            <h2 className="section-title">Step 2: Review & Confirm</h2>

            <div className="review-grid">
                <div className="review-item"><strong>Sport Category:</strong> {aiData.sport}</div>
                <div className="review-item"><strong>Odds:</strong> {data.odds}</div>
                <div className="review-item"><strong>Risk (Units):</strong> {data.risk}U</div>
                <div className="review-item"><strong>Verbatim Pick:</strong> {data.pick}</div>
            </div>

            <div className="form-group">
                <label>Image Preview</label>
                <img src={data.image} alt="Upload" className="img-preview" />
            </div>

            <div className="button-group">
                <button className="secondary-btn" onClick={onBack} disabled={isGenerating}>Go Back</button>
                <button className="primary-btn" onClick={onConfirm} disabled={isGenerating}>
                    {isGenerating ? "Processing Asset..." : "Confirm & Generate Asset"}
                </button>
            </div>
        </div>
    );
}
