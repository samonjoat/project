import React from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface ColumnMapping {
  sourceColumn: string;
  targetColumn: string;
}

interface FileMapping {
  fileName: string;
  nameColumn: string;
  headerRow: number;
  columnMappings: ColumnMapping[];
}

interface ColumnMappingProps {
  files: File[];
  masterColumns: string[];
  mappings: Record<string, FileMapping>;
  onMappingChange: (fileName: string, mapping: FileMapping) => void;
}

export const ColumnMapping: React.FC<ColumnMappingProps> = ({
  files,
  masterColumns,
  mappings,
  onMappingChange,
}) => {
  const handleMappingChange = (fileName: string, field: keyof FileMapping, value: any) => {
    const currentMapping = mappings[fileName] || {
      fileName,
      nameColumn: '',
      headerRow: 1,
      columnMappings: [],
    };

    const updatedMapping = {
      ...currentMapping,
      [field]: value,
    };

    onMappingChange(fileName, updatedMapping);
  };

  const handleAddMapping = (fileName: string) => {
    const currentMapping = mappings[fileName];
    if (!currentMapping) return;

    const updatedMappings = [...currentMapping.columnMappings, { sourceColumn: '', targetColumn: '' }];
    handleMappingChange(fileName, 'columnMappings', updatedMappings);
  };

  const handleRemoveMapping = (fileName: string, index: number) => {
    const currentMapping = mappings[fileName];
    if (!currentMapping) return;

    const updatedMappings = currentMapping.columnMappings.filter((_, i) => i !== index);
    handleMappingChange(fileName, 'columnMappings', updatedMappings);
  };

  const handleColumnMappingChange = (
    fileName: string,
    index: number,
    field: 'sourceColumn' | 'targetColumn',
    value: string
  ) => {
    const currentMapping = mappings[fileName];
    if (!currentMapping) return;

    const updatedMappings = [...currentMapping.columnMappings];
    updatedMappings[index] = {
      ...updatedMappings[index],
      [field]: value,
    };

    handleMappingChange(fileName, 'columnMappings', updatedMappings);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Column Mapping Configuration
      </Typography>
      {files.map((file) => (
        <Accordion key={file.name} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{file.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Header Row Number"
                  type="number"
                  value={mappings[file.name]?.headerRow || 1}
                  onChange={(e) =>
                    handleMappingChange(file.name, 'headerRow', parseInt(e.target.value))
                  }
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Name Column</InputLabel>
                  <Select
                    value={mappings[file.name]?.nameColumn || ''}
                    onChange={(e) => handleMappingChange(file.name, 'nameColumn', e.target.value)}
                    label="Name Column"
                  >
                    {masterColumns.map((column) => (
                      <MenuItem key={column} value={column}>
                        {column}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">Column Mappings</Typography>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleAddMapping(file.name)}
                    size="small"
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                {(mappings[file.name]?.columnMappings || []).map((mapping, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                    <TextField
                      label="Source Column"
                      value={mapping.sourceColumn}
                      onChange={(e) =>
                        handleColumnMappingChange(file.name, index, 'sourceColumn', e.target.value)
                      }
                      fullWidth
                    />
                    <FormControl fullWidth>
                      <InputLabel>Target Column</InputLabel>
                      <Select
                        value={mapping.targetColumn}
                        onChange={(e) =>
                          handleColumnMappingChange(file.name, index, 'targetColumn', e.target.value)
                        }
                        label="Target Column"
                      >
                        {masterColumns.map((column) => (
                          <MenuItem key={column} value={column}>
                            {column}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveMapping(file.name, index)}
                      size="small"
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};