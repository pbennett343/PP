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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 className="section-title" style={{ margin: 0, fontSize: '1.4rem' }}>Step 2: Review</h2>
                <button 
                    className="primary-btn" 
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 'auto', width: 'auto' }}
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
                <div style={{ background: '#ffffff1a', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <span style={{ color: '#a1a1aa', fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>Sport</span>
                            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#8b5cf6' }}>{sport}</span>
                        </div>
                        <div>
                            <span style={{ color: '#a1a1aa', fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>Risk</span>
                            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#8b5cf6' }}>{risk} U</span>
                        </div>
                        <div>
                            <span style={{ color: '#a1a1aa', fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>Odds</span>
                            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#8b5cf6' }}>{odds}</span>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <span style={{ color: '#a1a1aa', fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>Pick</span>
                            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#8b5cf6' }}>{pick}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="form-group">
                <label style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '5px' }}>Image Asset</label>
                <img src={data.image} alt="Upload" className="img-preview" style={{ maxHeight: '200px', objectFit: 'contain', background: '#000', borderRadius: '8px' }} />
            </div>

            <div className="button-group" style={{ marginTop: '20px' }}>
                <button className="secondary-btn" onClick={onBack} disabled={isGenerating}>Go Back</button>
                <button className="primary-btn" onClick={handleConfirm} disabled={isGenerating || isEditing}>
                    {isGenerating ? "Processing Asset..." : "Proceed"}
                </button>
            </div>
        </div>
    );
}
