import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../useStore';

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({
      masterFile: null,
      salesforceFiles: [],
      columnMapping: {},
      masterColumns: [],
      sourceColumns: []
    });
  });

  it('sets master file correctly', () => {
    const file = new File(['test'], 'test.xlsx');
    useStore.getState().setMasterFile(file);
    expect(useStore.getState().masterFile).toBe(file);
  });

  it('sets salesforce files correctly', () => {
    const files = [
      new File(['test1'], 'test1.xlsx'),
      new File(['test2'], 'test2.xlsx')
    ];
    useStore.getState().setSalesforceFiles(files);
    expect(useStore.getState().salesforceFiles).toEqual(files);
  });

  it('sets column mapping correctly', () => {
    const mapping = { 'source': 'target' };
    useStore.getState().setColumnMapping(mapping);
    expect(useStore.getState().columnMapping).toEqual(mapping);
  });
});