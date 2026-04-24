'use client'
import { useState } from "react";
import IntakeScreen from "@/components/IntakeScreen";
import ReviewScreen from "@/components/ReviewScreen";

export default function Home() {
    const [step, setStep] = useState(1);
    const [intakeData, setIntakeData] = useState<any>(null);
    const [aiData, setAiData] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

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
                alert("AI processing failed. Check console.");
            }
        } catch (e) {
            console.error(e);
            alert("Network error.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <main className="container wrapper">
            <div className="header-brand">
                <h1 className="title">PP Workspace</h1>
                <p className="subtitle">AI Graphic Compositor</p>
            </div>

            {step === 1 && (
                <IntakeScreen onSubmit={handleIntakeSubmit} isAnalyzing={isAnalyzing} />
            )}

            {step === 2 && (
                <ReviewScreen
                    data={intakeData}
                    aiData={aiData}
                    onBack={() => setStep(1)}
                    onConfirm={() => alert("Image Generation coming soon!")}
                    isGenerating={false}
                />
            )}
        </main>
    );
}
