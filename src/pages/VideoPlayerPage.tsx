import { useParams } from 'react-router-dom';
import { useGoogleDriveData } from '../hooks/useGoogleDriveData';
import VideoPlayer from '../components/VideoPlayer';

const VideoPlayerPage = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const { data: driveData } = useGoogleDriveData();

  if (!fileId) {
    return <div>Video not found.</div>;
  }

  const history = driveData?.history.history[fileId];

  const handleTimeUpdate = (time: number, duration: number) => {
    // This is where we will save the history
    console.log({ fileId, time, duration });
  };

  return (
    <div className="w-full">
      <VideoPlayer
        fileId={fileId}
        initialTime={history?.t}
        onTimeUpdate={handleTimeUpdate}
      />
      {/* TODO: Add video title and other details */}
    </div>
  );
};

export default VideoPlayerPage;
