import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { ColumnMapping } from '../ColumnMapping';

describe('ColumnMapping', () => {
  const mockProps = {
    sourceColumns: ['Name', 'Email'],
    masterColumns: ['Full Name', 'Contact Email'],
    mapping: {},
    onMappingChange: vi.fn()
  };

  it('renders all source columns', () => {
    render(<ColumnMapping {...mockProps} />);
    
    expect(screen.getByText('Name')).toBeDefined();
    expect(screen.getByText('Email')).toBeDefined();
  });

  it('handles mapping change correctly', () => {
    render(<ColumnMapping {...mockProps} />);
    
    const select = screen.getAllByRole('combobox')[0];
    fireEvent.mouseDown(select);
    
    const option = screen.getByText('Full Name');
    fireEvent.click(option);
    
    expect(mockProps.onMappingChange).toHaveBeenCalledWith('Name', 'Full Name');
  });
});