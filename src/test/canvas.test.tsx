import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Canvas from '@/components/Canvas';
import { useStore } from '@/lib/store';

// Mock React Flow ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

describe('Canvas Component', () => {
  it('should render the React Flow container', () => {
    render(<Canvas />);
    const reactFlowContainer = screen.getByTestId('rf__wrapper');
    expect(reactFlowContainer).toBeInTheDocument();
  });

  it('should add a node when "Add Thought" button is clicked', () => {
    render(<Canvas />);
    const addButton = screen.getByText('Add Thought');
    fireEvent.click(addButton);
    
    const nodes = useStore.getState().nodes;
    expect(nodes.length).toBeGreaterThan(0);
  });

  it('should delete a node when onNodesChange is called with a remove change', () => {
    const { getState } = useStore;
    const initialNode = { id: 'test-node', position: { x: 0, y: 0 }, data: { label: 'Test' } };
    getState().setNodes([initialNode]);
    
    expect(getState().nodes.length).toBe(1);
    
    getState().onNodesChange([{ id: 'test-node', type: 'remove' }]);
    
    expect(getState().nodes.length).toBe(0);
  });
});
