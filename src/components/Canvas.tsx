'use client';

import React, { useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from '@/lib/store';
import ThoughtNode from './ThoughtNode';
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
    addNode,
  } = useStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNodeClick = (event: React.MouseEvent, node: any) => {
    const isMulti = event.metaKey || event.ctrlKey || event.shiftKey;
    useStore.getState().toggleSelection(node.id, isMulti);
  };

  const handleAddNode = () => {
     const id = Date.now().toString();
     const newNode = {
       id,
       position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
       data: { label: `Thought ${id}`, content: '' },
       type: 'thought',
     };
     addNode(newNode);
   };

  return (
    <div style={{ width: '100%', height: '100%' }} className="relative" data-testid="rf__wrapper">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 glass-panel px-2 py-1.5 rounded-2xl flex items-center gap-1 z-30 shadow-2xl">
            <div className="flex gap-0.5 border-r border-white/10 pr-2 mr-1">
                <button className="p-2 text-white hover:bg-white/5 rounded-lg transition-colors" title="Select">
                    <span className="material-symbols-outlined text-[20px]">near_me</span>
                </button>
                <button className="p-2 text-[#9db4b9] hover:bg-white/5 rounded-lg transition-colors" title="Draw Connections">
                    <span className="material-symbols-outlined text-[20px]">gesture</span>
                </button>
                <button className="p-2 text-[#9db4b9] hover:bg-white/5 rounded-lg transition-colors" title="Group Nodes">
                    <span className="material-symbols-outlined text-[20px]">filter_center_focus</span>
                </button>
            </div>
            <div className="flex gap-1 items-center px-2">
                <button className="text-[11px] font-bold text-[#9db4b9] uppercase tracking-tighter hover:text-white">Zoom: 84%</button>
            </div>
            <div className="flex gap-0.5 border-l border-white/10 pl-2 ml-1">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-bold transition-all hover:bg-primary/20">
                    <span className="material-symbols-outlined text-[16px]">hub</span>
                    FORCE LAYOUT
                </button>
            </div>
        </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          style: { stroke: '#11b4d4', strokeWidth: 1.5 },
          type: 'default',
          animated: true,
        }}
        fitView
        multiSelectionKeyCode={['Meta', 'Ctrl']}
        className="graph-grid bg-background-dark"
      >
        <Background color="transparent" /> 
        
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0">
          <path d="M400,300 C450,300 500,400 550,400" fill="none" stroke="#11b4d4" strokeWidth="1.5"></path>
          <path d="M400,300 C350,300 300,200 250,200" fill="none" stroke="#11b4d4" strokeWidth="1.5"></path>
          <path d="M550,400 C600,400 650,450 700,450" fill="none" strokeDasharray="4,4" strokeWidth="1.5"></path>
          <path d="M550,400 C600,350 650,300 700,300" fill="none" stroke="#eab308" strokeWidth="1.5"></path>
        </svg>

        <div className="absolute top-[120px] left-[150px] w-[600px] h-[450px] border border-white/5 bg-white/[0.02] rounded-[32px] pointer-events-none z-0">
          <div className="absolute -top-3 left-8 px-3 py-1 bg-background-dark border border-[#283639] rounded-full">
            <span className="text-[10px] font-bold text-[#9db4b9] tracking-[2px] uppercase">Zone: AI Fundamentals</span>
          </div>
        </div>

        <AIChat />

      </ReactFlow>

      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
        <div className="glass-panel flex flex-col rounded-xl overflow-hidden">
            <button onClick={handleAddNode} className="p-2.5 hover:bg-white/5 transition-colors border-b border-white/5 text-white" title="Add Node">
                <span className="material-symbols-outlined">add</span>
            </button>
            <button className="p-2.5 hover:bg-white/5 transition-colors border-b border-white/5 text-white" title="Zoom Out">
                <span className="material-symbols-outlined">remove</span>
            </button>
            <button className="p-2.5 hover:bg-white/5 transition-colors text-white" title="Fit View">
                <span className="material-symbols-outlined">center_focus_strong</span>
            </button>
        </div>
        <button className="glass-panel p-2.5 rounded-xl hover:bg-white/5 transition-colors text-white" title="Explore">
            <span className="material-symbols-outlined">explore</span>
        </button>
      </div>
    </div>
  );
};

export default Canvas;
