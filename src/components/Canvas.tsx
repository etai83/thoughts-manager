'use client';

import React, { useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from '@/lib/store';

const Canvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    loadData,
  } = useStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddNode = () => {
    const id = Date.now().toString();
    const newNode = {
      id,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `New Thought ${id}` },
      type: 'default',
    };
    addNode(newNode);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }} data-testid="rf__wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <div className="flex flex-col gap-2 bg-white p-2 border rounded shadow">
            <button
              onClick={handleAddNode}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Add Thought
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default Canvas;
