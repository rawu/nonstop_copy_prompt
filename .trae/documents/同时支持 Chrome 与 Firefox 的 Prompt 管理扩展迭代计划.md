## 当前状态概览
- 现有扩展为 MV3，只有弹窗页面，权限仅 storage，见 [manifest.json](file:///d:/develop/vscode_jupyter/nonstop_copy_prompt/nonstop_copy_prompt/manifest.json)
- 弹窗逻辑在 [popup.js](file:///d:/develop/vscode_jupyter/nonstop_copy_prompt/nonstop_copy_prompt/popup.js)，用 chrome.storage.sync 存取，并通过 navigator.clipboard 复制文本
- 未定义 background、content_scripts、sidePanel/sidebarAction；未做 Firefox 专属设置

## 兼容性策略
- 采用 WebExtensions 通用模型，维持 MV3 与仅弹窗架构，避免使用不完全受支持的 API
- 保持 storage.sync 作为默认存储；如后续需要离线更稳健可切换到 storage.local
- 建议引入 browser.* 兼容层（webextension-polyfill），但在当前最小改动方案中，保留 chrome.* 的回调用法即可在 Firefox 运行

## 清单改造（最小改动）
- 在根级添加 Firefox 专属设置：browser_specific_settings.gecko（扩展 ID 与最低版本）
- 保持 action.default_popup；继续仅声明必要权限
- 可选添加 clipboardWrite 以覆盖某些复制场景

示例（在现有 manifest.json 基础上补充）：

```json
{
  "manifest_version": 3,
  "name": "Prompt Manager",
  "version": "1.0.0",
  "description": "Manage and copy prompts",
  "action": { "default_popup": "popup.html" },
  "permissions": ["storage", "clipboardWrite"],
  "browser_specific_settings": {
    "gecko": { "id": "prompt-manager@example.com", "strict_min_version": "109.0" }
  }
}
```

## 代码改造（可选增强）
- 为存储封装一个轻量适配层（统一 get/set，便于未来切换 browser.* 或 local/sync）
- 如需 Promise 化，可后续引入 webextension-polyfill 并将 chrome.storage.sync 改为 browser.storage.sync（当前迭代不强制）

## 验证流程
- Chrome：开启开发者模式，加载已解压扩展目录；验证弹窗读取/保存/复制均正常
- Firefox：在 about:debugging -> This Firefox -> Load Temporary Add-on，选择 manifest.json；验证弹窗与存储、复制
- 权限检查：storage、clipboardWrite 均可用；若 clipboard 写入受限，确保操作含用户手势（按钮点击）

## 发布准备
- Firefox：在扩展根添加 browser_specific_settings 后，使用 web-ext（可后续新增）进行本地运行与签名提交 AMO
- Chrome：准备 ZIP 包上传 Chrome Web Store
- 补充 README 与商店描述，说明功能与权限用途

## 后续增强方向（非本次范围）
- 引入 webextension-polyfill，统一 browser.* Promise 模式
- 视需求增加 content_scripts 或侧边面板（Chrome sidePanel 与 Firefox sidebarAction 需分支适配）
- 增加备份/导入导出、云同步策略与冲突处理

## 本次迭代交付
- 修改 manifest.json 以支持 Firefox（添加 browser_specific_settings.gecko、可选 clipboardWrite）
- 保持现有 popup.js 逻辑不变，完成双端运行验证

请确认以上计划，确认后我将按该方案实施并进行本地验证与打包。