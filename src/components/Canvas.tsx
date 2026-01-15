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
import ThoughtNode from './ThoughtNode';
import { runLayout } from '@/lib/layout';
import SearchBar from './SearchBar';
import InsightsPanel from './InsightsPanel';
import { exportToJson, exportToMarkdown, importFromJson } from '@/lib/dataPortability';

const nodeTypes = {
  thought: ThoughtNode,
};

const Canvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setNodes,
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
      data: { label: `Thought ${id}`, content: '' },
      type: 'thought',
    };
    addNode(newNode);
  };

  const handleLayout = () => {
    const layoutedNodes = runLayout(nodes, edges);
    setNodes(layoutedNodes);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importFromJson(file);
        await loadData(); // Reload store from DB
      } catch (error) {
        alert('Import failed: ' + (error as Error).message);
      }
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }} data-testid="rf__wrapper">
      <SearchBar />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <InsightsPanel />
        <Panel position="top-right">
          <div className="flex flex-col gap-2 bg-white p-2 border rounded shadow">
            <button
              onClick={handleAddNode}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Add Thought
            </button>
            <button
              onClick={handleLayout}
              className="bg-stone-500 text-white px-4 py-2 rounded hover:bg-stone-600 transition-colors"
            >
              Auto Layout
            </button>
          </div>
        </Panel>

        <Panel position="bottom-left">
          <div className="flex flex-col gap-2 bg-white p-2 border rounded shadow text-black">
            <div className="text-xs font-bold border-b mb-1">Data Management</div>
            <button
              onClick={exportToJson}
              className="text-xs bg-gray-200 hover:bg-gray-300 p-1 rounded transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={exportToMarkdown}
              className="text-xs bg-gray-200 hover:bg-gray-300 p-1 rounded transition-colors"
            >
              Export Markdown (ZIP)
            </button>
            <label className="text-xs bg-gray-200 hover:bg-gray-300 p-1 rounded transition-colors cursor-pointer text-center">
              Import JSON
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default Canvas;
