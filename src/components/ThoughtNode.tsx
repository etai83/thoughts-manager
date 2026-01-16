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
    // Only blur if we're not clicking the suggest button (handled by onMouseDown)
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

  // Dynamic border color based on selection state
  const borderClass = selected
    ? 'border-blue-500 shadow-lg shadow-blue-200'
    : 'border-stone-400';

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${borderClass} min-w-[200px] max-w-[400px] text-black transition-all duration-200`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />

      <div className="flex flex-col text-black">
        {isEditing ? (
          <>
            <input
              className="font-bold border-b mb-2 focus:outline-none text-black"
              value={data.label}
              onChange={handleLabelChange}
              autoFocus
            />
            <textarea
              className="text-xs border rounded p-1 focus:outline-none min-h-[150px] text-black font-mono"
              value={data.content || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              onPaste={handlePaste}
              placeholder="Paste images or type markdown..."
            />
            <button
              onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
              onClick={handleSuggest}
              disabled={isSuggesting}
              className="mt-2 text-[10px] bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isSuggesting ? 'Thinking...' : 'AI Suggestion'}
            </button>
          </>
        ) : (
          <div onDoubleClick={handleDoubleClick} className="text-black overflow-hidden">
            <div className="font-bold border-b mb-2 text-black">{data.label}</div>
            <div className="text-xs prose prose-slate max-w-none text-black break-words">
              <ReactMarkdown
                components={{
                  img({ node, ...props }: any) {
                    return <img {...props} className="max-w-full h-auto rounded-sm my-2 shadow-sm" />;
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
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
  );
};

export default React.memo(ThoughtNode);
