import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sport = searchParams.get('sport');
        if (!sport) throw new Error("No sport provided");

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = '1gcqU3MNEZJpAhqDAkeUBiZBp6Xz4s2_kJzn-1UP8z_o';

        const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sport.toUpperCase().trim()}!C2:C2`,
        });

        let units = "0";
        if (res.data.values && res.data.values.length > 0 && res.data.values[0].length > 0) {
            units = res.data.values[0][0];
        }

        return NextResponse.json({ success: true, units });
    } catch (error: any) {
        console.error("Stats Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
