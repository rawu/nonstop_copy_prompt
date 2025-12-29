import React, { useState } from 'react';
import { Prompt, PromptType } from '../types';

interface AddPromptFormProps {
  onAdd: (newPrompt: Prompt) => void;
}

const AddPromptForm: React.FC<AddPromptFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPrompt: Prompt = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      type: PromptType.CUSTOM,
    };

    onAdd(newPrompt);
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-4 px-1 mt-auto bg-white sticky bottom-0">
      <div className="mb-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="標題 (例: 客服回覆)"
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
        />
      </div>
      <div className="mb-2">
        <textarea
          rows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="輸入 Prompt 內容..."
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={!title.trim() || !content.trim()}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded text-xs font-semibold hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        新增 Prompt
      </button>
    </form>
  );
};

export default AddPromptForm;