# Investment Proposal Builder

## 功能目的

Investment Proposal Builder 是由內建 starter 開啟的獨立 extension 視窗，用來把台灣投資抵減 / 研發計畫提案資訊整理成政府審查語氣的 Word 文件。

它不是一般聊天面板內的單次 prompt，而是固定輸入欄位、固定輸出格式、固定下載產物的專用文件產生器。

## 入口與主要檔案

- in-page starter id：`builtin:investmentProposalBuilder`
- content script 入口：`openInvestmentProposalBuilderWindow()`
- background message：`investment-proposal:open-builder`
- window URL：`src/investment-proposal-builder.html`
- builder 邏輯：`src/investment-proposal-builder.js`

背景頁優先用 `chrome.windows.create()` 開啟 1180 x 900 popup；若失敗，fallback 為 `chrome.tabs.create()`。

## UI 結構契約

```text
Investment Proposal Builder
|- Hero
|  |- kicker: Investment Proposal Builder
|  |- title: 投資提案文件 starter
|  |- fixed-rule side card
|- Main grid
|  |- Form card
|  |  |- proposal topic
|  |  |- research schedule
|  |  |- research items
|  |  |- industry-leading benchmarks
|  |  |- patent notes
|  |  |- support images upload / paste
|  |  |- generate / download appendix 6 / download appendix 7 / clear draft
|  |  |- progress bar
|  |  |- status message
|  |- Result card
|     |- current provider
|     |- current model
|     |- generated filenames
|     |- output preview
```

## 輸入契約

必填：

- 提案主題
- 研發時程
- 研發項目
- 領先業界指標

選填：

- 專利申請資訊
- 圖片佐證

研發項目與領先業界指標可用換行或逗號分隔。圖片支援多張上傳與剪貼簿貼上，會先轉成尺寸上限約 1600px 的 PNG data URL 再保存與嵌入。

## 生成流程

1. 從 extension storage 讀取目前 provider / model 設定。
2. 驗證目前 provider 是否可用；Ollama 需有已選模型，Gemini / Azure OpenAI 需有對應 model 或 deployment。
3. 組合共同 prompt section，包含提案資料、固定審查語氣、圖片佐證摘要、隨機年度銷售量與營收估算。
4. 分別生成附表6與附表7 JSON。
5. 若模型輸出 JSON parse 失敗，使用 repair prompt 再請模型修復成指定 schema。
6. 以 fallback 文案補齊缺漏欄位，避免 Word 產物出現空章節。
7. 將 Mermaid 研發流程轉成可嵌入圖片。
8. 生成兩份 `.docx`，並啟用各自下載按鈕。

## 輸出契約

一次生成兩份 Word：

- 附表6：研究發展計畫重點摘要書
- 附表7：投資抵減計畫書

檔名格式：

```text
YYYYMMDD-HHMMSS-{proposal-topic}-{appendix-label}.docx
```

DOCX 內容要使用真正的 Word table / paragraph XML，不可只輸出 Markdown 讓使用者手動轉貼。

## 資料與暫存

- draft storage key：`investmentProposalBuilderDraft`
- 暫存欄位包含文字輸入與 normalized support images。
- 表單輸入會 debounce 後自動保存。
- `清除暫存` 會清空 storage draft、表單欄位、圖片、生成 artifacts 與進度狀態。

## Provider 契約

Builder 沿用 Open Copilot provider 設定，而不是另外維護一套設定。

- Ollama：使用 `selectedModel`
- LM Studio：使用 `lmStudioModel`
- Gemini：使用 `geminiModel`
- Azure OpenAI：使用 `azureOpenAiDeployment`

若設定不足，必須在狀態區清楚顯示錯誤，不應產生半成品。

## 內容語氣契約

輸出必須：

- 使用繁體中文與台灣常用制度語彙
- 以政府審查邏輯、研發必要性、技術自主性、產業升級效益為主
- 避免中國用語
- 避免保證核准、一定符合等保證性語句
- 將專利申請資訊視為佐證，不可誇大成已取得權利

## 驗收標準

- starter 點擊後能開啟獨立 builder 視窗或 fallback tab。
- 必填欄位不足時不可送出生成。
- 支援圖片上傳、貼上、移除與暫存恢復。
- 生成過程顯示可理解的進度與狀態。
- 成功後兩個下載按鈕都可下載 `.docx`。
- 重新開啟頁面時，未清除的 draft 會恢復。
