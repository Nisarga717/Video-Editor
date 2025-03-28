import React from 'react';
import { 
  FileInput, 
  NumberInput, 
  Stack, 
  Card, 
  Title 
} from '@mantine/core';

interface LeftSidebarProps {
  onMediaUpload: (file: File | null) => void;
  dimensions: { width: number; height: number };
  timeConfig: { startTime: number; endTime: number };
  onDimensionChange: (type: 'width' | 'height', value: number) => void;
  onTimeConfigChange: (type: 'startTime' | 'endTime', value: number) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onMediaUpload,
  dimensions,
  timeConfig,
  onDimensionChange,
  onTimeConfigChange
}) => {
  const handleWidthChange = (value: number | string) => {
    const numValue = Number(value);
    onDimensionChange('width', isNaN(numValue) ? 640 : numValue);
  };

  const handleHeightChange = (value: number | string) => {
    const numValue = Number(value);
    onDimensionChange('height', isNaN(numValue) ? 480 : numValue);
  };

  const handleStartTimeChange = (value: number | string) => {
    const numValue = Number(value);
    onTimeConfigChange('startTime', isNaN(numValue) ? 0 : numValue);
  };

  const handleEndTimeChange = (value: number | string) => {
    const numValue = Number(value);
    onTimeConfigChange('endTime', isNaN(numValue) ? 30 : numValue);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={4}>Media Settings</Title>
        
        <FileInput 
          label="Upload Media" 
          placeholder="Select video or image"
          accept="image/*, video/*"
          onChange={onMediaUpload}
        />
        
        <NumberInput
          label="Width"
          value={dimensions.width}
          onChange={handleWidthChange}
          min={50}
          max={1920}
        />
        
        <NumberInput
          label="Height"
          value={dimensions.height}
          onChange={handleHeightChange}
          min={50}
          max={1080}
        />
        
        <NumberInput
          label="Start Time (seconds)"
          value={timeConfig.startTime}
          onChange={handleStartTimeChange}
          min={0}
        />
        
        <NumberInput
          label="End Time (seconds)"
          value={timeConfig.endTime}
          onChange={handleEndTimeChange}
          min={0}
        />
      </Stack>
    </Card>
  );
};