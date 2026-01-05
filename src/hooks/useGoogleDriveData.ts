import { useQuery } from '@tanstack/react-query';
import { listVideoFiles, readHistoryFile, DriveFile, HistoryFile } from '../lib/googleDrive';

export const useGoogleDriveData = () => {
  return useQuery({
    queryKey: ['googleDriveData'],
    queryFn: async (): Promise<{ files: DriveFile[]; history: HistoryFile }> => {
      const [files, history] = await Promise.all([
        listVideoFiles(),
        readHistoryFile(),
      ]);
      return { files, history };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
