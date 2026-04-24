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
                // Fetch stats first
                let statsText = "";
                try {
                    const sport = aiData.sport.toUpperCase().trim();
                    const response = await fetch(`/api/stats?sport=${sport}`);
                    const resData = await response.json();
                    if (resData.success && resData.units) {
                        const prefix = resData.units.toString().startsWith('-') ? '' : '+';
                        statsText = `OUR ${sport} PICKS ARE ${prefix}${resData.units}U THIS YEAR`;
                    }
                } catch (e) {
                    console.warn("Failed to retrieve stats:", e);
                }

                // 1. Load Background Template Dynamically
                const bgImg = new Image();
                bgImg.crossOrigin = "anonymous";
                bgImg.src = "/templates/PP_Template.png";
                await new Promise((resolve, reject) => {
                    bgImg.onload = resolve;
                    bgImg.onerror = reject;
                });

                const width = bgImg.width;
                const height = bgImg.height;
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(bgImg, 0, 0, width, height);

                const scale = width / 4000;

                const dateStr = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
                ctx.font = `bold ${150 * scale}px sans-serif`;
                ctx.fillStyle = '#8b5cf6';
                ctx.textAlign = 'center';

                const dateY = 600 * scale;
                ctx.fillText(dateStr, width / 2, dateY);

                const pickText = data.pick.toUpperCase();
                ctx.font = `bold ${360 * scale}px sans-serif`;
                const pickMetrics = ctx.measureText(pickText);

                const boxPaddingW = 400 * scale;
                const finalBoxW = pickMetrics.width + boxPaddingW;
                const rectW = Math.max(finalBoxW, width * 0.75);
                const rectH = 550 * scale;
                const rectX = (width - rectW) / 2;

                const rectY = dateY + (200 * scale);
                const pickY = rectY + Math.round(rectH * 0.75);

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(rectX, rectY, rectW, rectH);
                ctx.lineWidth = 15 * scale;
                ctx.strokeStyle = '#8b5cf6';
                ctx.strokeRect(rectX, rectY, rectW, rectH);

                ctx.fillStyle = '#8b5cf6';
                ctx.fillText(pickText, width / 2, pickY);

                ctx.font = `bold ${240 * scale}px sans-serif`;
                ctx.fillStyle = '#8b5cf6';
                const oddsRiskStr = `${data.odds} | ${data.risk}U`;
                const oddsY = pickY + (450 * scale);
                ctx.fillText(oddsRiskStr, width / 2, oddsY);

                if (data.image) {
                    const userImg = new Image();
                    userImg.crossOrigin = "anonymous";
                    userImg.src = data.image;
                    await new Promise((resolve, reject) => {
                        userImg.onload = resolve;
                        userImg.onerror = reject;
                    });

                    const imgMarginTop = 300 * scale;
                    const imgMarginBottom = statsText ? 500 * scale : 400 * scale; // Extra space if text exists
                    const imgMarginSides = 500 * scale;

                    const imgStartX = imgMarginSides;
                    const imgStartY = oddsY + imgMarginTop;
                    const maxImgW = width - (imgMarginSides * 2);
                    const maxImgH = height - imgStartY - imgMarginBottom;

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

                    const drawX = imgStartX + (maxImgW - drawW) / 2;
                    const drawY = imgStartY + (maxImgH - drawH) / 2;

                    ctx.drawImage(userImg, drawX, drawY, drawW, drawH);

                    ctx.lineWidth = 25 * scale;
                    ctx.strokeStyle = '#8b5cf6';
                    ctx.strokeRect(drawX, drawY, drawW, drawH);
                }

                // 6. Draw Final Stats Text
                if (statsText) {
                    ctx.font = `bold ${160 * scale}px sans-serif`;
                    ctx.fillStyle = '#22c55e'; // Green
                    const statsY = height - (150 * scale);
                    ctx.fillText(statsText, width / 2, statsY);
                }

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
