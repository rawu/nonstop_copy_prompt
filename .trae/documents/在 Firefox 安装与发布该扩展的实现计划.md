## 目标
- 支持在 Firefox 中临时安装用于开发调试
- 支持打包并提交 AMO 获取签名，进行长期安装/分发
- 修正当前工程中与 Firefox MV3 不兼容的点（远程脚本、缺少背景脚本文件）

## 必要修正
1. 移除远程脚本与内联脚本
- index.html 使用了 CDN（Tailwind 与 esm.sh Import Map），违反扩展政策与 MV3 默认 CSP。
- 方案：改为本地打包静态资源，通过 Vite 产物（本地 JS/CSS 文件）加载。
- 参考文件：[index.html](file:///d:/develop/vscode_jupyter/nonstop_copy_prompt/nonstop_copy_prompt/index.html)

2. 背景脚本一致性
- manifest.json 声明了 background.service_worker: "background.js"，但仓库中不存在该文件。
- 方案：
  - 若无需后台逻辑，删除 background 字段；
  - 若需要（如存储清理、消息处理），补充实现 background.js 并使用 browser.* API。
- 参考文件：[manifest.json](file:///d:/develop/vscode_jupyter/nonstop_copy_prompt/nonstop_copy_prompt/manifest.json)

3. Firefox 特定设置（用于发布）
- 在 manifest.json 添加 browser_specific_settings.gecko：
  - id（固定扩展 ID，便于更新）
  - strict_min_version（如 "109.0"，匹配 MV3 支持）

## 构建与打包
1. 使用 Vite 进行生产构建
- 将 React 应用打包为静态 JS/CSS 文件；确保 index.html 引用本地打包文件。
- 将 manifest.json、图标等一并复制到 dist。

2. 生成 XPI
- 压缩 dist 内容为 ZIP，并重命名为 .xpi（根目录即扩展文件集合，避免多一层目录）。

## 安装流程
1. 临时安装（开发调试）
- 打开 about:debugging#/runtime/this-firefox → Load Temporary Add-on → 选择 manifest.json（源目录或 dist）。

2. 长期安装/分发
- 前往 AMO 开发者中心提交扩展获取签名（可选择仅签名自分发）。
- 审核通过后下载已签名 XPI，在目标环境安装。

## 验证与兼容性
- 确认弹窗页面能正常渲染（无远程脚本警告，无 CSP 违规）。
- 若使用存储等 API，优先使用 browser.* Promise 风格，或添加 polyfill 保持兼容。
- 在 Windows 与 macOS 上进行基础验证（装载、卸载、重启浏览器后行为一致）。

## 交付物
- 修正后的 manifest.json 与 index.html
- 可运行的 background.js（或删去该声明）
- dist 目录与可安装的 .xpi 包

## 备注
- 临时安装不持久，重启后需重新加载；长期使用需 AMO 签名。
- 遵守“禁止远程代码”政策与 MV3 CSP，所有脚本必须打包在扩展内。