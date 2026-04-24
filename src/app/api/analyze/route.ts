import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
    try {
        const { pick } = await req.json();

        const prompt = `
You are a top-tier sports betting AI analyst. 
Based on the following user pick: "${pick}"

1. Categorize the correct major sport (e.g. MLB, NFL, NBA, NCAAF).
2. Generate a highly unique, contextually relevant, and convincing statistical insight (under 120 characters) supporting this pick. The stat should look realistic and insightful (e.g., "The team is playing against an opponent in the same division with a 10-1 streak" or "Pitcher has a 0.89 ERA in the last 4 starts at home.").

Return your response in strict JSON format exactly like this:
{
  "sport": "SPORT_NAME",
  "insight": "The insight sentence."
}
    `;

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(prompt);
        const resultText = result.response.text() || "{}";
        const resultObj = JSON.parse(resultText);

        return NextResponse.json({ success: true, aiData: resultObj });
    } catch (error: any) {
        console.error("AI Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
