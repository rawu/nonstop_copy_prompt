import React, { useEffect, useState, useCallback } from 'react';
import { Prompt, ToastMessage } from './types';
import { getPrompts, savePrompts } from './services/storageService';
import PromptItem from './components/PromptItem';
import AddPromptForm from './components/AddPromptForm';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage>({ show: false, message: '' });

  // Load prompts on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPrompts();
        setPrompts(data);
      } catch (error) {
        console.error('Failed to load prompts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Show toast helper
  const showToast = useCallback((message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2000);
  }, []);

  const handleAddPrompt = async (newPrompt: Prompt) => {
    const updatedPrompts = [...prompts, newPrompt];
    setPrompts(updatedPrompts);
    await savePrompts(updatedPrompts);
    showToast('已新增 Prompt');
  };

  const handleDeletePrompt = async (id: string) => {
    if (!window.confirm('確定要刪除嗎？')) return;
    
    const updatedPrompts = prompts.filter(p => p.id !== id);
    setPrompts(updatedPrompts);
    await savePrompts(updatedPrompts);
    showToast('已刪除');
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      showToast('內容已複製!');
    } catch (err) {
      console.error('Copy failed', err);
      showToast('複製失敗');
    }
  };

  return (
    <div className="flex flex-col h-full p-4 relative min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <h1 className="font-bold text-gray-800 text-base">Prompt 助手</h1>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {prompts.length} 個
        </span>
      </header>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto mb-4 min-h-[200px] pb-2">
        {loading ? (
          <div className="flex justify-center items-center h-32 text-gray-400 text-xs">
            載入中...
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center text-gray-400 text-xs mt-10">
            還沒有 Prompt，新增一個吧！
          </div>
        ) : (
          prompts.map((prompt) => (
            <PromptItem
              key={prompt.id}
              prompt={prompt}
              onCopy={handleCopy}
              onDelete={handleDeletePrompt}
            />
          ))
        )}
      </div>

      {/* Input Area */}
      <AddPromptForm onAdd={handleAddPrompt} />

      {/* Toast Notification */}
      <Toast message={toast.message} isVisible={toast.show} />
    </div>
  );
};

export default App;