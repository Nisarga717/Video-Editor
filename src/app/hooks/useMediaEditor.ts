import { useState, useCallback } from 'react';

export default function useMediaEditor() {
  const [mediaFile, setMediaFile] = useState<{
    file: File | null;
    type: 'image' | 'video' | null;
    url: string | null;
  } | null>(null);

  const [dimensions, setDimensions] = useState({
    width: 640,
    height: 480
  });

  const [timeConfig, setTimeConfig] = useState({
    startTime: 0,
    endTime: 30
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const handleMediaUpload = useCallback((file: File | null) => {
    if (file) {
      setMediaFile({
        file,
        type: file.type.startsWith('image') ? 'image' : 'video',
        url: URL.createObjectURL(file)
      });
    }
  }, []);

  const updateDimensions = useCallback((type: 'width' | 'height', value: number) => {
    setDimensions(prev => ({
      ...prev,
      [type]: Math.max(50, Math.min(value, 1920))
    }));
  }, []);

  const updateTimeConfig = useCallback((
    configOrType: Partial<{startTime: number, endTime: number}> | 'startTime' | 'endTime', 
    value?: number
  ) => {
    setTimeConfig(prev => {
      // If passed an object, merge it with existing config
      if (typeof configOrType === 'object') {
        const newConfig = { ...prev, ...configOrType };
        
        // Ensure startTime doesn't exceed endTime
        if (configOrType.startTime !== undefined && configOrType.startTime > newConfig.endTime) {
          newConfig.endTime = configOrType.startTime + 10;
        }

        // Ensure endTime isn't less than startTime
        if (configOrType.endTime !== undefined && configOrType.endTime < newConfig.startTime) {
          newConfig.startTime = Math.max(0, configOrType.endTime - 10);
        }

        return newConfig;
      }
      
      // If passed type and value, update specific time config
      if (value !== undefined) {
        const newConfig = { ...prev, [configOrType]: value };

        if (configOrType === 'startTime' && value > prev.endTime) {
          newConfig.endTime = value + 10;
        }

        if (configOrType === 'endTime' && value < prev.startTime) {
          newConfig.startTime = Math.max(0, value - 10);
        }

        return newConfig;
      }

      // Fallback to previous config if no valid arguments
      return prev;
    });
  }, []);

  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const resetEditor = useCallback(() => {
    setMediaFile(null);
    setDimensions({ width: 640, height: 480 });
    setTimeConfig({ startTime: 0, endTime: 30 });
    setIsPlaying(false);
  }, []);

  return {
    mediaFile,
    dimensions,
    timeConfig,
    isPlaying,
    handleMediaUpload,
    updateDimensions,
    updateTimeConfig,
    togglePlayback,
    resetEditor
  };
}