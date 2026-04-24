import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
    try {
        const { pick, odds, risk, sport, timestamp } = await req.json();

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Active 2026 Write Sheet
        const spreadsheetId = '1gcqU3MNEZJpAhqDAkeUBiZBp6Xz4s2_kJzn-1UP8z_o';
        const sheetTab = sport.toUpperCase().trim();

        // 1. Read Column A to find exactly which row is the first empty one
        // We cannot use append() because Sheets counts formatting as "non-empty" rows!
        const readRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetTab}!A:A`,
        });

        const numRows = readRes.data.values ? readRes.data.values.length : 0;
        // Base changed to 4 because data explicitly starts on Row 4 per picture
        const targetRow = Math.max(numRows + 1, 4);

        const dateFormatted = new Date(timestamp).toLocaleDateString('en-US');

        // 2. Explicitly UPDATE the target row, bypassing append logic
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetTab}!A${targetRow}:D${targetRow}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    dateFormatted,
                    pick,
                    odds,
                    risk
                ]],
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Sheets Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
