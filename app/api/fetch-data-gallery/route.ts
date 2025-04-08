import { google } from 'googleapis';
import { NextResponse } from 'next/server';

interface File {
  id: string;
  name: string;
  mimeType: string;
  webContentLink?: string;
}

interface Subfolder {
  id: string;
  name: string;
  mimeType: string;
  files: File[];
  subfolders: Subfolder[];
}

async function fetchFilesFromFolder(
  drive: any,
  folderId: string,
): Promise<Subfolder> {
  const folderDetails = await drive.files.get({
    fileId: folderId,
    fields: 'id, name, mimeType',
  });

  const subfolder: Subfolder = {
    id: folderDetails.data.id,
    name: folderDetails.data.name || 'Unnamed Folder',
    mimeType: folderDetails.data.mimeType,
    files: [],
    subfolders: [],
  };

  const files = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType)',
  });

  for (const file of files.data.files || []) {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      const nestedSubfolder = await fetchFilesFromFolder(drive, file.id);
      subfolder.subfolders.push(nestedSubfolder);
    } else if (file.mimeType.startsWith('image/')) {
      subfolder.files.push({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        webContentLink: `https://drive.google.com/thumbnail?id=${file.id}`,
      });
    }
  }

  return subfolder;
}

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId) {
      throw new Error('Google Drive folder ID not configured');
    }

    const rootFolder = await fetchFilesFromFolder(drive, folderId);

    return NextResponse.json(
      { subfolders: rootFolder.subfolders },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    console.error('Error in API handler:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
