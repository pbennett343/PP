const fs = require('fs');
const { google } = require('googleapis');

const envLocal = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envLocal.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)="?(.*?)"?$/);
  if (match) env[match[1]] = match[2];
});

async function run() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_CLIENT_EMAIL,
        private_key: (env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1gcqU3MNEZJpAhqDAkeUBiZBp6Xz4s2_kJzn-1UP8z_o';
    
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'MLB!A14', 
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [['2']] },
    });
    console.log("Success! Appended 2 to MLB!A14.");
  } catch (error) {
    console.error("Sheets Error:", error.message);
  }
}
run();
