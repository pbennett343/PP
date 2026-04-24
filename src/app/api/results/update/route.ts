import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
    try {
        const { tab, rowIdx, outcome } = await req.json();

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = '1gcqU3MNEZJpAhqDAkeUBiZBp6Xz4s2_kJzn-1UP8z_o';

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${tab}!E${rowIdx}:E${rowIdx}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[outcome]],
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Update Result Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
