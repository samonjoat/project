import axios from 'axios';
import { mockBackend } from './mockBackend';

const IS_PREVIEW = import.meta.env.VITE_PREVIEW === 'true';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFile = async (file: File) => {
  try {
    if (IS_PREVIEW) {
      return await mockBackend.previewFile(file);
    }

    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/preview', formData);
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Network error occurred');
    }
    throw error;
  }
};

export const processFiles = async (
  masterFile: File,
  salesforceFiles: File[],
  mapping: Record<string, any>
) => {
  try {
    if (IS_PREVIEW) {
      return await mockBackend.processFiles(masterFile, salesforceFiles, mapping);
    }

    const formData = new FormData();
    formData.append('masterFile', masterFile);
    salesforceFiles.forEach(file => {
      formData.append('salesforceFiles', file);
    });
    formData.append('mapping', JSON.stringify(mapping));

    const response = await api.post('/api/process', formData);
    return response.data;
  } catch (error) {
    console.error('Process error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error processing files');
    }
    throw error;
  }
};