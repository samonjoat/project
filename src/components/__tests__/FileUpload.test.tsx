import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { FileUpload } from '../FileUpload';

describe('FileUpload', () => {
  it('renders upload area with correct title', () => {
    const onDrop = vi.fn();
    render(<FileUpload title="Test Upload" onDrop={onDrop} />);
    
    expect(screen.getByText('Test Upload')).toBeDefined();
    expect(screen.getByText(/Drag & drop files here/)).toBeDefined();
  });

  it('handles file drop correctly', async () => {
    const onDrop = vi.fn();
    render(<FileUpload title="Test Upload" onDrop={onDrop} />);

    const file = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const dropzone = screen.getByText(/Drag & drop files here/);

    Object.defineProperty(dropzone, 'dataTransfer', {
      value: {
        files: [file]
      }
    });

    fireEvent.drop(dropzone);
    expect(onDrop).toHaveBeenCalledWith([file]);
  });
});