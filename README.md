# Prompt 管理扩展（Chrome/Firefox）

## 功能概览
- 弹窗页面管理与复制常用 Prompt
- 使用 storage.sync 保存数据，含预设与自定义项
- 支持在弹窗中一键复制到剪贴板

## 代码结构
- 清单：见 [manifest.json](file:///d:/develop/vscode_jupyter/nonstop_copy_prompt/nonstop_copy_prompt/manifest.json)
- 弹窗脚本：见 [popup.js](file:///d:/develop/vscode_jupyter/nonstop_copy_prompt/nonstop_copy_prompt/popup.js)
- 弹窗页面：见 [popup.html](file:///d:/develop/vscode_jupyter/nonstop_copy_prompt/nonstop_copy_prompt/popup.html)

## Chrome 本地加载
- 打开 Chrome 扩展管理（chrome://extensions）
- 开启开发者模式
- 选择“加载已解压的扩展程序”，指向项目根目录
- 在工具栏点击图标打开弹窗，验证读取、新增、删除与复制功能

## Firefox 本地加载
- 打开 about:debugging
- 选择 “This Firefox” -> “Load Temporary Add-on”
- 选择项目根目录下的 manifest.json
- 在工具栏点击图标打开弹窗，验证读取、新增、删除与复制功能

## 发布与打包
- Chrome：将项目根目录打包为 ZIP，上传至 Chrome Web Store
- Firefox：建议使用 web-ext 进行打包与签名提交 AMO（可后续在项目中加入脚本）

## 权限说明
- storage：用于保存扩展数据（默认使用 sync）
- clipboardWrite：在部分场景下提升复制稳定性（实际复制由 navigator.clipboard 完成）

## 兼容性说明
- 采用 WebExtensions 标准与 MV3 弹窗架构，避免使用不完全受支持的 API
- 当前代码仅使用 chrome.storage.sync 与 navigator.clipboard，已在清单中添加 Firefox 的 browser_specific_settings（gecko）

