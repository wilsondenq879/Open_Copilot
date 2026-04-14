# Open Copilot Rebuild Specs

這份 `spec/` 不是一般產品摘要，而是提供給另一個 AI 或新接手工程師，用來重建 Open Copilot 的功能與畫面風格。

目標不是「做出類似產品」，而是盡可能做出和目前專案一致的資訊架構、互動節奏、主要狀態、視覺語言與資料流。

## 重建原則

- 先遵守功能 contract，再做內部實作替換。
- 先遵守畫面結構與樣式語氣，再微調視覺細節。
- 使用者感受到的操作流程要與現有版本一致。
- 若重建時遇到不明確處，優先以本 repo 的 `src/*.html`、`src/*.js`、`src/*.css` 為準。

## 必讀文件

1. [Design System and UI Language](./design-system-and-ui-language.md)
2. [Visual Style Tokens](./visual-style-tokens.md)
3. [Component Inventory and DOM Contract](./component-inventory-and-dom-contract.md)
4. [Interaction and State Machine](./interaction-and-state-machine.md)
5. [Data Model and Payload Contract](./data-model-and-payload-contract.md)
6. [In-Page Chat Panel](./in-page-chat-panel.md)
7. [Attachments and Context](./attachments-and-context.md)
8. [Starters and Agent Flows](./starters-and-agent-flows.md)
9. [Multi-Perspective Analysis](./multi-perspective-analysis.md)
10. [GitHub Article Structure Review Starter](./github-article-structure-review-starter.md)
11. [Task Reminders](./task-reminders.md)
12. [Local Work Folder and Drive Sync](./local-work-folder-and-drive-sync.md)
13. [Settings and Provider Config](./settings-and-provider-config.md)
14. [Popup Model Selection](./popup-model-selection.md)

## 主要原始碼對照

| 領域 | 主要檔案 |
| --- | --- |
| Popup | `src/popup.html`, `src/popup.js`, `src/ui.css` |
| Settings | `src/options.html`, `src/options.js`, `src/ui.css` |
| In-page UI | `src/content-script.js`, `src/injected.css` |
| 資料與背景邏輯 | `src/background.js` |
| Browser extension 定義 | `manifest.json` |

## 功能地圖

| 功能 | 入口 | 核心行為 |
| --- | --- | --- |
| Popup 模型切換 | extension popup | 看 endpoint、抓模型、切換 selected model |
| Settings | options page | 以 top-level tabs 管理 General、AI Provider、Notifications、Starter、Agent Flow |
| 浮動聊天面板 | 任意一般網頁 | 右側 launcher、收合展開、聊天、最大化 |
| Context / Attachments | 聊天面板 | 自動頁面 context、圖片、文件、GitHub source、tabs |
| Starters / Flows | 聊天面板與 settings | 依頁型推薦、快速套用、建立 reusable workflows |
| Multi-Perspective | 聊天面板 | 多個角色逐步分析，最後 synthesis |
| Task Reminders | 聊天面板 | 從聊天抽 task，儲存 reminder，做 alarm/notification |
| Local / Drive Sync | settings + export | 本機資料夾與 Google Drive app data 同步 |
| Batch URL QA | 聊天面板 workflow + settings logs | 批次讀網址、產生 grounded FAQ、輸出單一 JSONL、記錄 job 狀態 |
| Notifications | settings | Telegram / LINE / Teams / Slack / Discord 測試與完成通知 |
| UI Localization | popup + settings + in-page panel | `uiLanguage` 控制介面語言，`replyLanguage` 控制模型回覆語言 |
| Teams Inline Action | Microsoft Teams 頁面 | hover 訊息時顯示 `Send to Open Copilot` 動作 |

## 對 AI 重建者的要求

- 不可把右側浮動工作台改成一般全頁聊天頁。
- 不可把視覺風格改成通用白底 SaaS 面板。
- 不可把 starters 降級成單純 prompt dropdown。
- 不可忽略 maximized workspace、task rail、include panels。
- 不可省略資料狀態：`selectedModel`、`pageContextMode`、`chatMessages`、`customStarters`、`taskReminderItems`。

## 共享樣式結論

- Settings / Popup：深色玻璃感儀表板，藍青色光暈，厚圓角，高透明度卡片。
- In-page panel：超高 z-index 的右側浮動工作台，含發光 orb launcher。
- 視覺氣質：不是極簡企業後台，而是「local-first AI cockpit」。

## 近期已跟上的實作重點

- Settings 已不是單一長表單，而是上層分成 `General`、`AI Provider`、`Notifications`、`Starter`、`Agent Flow` 五個 tab。
- `uiLanguage` 已與 `replyLanguage` 分離；popup 會優先跟 `uiLanguage` 走。
- 通知通道已包含 Telegram、LINE、Teams、Slack、Discord。
- Batch URL QA 已改為輸出 `.jsonl`，並支援 job logs、取消執行、唯一檔名與完成通知。
- Teams 頁面支援 inline `Send to Open Copilot` hover action。
