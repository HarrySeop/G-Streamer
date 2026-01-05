import { useGoogleDriveData } from '../hooks/useGoogleDriveData';
import VideoCard from '../components/VideoCard';
import VideoCardSkeleton from '../components/VideoCardSkeleton';

const DashboardPage = () => {
  const { data, isLoading, isError } = useGoogleDriveData();

  if (isError) {
    return (
      <div className="container mx-auto py-8 text-center text-red-500">
        Failed to load data from Google Drive.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <VideoCardSkeleton key={index} />
            ))
          : data?.files.map((file) => (
              <VideoCard
                key={file.id}
                file={file}
                history={data.history.history[file.id!]}
              />
            ))}
      </div>
    </div>
  );
};

export default DashboardPage;
