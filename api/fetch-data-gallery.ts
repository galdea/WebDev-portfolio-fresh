import * as cors from 'cors';
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

  const app = express();
  app.use(express.json());
  app.use(cors());

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

// Initialize the Express app
const app = express();
app.use(express.json());

// Define the async handler
const fetchDataGalleryHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
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
    res.status(200).json({ subfolders: rootFolder.subfolders });
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Wrap async handler properly to ensure Express works
app.get('/api/fetch-data-gallery', (req: Request, res: Response) => {
  return fetchDataGalleryHandler(req, res).catch((err) => {
    console.error('Unexpected error:', err);
    res.status(500).send('Unexpected server error');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
