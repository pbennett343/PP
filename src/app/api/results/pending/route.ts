import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SPORTS = ["MLB", "NFL", "NBA", "NHL", "NCAAF", "NCAAM", "WNBA"];

export async function GET() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = '1gcqU3MNEZJpAhqDAkeUBiZBp6Xz4s2_kJzn-1UP8z_o';

        let pending: any[] = [];

        const promises = SPORTS.map(async (sport) => {
            try {
                const res = await sheets.spreadsheets.values.get({
                    spreadsheetId,
                    range: `${sport}!A14:E`,
                });
                const rows = res.data.values || [];
                rows.forEach((row, index) => {
                    if (row[1] && row[1].trim() !== "" && (!row[4] || row[4].trim() === "")) {
                        pending.push({
                            tab: sport,
                            rowIdx: index + 14,
                            date: row[0] || "",
                            pick: row[1],
                            odds: row[2] || ""
                        });
                    }
                });
            } catch (e) {
                console.warn(`Failed to fetch tab ${sport}`);
            }
        });

        await Promise.all(promises);

        return NextResponse.json({ success: true, pending });
    } catch (error: any) {
        console.error("Pending Results Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
