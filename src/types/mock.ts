export interface MockColumn {
  field: string;
  headerName: string;
}

export interface MockFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  headers: string[];
  data: any[];
}

export interface MockResponse {
  status?: string;
  columns?: string[];
  data?: any[];
  message?: string;
  error?: string;
  success?: boolean;
}