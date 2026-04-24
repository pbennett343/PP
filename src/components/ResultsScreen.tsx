'use client'
import React, { useState, useEffect } from 'react';

export default function ResultsScreen({ onBack }: { onBack: () => void }) {
    const [pending, setPending] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/results/pending');
            const data = await res.json();
            if (data.success) {
                setPending(data.pending);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (tab: string, rowIdx: number, outcome: string) => {
        try {
            await fetch('/api/results/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tab, rowIdx, outcome })
            });
            setPending(prev => prev.filter(p => !(p.tab === tab && p.rowIdx === rowIdx)));
        } catch (e) {
            console.error(e);
            alert("Failed to update result.");
        }
    };

    return (
        <div className="card animate-fade-in">
            <h2 className="section-title">Update Pending Results</h2>
            {isLoading ? (
                <p>Loading unresolved picks across all tabs...</p>
            ) : pending.length === 0 ? (
                <p>All clean! No pending picks found.</p>
            ) : (
                <div className="results-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {pending.map((p, i) => (
                        <div key={i} className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff1a', padding: '1rem', borderRadius: '8px', gap: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <strong style={{ color: '#8b5cf6' }}>{p.tab}</strong>: {p.pick} <br />
                                <small style={{ opacity: 0.8 }}>{p.date} | {p.odds}</small>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleUpdate(p.tab, p.rowIdx, 'W')} className="primary-btn" style={{ padding: '8px 16px', background: '#22c55e', minWidth: '50px' }}>W</button>
                                <button onClick={() => handleUpdate(p.tab, p.rowIdx, 'L')} className="primary-btn" style={{ padding: '8px 16px', background: '#ef4444', minWidth: '50px' }}>L</button>
                                <button onClick={() => handleUpdate(p.tab, p.rowIdx, 'Push')} className="secondary-btn" style={{ padding: '8px 16px' }}>Push</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="button-group" style={{ marginTop: '20px' }}>
                <button onClick={onBack} className="secondary-btn" style={{ flex: 1 }}>Home</button>
                <button onClick={fetchPending} className="primary-btn" style={{ flex: 1 }}>Refresh</button>
            </div>
        </div>
    );
}
