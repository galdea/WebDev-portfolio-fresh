import * as express from 'express';
import { Request, Response } from 'express';
import * as fs from 'fs/promises';
import { google } from 'googleapis';
import * as path from 'path';

interface File {
  id: string;
  name: string;
  mimeType: string;
  webContentLink?: string;
}

interface Subfolder {
  id: string;
  name: string;
  mimeType: string; // Required property
  files: File[];
  subfolders: Subfolder[];
}

interface Folder {
  id: string;
  name: string;
  files: File[];
  subfolders: Subfolder[];
}

const app = express();

app.get('/documents', async (req: Request, res: Response) => {
  try {
    const keyPath = path.join(process.cwd(), 'secrets.json');
    const keyFile = await fs.readFile(keyPath, 'utf-8');
    const key = JSON.parse(keyFile);

    const auth = new google.auth.GoogleAuth({
      credentials: key,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });
    const folderId = '19gbsQehWmDAhDN0gqmJkGrjSyJ7ABXLh';
    const rootFolder = await fetchFilesFromFolder(drive, folderId);

    res.setHeader('Cache-Control', 'no-store');
    return res
      .status(200)
      .json({ documents: [], subfolders: rootFolder.subfolders });
  } catch (error) {
    console.error('Error in API handler:', error);
    return res.status(500).json({
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

async function fetchFilesFromFolder(
  drive: any,
  folderId: string,
): Promise<Subfolder> {
  // Change return type to Subfolder
  const folderDetails = await drive.files.get({
    fileId: folderId,
    fields: 'id, name, mimeType',
  });

  const subfolder: Subfolder = {
    id: folderDetails.data.id,
    name: folderDetails.data.name || 'Unnamed Folder',
    mimeType: folderDetails.data.mimeType, // MimeType is required for Subfolder
    files: [],
    subfolders: [],
  };

  const files = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType)',
  });

  for (const file of files.data.files || []) {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      const nestedSubfolder = await fetchFilesFromFolder(drive, file.id); // Recursively fetch subfolders
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

  return subfolder; // Always return a Subfolder object
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
