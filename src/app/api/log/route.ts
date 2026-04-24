import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
    try {
        const { pick, odds, sport, insight, timestamp } = await req.json();

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                // Handling both raw newlines and escaped newlines correctly
                private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Active 2026 Write Sheet provided by user
        const spreadsheetId = '1gcqU3MNEZJpAhqDAkeUBiZBp6Xz4s2_kJzn-1UP8z_o';

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:E',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    timestamp,
                    sport,
                    pick,
                    odds,
                    insight
                ]],
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Sheets Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
