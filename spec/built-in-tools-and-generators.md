# Built-in Tools and Generators

## 功能目的

Open Copilot 除了右側聊天面板，也提供幾個 extension origin 下執行的工具頁。這些頁面不是外部網站，也不是單純靜態範例；它們會沿用 extension runtime、provider config、storage 或內建 assets。

## 入口地圖

| 工具 | 入口 | 主要檔案 |
| --- | --- | --- |
| JSONL QA Editor | Settings `Tools` tab | `jsonl_ex.html`, `jsonl_ex.js` |
| Knowledge Base QA Tester | Settings `Tools` tab | `knowledge_base_tester.html`, `knowledge_base_tester.js` |
| RED Excel Agent Flow | Settings `Tools` tab、聊天面板 starter / flow | `red_excel_generator.html`, `red_excel_generator.js` |
| Investment Proposal Builder | 聊天面板 starter | `src/investment-proposal-builder.html`, `src/investment-proposal-builder.js` |

## Settings Tools Contract

- Tools tab 必須以卡片顯示工具，不可退化成裸連結列表。
- 工具頁應使用 `chrome.runtime.getURL(...)` 或 background opener，以 extension origin 開啟。
- 工具頁說明文字要清楚標示用途，但不取代工具本身的操作 UI。
- JSONL、KB Tester、RED Excel 必須能從 Settings Tools 直接開新分頁。

## JSONL QA Editor

### 行為契約

- 載入 JSONL 後顯示可編輯 records。
- 主要欄位包含 `canonical_question`、`question_aliases`、`answers`。
- 支援 AI assist 協助整理內容。
- 支援 draft / dirty state，避免未儲存內容遺失。
- 支援輸出或寫回 JSONL。

### Provider Contract

- AI assist 優先沿用 Open Copilot 已儲存的 provider 設定。
- 不應要求使用者在工具頁重新建立一套不相容的 provider config。

## Knowledge Base QA Tester

### 行為契約

- 支援知識文本匯入、chunking、embedding indexing、retrieval、單題 QA、batch QA。
- 主要參數包含 `topK`、`temperature`、`chunkSize`、`chunkOverlap`。
- 結果應顯示命中的 chunks，方便檢查 grounding。
- Batch result 要能對照 expected answer 並輸出 judge / advisor 訊息。

### Provider Contract

- Chat provider 使用 Open Copilot default provider。
- Embedding provider 使用 Settings 裡的 default embedding provider。
- Provider summary 要讓使用者知道目前使用哪個模型與 endpoint。

## RED Excel Agent Flow

### 行為契約

- 工具頁收集 `Model name`、`UM`、`QSG`、`Spec`、`Interface-01 Wi-Fi Radio`。
- 內建模板位於 `assets/templates/red-en18031-1-template.xlsx` 與 `assets/templates/red-en18031-2-template.xlsb`。
- 使用者不需要上傳模板即可產出兩份檔案。
- 產出檔案：
  - EN 18031-1 `.xlsx`
  - EN 18031-2 `.xlsb`
- 下載檔名需包含 timestamp、RED / EN 18031 類型與 sanitized model name。

### Spec URL Analysis

- `Analyze Spec URL` 會 fetch 使用者填入的 spec URL。
- 目前主要針對 ASUS tech spec 頁面，擷取：
  - Operating Frequency
  - I/O Ports
  - Buttons
- Operating Frequency 用來推論 Wi-Fi Radio 是 `2.4 & 5GHz` 或 `2.4 & 5 & 6GHz`。
- I/O Ports 會整理 LAN / WAN / USB overview，並 patch 到 Interfaces sheet。
- Buttons 會整理 button overview，並 patch 到 Interfaces sheet。
- 從聊天面板 starter 開啟時，background 會帶入目前頁面的 URL 與 title，工具頁可用 query string 預填 spec 與 model name。

### Workbook Patch Contract

- `.xlsx` 使用 OpenXML zip entry patch。
- `.xlsb` 使用 BIFF12 shared strings 與 sheet cell records patch。
- 必須保留模板其他內容與格式，不可整份重建為簡化表格。

## Investment Proposal Builder

### 行為契約

- 由聊天面板 built-in starter 開啟獨立 extension window。
- 主要輸入包含提案主題、研發時程、研發項目、領先業界指標、專利說明與圖片佐證。
- 圖片支援 upload / paste，並會壓縮成適合 DOCX 內嵌的 PNG data URL。
- 使用 Open Copilot provider 生成附表 6 與附表 7 的結構化 JSON。
- 若模型回傳 JSON 不完整，需嘗試 parse / repair / fallback shaping。
- 產出兩份 `.docx`，並保留重新下載按鈕。
- 草稿使用 `chrome.storage.local` 的 `investmentProposalBuilderDraft`。

### DOCX Contract

- DOCX 以 zip package 方式在前端組裝。
- 附表 6 包含流程圖 / mermaid fallback image 與圖片佐證。
- 附表 7 包含投資抵減計畫書所需章節與圖片佐證。
- 文件內容要以繁體中文為主，並符合台灣投資抵減文件語氣。

## Dist Contract

- `scripts/build-dist.mjs` 會把工具頁一起複製到 `dist/`。
- 修改工具頁或 `src/` 內的 builder 後，若要更新可載入 extension，需重新執行 dist build。
