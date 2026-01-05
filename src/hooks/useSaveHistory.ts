import { useMutation, useQueryClient } from '@tanstack/react-query';
import { writeHistoryFile, type HistoryFile } from '../lib/googleDrive';

export const useSaveHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (history: HistoryFile) => writeHistoryFile(history),
    onSuccess: () => {
      // Invalidate and refetch the googleDriveData query to get the fresh history
      queryClient.invalidateQueries({ queryKey: ['googleDriveData'] });
    },
  });
};
