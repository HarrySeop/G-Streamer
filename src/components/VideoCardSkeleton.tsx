import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

const VideoCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="w-full h-40" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4" />
      </CardContent>
    </Card>
  );
};

export default VideoCardSkeleton;
