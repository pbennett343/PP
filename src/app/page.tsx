'use client'
import { useState } from "react";
import IntakeScreen from "@/components/IntakeScreen";
import ReviewScreen from "@/components/ReviewScreen";
import ImageGenerator from "@/components/ImageGenerator";

export default function Home() {
    const [step, setStep] = useState(1);
    const [intakeData, setIntakeData] = useState<any>(null);
    const [aiData, setAiData] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGenerator, setShowGenerator] = useState(false);

    const handleIntakeSubmit = async (data: any) => {
        setIsAnalyzing(true);
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pick: data.pick })
            });
            const result = await response.json();

            if (result.success) {
                setIntakeData(data);
                setAiData(result.aiData);
                setStep(2);
            } else {
                alert("AI processing failed: " + result.error);
            }
        } catch (e) {
            console.error(e);
            alert("Network error.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleConfirm = () => {
        setIsGenerating(true);
        setShowGenerator(true);
    };

    const handleGeneratorComplete = async (dataUrl: string) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `PP_${aiData.sport}_Asset.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        try {
            await fetch('/api/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pick: intakeData.pick,
                    odds: intakeData.odds,
                    risk: intakeData.risk,
                    sport: aiData.sport,
                    timestamp: new Date().toISOString()
                })
            });
            console.log("Logged remotely!");
        } catch (e) {
            console.error("Sheets log failed:", e);
        }

        alert("Asset Downloaded & Logged to 2026 Sheet!");
        setShowGenerator(false);
        setIsGenerating(false);
        setStep(1);
        setIntakeData(null);
        setAiData(null);
    };

    const handleGeneratorError = (err: string) => {
        alert(err);
        setShowGenerator(false);
        setIsGenerating(false);
    };

    return (
        <main className="container wrapper">
            <div className="header-brand">
                <img src="/templates/header_logo.png" alt="WTF Bets Premium Picks" style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto 10px auto', borderRadius: '8px' }} />
                <h1 className="title" style={{ fontSize: '2rem', marginTop: '0' }}>GENERATOR</h1>
            </div>

            {step === 1 && (
                <IntakeScreen onSubmit={handleIntakeSubmit} isAnalyzing={isAnalyzing} />
            )}

            {step === 2 && (
                <ReviewScreen
                    data={intakeData}
                    aiData={aiData}
                    onBack={() => setStep(1)}
                    onConfirm={(updatedData: any, updatedAiData: any) => {
                        setIntakeData(updatedData);
                        setAiData(updatedAiData);
                        handleConfirm();
                    }}
                    isGenerating={isGenerating}
                />
            )}

            {showGenerator && (
                <ImageGenerator
                    data={intakeData}
                    aiData={aiData}
                    onComplete={handleGeneratorComplete}
                    onError={handleGeneratorError}
                />
            )}
        </main>
    );
}
