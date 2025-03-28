'use client';

import { Container, Grid, Button, Group, ActionIcon, Card, ThemeIcon } from '@mantine/core';
import { LeftSidebar } from '../components/leftSidebar';
import { MediaCanvas } from '../components/MediaCanvas';
import useMediaEditor from '../hooks/useMediaEditor';
import { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Scissors, Upload } from 'lucide-react';

export default function VideoEditor() {
  const {
    mediaFile,
    dimensions,
    timeConfig,
    handleMediaUpload,
    updateDimensions,
    updateTimeConfig,
    resetEditor
  } = useMediaEditor();

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMediaPlaying, setIsMediaPlaying] = useState(false);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      updateTimeConfig({
        startTime: 0,
        endTime: videoDuration
      });
    }
  };

  const toggleMainPlayPause = () => {
    if (videoRef.current) {
      if (isMediaPlaying) {
        videoRef.current.pause();
        setIsMediaPlaying(false);
      } else {
        if (currentTime >= timeConfig.endTime) {
          videoRef.current.currentTime = timeConfig.startTime;
          setCurrentTime(timeConfig.startTime);
        }
        videoRef.current.play();
        setIsMediaPlaying(true);
      }
    }
  };

  const handleReset = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeConfig.startTime;
      setCurrentTime(timeConfig.startTime);
      setIsMediaPlaying(false);
      resetEditor();
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);

      if (videoElement.currentTime >= timeConfig.endTime) {
        videoElement.pause();
        setIsMediaPlaying(false);
      }
    };

    const handlePlay = () => {
      setIsMediaPlaying(true);
    };

    const handlePause = () => {
      setIsMediaPlaying(false);
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [timeConfig.endTime]);

  return (
    <Container fluid className="bg-gray-50 h-screen p-4">
      <Grid>
        <Grid.Col span={3}>
          <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full">
            <Card.Section p="md" className="border-b">
              <Button 
                fullWidth 
                variant="light" 
                leftSection={<Upload size={14} />}
                onClick={triggerFileUpload}
              >
                Upload Media
              </Button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                onChange={(event) => {
                  const file = event.target.files ? event.target.files[0] : null;
                  handleMediaUpload(file);
                }}
              />
            </Card.Section>
            
            <Card.Section p="md">
              <LeftSidebar
                onMediaUpload={handleMediaUpload}
                dimensions={dimensions}
                timeConfig={timeConfig}
                onDimensionChange={updateDimensions}
                onTimeConfigChange={updateTimeConfig}
              />
            </Card.Section>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={9}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {mediaFile && mediaFile.type === 'video' && (
              <video
                ref={videoRef}
                src={mediaFile.url}
                style={{ display: 'none' }}
                onLoadedMetadata={handleLoadedMetadata}
              />
            )}
            
            <MediaCanvas
              mediaFile={mediaFile}
              dimensions={dimensions}
              isPlaying={isMediaPlaying}
              startTime={timeConfig.startTime}
              endTime={timeConfig.endTime}
            />
            
            <Group justify="center" mt="md" align="center" gap="md">
              <ThemeIcon 
                variant="light" 
                size="xl" 
                radius="xl" 
                onClick={handleReset}
              >
                <RotateCcw size={20} />
              </ThemeIcon>

              <ActionIcon 
                variant="filled" 
                size="xl" 
                radius="xl" 
                onClick={toggleMainPlayPause}
              >
                {isMediaPlaying ? <Pause size={24} /> : <Play size={24} />}
              </ActionIcon>

              <ThemeIcon 
                variant="light" 
                size="xl" 
                radius="xl"
                onClick={() => console.log('Edit tools')}
              >
                <Scissors size={20} />
              </ThemeIcon>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}