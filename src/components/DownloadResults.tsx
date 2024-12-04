import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon 
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface DownloadResultsProps {
  logs: string[];
  onDownloadMaster: () => void;
  onDownloadLogs: () => void;
}

export const DownloadResults: React.FC<DownloadResultsProps> = ({
  logs,
  onDownloadMaster,
  onDownloadLogs
}) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Processing Complete
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
          <Typography variant="h6">
            Files Processed Successfully
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={onDownloadMaster}
          >
            Download Updated Master Sheet
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArticleIcon />}
            onClick={onDownloadLogs}
          >
            Download Processing Logs
          </Button>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Processing Logs:
        </Typography>
        <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto', p: 2 }}>
          <List dense>
            {logs.map((log, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <ArticleIcon color="action" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={log} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Paper>
    </Box>
  );
};