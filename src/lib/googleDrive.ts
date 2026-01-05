/// <reference types="gapi.client.drive-v3" />

import { gapi } from 'gapi-script';

export interface DriveFile extends gapi.client.drive.File {
  videoMediaMetadata?: {
    width?: number;
    height?: number;
    durationMillis?: string;
  };
}

export interface HistoryData {
  [fileId: string]: {
    t: number; // currentTime
    d: number; // duration
    w: string; // lastWatched
  };
}

export interface HistoryFile {
  updatedAt: string;
  history: HistoryData;
}

const HISTORY_FILE_NAME = 'g-streamer-history.json';

/**
 * Lists video files from Google Drive.
 */
export const listVideoFiles = async (): Promise<DriveFile[]> => {
  const response = await gapi.client.drive.files.list({
    pageSize: 100,
    fields: 'nextPageToken, files(id, name, thumbnailLink, videoMediaMetadata)',
    q: "mimeType contains 'video/' and trashed = false",
  });

  return response.result.files as DriveFile[] || [];
};

/**
 * Gets the ID of the history file.
 */
const getHistoryFileId = async (): Promise<string | null> => {
  const response = await gapi.client.drive.files.list({
    q: `name='${HISTORY_FILE_NAME}' and trashed = false`,
    fields: 'files(id)',
    spaces: 'appDataFolder',
  });

  if (response.result.files && response.result.files.length > 0) {
    return response.result.files[0].id || null;
  }
  return null;
};

/**
 * Reads the history file from the appDataFolder.
 */
export const readHistoryFile = async (): Promise<HistoryFile> => {
  const fileId = await getHistoryFileId();
  if (!fileId) {
    return { updatedAt: new Date().toISOString(), history: {} };
  }

  const response = await gapi.client.drive.files.get({
    fileId: fileId,
    alt: 'media',
  });

  return response.result as HistoryFile;
};

/**
 * Writes the history file to the appDataFolder.
 */
export const writeHistoryFile = async (data: HistoryFile): Promise<void> => {
  const fileId = await getHistoryFileId();
  const metadata = {
    name: HISTORY_FILE_NAME,
    mimeType: 'application/json',
    parents: fileId ? undefined : ['appDataFolder'],
  };

  const file = new Blob([JSON.stringify(data)], { type: 'application/json' });

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);
  
  const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files${fileId ? `/${fileId}` : ''}?uploadType=multipart`;

  await fetch(uploadUrl, {
    method: fileId ? 'PATCH' : 'POST',
    headers: {
      Authorization: `Bearer ${gapi.auth.getToken().access_token}`,
    },
    body: form,
  });
};
