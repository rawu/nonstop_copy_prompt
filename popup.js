// 1. 這裡定義預設的 Prompt
const DEFAULT_PROMPTS = [
  { id: 'def_1', title: '冷郵件開頭', content: 'Hi [Name], 我注意到貴公司正在招募...', type: 'default' },
  { id: 'def_2', title: 'IG 爆款標題', content: '請給我 5 個關於 [主題] 的爭議性標題...', type: 'default' },
  { id: 'def_3', title: 'React 優化', content: '你是 React 專家，請優化這段代碼：', type: 'default' }
];

document.addEventListener('DOMContentLoaded', () => {
  loadPrompts();
  document.getElementById('add-btn').addEventListener('click', addCustomPrompt);
});

// 載入資料
function loadPrompts() {
  // 使用 chrome.storage 讀取資料
  chrome.storage.sync.get(['myPrompts'], (result) => {
    let prompts = result.myPrompts;

    // 如果是第一次安裝（沒有資料），載入預設值
    if (!prompts) {
      prompts = DEFAULT_PROMPTS;
      chrome.storage.sync.set({ myPrompts: prompts });
    }
    renderList(prompts);
  });
}

// 渲染畫面
function renderList(prompts) {
  const list = document.getElementById('prompt-list');
  const countSpan = document.getElementById('count');
  
  list.innerHTML = '';
  countSpan.textContent = `${prompts.length} 個`;

  prompts.forEach((p, index) => {
    const item = document.createElement('div');
    item.className = 'prompt-item';
    
    const tagClass = p.type === 'default' ? 'tag-default' : 'tag-custom';
    const tagName = p.type === 'default' ? '官方' : '自訂';

    item.innerHTML = `
      <div class="prompt-title">
        <span class="tag ${tagClass}">${tagName}</span>${p.title}
      </div>
      <div class="prompt-content">${p.content}</div>
      <span class="delete-btn" data-index="${index}">×</span>
    `;

    // 點擊複製
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) return;
      copyToClipboard(p.content);
    });

    // 刪除按鈕
    item.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deletePrompt(index);
    });

    list.appendChild(item);
  });
}

// 新增功能
function addCustomPrompt() {
  const titleInput = document.getElementById('new-title');
  const contentInput = document.getElementById('new-content');
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("請輸入標題和內容");
    return;
  }

  chrome.storage.sync.get(['myPrompts'], (result) => {
    const prompts = result.myPrompts || DEFAULT_PROMPTS;
    prompts.push({
      id: Date.now().toString(),
      title: title,
      content: content,
      type: 'custom'
    });

    chrome.storage.sync.set({ myPrompts: prompts }, () => {
      titleInput.value = '';
      contentInput.value = '';
      loadPrompts();
    });
  });
}

// 刪除功能
function deletePrompt(index) {
  if(!confirm('確定要刪除嗎？')) return;

  chrome.storage.sync.get(['myPrompts'], (result) => {
    const prompts = result.myPrompts;
    prompts.splice(index, 1);
    
    chrome.storage.sync.set({ myPrompts: prompts }, () => {
      loadPrompts();
    });
  });
}

// 複製功能
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.getElementById('toast');
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 1500);
  });
}