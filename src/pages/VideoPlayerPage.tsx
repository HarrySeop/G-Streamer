import { useParams } from 'react-router-dom';
import { useGoogleDriveData } from '../hooks/useGoogleDriveData';
import { useSaveHistory } from '../hooks/useSaveHistory';
import VideoPlayer from '../components/VideoPlayer';
import { useCallback, useEffect, useRef } from 'react';

const VideoPlayerPage = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const { data: driveData, isSuccess } = useGoogleDriveData();
  const { mutate: saveHistory } = useSaveHistory();

  const historyDataRef = useRef(driveData?.history);
  const lastSaveTimeRef = useRef(Date.now());
  const playbackInfoRef = useRef({ time: 0, duration: 0 });

  useEffect(() => {
    historyDataRef.current = driveData?.history;
  }, [driveData?.history]);

  const saveCurrentHistory = useCallback(() => {
    if (!fileId || !isSuccess || !historyDataRef.current) return;

    const { time, duration } = playbackInfoRef.current;
    if (duration > 0 && time > 0) {
      const newHistory = {
        ...historyDataRef.current,
        updatedAt: new Date().toISOString(),
        history: {
          ...historyDataRef.current.history,
          [fileId]: {
            t: time,
            d: duration,
            w: new Date().toISOString(),
          },
        },
      };
      saveHistory(newHistory);
      lastSaveTimeRef.current = Date.now();
    }
  }, [fileId, saveHistory, isSuccess]);

  const handleTimeUpdate = useCallback((time: number, duration: number) => {
    playbackInfoRef.current = { time, duration };
    // Save every 15 seconds
    if (Date.now() - lastSaveTimeRef.current > 15000) {
      saveCurrentHistory();
    }
  }, [saveCurrentHistory]);

  useEffect(() => {
    // Save on unmount
    return () => {
      saveCurrentHistory();
    };
  }, [saveCurrentHistory]);

  if (!fileId) {
    return <div>Video not found.</div>;
  }

  const initialTime = driveData?.history.history[fileId]?.t;

  return (
    <div className="w-full">
      <VideoPlayer
        fileId={fileId}
        initialTime={initialTime}
        onTimeUpdate={handleTimeUpdate}
      />
      {/* TODO: Add video title and other details */}
    </div>
  );
};

export default VideoPlayerPage;
