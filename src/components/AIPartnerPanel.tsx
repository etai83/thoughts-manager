'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useOnSelectionChange } from '@xyflow/react';

const AIPartnerPanel: React.FC = () => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const getRelationshipExplanation = useStore((s) => s.getRelationshipExplanation);

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setSelectedNodes(nodes.map(n => n.id));
      if (nodes.length < 2) {
        setExplanation(null);
      }
    },
  });

  const handleExplain = async () => {
    if (selectedNodes.length >= 2) {
      setIsLoading(true);
      const result = await getRelationshipExplanation(selectedNodes);
      setExplanation(result);
      setIsLoading(false);
    }
  };

  if (selectedNodes.length < 2) return null;

  const thoughtWord = selectedNodes.length === 2 ? 'two thoughts' : `${selectedNodes.length} thoughts`;

  return (
    <div className="absolute top-4 right-4 z-[10] w-[300px] bg-white rounded-lg shadow-xl border p-4 text-black">
      <h3 className="font-bold text-sm border-b pb-2 mb-2 flex justify-between items-center">
        AI Partner
        <button
          onClick={() => setExplanation(null)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </h3>

      {!explanation && !isLoading && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-600">You've selected {thoughtWord}. Want to see how they might be connected?</p>
          <button
            onClick={handleExplain}
            className="bg-purple-600 text-white px-3 py-2 rounded text-xs hover:bg-purple-700 transition-colors"
          >
            Explain Connection{selectedNodes.length > 2 ? 's' : ''}
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-xs text-gray-500 italic animate-pulse">
          Synthesizing connection{selectedNodes.length > 2 ? 's' : ''}...
        </div>
      )}

      {explanation && (
        <div className="text-xs prose prose-slate max-w-none bg-purple-50 p-2 rounded border border-purple-100 italic">
          {explanation}
        </div>
      )}
    </div>
  );
};

export default AIPartnerPanel;
