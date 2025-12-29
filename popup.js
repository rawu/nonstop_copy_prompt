let editingId = null;

function migrateSyncToLocalOnce(callback) {
  chrome.storage.local.get(['migrationDone', 'myPrompts'], (localState) => {
    const done = !!localState.migrationDone;
    const localHasData = Array.isArray(localState.myPrompts) && localState.myPrompts.length > 0;
    if (done || localHasData) {
      if (callback) callback();
      return;
    }
    chrome.storage.sync.get(['myPrompts'], (syncState) => {
      const syncData = Array.isArray(syncState.myPrompts) ? syncState.myPrompts : [];
      if (syncData.length > 0) {
        chrome.storage.local.set({ myPrompts: syncData, migrationDone: true }, () => {
          if (callback) callback();
        });
      } else {
        chrome.storage.local.set({ migrationDone: true }, () => {
          if (callback) callback();
        });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  migrateSyncToLocalOnce(() => {
    loadPrompts();
  });
  document.getElementById('add-btn').addEventListener('click', addCustomPrompt);
  const cancelBtn = document.getElementById('cancel-edit-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', cancelEdit);
});

// 載入資料
function loadPrompts() {
  // 使用 chrome.storage.local 讀取資料
  chrome.storage.local.get(['myPrompts'], (result) => {
    let prompts = result.myPrompts;

    if (!Array.isArray(prompts)) prompts = [];
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
      <span class="edit-btn" data-id="${p.id}">✎</span>
      <span class="delete-btn" data-index="${index}">×</span>
    `;

    // 點擊複製
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) return;
      if (e.target.classList.contains('edit-btn')) return;
      copyToClipboard(p.content);
    });

    // 刪除按鈕
    item.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deletePrompt(index);
    });

    // 編輯按鈕
    item.querySelector('.edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      startEdit(p);
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

  // 如果目前在編輯狀態，改為保存編輯
  if (editingId) {
    saveEdit();
    return;
  }

  chrome.storage.local.get(['myPrompts'], (result) => {
    const prompts = Array.isArray(result.myPrompts) ? result.myPrompts : [];
    const newItem = {
      id: Date.now().toString(),
      title: title,
      content: content,
      type: 'custom'
    };
    prompts.push(newItem);

    chrome.storage.local.set({ myPrompts: prompts }, () => {
      titleInput.value = '';
      contentInput.value = '';
      loadPrompts();
    });
  });
}

// 刪除功能
function deletePrompt(index) {
  if(!confirm('確定要刪除嗎？')) return;

  chrome.storage.local.get(['myPrompts'], (result) => {
    const prompts = result.myPrompts;
    prompts.splice(index, 1);
    
    chrome.storage.local.set({ myPrompts: prompts }, () => {
      loadPrompts();
    });
  });
}

// 開始編輯
function startEdit(p) {
  editingId = p.id;
  const titleInput = document.getElementById('new-title');
  const contentInput = document.getElementById('new-content');
  const addBtn = document.getElementById('add-btn');
  const cancelBtn = document.getElementById('cancel-edit-btn');
  titleInput.value = p.title;
  contentInput.value = p.content;
  addBtn.textContent = '保存修改';
  if (cancelBtn) cancelBtn.style.display = 'block';
}

// 取消編輯
function cancelEdit() {
  editingId = null;
  const titleInput = document.getElementById('new-title');
  const contentInput = document.getElementById('new-content');
  const addBtn = document.getElementById('add-btn');
  const cancelBtn = document.getElementById('cancel-edit-btn');
  titleInput.value = '';
  contentInput.value = '';
  addBtn.textContent = '新增 Prompt';
  if (cancelBtn) cancelBtn.style.display = 'none';
}

// 保存編輯
function saveEdit() {
  const titleInput = document.getElementById('new-title');
  const contentInput = document.getElementById('new-content');
  const newTitle = titleInput.value.trim();
  const newContent = contentInput.value.trim();
  if (!newTitle || !newContent) {
    alert('請輸入標題和內容');
    return;
  }
  chrome.storage.local.get(['myPrompts'], (result) => {
    const prompts = Array.isArray(result.myPrompts) ? result.myPrompts : [];
    const idx = prompts.findIndex(x => x.id === editingId);
    if (idx !== -1) {
      prompts[idx] = { ...prompts[idx], title: newTitle, content: newContent };
      chrome.storage.local.set({ myPrompts: prompts }, () => {
        cancelEdit();
        loadPrompts();
      });
    } else {
      alert('找不到要編輯的項目');
    }
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
