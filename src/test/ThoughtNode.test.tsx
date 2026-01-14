import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ThoughtNode from '@/components/ThoughtNode';

describe('ThoughtNode Component', () => {
  const mockData = {
    id: '1',
    data: { label: 'Test Node', content: '# Hello Markdown' },
    selected: false,
  };

  it('should render the node label', () => {
    // @ts-ignore
    render(<ThoughtNode {...mockData} />);
    expect(screen.getByText('Test Node')).toBeInTheDocument();
  });

  it('should switch to edit mode on double click', () => {
    // @ts-ignore
    render(<ThoughtNode {...mockData} />);
    const label = screen.getByText('Test Node');
    fireEvent.doubleClick(label);
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
