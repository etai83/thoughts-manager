'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useOnSelectionChange } from '@xyflow/react';

const InsightsPanel: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [relatedNodes, setRelatedNodes] = useState<any[]>([]);
  const getRelatedNodes = useStore((s) => s.getRelatedNodes);
  const addEdge = useStore((s) => s.onConnect);

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length === 1) {
        setSelectedNodeId(nodes[0].id);
      } else {
        setSelectedNodeId(null);
        setRelatedNodes([]);
      }
    },
  });

  useEffect(() => {
    if (selectedNodeId) {
      getRelatedNodes(selectedNodeId).then(setRelatedNodes);
    }
  }, [selectedNodeId, getRelatedNodes]);

  if (!selectedNodeId) return null;

  const handleConnect = (targetId: string) => {
    addEdge({
      source: selectedNodeId,
      target: targetId,
      sourceHandle: null,
      targetHandle: null,
    });
  };

  return (
    <div className="absolute bottom-4 right-4 z-[10] w-[250px] bg-white rounded-lg shadow-xl border p-4 text-black">
      <h3 className="font-bold text-sm border-b pb-2 mb-2">Related Thoughts</h3>
      {relatedNodes.length === 0 ? (
        <div className="text-xs text-gray-500 italic">No similar thoughts found.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {relatedNodes.map((node) => (
            <div key={node.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <div className="text-xs font-medium truncate flex-1 mr-2">{node.label}</div>
              <button
                onClick={() => handleConnect(node.id)}
                className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 hover:scale-[1.05] active:scale-[0.95] transition-all font-bold shadow-sm shadow-blue-50"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsPanel;
