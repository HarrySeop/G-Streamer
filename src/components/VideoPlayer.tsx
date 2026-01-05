import { useState, useRef, useEffect } from 'react';
import { gapi } from 'gapi-script';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  FastForward,
  Rewind,
} from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { cn } from '../lib/utils';

interface VideoPlayerProps {
  fileId: string;
  onTimeUpdate: (time: number, duration: number) => void;
  initialTime?: number;
}

const VideoPlayer = ({ fileId, onTimeUpdate, initialTime = 0 }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const videoSrc = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const accessToken = gapi.auth.getToken().access_token;

  useEffect(() => {
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setPlaying = () => setIsPlaying(true);
    const setPaused = () => setIsPlaying(false);

    video.addEventListener('play', setPlaying);
    video.addEventListener('pause', setPaused);

    video.currentTime = initialTime;
    if (initialTime > 0) {
      video.play();
    }

    return () => {
      video.removeEventListener('play', setPlaying);
      video.removeEventListener('pause', setPaused);
    };
  }, [initialTime]);
  
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      onTimeUpdate(videoRef.current.currentTime, videoRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleDoubleClick = (direction: 'forward' | 'backward') => {
    if (videoRef.current) {
      const newTime =
        direction === 'forward'
          ? videoRef.current.currentTime + 10
          : videoRef.current.currentTime - 10;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  };

  return (
    <div className="relative w-full aspect-video bg-black" onMouseMove={() => {
        setIsControlsVisible(true);
        if (controlsTimeout.current) {
          clearTimeout(controlsTimeout.current);
        }
        controlsTimeout.current = setTimeout(() => setIsControlsVisible(false), 3000);
    }}>
      <video
        ref={videoRef}
        className="w-full h-full"
        src={`${videoSrc}&access_token=${accessToken}`}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
        onClick={handlePlayPause}
        preload="auto"
      />
      <div className="absolute inset-0 flex">
        <div className="flex-1" onDoubleClick={() => handleDoubleClick('backward')}></div>
        <div className="flex-1" onDoubleClick={() => handleDoubleClick('forward')}></div>
      </div>
      <div className={cn("absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent transition-opacity", isControlsVisible ? 'opacity-100' : 'opacity-0')}>
        <div className="flex items-center gap-4 text-white">
          <Button variant="ghost" size="icon" onClick={handlePlayPause}>
            {isPlaying ? <Pause /> : <Play />}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}>
                <Rewind />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}>
                <FastForward />
            </Button>
          </div>
          <span className="text-sm">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <span className="text-sm">{formatTime(duration)}</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
                {isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => videoRef.current?.requestFullscreen()}>
            <Maximize />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
