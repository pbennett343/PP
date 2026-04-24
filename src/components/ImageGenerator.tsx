'use client';
import { useEffect, useRef } from 'react';

export default function ImageGenerator({ data, aiData, onComplete, onError }: any) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const drawAsset = async () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const width = 4000;
            const height = 5333;
            canvas.width = width;
            canvas.height = height;

            try {
                // 1. Load Background Template
                const bgImg = new Image();
                bgImg.crossOrigin = "anonymous";
                bgImg.src = "/templates/Blank_PP.PNG";
                await new Promise((resolve, reject) => {
                    bgImg.onload = resolve;
                    bgImg.onerror = reject;
                });
                ctx.drawImage(bgImg, 0, 0, width, height);

                // 2. Load and Draw User File
                if (data.image) {
                    const userImg = new Image();
                    userImg.crossOrigin = "anonymous";
                    userImg.src = data.image;
                    await new Promise((resolve, reject) => {
                        userImg.onload = resolve;
                        userImg.onerror = reject;
                    });

                    // Tuned coordinates: shrunk slightly and shifted down below the Odds text into the purple border
                    const boxX = 645;
                    const boxY = 2200;
                    const boxW = 2710;
                    const boxH = 2660;

                    ctx.drawImage(userImg, boxX, boxY, boxW, boxH);
                }

                // 3. Draw Date
                const dateStr = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
                ctx.font = 'bold 150px sans-serif';
                ctx.fillStyle = '#8b5cf6';
                ctx.textAlign = 'center';
                ctx.fillText(dateStr, width / 2, 600);

                // 4. Draw Pick Text
                ctx.font = 'bold 360px sans-serif';
                ctx.fillStyle = '#8b5cf6';
                ctx.fillText(data.pick.toUpperCase(), width / 2, 1420); // Baseline pushed deep into the white box

                // 5. Draw Odds and Risk
                ctx.font = 'bold 240px sans-serif';
                ctx.fillStyle = '#8b5cf6';
                const oddsRiskStr = `${data.odds} | ${data.risk}U`;
                ctx.fillText(oddsRiskStr, width / 2, 1950); // Lowered closer to image

                // Export and dispatch
                const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                onComplete(dataUrl);

            } catch (err) {
                console.error(err);
                onError("Canvas failed to composite image.");
            }
        };

        drawAsset();
    }, [data, aiData, onComplete, onError]);

    return (
        <div style={{ display: 'none' }}>
            <canvas ref={canvasRef} />
        </div>
    );
}
