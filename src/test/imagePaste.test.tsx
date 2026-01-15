import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ThoughtNode from '@/components/ThoughtNode';
import { useStore } from '@/lib/store';
import { ReactFlow } from '@xyflow/react';

vi.mock('@/lib/store', () => ({
    useStore: vi.fn(),
}));

describe('ThoughtNode Image Paste', () => {
    const updateNodeData = vi.fn();
    (useStore as any).mockReturnValue(updateNodeData);

    const mockProps = {
        id: '1',
        data: { label: 'Test Node', content: '' },
        selected: false,
    };

    it('should handle image paste and update content with markdown image', async () => {
        // @ts-ignore
        render(
            <ReactFlow nodes={[]} edges={[]}>
                <ThoughtNode {...mockProps} />
            </ReactFlow>
        );

        // Enter edit mode
        const label = screen.getByText('Test Node');
        fireEvent.doubleClick(label);

        const textarea = screen.getByPlaceholderText('Paste images or type markdown...');

        // Create a mock image file
        const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });

        // Mock the paste event
        const pasteEvent = {
            clipboardData: {
                items: [
                    {
                        type: 'image/png',
                        getAsFile: () => file,
                    },
                ],
            },
        };

        fireEvent.paste(textarea, pasteEvent);

        // Since FileReader is async, we need to wait
        await vi.waitFor(() => {
            expect(updateNodeData).toHaveBeenCalledWith('1', expect.objectContaining({
                content: expect.stringContaining('![image](data:image/png;base64,')
            }));
        });
    });
});
