import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Note: In a real Next.js project, you would import these types from 'next'
// import type { NextApiRequest, NextApiResponse } from 'next';

// Mocking Next.js types for this standalone TS file context if 'next' isn't installed in the preview environment
type NextApiRequest = any;
type NextApiResponse = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Initialize Auth
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // 2. Load the Document
    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID as string,
      serviceAccountAuth
    );

    await doc.loadInfo();
    
    // Target sheet "2025" with fallback
    let sheet = doc.sheetsByTitle['2025'];
    if (!sheet) {
      console.warn('Sheet "2025" not found, falling back to index 0');
      sheet = doc.sheetsByIndex[0];
    }

    // 3. Handle Requests
    if (req.method === 'POST') {
      // NOW accepting 'date' and 'oc' from the client side
      const { name, message, date, oc } = req.body;

      if (!name || !message) {
        return res.status(400).json({ error: 'Name and message are required' });
      }

      // Map to lowercase headers strictly: date, name, message, oc
      const newRow = {
        name: name,
        message: message,
        date: date || new Date().toLocaleString(), // Use client date or fallback, do not auto-generate new timestamp
        oc: oc || '',
      };

      await sheet.addRow(newRow);
      return res.status(200).json({ status: 'success' });
    } 
    
    if (req.method === 'GET') {
      const rows = await sheet.getRows();
      
      const entries = rows.map((row) => ({
        name: row.get('name'),
        message: row.get('message'),
        date: row.get('date'),
        oc: row.get('oc'), // Retrieve the new column
      }));

      // Return most recent first
      return res.status(200).json(entries.reverse());
    }

  } catch (error: any) {
    console.error('Google Sheets API Error:', error);
    return res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
}