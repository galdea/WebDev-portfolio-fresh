import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Starting gallery API request...');

    if (!process.env.GOOGLE_DRIVE_FOLDER_ID_GENERATIVEAI) {
      console.error(
        'Missing GOOGLE_DRIVE_FOLDER_ID_GENERATIVEAI environment variable',
      );
      return NextResponse.json(
        { error: 'Missing folder ID configuration' },
        { status: 500 },
      );
    }

    if (
      !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY
    ) {
      console.error('Missing Google API credentials');
      return NextResponse.json(
        { error: 'Missing Google API credentials' },
        { status: 500 },
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(
          /\\n/g,
          '\n',
        ).replace(/"/g, ''),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID_GENERATIVEAI;

    console.log('Fetching folder details for ID:', folderId);
    const folderDetails = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, mimeType',
    });

    console.log('Fetching files and subfolders from the folder...');
    const files = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, mimeType)',
    });

    console.log('Total files found:', files.data.files?.length || 0);

    const imageFiles = (files.data.files || []).filter((file: any) =>
      file.mimeType.startsWith('image/'),
    );

    console.log('Image files found:', imageFiles.length);

    // Check for subfolders within the folder
    const subfolders = (files.data.files || []).filter(
      (file: any) => file.mimeType === 'application/vnd.google-apps.folder',
    );

    console.log('Subfolders found:', subfolders.length);

    const formattedSubfolders = await Promise.all(
      subfolders.map(async (subfolder: any) => {
        const subfolderFiles = await drive.files.list({
          q: `'${subfolder.id}' in parents and trashed = false`,
          fields: 'files(id, name, mimeType)',
        });

        const imageFilesInSubfolder = (subfolderFiles.data.files || []).filter(
          (file: any) => file.mimeType.startsWith('image/'),
        );

        return {
          id: subfolder.id,
          name: subfolder.name,
          files: imageFilesInSubfolder.map((file: any) => ({
            id: file.id,
            name: file.name,
            thumbnailLink: `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`,
            webContentLink: `https://lh3.googleusercontent.com/d/${file.id}`,
          })),
        };
      }),
    );

    const responseData = {
      mainFolder: {
        id: folderDetails.data.id,
        name: folderDetails.data.name || 'Unnamed Folder',
        files: imageFiles.map((file: any) => ({
          id: file.id,
          name: file.name,
          thumbnailLink: `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`,
          webContentLink: `https://lh3.googleusercontent.com/d/${file.id}`,
        })),
      },
      subfolders: formattedSubfolders,
    };

    console.log('Successfully fetched data, returning response');
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in gallery API handler:', error);
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
