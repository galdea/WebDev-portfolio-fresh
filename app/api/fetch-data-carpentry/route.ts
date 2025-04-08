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

const FOLDER_ID = '1Nk7OGQTwOXBhq5fgjcvDrzSVcg8vY5xt';

async function fetchFilesFromFolder(
  drive: any,
  folderId: string,
): Promise<Subfolder> {
  try {
    console.log('Fetching folder details for ID:', folderId);
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

    console.log('Fetching files for folder:', folderDetails.data.name);
    const files = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)',
    });

    console.log(
      `Found ${files.data.files?.length || 0} files in folder ${
        folderDetails.data.name
      }`,
    );

    for (const file of files.data.files || []) {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        console.log('Processing subfolder:', file.name);
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
  } catch (error) {
    console.error('Error in fetchFilesFromFolder:', error);
    throw error;
  }
}

export async function GET() {
  try {
    console.log('Starting API request...');

    // Check environment variables
    if (
      !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY
    ) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        {
          error: 'Configuration error',
          details: 'Missing Google API credentials',
        },
        { status: 500 },
      );
    }

    console.log('Initializing Google Auth...');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    console.log('Creating Drive client...');
    const drive = google.drive({ version: 'v3', auth });

    console.log('Fetching root folder...');
    const rootFolder = await fetchFilesFromFolder(drive, FOLDER_ID);

    console.log('Successfully fetched data, returning response...');
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
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
    return NextResponse.json(
      {
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
