// server.js
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint for gallery data
app.get('/api/fetch-data-gallery', async (req, res) => {
  try {
    const keyPath = path.join(__dirname, 'secrets.json');
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
    res.status(200).json({
      documents: [],
      subfolders: rootFolder.subfolders,
    });
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

async function fetchFilesFromFolder(drive, folderId) {
  const folderDetails = await drive.files.get({
    fileId: folderId,
    fields: 'id, name, mimeType',
  });

  const subfolder = {
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
        thumbnailLink: `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`,
        webContentLink: `https://drive.google.com/uc?id=${file.id}`,
      });
    }
  }

  return subfolder;
}

// For any other routes, serve the Vite app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
