import React from 'react';
import { Prompt, PromptType } from '../types';

interface PromptItemProps {
  prompt: Prompt;
  onCopy: (content: string) => void;
  onDelete: (id: string) => void;
}

const PromptItem: React.FC<PromptItemProps> = ({ prompt, onCopy, onDelete }) => {
  
  const handleCopy = () => {
    onCopy(prompt.content);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(prompt.id);
  };

  const isDefault = prompt.type === PromptType.DEFAULT;

  return (
    <div 
      onClick={handleCopy}
      className="group relative bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer mb-2 active:scale-[0.99]"
    >
      <div className="flex items-center mb-1.5 pr-5">
        <span 
          className={`
            inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium mr-2
            ${isDefault ? 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10' : 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'}
          `}
        >
          {isDefault ? '官方' : '自訂'}
        </span>
        <h3 className="text-sm font-semibold text-gray-800 truncate">{prompt.title}</h3>
      </div>
      
      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
        {prompt.content}
      </p>

      {!isDefault && (
        <button 
          onClick={handleDelete}
          className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          title="刪除"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PromptItem;