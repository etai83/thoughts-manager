'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useOnSelectionChange } from '@xyflow/react';

const AIPartnerPanel: React.FC = () => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const getRelationshipExplanation = useStore((s) => s.getRelationshipExplanation);
  const summarizeCluster = useStore((s) => s.summarizeCluster);

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setSelectedNodes(nodes.map(n => n.id));
      if (nodes.length < 2) {
        setResult(null);
      }
    },
  });

  const handleExplain = async () => {
    if (selectedNodes.length === 2) {
      setIsLoading(true);
      const res = await getRelationshipExplanation(selectedNodes[0], selectedNodes[1]);
      setResult(res);
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (selectedNodes.length >= 2) {
      setIsLoading(true);
      const res = await summarizeCluster(selectedNodes);
      setResult(res);
      setIsLoading(false);
    }
  };

  if (selectedNodes.length < 2) return null;

  return (
    <div className="absolute top-4 right-4 z-[10] w-[300px] bg-white rounded-lg shadow-xl border p-4 text-black">
      <h3 className="font-bold text-sm border-b pb-2 mb-2 flex justify-between items-center">
        AI Partner
        <button
          onClick={() => setResult(null)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </h3>

      {!result && !isLoading && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-600">
            {selectedNodes.length === 2
              ? "You've selected two thoughts. Want to see how they might be connected?"
              : `You've selected ${selectedNodes.length} thoughts. Want to synthesize them into a summary?`}
          </p>
          <div className="flex gap-2">
            {selectedNodes.length === 2 && (
              <button
                onClick={handleExplain}
                className="flex-1 bg-purple-600 text-white px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-purple-50"
              >
                Explain Link
              </button>
            )}
            <button
              onClick={handleSummarize}
              className="flex-1 bg-blue-600 text-white px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-blue-50"
            >
              Summarize
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-xs text-gray-500 italic animate-pulse">
          AI is thinking...
        </div>
      )}

      {result && (
        <div className="text-xs prose prose-slate max-w-none bg-gray-50 p-2 rounded border border-gray-100 italic">
          {result}
        </div>
      )}
    </div>
  );
};

export default AIPartnerPanel;
