'use client';

import React, { useState } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useStore } from '@/lib/store';

export type ThoughtNodeData = {
  label: string;
  content?: string;
};

const ThoughtNode = ({ id, data, selected }: NodeProps<Node<ThoughtNodeData>>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const updateNodeData = useStore((s) => s.updateNodeData);
  const suggestExpansion = useStore((s) => s.suggestExpansion);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { content: evt.target.value });
  };

  const handleLabelChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { label: evt.target.value });
  };

  const handleSuggest = async () => {
    setIsSuggesting(true);
    const suggestion = await suggestExpansion(id);
    const newContent = (data.content || '') + '\n\n**AI Suggestion:** ' + suggestion;
    updateNodeData(id, { content: newContent });
    setIsSuggesting(false);
  };

  const handlePaste = async (evt: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = evt.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64 = e.target?.result as string;
            const markdownImage = `\n![image](${base64})\n`;
            const newContent = (data.content || '') + markdownImage;
            updateNodeData(id, { content: newContent });
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const selectedClass = selected ? 'border-primary shadow-[0_0_15px_rgba(17,180,212,0.5)]' : 'border-white/10 hover:border-primary';

  return (
    <div className={`glass-panel rounded-xl p-4 transition-all duration-200 min-w-[250px] max-w-[400px] border ${selectedClass}`}>
      <Handle type="target" position={Position.Top} className="!bg-primary !w-3 !h-3" />

      <div className="flex justify-between items-start mb-2">
        <span className="px-2 py-0.5 bg-primary/20 text-primary text-[9px] font-black rounded uppercase tracking-widest">Active</span>
        <span className="material-symbols-outlined text-[#9db4b9] text-sm cursor-pointer hover:text-white">more_horiz</span>
      </div>

      <div className="flex flex-col text-white">
        {isEditing ? (
          <>
            <input
              className="font-bold border-b border-white/20 mb-2 focus:outline-none bg-transparent text-white placeholder-white/50"
              value={data.label}
              onChange={handleLabelChange}
              autoFocus
            />
            <textarea
              className="text-xs border border-white/20 rounded p-1 focus:outline-none min-h-[150px] bg-black/20 text-white font-mono"
              value={data.content || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              onPaste={handlePaste}
              placeholder="Paste images or type markdown..."
            />
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSuggest}
              disabled={isSuggesting}
              className="mt-2 text-[10px] bg-primary/20 text-primary border border-primary/50 px-2 py-1 rounded hover:bg-primary/30 transition-colors disabled:opacity-50 uppercase font-bold tracking-wide"
            >
              {isSuggesting ? 'Thinking...' : 'AI Suggestion'}
            </button>
          </>
        ) : (
          <div onDoubleClick={handleDoubleClick} className="text-white overflow-hidden">
            <h3 className="text-sm font-bold mb-2 text-white">{data.label}</h3>
            <div className="text-xs text-[#9db4b9] leading-relaxed line-clamp-4 prose prose-invert prose-p:my-1 prose-headings:my-1 max-w-none">
              <ReactMarkdown
                components={{
                  img({ node, ...props }: any) {
                    return <img {...props} className="max-w-full h-auto rounded-sm my-2 shadow-sm border border-white/10" />;
                  },
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {data.content || 'Double click to edit...'}
              </ReactMarkdown>
            </div>
            <div className="mt-3 flex gap-2">
                <span className="text-[10px] text-primary font-medium">#research</span>
                <span className="text-[10px] text-[#9db4b9] font-medium">#draft</span>
            </div>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-3 !h-3" />
    </div>
  );
};

export default React.memo(ThoughtNode);
