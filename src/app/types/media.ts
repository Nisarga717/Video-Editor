export interface MediaFile {
  file: File | null;
  type: 'image' | 'video';
  url: string;
}

export interface DimensionsConfig {
  width: number;
  height: number;
}

export interface TimeConfig {
  startTime: number;
  endTime: number;
}

export const validateMediaFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
  return allowedTypes.includes(file.type) && file.size < 50 * 1024 * 1024;
};

export const createObjectURL = (file: File): string => {
  return file ? URL.createObjectURL(file) : '';
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};