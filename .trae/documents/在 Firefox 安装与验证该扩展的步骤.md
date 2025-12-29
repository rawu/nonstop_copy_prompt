## 在 Firefox 本地安装
- 打开 about:debugging -> This Firefox -> Load Temporary Add-on
- 选择项目根目录的 [manifest.json](file:///d:/develop/vscode_jupyter/nonstop_copy_prompt/nonstop_copy_prompt/manifest.json)
- 工具栏点击扩展图标，打开弹窗并验证读取/新增/删除/复制功能
- 如遇复制受限，确保通过“点击按钮”等用户手势触发（已声明 clipboardWrite 权限）

## 目标与问题对应
- 长文本：尽量不限制长度
- 可编辑：支持对已存在的 prompt 进行编辑
- 升级保障：移除预设 prompt；升级不修改/不删除用户已有 prompt

## 技术方案（最小破坏）
- 存储改造：将 myPrompts 从 storage.sync 切换到 storage.local，规避 8KB/项限制，容量更大（~5MB/扩展）。
- 迁移策略：
  - 首次升级运行时：若存在 sync.myPrompts，则复制到 local.myPrompts；不清除用户数据；后续仅读写 local
  - 加入 SCHEMA_VERSION 与 MIGRATION_DONE 标记，确保迁移只执行一次
- 移除预设：
  - 删除 DEFAULT_PROMPTS 常量与首次安装的默认写入逻辑
  - 新安装显示空列表；不自动写入任何预设
  - 对已有用户，不自动删除历史中的 default 项，避免误伤；可后续提供“一键移除旧版预设”按钮（可选）
- 编辑功能：
  - UI：在列表项新增“编辑”按钮，点击后切换为 inline 编辑（标题/内容可编辑）或打开简单弹窗
  - 逻辑：基于 id 定位项，更新 title/content，保存到 storage.local 并刷新列表
  - 防误操作：保存前校验非空；取消恢复原状
- 长文本输入：
  - 将输入区 textarea 支持更高行数（例如 rows=6-10），不设 maxlength
  - 存储层不做长度限制；仅在极端超大时提示备份/导出
- 数据完整性与回退：
  - 所有写操作仅在用户明确点击“新增/编辑/删除”时进行
  - 不在启动时覆盖 myPrompts；升级仅进行一次性迁移到 local

## 文件改动点
- [popup.js](file:///d:/develop/vscode_jupyter/nonstop_copy_prompt/nonstop_copy_prompt/popup.js)：
  - 把 chrome.storage.sync 全部替换为 chrome.storage.local
  - 移除 DEFAULT_PROMPTS 与首次安装写入逻辑
  - 新增：编辑函数（editPromptById / startEdit / saveEdit / cancelEdit）与迁移逻辑（检测并复制 sync.myPrompts 到 local）
- [popup.html](file:///d:/develop/vscode_jupyter/nonstop_copy_prompt/nonstop_copy_prompt/popup.html)：
  - 调整输入区 textarea 的 rows（如 6-10）
  - 在每个列表项增加“编辑”按钮及简单编辑状态的 UI

## 验证
- Chrome/Firefox 分别加载已解压扩展，完成：
  - 新增长文本（>8KB）并成功保存到 storage.local
  - 编辑已有项并保存；重开弹窗仍能显示修改
  - 升级场景：模拟 sync -> local 迁移；确认用户数据无丢失且不被覆盖

## 发布与文档
- 更新 README 的安装与发布指引（已包含 Firefox 临时加载步骤）
- 后续可加入 web-ext 脚本以便一键打包与签名（非本次必须）

请确认以上计划，确认后我将开始实现并逐项验证。