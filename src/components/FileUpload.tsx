import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Paper, Typography, Box, CircularProgress, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green } from '@mui/material/colors';

interface FileUploadProps {
  onDrop: (files: File[]) => void;
  accept?: string[];
  multiple?: boolean;
  title: string;
  onUploadComplete?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onDrop, 
  accept = ['.xlsx', '.xls'], 
  multiple = false,
  title,
  onUploadComplete
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleDrop = async (acceptedFiles: File[]) => {
    setIsUploading(true);
    setUploadComplete(false);

    try {
      // Simulate upload delay for better UX
      await new Promise(resolve => setTimeout(resolve, 3000));
      await onDrop(acceptedFiles);
      
      // Show success state for a few seconds
      setUploadComplete(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: accept.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    multiple,
    disabled: isUploading
  });

  return (
    <Paper
      {...getRootProps()}
      sx={{
        p: 3,
        mb: 2,
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'grey.300',
        bgcolor: isDragActive ? 'action.hover' : 'background.paper',
        cursor: isUploading ? 'default' : 'pointer',
        opacity: isUploading ? 0.7 : 1
      }}
    >
      <input {...getInputProps()} />
      <Box display="flex" flexDirection="column" alignItems="center">
        {isUploading ? (
          <CircularProgress sx={{ mb: 2 }} />
        ) : uploadComplete ? (
          <CheckCircleIcon sx={{ fontSize: 48, mb: 2, color: green[500] }} />
        ) : (
          <CloudUploadIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
        )}
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {isUploading 
            ? 'Processing file...' 
            : uploadComplete
            ? 'Upload complete!'
            : 'Drag & drop files here, or click to select'}
        </Typography>
      </Box>
    </Paper>
  );
};