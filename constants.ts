import { Prompt, PromptType } from './types';

export const DEFAULT_PROMPTS: Prompt[] = [
  { 
    id: 'def_1', 
    title: '冷郵件開頭 (Cold Email)', 
    content: 'Hi [Name], 我注意到貴公司正在招募... 我在該領域有豐富經驗...', 
    type: PromptType.DEFAULT 
  },
  { 
    id: 'def_2', 
    title: 'IG 爆款標題', 
    content: '請給我 5 個關於 [主題] 的爭議性標題，目標是引起強烈討論...', 
    type: PromptType.DEFAULT 
  },
  { 
    id: 'def_3', 
    title: 'React 代碼優化', 
    content: '你是 React 資深工程師，請幫我審查這段代碼並提出效能優化建議：\n\n[代碼]', 
    type: PromptType.DEFAULT 
  },
  {
    id: 'def_4',
    title: '英文潤稿',
    content: '請幫我將這段英文修改得更道地、專業，語氣保持禮貌：',
    type: PromptType.DEFAULT
  }
];