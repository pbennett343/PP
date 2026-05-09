'use client'
import React, { useState } from 'react';

export default function ReviewScreen({ data, aiData, onConfirm, onBack, isGenerating }: any) {
    const [isEditing, setIsEditing] = useState(false);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="section-title" style={{ margin: 0 }}>Step 2: Review</h2>
                <button 
                    className="secondary-btn" 
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                >
                    {isEditing ? "Save Edits" : "Edit Details"}
                </button>
            </div>

            {isEditing ? (
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
                            <option value="SOCCER">SOCCER</option>
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
            ) : (
                <div style={{ background: '#ffffff1a', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <span style={{ color: '#a1a1aa', fontSize: '0.9rem', display: 'block' }}>Sport</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#8b5cf6' }}>{sport}</span>
                        </div>
                        <div>
                            <span style={{ color: '#a1a1aa', fontSize: '0.9rem', display: 'block' }}>Risk</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{risk} U</span>
                        </div>
                        <div>
                            <span style={{ color: '#a1a1aa', fontSize: '0.9rem', display: 'block' }}>Odds</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{odds}</span>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <span style={{ color: '#a1a1aa', fontSize: '0.9rem', display: 'block' }}>Pick</span>
                            <span style={{ fontSize: '1.1rem' }}>{pick}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="form-group">
                <label style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Image Asset</label>
                <img src={data.image} alt="Upload" className="img-preview" style={{ maxHeight: '300px', objectFit: 'contain', background: '#000', borderRadius: '12px' }} />
            </div>

            <div className="button-group" style={{ marginTop: '30px' }}>
                <button className="secondary-btn" onClick={onBack} disabled={isGenerating}>Go Back</button>
                <button className="primary-btn" onClick={handleConfirm} disabled={isGenerating || isEditing}>
                    {isGenerating ? "Processing Asset..." : "Generate & Export Image"}
                </button>
            </div>
        </div>
    );
}
