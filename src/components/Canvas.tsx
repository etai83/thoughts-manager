'use client';

import React, { useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from '@/lib/store';
import ThoughtNode from './ThoughtNode';
import SearchBar from './SearchBar';
import InsightsPanel from './InsightsPanel';
import AIPartnerPanel from './AIPartnerPanel';
import AIChat from './AIChat';

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
    loadData,
  } = useStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNodeClick = (event: React.MouseEvent, node: any) => {
    const isMulti = event.metaKey || event.ctrlKey || event.shiftKey;
    useStore.getState().toggleSelection(node.id, isMulti);
  };

  return (
    <div style={{ width: '100%', height: '100%' }} data-testid="rf__wrapper">
      <SearchBar />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        multiSelectionKeyCode={['Meta', 'Ctrl']}
      >
        <Background />
        <Controls />
        <InsightsPanel />
        <AIPartnerPanel />
        <AIChat />
      </ReactFlow>
    </div>
  );
};

export default Canvas;
