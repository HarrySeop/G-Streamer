import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import type { DriveFile, HistoryData } from '../lib/googleDrive';

interface VideoCardProps {
  file: DriveFile;
  history?: HistoryData[string];
}

const VideoCard = ({ file, history }: VideoCardProps) => {
  const durationInSeconds = history?.d || (file.videoMediaMetadata?.durationMillis ? parseInt(file.videoMediaMetadata.durationMillis) / 1000 : 0);
  const progress = durationInSeconds > 0 && history?.t ? (history.t / durationInSeconds) * 100 : 0;

  return (
    <Link to={`/video/${file.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <img
            src={file.thumbnailLink}
            alt={file.name}
            className="w-full h-40 object-cover"
          />
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-base font-medium truncate">{file.name}</CardTitle>
        </CardContent>
        {progress > 0 && (
          <CardFooter className="p-4 pt-0">
            <Progress value={progress} className="w-full" />
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};

export default VideoCard;
