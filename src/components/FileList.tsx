import React from 'react';
import { List, ListItem, ListItemText, IconButton, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface FileListProps {
  files: File[];
  onDelete: (index: number) => void;
  title: string;
}

export const FileList: React.FC<FileListProps> = ({ files, onDelete, title }) => {
  if (!files.length) return null;

  return (
    <Paper sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <List>
        {files.map((file, index) => (
          <ListItem
            key={`${file.name}-${index}`}
            secondaryAction={
              <IconButton edge="end" onClick={() => onDelete(index)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};