import create from 'zustand';

interface FileMapping {
  fileName: string;
  nameColumn: string;
  headerRow: number;
  columnMappings: Array<{
    sourceColumn: string;
    targetColumn: string;
  }>;
}

interface FileState {
  masterFile: File | null;
  salesforceFiles: File[];
  columnMapping: Record<string, FileMapping>;
  masterColumns: string[];
  sourceColumns: string[];
  processingLogs: string[];
  activeStep: number;
  setMasterFile: (file: File | null) => void;
  setSalesforceFiles: (files: File[]) => void;
  setColumnMapping: (mapping: Record<string, FileMapping>) => void;
  setMasterColumns: (columns: string[]) => void;
  setSourceColumns: (columns: string[]) => void;
  addProcessingLog: (log: string) => void;
  setActiveStep: (step: number) => void;
  clearLogs: () => void;
}

export const useStore = create<FileState>((set) => ({
  masterFile: null,
  salesforceFiles: [],
  columnMapping: {},
  masterColumns: [],
  sourceColumns: [],
  processingLogs: [],
  activeStep: 0,
  setMasterFile: (file) => set({ masterFile: file }),
  setSalesforceFiles: (files) => set({ salesforceFiles: files }),
  setColumnMapping: (mapping) => set({ columnMapping: mapping }),
  setMasterColumns: (columns) => set({ masterColumns: columns }),
  setSourceColumns: (columns) => set({ sourceColumns: columns }),
  addProcessingLog: (log) => set((state) => ({ 
    processingLogs: [...state.processingLogs, log] 
  })),
  setActiveStep: (step) => set({ activeStep: step }),
  clearLogs: () => set({ processingLogs: [] })
}));