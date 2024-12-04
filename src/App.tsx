import React from 'react';
import { Container, Typography, Alert, Box } from '@mui/material';
import { FileUpload } from './components/FileUpload';
import { FileList } from './components/FileList';
import { ColumnMapping } from './components/ColumnMapping';
import { Steps } from './components/Steps';
import { NavigationButtons } from './components/NavigationButtons';
import { DownloadResults } from './components/DownloadResults';
import { useStore } from './store/useStore';
import { uploadFile, processFiles } from './services/api';
import { downloadFile, formatLogs } from './utils/downloadUtils';

function App() {
  const store = useStore();
  const [error, setError] = React.useState('');

  const handleMasterFileUpload = async (files: File[]) => {
    const file = files[0];
    setError('');
    
    try {
      store.setMasterFile(file);
      const data = await uploadFile(file);
      store.setMasterColumns(data.columns);
      store.addProcessingLog(`Master file "${file.name}" uploaded successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error processing master file';
      setError(errorMessage);
      store.setMasterFile(null);
      store.setMasterColumns([]);
    }
  };

  const handleSalesforceFilesUpload = async (files: File[]) => {
    setError('');
    
    try {
      const currentFiles = [...store.salesforceFiles, ...files];
      store.setSalesforceFiles(currentFiles);
      const data = await uploadFile(files[0]);
      store.setSourceColumns(data.columns);
      files.forEach(file => {
        store.addProcessingLog(`Salesforce file "${file.name}" uploaded successfully`);
      });
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error processing Salesforce files';
      setError(errorMessage);
    }
  };

  const handleDeleteFile = (index: number, type: 'master' | 'salesforce') => {
    if (type === 'master') {
      store.setMasterFile(null);
      store.setMasterColumns([]);
      store.addProcessingLog('Master file removed');
    } else {
      const newFiles = [...store.salesforceFiles];
      const removedFile = newFiles[index];
      newFiles.splice(index, 1);
      store.setSalesforceFiles(newFiles);
      store.addProcessingLog(`Salesforce file "${removedFile.name}" removed`);
    }
  };

  const handleProcess = async () => {
    setError('');
    store.clearLogs();
    
    try {
      await processFiles(store.masterFile!, store.salesforceFiles, store.columnMapping);
      store.addProcessingLog('File processing completed successfully');
      store.setActiveStep(4); // Move to download step
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error processing files';
      setError(errorMessage);
      store.addProcessingLog(`Error: ${errorMessage}`);
    }
  };

  const handleDownloadMaster = () => {
    if (store.masterFile) {
      downloadFile(store.masterFile, 'updated_master_sheet.xlsx');
      store.addProcessingLog('Updated master sheet downloaded');
    }
  };

  const handleDownloadLogs = () => {
    const logContent = formatLogs(store.processingLogs);
    downloadFile(logContent, 'processing_logs.txt');
  };

  const handleBack = () => {
    store.setActiveStep(Math.max(0, store.activeStep - 1));
  };

  const handleNext = () => {
    if (store.activeStep === 3) {
      handleProcess();
    } else {
      store.setActiveStep(Math.min(4, store.activeStep + 1));
    }
  };

  const isNextDisabled = () => {
    switch (store.activeStep) {
      case 0:
        return !store.masterFile;
      case 1:
        return store.salesforceFiles.length === 0;
      case 2:
        return Object.keys(store.columnMapping).length === 0;
      case 3:
        return false;
      default:
        return true;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Excel Data Processor
      </Typography>

      <Steps activeStep={store.activeStep} />

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {store.activeStep === 0 && (
        <>
          <FileUpload
            title="Upload Master Excel File"
            onDrop={handleMasterFileUpload}
            multiple={false}
          />
          <FileList
            files={store.masterFile ? [store.masterFile] : []}
            onDelete={(index) => handleDeleteFile(index, 'master')}
            title="Master File"
          />
        </>
      )}

      {store.activeStep === 1 && (
        <>
          <FileUpload
            title="Upload Salesforce Files"
            onDrop={handleSalesforceFilesUpload}
            multiple={true}
          />
          <FileList
            files={store.salesforceFiles}
            onDelete={(index) => handleDeleteFile(index, 'salesforce')}
            title="Salesforce Files"
          />
        </>
      )}

      {store.activeStep === 2 && (
        <ColumnMapping
          files={store.salesforceFiles}
          masterColumns={store.masterColumns}
          mappings={store.columnMapping}
          onMappingChange={(fileName, mapping) => {
            store.setColumnMapping({
              ...store.columnMapping,
              [fileName]: mapping
            });
          }}
        />
      )}

      {store.activeStep === 4 && (
        <DownloadResults
          logs={store.processingLogs}
          onDownloadMaster={handleDownloadMaster}
          onDownloadLogs={handleDownloadLogs}
        />
      )}

      {store.activeStep < 4 && (
        <NavigationButtons
          activeStep={store.activeStep}
          totalSteps={5}
          onBack={handleBack}
          onNext={handleNext}
          isNextDisabled={isNextDisabled()}
        />
      )}
    </Container>
  );
}

export default App;