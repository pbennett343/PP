'use client'
import React, { useState } from 'react';

export default function IntakeScreen({ onSubmit, isAnalyzing }: { onSubmit: any, isAnalyzing: boolean }) {
    const [image, setImage] = useState<string | null>(null);
    const [pick, setPick] = useState("");
    const [odds, setOdds] = useState("");
    const [risk, setRisk] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setImage(url);
        }
    };

    return (
        <div className="card animate-fade-in">
            <h2 className="section-title">Step 1: Intake</h2>
            <div className="form-group">
                <label>Upload Source Image</label>
                <div className="file-upload-wrapper">
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                {image && <img src={image} alt="Preview" className="img-preview" />}
            </div>
            <div className="form-group">
                <label>Pick Text</label>
                <textarea
                    value={pick}
                    onChange={(e) => setPick(e.target.value)}
                    rows={3}
                    placeholder="e.g. RED SOX ML"
                    className="input-field"
                />
            </div>
            <div className="form-group">
                <label>Odds</label>
                <input
                    type="text"
                    value={odds}
                    onChange={(e) => setOdds(e.target.value)}
                    placeholder="e.g. -120"
                    className="input-field"
                />
            </div>
            <div className="form-group">
                <label>Risk (Units)</label>
                <input
                    type="text"
                    value={risk}
                    onChange={(e) => setRisk(e.target.value)}
                    placeholder="e.g. 2"
                    className="input-field"
                />
            </div>
            <button
                className="primary-btn"
                onClick={() => onSubmit({ image, pick, odds, risk })}
                disabled={!image || !pick || !odds || !risk || isAnalyzing}
            >
                {isAnalyzing ? "Analyzing via AI..." : "Continue to AI Review"}
            </button>
        </div>
    );
}
