# Open Copilot Project Index

這份索引的目的，是讓之後每次對談都能先用「功能區塊」縮小範圍，再進一步讀必要檔案，降低 context 消耗。

## 使用方式

之後你可以直接這樣跟我說：

- `看 PROJECT_INDEX，幫我改聊天面板的附件流程`
- `看 PROJECT_INDEX，幫我調整 settings 的通知區`
- `看 PROJECT_INDEX，幫我改 knowledge base tester 的 chunking`
- `看 PROJECT_INDEX，幫我查 GitHub 頁面的 context 擷取`
- `看 PROJECT_INDEX，幫我改 RED Excel Agent Flow 的 spec 解析`
- `看 PROJECT_INDEX，幫我改投資提案文件產生器的 Word 匯出`

建議描述格式：

- `功能區塊 + 想改的行為 + 是否只改 UI / 邏輯 / provider`
- 例：`改 in-page chat panel 的 task 提醒 UI，不動 background notification`

## 先看哪裡

### 1. Extension 主體

- `manifest.json`
  - Extension 入口定義
  - background / popup / options / content script 掛載位置
- `src/background.js`
  - 背景邏輯與 provider 路由核心
  - storage / work folder / Drive sync / notification / model API / GitHub API / batch jobs
- `src/content-script.js`
  - 注入網頁的聊天面板主體
  - page context 擷取、starter、attachments、multi-perspective、agent flow、task UI、聊天 rendering
- `src/injected.css`
  - 網頁內浮動面板樣式
- `src/options.js`
  - 設定頁邏輯
  - provider config、embedding provider、通知設定、skills、Agent Flow、工具頁入口
- `src/options.html`
  - 設定頁 DOM
- `src/popup.js`
  - extension popup 模型選擇與狀態
- `src/popup.html`
  - popup DOM
- `src/ui.css`
  - popup / options 共用樣式
- `src/investment-proposal-builder.html`
  - 投資提案文件產生器 DOM 與頁面樣式
- `src/investment-proposal-builder.js`
  - 投資提案附表 6 / 附表 7 的 AI JSON 生成、DOCX 組裝、圖片附件、草稿暫存

### 2. 獨立工具頁

- `knowledge_base_tester.html`
  - Knowledge Base QA Tester 畫面
  - 主題、欄位配置、操作區塊
- `knowledge_base_tester.js`
  - KB chunking / embedding / retrieval / QA / judge / batch test / advisor
- `jsonl_ex.html`
  - JSONL QA Editor 畫面
- `jsonl_ex.js`
  - JSONL 載入、編輯、AI assist、輸出與寫檔
- `red_excel_generator.html`
  - RED Excel Agent Flow 畫面
- `red_excel_generator.js`
  - ASUS spec URL 解析、EN 18031-1 `.xlsx` / EN 18031-2 `.xlsb` 模板 patch 與下載

### 3. 文件與規格

- `README.md`
  - 專案對外說明與功能概觀
- `spec/README.md`
  - 重建導向總覽，適合快速理解整體資訊架構
- `spec/*.md`
  - 各子系統的功能 contract、資料模型、互動節奏、視覺語言
- `DIST_UPDATE_SOP.md`
  - `dist/` 同步流程
- `scripts/build-dist.mjs`
  - 將 extension source、assets 與工具頁複製到 `dist/`

## 常見修改需求對照

### 聊天面板 UI / 互動

優先看：

- `src/content-script.js`
- `src/injected.css`

關鍵內容：

- panel 開關、maximize、launcher 拖曳
- message rendering
- attachments 顯示
- include picker / local document picker / browser tab picker
- task inbox / batch QA rail / starter builder UI

適合這樣描述：

- `改聊天面板右側 UI`
- `調整 launcher 位置與拖曳`
- `改附件卡片樣式`
- `改訊息 render 或 markdown 呈現`

### 頁面內容擷取 / Context 組裝

優先看：

- `src/content-script.js`
- `src/background.js`

關鍵內容：

- page text snapshot
- headings / images / selection / child frame context
- GitHub / Teams / Email / Office 頁面專用擷取
- 最後送給模型前的 prompt 組裝

適合這樣描述：

- `改 GitHub 頁面的 context 擷取`
- `調整 page context 長度`
- `改 Teams message 匯入 prompt`

### Provider / 模型呼叫 / 串流

優先看：

- `src/background.js`
- `src/popup.js`
- `src/options.js`

關鍵內容：

- Ollama / LM Studio / Gemini / Azure OpenAI
- list models
- stream chat
- provider config 儲存
- selected model / model routing

適合這樣描述：

- `改 Ollama 串流`
- `加 Azure OpenAI 行為`
- `調整 popup 模型刷新`

### Settings 設定頁

優先看：

- `src/options.js`
- `src/options.html`
- `src/ui.css`

關鍵內容：

- provider tabs
- embedding provider settings
- notification settings
- local work folder
- Google Drive sync
- custom starters library
- Agent Flow editor
- 工具頁入口

適合這樣描述：

- `改 settings 的通知區`
- `改 starter library`
- `改 embedding provider 選項`
- `改 Tools 分頁工具卡`
- `改 Google Drive sync UI`

### Popup

優先看：

- `src/popup.js`
- `src/popup.html`
- `src/ui.css`

關鍵內容：

- 模型列表
- endpoint 狀態
- i18n
- selected model 切換

### Work Folder / 匯出 / 同步

優先看：

- `src/background.js`
- `src/options.js`
- `src/content-script.js`

關鍵內容：

- IndexedDB / storage
- local work folder handle
- chat export
- starter / task / dataset / sync 檔案寫入
- Google Drive app data sync

適合這樣描述：

- `改下載 MD 的檔名`
- `改 work folder dataset 儲存`
- `改 Drive sync payload`

### 通知與提醒

優先看：

- `src/background.js`
- `src/options.js`
- `src/content-script.js`

關鍵內容：

- Telegram / LINE / Teams / Slack / Discord
- task reminder alarm / notification
- Agent Flow 完成通知
- batch URL QA 完成通知

適合這樣描述：

- `改 Telegram 通知格式`
- `改 task reminder 觸發`
- `改通知測試按鈕`

### Starters / Agent Flow / 多視角

優先看：

- `src/content-script.js`
- `src/options.js`
- `src/background.js`

關鍵內容：

- built-in starters
- custom starters import / normalize / persist
- starter AI editor
- Agent Flow builder / runner
- built-in RED Excel flow
- investment proposal builder launcher
- multi-perspective prompt 與輸出
- HTML / PowerPoint 匯出型 starters

適合這樣描述：

- `改 starter 推薦邏輯`
- `改 Agent Flow 執行`
- `改多視角 synthesis`
- `改 HTML / PowerPoint 簡報輸出`
- `改投資提案文件 starter`
- `改 RED Excel flow 入口`

### GitHub 相關能力

優先看：

- `src/content-script.js`
- `src/background.js`
- `spec/github-article-structure-review-starter.md`

關鍵內容：

- GitHub repo / file context 擷取
- include GitHub sources
- recent GitHub files
- GitHub API fetch

適合這樣描述：

- `改 GitHub file include`
- `改 repo README 擷取`
- `改 PR / diff 類頁面的 starter`

### Task Reminders

優先看：

- `src/content-script.js`
- `src/background.js`
- `spec/task-reminders.md`

關鍵內容：

- 從聊天抽 task candidates
- task inbox UI
- alarm schedule
- reminder record 儲存

### Batch URL QA

優先看：

- `src/content-script.js`
- `src/background.js`
- `src/options.js`

關鍵內容：

- builder UI
- job 狀態輪詢
- page fetch / page context
- QA 生成
- JSONL 輸出
- work folder 寫入

### RED Excel Agent Flow

優先看：

- `red_excel_generator.js`
- `red_excel_generator.html`
- `assets/templates/red-en18031-1-template.xlsx`
- `assets/templates/red-en18031-2-template.xlsb`
- `src/background.js`
- `src/options.js`
- `src/content-script.js`

關鍵內容：

- Settings Tools 分頁與 Starter/Flow 卡片入口
- `red-excel:open-generator` background window opener
- 從目前頁面帶入 `spec` URL 與頁面標題
- ASUS spec URL 的 Operating Frequency / I/O Ports / Buttons 解析
- Wi-Fi Radio 2.4/5 或 2.4/5/6GHz 推論
- `.xlsx` OpenXML sheet patch
- `.xlsb` BIFF12 shared string / cell patch
- EN 18031-1 / EN 18031-2 檔名與下載

適合這樣描述：

- `改 RED Excel 的 spec URL 解析`
- `改 EN 18031-2 xlsb 欄位`
- `改 Interface-01 Wi-Fi Radio 推論`
- `改 RED Excel 產出檔名`

### 投資提案文件產生器

優先看：

- `src/investment-proposal-builder.js`
- `src/investment-proposal-builder.html`
- `src/background.js`
- `src/content-script.js`

關鍵內容：

- `investment-proposal:open-builder` background window opener
- proposal topic / 研發時程 / 研發項目 / benchmark / 專利說明輸入
- 圖片附件 paste / upload / 壓縮 / Word 內嵌
- 使用目前 Open Copilot provider 與 selected model 生成附表 6 / 附表 7 JSON
- JSON parse / repair / fallback shaping
- DOCX ZIP package 組裝與下載
- `chrome.storage.local` 草稿暫存

適合這樣描述：

- `改投資提案文件的 prompt`
- `改附表6 DOCX 格式`
- `改圖片佐證區`
- `改草稿暫存`

## 獨立工具頁索引

### Knowledge Base QA Tester

檔案：

- `knowledge_base_tester.html`
- `knowledge_base_tester.js`

主要範圍：

- provider / embedding provider 摘要
- chunk 參數：`topK`、`temperature`、`chunkSize`、`chunkOverlap`
- 知識文本匯入與切塊
- embedding 建索引
- retrieval
- 單題 QA
- judge scoring
- batch cases
- advisor chat
- work folder dataset index 存取

如果你之後要我改這塊，建議直接說：

- `改 KB tester 的 chunking`
- `改 KB tester 的 embedding provider`
- `改 KB tester 的 judge prompt`
- `改 KB tester 的 batch result 呈現`

### JSONL QA Editor

檔案：

- `jsonl_ex.html`
- `jsonl_ex.js`

主要範圍：

- JSONL 載入 / parse
- record 編輯
- dirty draft 暫存
- AI assist 產生答案
- 寫回檔案 / download

### RED Excel Agent Flow

檔案：

- `red_excel_generator.html`
- `red_excel_generator.js`
- `assets/templates/red-en18031-1-template.xlsx`
- `assets/templates/red-en18031-2-template.xlsb`

主要範圍：

- Cover 欄位：model name、UM、QSG、Spec
- Interface-01 Wi-Fi Radio 選項與自動推論
- ASUS spec URL 分析：I/O ports、buttons、operating frequency
- 產出 EN 18031-1 `.xlsx` 與 EN 18031-2 `.xlsb`

### Investment Proposal Builder

檔案：

- `src/investment-proposal-builder.html`
- `src/investment-proposal-builder.js`

主要範圍：

- 台灣投資抵減附表 6 / 附表 7 Word 文件
- AI 產生結構化 JSON 後組成 DOCX
- 支援圖片佐證附件
- 使用 `chrome.storage.local` 保存草稿

## 規格文件索引

當我要「理解 intent」而不是只修 bug，優先可看這些：

- `spec/design-system-and-ui-language.md`
  - 整體視覺語氣
- `spec/visual-style-tokens.md`
  - 顏色、圓角、玻璃感、token
- `spec/component-inventory-and-dom-contract.md`
  - DOM 結構與元件清單
- `spec/interaction-and-state-machine.md`
  - 狀態切換與互動節奏
- `spec/data-model-and-payload-contract.md`
  - storage / payload / message 結構
- `spec/in-page-chat-panel.md`
  - 右側聊天面板 contract
- `spec/attachments-and-context.md`
  - 附件與 context 規則
- `spec/starters-and-agent-flows.md`
  - starter / flow 定義
- `spec/built-in-tools-and-generators.md`
  - JSONL、KB Tester、RED Excel、Investment Proposal 等工具頁 contract
- `spec/powerpoint-starter-and-export.md`
  - PowerPoint starter、`.pptx` 匯出契約與 smoke test flow
- `spec/multi-perspective-analysis.md`
  - 多視角分析流程
- `spec/local-work-folder-and-drive-sync.md`
  - 本機資料夾與 Drive sync
- `spec/settings-and-provider-config.md`
  - Settings 頁結構與 provider 設定
- `spec/popup-model-selection.md`
  - popup 模型選擇行為
- `spec/task-reminders.md`
  - task reminder 資料流
- `spec/landing-page-template-selector-and-generation-flow.md`
  - Landing Page Builder template selector 與生成流程
- `spec/github-article-structure-review-starter.md`
  - GitHub 文章結構審查 starter

## 目錄級地圖

- `src/`
  - extension 主體
- `spec/`
  - 重建與功能 contract
- `assets/icons/`
  - extension icons
- `assets/templates/`
  - RED Excel 內建模板
- `images/`
  - README 圖片
- `tutorial_code_assistant/`
  - 教學素材
- `tutorial_web_summarizer/`
  - 教學素材
- `dist/`
  - 載入到 Edge 的成品，包含 extension source、assets、獨立工具頁
- `scripts/build-dist.mjs`
  - dist 建置腳本

## 對談時的最佳引用方式

如果你想讓我最快定位，直接引用下面其中一種格式：

- `Index: in-page chat panel / attachments / UI only`
- `Index: settings / notifications / Telegram + Teams`
- `Index: KB tester / retrieval + judge`
- `Index: background / provider routing / Ollama`
- `Index: GitHub context / content-script`
- `Index: RED Excel / spec parser / xlsb`
- `Index: Investment proposal / DOCX export`

## 高頻入口總結

最常會先看的其實只有幾個：

- `src/content-script.js`
- `src/background.js`
- `src/options.js`
- `knowledge_base_tester.js`
- `jsonl_ex.js`
- `red_excel_generator.js`
- `spec/README.md`

如果你之後沒有特別指定，我會先根據這份索引把問題歸到其中一區，再只讀必要檔案。
