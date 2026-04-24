'use client'
import React, { useState } from 'react';

export default function ReviewScreen({ data, aiData, onConfirm, onBack, isGenerating }: any) {
    const [sport, setSport] = useState(aiData?.sport || "MLB");
    const [odds, setOdds] = useState(data?.odds || "");
    const [risk, setRisk] = useState(data?.risk || "");
    const [pick, setPick] = useState(data?.pick || "");

    const handleConfirm = () => {
        onConfirm({
            ...data,
            pick, odds, risk
        }, {
            ...aiData,
            sport
        });
    };

    return (
        <div className="card animate-fade-in">
            <h2 className="section-title">Step 2: Review & Edit</h2>

            <div className="review-grid">
                <div className="form-group">
                    <label>Sport</label>
                    <select value={sport} onChange={e => setSport(e.target.value)} className="input-field" style={{ height: '45px' }}>
                        <option value="MLB">MLB</option>
                        <option value="NFL">NFL</option>
                        <option value="NBA">NBA</option>
                        <option value="NHL">NHL</option>
                        <option value="NCAAF">NCAAF</option>
                        <option value="NCAAM">NCAAM</option>
                        <option value="WNBA">WNBA</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Odds</label>
                    <input type="text" value={odds} onChange={e => setOdds(e.target.value)} className="input-field" />
                </div>
                <div className="form-group">
                    <label>Risk (Units)</label>
                    <input type="text" value={risk} onChange={e => setRisk(e.target.value)} className="input-field" />
                </div>
                <div className="form-group">
                    <label>Verbatim Pick</label>
                    <textarea value={pick} onChange={e => setPick(e.target.value)} className="input-field" rows={2}></textarea>
                </div>
            </div>

            <div className="form-group">
                <label>Image Preview</label>
                <img src={data.image} alt="Upload" className="img-preview" />
            </div>

            <div className="button-group">
                <button className="secondary-btn" onClick={onBack} disabled={isGenerating}>Go Back</button>
                <button className="primary-btn" onClick={handleConfirm} disabled={isGenerating}>
                    {isGenerating ? "Processing Asset..." : "Generate Image"}
                </button>
            </div>
        </div>
    );
}
