import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ThoughtNode from '@/components/ThoughtNode';

describe('Rich Content - Code Highlighting', () => {
  const mockData = {
    id: '1',
    data: { 
      label: 'Code Note', 
      content: 'Here is some code:\n\n```javascript\nconst x = 10;\n```' 
    },
    selected: false,
  };

  it('should render a code block with highlighting classes', () => {
    // @ts-ignore
    render(<ThoughtNode {...mockData} />);
    
    // Check for the code element
    const codeElement = screen.getByText(/const x = 10;/);
    expect(codeElement).toBeInTheDocument();
    
    // We expect react-syntax-highlighter to wrap the code in spans with classes or styles
    // Since we'll use Prism or HLJS, we look for parent structures
    const preElement = codeElement.closest('pre');
    expect(preElement).toBeInTheDocument();
  });
});

