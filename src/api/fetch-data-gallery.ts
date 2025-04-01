import { Request, Response } from 'express';
import * as fs from 'fs/promises';
import { google } from 'googleapis';
import * as path from 'path';

interface File {
  id: string;
  name: string;
  mimeType: string;
  webContentLink?: string;
  thumbnailLink?: string; // Add this field
}

interface Subfolder {
  id: string;
  name: string;
  mimeType: string;
  files: File[];
  subfolders: Subfolder[];
}

interface DocumentsResponse {
  documents: Folder[];
  subfolders?: Subfolder[];
}

interface Folder {
  id: string;
  name: string;
  files: File[];
  subfolders: Subfolder[];
}

// Change to an export instead of default function
export const handler = async (
  req: Request,
  res: Response<DocumentsResponse | { error: string; details?: string }>,
) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const keyPath = path.join(process.cwd(), 'secrets.json');
    const keyFile = await fs.readFile(keyPath, 'utf-8');
    const key = JSON.parse(process.env.GOOGLE_CREDENTIALS!);

    const auth = new google.auth.GoogleAuth({
      credentials: key,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });
    // const folderId = '19gbsQehWmDAhDN0gqmJkGrjSyJ7ABXLh';
    const folderId = '19gbsQehWmDAhDN0gqmJkGrjSyJ7ABXLh';
    const rootFolder = await fetchFilesFromFolder(drive, folderId);

    // Log the organized folder structure in the console
    console.log(JSON.stringify(rootFolder, null, 2));

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      documents: [], // If there are documents to return, modify this accordingly
      subfolders: rootFolder.subfolders,
    });
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

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
      // Add both thumbnailLink and webContentLink for images
      subfolder.files.push({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        thumbnailLink: `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`,
        webContentLink: `https://drive.google.com/uc?id=${file.id}`,
      });
    }
  }

  return subfolder;
}

// Export default for compatibility
export default handler;
