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

            try {
                // 1. Load Background Template Dynamically
                const bgImg = new Image();
                bgImg.crossOrigin = "anonymous";
                bgImg.src = "/templates/PP_Template.png";
                await new Promise((resolve, reject) => {
                    bgImg.onload = resolve;
                    bgImg.onerror = reject;
                });

                // Natively read the background layout resolution making it template agnostic
                const width = bgImg.width;
                const height = bgImg.height;
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(bgImg, 0, 0, width, height);

                // Global Scaling Base (Calculates against native 4000px assumption)
                const scale = width / 4000;

                // 2. Draw Date
                const dateStr = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
                ctx.font = `bold ${150 * scale}px sans-serif`;
                ctx.fillStyle = '#8b5cf6';
                ctx.textAlign = 'center';

                // Typically Date can just sit right under Logo Area (~600)
                const dateY = 600 * scale;
                ctx.fillText(dateStr, width / 2, dateY);

                // 3. Draw Dynamic Pick Box & Text
                const pickText = data.pick.toUpperCase();
                ctx.font = `bold ${360 * scale}px sans-serif`;
                const pickMetrics = ctx.measureText(pickText);

                const boxPaddingW = 400 * scale;
                const finalBoxW = pickMetrics.width + boxPaddingW;
                const rectW = Math.max(finalBoxW, width * 0.75); // At least 75% width
                const rectH = 550 * scale;
                const rectX = (width - rectW) / 2;

                // Base the element stack downwards
                const rectY = dateY + (200 * scale);
                const pickY = rectY + Math.round(rectH * 0.75); // Text baseline inside box

                // Draw the white rect and purple border behind
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(rectX, rectY, rectW, rectH);
                ctx.lineWidth = 15 * scale;
                ctx.strokeStyle = '#8b5cf6';
                ctx.strokeRect(rectX, rectY, rectW, rectH);

                // Draw Pick Text cleanly
                ctx.fillStyle = '#8b5cf6';
                ctx.fillText(pickText, width / 2, pickY);

                // 4. Draw Odds and Risk Base
                ctx.font = `bold ${240 * scale}px sans-serif`;
                ctx.fillStyle = '#8b5cf6';
                const oddsRiskStr = `${data.odds} | ${data.risk}U`;
                const oddsY = pickY + (450 * scale);
                ctx.fillText(oddsRiskStr, width / 2, oddsY);

                // 5. Load and Draw User File Inside Vector Output
                if (data.image) {
                    const userImg = new Image();
                    userImg.crossOrigin = "anonymous";
                    userImg.src = data.image;
                    await new Promise((resolve, reject) => {
                        userImg.onload = resolve;
                        userImg.onerror = reject;
                    });

                    const imgMarginTop = 300 * scale;
                    const imgMarginBottom = 400 * scale;
                    const imgMarginSides = 500 * scale;

                    const imgStartX = imgMarginSides;
                    const imgStartY = oddsY + imgMarginTop;
                    const maxImgW = width - (imgMarginSides * 2);
                    const maxImgH = height - imgStartY - imgMarginBottom;

                    // Preserve ratio flawlessly
                    const imgRatio = userImg.width / userImg.height;
                    const boxRatio = maxImgW / maxImgH;

                    let drawW, drawH;
                    if (imgRatio > boxRatio) {
                        drawW = maxImgW;
                        drawH = maxImgW / imgRatio;
                    } else {
                        drawH = maxImgH;
                        drawW = maxImgH * imgRatio;
                    }

                    // Center logically in the remaining space
                    const drawX = imgStartX + (maxImgW - drawW) / 2;
                    const drawY = imgStartY + (maxImgH - drawH) / 2;

                    // Draw Uploaded Image Content
                    ctx.drawImage(userImg, drawX, drawY, drawW, drawH);

                    // Draw the tight perimeter bounds exact to native shape bounds
                    ctx.lineWidth = 25 * scale;
                    ctx.strokeStyle = '#8b5cf6';
                    ctx.strokeRect(drawX, drawY, drawW, drawH);
                }

                // Export Payload 
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
