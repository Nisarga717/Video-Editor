import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface MediaFile {
  type: 'video' | 'image';
  url: string;
}

interface MediaCanvasProps {
  mediaFile: MediaFile | null;
  dimensions: { width: number; height: number };
  isPlaying: boolean;
  startTime: number;
  endTime: number;
  onResize?: (width: number, height: number) => void;
}

export const MediaCanvas: React.FC<MediaCanvasProps> = ({
  mediaFile, 
  dimensions, 
  isPlaying,
  startTime,
  endTime,
  onResize
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [currentSize, setCurrentSize] = useState(dimensions);
  const playStateRef = useRef<{
    shouldBePlaying: boolean;
    playPromise: Promise<void> | null;
  }>({
    shouldBePlaying: false,
    playPromise: null
  });

  const managePLayback = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement || mediaFile?.type !== 'video') return;

    // Cancel any existing play promise
    const cancelExistingPromise = async () => {
      if (playStateRef.current.playPromise) {
        try {
          await playStateRef.current.playPromise;
        } catch {
          // Ignore cancellation errors
        }
      }
    };

    const executePlayback = async () => {
      // Cancel any existing promises
      await cancelExistingPromise();

      // Reset play state
      playStateRef.current.shouldBePlaying = isPlaying;
      
      // Set start time
      videoElement.currentTime = startTime;

      try {
        // Pause first to reset any pending play state
        videoElement.pause();

        // Wait a brief moment to ensure pause is processed
        await new Promise(resolve => setTimeout(resolve, 0));

        // Play if should be playing
        if (isPlaying) {
          playStateRef.current.playPromise = videoElement.play();
          await playStateRef.current.playPromise;
        }
      } catch (error) {
        console.error('Playback management error:', error);
      } finally {
        // Clear the play promise
        playStateRef.current.playPromise = null;
      }
    };

    // Execute playback
    executePlayback();
  }, [isPlaying, startTime, mediaFile]);

  // Effect to manage video playback
  useEffect(() => {
    if (!mediaFile || mediaFile.type !== 'video') return;

    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Manage time constraints
    const handleTimeUpdate = () => {
      if (videoElement.currentTime >= endTime) {
        videoElement.pause();
      }
    };

    // Add time update listener
    videoElement.addEventListener('timeupdate', handleTimeUpdate);

    // Manage playback
    managePLayback();

    // Cleanup
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [mediaFile, isPlaying, startTime, endTime, managePLayback]);

  // Update current size when dimensions prop changes
  useEffect(() => {
    setCurrentSize(dimensions);
  }, [dimensions]);

  const handleResize = (event: any, { size }: { size: { width: number; height: number } }) => {
    const constrainedWidth = Math.max(50, Math.min(size.width, 1920));
    const constrainedHeight = Math.max(50, Math.min(size.height, 1080));

    setCurrentSize({ width: constrainedWidth, height: constrainedHeight });
    onResize?.(constrainedWidth, constrainedHeight);
  };

  if (!mediaFile?.url) return null;

  return (
    <ResizableBox
      width={currentSize.width}
      height={currentSize.height}
      onResize={handleResize}
      minConstraints={[50, 50]}
      maxConstraints={[1920, 1080]}
    >
      <div 
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          border: '2px solid #ccc',
          overflow: 'hidden'
        }}
      >
        {mediaFile.type === 'video' ? (
          <video
            ref={videoRef}
            src={mediaFile.url}
            width="100%"
            height="100%"
            style={{ 
              objectFit: 'contain',
              backgroundColor: '#000' // Added black background for better visibility
            }}
            controlsList="nodownload"
          />
        ) : (
          <img
            ref={imageRef}
            src={mediaFile.url}
            alt="Uploaded media"
            width="100%"
            height="100%"
            style={{ 
              objectFit: 'contain',
              backgroundColor: '#f0f0f0' // Added light background for images
            }}
          />
        )}
      </div>
    </ResizableBox>
  );
};

export default MediaCanvas;