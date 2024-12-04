import { read, utils } from 'xlsx';
import { MockColumn, MockFile, MockResponse } from '../types/mock';

class MockBackendService {
  private storage: Map<string, any> = new Map();

  async healthCheck(): Promise<MockResponse> {
    return { status: 'healthy' };
  }

  async previewFile(file: File): Promise<MockResponse> {
    try {
      if (!file || !file.name) {
        throw new Error('No file provided');
      }

      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error('Invalid file type. Only Excel files (.xlsx, .xls) are allowed');
      }

      // Read the Excel file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(arrayBuffer);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = utils.sheet_to_json(firstSheet, { header: 1 });

      // Get column headers (first row)
      const headers = data[0] as string[];
      
      // Store file info
      this.storage.set(file.name, {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        headers,
        data: data.slice(1, 6) // Get first 5 rows for preview
      });

      return {
        columns: headers,
        data: data.slice(1, 6).map(row => 
          headers.reduce((obj, header, index) => ({
            ...obj,
            [header]: row[index]
          }), {})
        )
      };
    } catch (error) {
      console.error('Error processing file:', error);
      throw error instanceof Error ? error : new Error('Error processing file');
    }
  }

  async processFiles(
    masterFile: File,
    salesforceFiles: File[],
    mapping: Record<string, any>
  ): Promise<MockResponse> {
    try {
      if (!masterFile || !salesforceFiles.length || !mapping) {
        throw new Error('Missing required files or mapping');
      }

      // Store the processed files and mapping
      this.storage.set('masterFile', masterFile);
      this.storage.set('salesforceFiles', salesforceFiles);
      this.storage.set('mapping', mapping);

      return { 
        message: 'Processing complete',
        success: true
      };
    } catch (error) {
      console.error('Error processing files:', error);
      throw error instanceof Error ? error : new Error('Error processing files');
    }
  }
}

export const mockBackend = new MockBackendService();