# Landing Page Template Selector And Generation Flow

## 目的

這份文件定義一種新的 starter / interactive flow：

- 使用者提供目前頁面或指定網址作為來源資料
- 系統先分析頁面內容、定位、受眾、賣點與資訊密度
- 系統顯示多個 landing page template 給使用者挑選
- 每個 template 必須帶有可視化預覽圖，而不是只有文字標籤
- 使用者選定 template 後，再生成 landing page 結果

這個功能的重點不是單次 prompt，而是把「內容理解 -> 版型選擇 -> 最終生成」做成一條可重複執行的產品化流程。

## 功能定位

這不是一般的 custom starter builder，也不是純自動跑完的 agent flow。

它屬於：

- starter 入口
- flow 型互動
- 中途需要使用者做 template selection 的 guided workflow

因此它需要比目前單純 `mode: "flow"` 更進一步的互動狀態。

## 核心使用情境

- 使用者正在看某個產品頁或品牌頁，想快速產出新的 landing page 草稿
- 使用者提供競品頁、品牌頁、技術說明頁，想轉成自己的 landing page 結構
- 使用者不懂 prompt engineering，但能辨認自己喜歡哪種版型
- 使用者需要先看預覽，再決定要讓 AI 用哪種方向生成

## 不可省略的產品要求

- template 不可只有文字名稱，必須帶預覽圖
- template selection 必須發生在生成之前
- 系統要先讀頁面內容，再決定推薦哪幾種 template
- 使用者仍可手動選擇不是系統首推的 template
- 每個 template 卡片需讓人快速理解視覺方向與資訊節奏
- 生成後要保留「原始來源頁面」與「選定 template」的對應關係

## Template 類型

### 1. Product Hero

適合：

- 單一產品主打頁
- 新產品發表頁
- 活動主視覺頁

典型結構：

- hero
- 核心賣點
- 產品畫面或示意圖
- 補充 feature sections
- CTA

重點：

- 快速建立「這是什麼」
- 強主標、強視覺、少量高辨識賣點

### 2. Product Hero / Tech Explainer

適合：

- 技術規格頁
- 平台能力介紹頁
- 硬體 / AI / infra / networking 說明頁
- 像 TP-Link WiFi 8 這類技術教育型 landing page

典型結構：

- hero
- 什麼是這項技術
- 問題場景或使用情境
- 核心技術機制
- 比較 / 規格 / 演進差異
- FAQ
- CTA

重點：

- 不只是賣產品，也要把技術講懂
- 可信度、結構清楚、資訊說服力比情緒渲染更重要

### 3. SaaS Conversion

適合：

- SaaS 首頁
- 註冊試用導向頁
- 預約 demo 導向頁
- B2B / B2C software 轉換頁

典型結構：

- hero
- social proof
- features
- use cases
- pricing cue / demo cue
- FAQ / objections
- CTA

重點：

- 轉換優先
- 要快速建立信任並引導行動

### 4. Story / Brand Narrative

適合：

- 品牌官網首頁
- 設計工作室
- DTC 品牌
- 理念驅動型產品或服務

典型結構：

- hero
- brand worldview
- story sections
- values / philosophy
- signature offering
- CTA

重點：

- 品牌情緒、世界觀、語氣與敘事節奏
- 不以大量 feature 說明為主

## Template Selector 契約

### 核心原則

- selector 是必要步驟，不是可有可無的小視窗
- 使用者應先看到 template card，再決定是否生成
- 預覽圖必須足以讓非設計背景使用者理解版型差異

### 每張卡片至少要包含

- `templateId`
- `label`
- `oneLineSummary`
- `previewImage`
- `recommendedFor`
- `sectionOutline`
- `visualTags`
- `isRecommended`

### 卡片文案範例

- `Product Hero`
  - summary: 清楚介紹產品，主視覺先行
- `Product Hero / Tech Explainer`
  - summary: 用更結構化的方式講懂技術與價值
- `SaaS Conversion`
  - summary: 以試用、註冊、demo 轉換為主
- `Story / Brand Narrative`
  - summary: 先建立品牌世界觀與情緒，再帶出產品

## Preview Image 契約

### 不可只用文字

- template 選擇時不可只顯示名稱與描述
- 至少要顯示靜態預覽縮圖
- 卡片需支援放大查看預覽

### MVP 做法

- 每個 template 先提供一張固定 mockup 圖
- mockup 以 wireframe 或 high-fidelity 靜態示意圖皆可
- 第一版不要求先用 AI 產生動態 preview

### 進階做法

- 未來可升級成根據同一份來源內容，生成各 template 的低保真 preview
- 但這不是 MVP 必要條件

## Starter / Flow 行為

### 入口

建議新增 built-in starter，例如：

- `landingPageFromCurrentPage`
- `landingPageFromUrl`

兩者都可以進入同一套 selector flow。

### 流程階段

1. `collect`
   - 使用目前頁面或使用者提供的 URL
2. `analyze`
   - 抽取頁面定位、受眾、賣點、資訊密度、品牌語氣
3. `recommend`
   - 顯示 4 張 template cards
4. `select`
   - 使用者選擇其中一個 template
5. `generate`
   - 依模板與來源資料生成 landing page
6. `revise`
   - 使用者可再要求改版或重新換模板

## 為什麼不能只用現有 Agent Flow

目前的 agent flow 偏向：

- step 1 跑完
- 自動餵 step 2
- 自動餵 step 3

但這個 landing page 流程中間需要：

- 呈現 selector UI
- 等待使用者點選 template
- 將點選結果寫回 flow state
- 再繼續生成

所以它需要一種「interactive flow state」，不能只靠目前純自動執行的 `flowSteps` 模式。

## UI 契約

### In-page modal

```text
Landing Page Builder

+--------------------------------------------------------------------------------+
| Source                                                                        |
| [Current Page] [Paste URL]                                                    |
| URL / source summary                                                          |
|--------------------------------------------------------------------------------|
| Recommended Templates                                                         |
| [card preview] [card preview] [card preview] [card preview]                   |
|--------------------------------------------------------------------------------|
| Selected Template                                                             |
| Preview image                                                                 |
| Why this fits                                                                 |
| Section outline                                                               |
| [Choose Template] [Generate Landing Page]                                     |
+--------------------------------------------------------------------------------+
```

### 卡片互動

- hover 時顯示更完整摘要
- click 時切換成 selected 狀態
- selected 卡片需有明顯外框與高亮
- 可開啟 larger preview

### 視覺要求

- 預覽圖尺寸不可太小，小到看不出版型差異
- 卡片在桌面至少 2 欄，寬畫面可 4 欄
- 手機或窄面板時可改成橫向可滑動卡片列

## Starter 排序策略

landing page builder 作為 starter 入口的一種，建議支援少量但明確的排序方式，讓使用者可依偏好切換，而不是永遠只吃單一推薦順序。

### 建議內建排序方式

- `recommended`
  - 預設值
  - 依目前頁面內容分析結果排序，最適合的 starter 排最前面
- `recently-used`
  - 讓使用者快速回到最近常用的 starter
- `a-z`
  - 依名稱排序，方便熟悉系統的使用者掃描
- `manual`
  - 允許使用者自定顯示順序，例如 pin 到最前面或拖曳排序

### 產品原則

- 第一次使用時，預設採用 `recommended`
- 使用者切換過排序方式後，系統可記住上次選擇
- 若使用者選擇 `manual`，自定順序應優先於推薦順序
- 即使不是 `recommended` 排序，仍可保留 recommended badge，避免推薦訊號消失
- 搜尋結果應優先套用關鍵字過濾，再在結果內使用目前排序方式

### `manual` 模式建議

- 支援 `pin to top`
- 支援拖曳調整個人順序
- 若不做完整拖曳，MVP 也可先只做 pin / unpin
- 自定排序應屬於 per-user preference，不要影響全域 starter catalog

### 排序資料模型建議

```json
{
  "starterSortMode": "recommended",
  "starterPinnedIds": [],
  "starterManualOrder": [],
  "starterLastUsedAt": {
    "landingPageFromCurrentPage": "2026-04-20T10:30:00.000Z"
  }
}
```

### 排序優先級建議

1. 先套用搜尋過濾
2. 若有 pinned starters，固定顯示在最前面
3. 其餘項目依目前選定的 sort mode 排序
4. 同分時再 fallback 到 `recommended` 或 `a-z`

### 為什麼值得做

- 新手可以先吃系統推薦，不會被太多 starter 淹沒
- 熟手可以切成 `recently-used` 或 `manual`，降低重複操作成本
- 產品不需要在「系統決定」與「完全自由」之間二選一

## 資料模型

### Template definition

```json
{
  "id": "product-hero-tech-explainer",
  "label": "Product Hero / Tech Explainer",
  "oneLineSummary": "Use a structured layout to explain the technology and its value clearly.",
  "previewImage": "assets/templates/product-hero-tech-explainer.png",
  "recommendedFor": ["networking", "hardware", "AI", "platform", "technology"],
  "sectionOutline": [
    "Hero",
    "What It Is",
    "Problem Scenarios",
    "Core Technologies",
    "Comparison",
    "FAQ",
    "CTA"
  ],
  "visualTags": ["technical", "structured", "credible", "high-information-density"]
}
```

### Flow state

```json
{
  "sourceType": "current-page",
  "sourceUrl": "",
  "analysisSummary": "",
  "recommendedTemplateIds": [],
  "selectedTemplateId": "",
  "generationStatus": "idle",
  "generatedOutput": ""
}
```

## 推薦邏輯

系統可根據以下訊號推薦 template：

- 頁面是否偏產品介紹
- 頁面是否偏技術說明
- 頁面是否有大量功能與比較段落
- 頁面是否強調註冊、demo、pricing、ROI
- 頁面是否偏品牌故事、理念、情緒敘事

### 推薦範例

- 若頁面像 TP-Link WiFi 8：
  - 首推 `Product Hero / Tech Explainer`
- 若頁面像 Linear / Notion 首頁：
  - 首推 `SaaS Conversion`
- 若頁面像一般新品發表頁：
  - 首推 `Product Hero`
- 若頁面像 Patagonia 品牌頁：
  - 首推 `Story / Brand Narrative`

## Prompt Contract

### Analyze 階段

模型應先整理：

- 這個頁面主要在賣什麼
- 主要受眾
- 核心賣點
- 資訊密度高或低
- 是偏品牌、偏產品、偏技術、還是偏轉換
- 最適合的 template 與原因

### Generate 階段

模型需收到：

- 來源頁面內容
- analyze summary
- selected template id
- selected template section outline
- 回覆格式要求

生成時不可忽略使用者選定的 template 結構。

## DOM / 狀態命名建議

### 新增狀態

- `landingPageBuilderOpen`
- `landingPageBuilderDraft`
- `landingPageTemplateCatalog`
- `landingPageSelectedTemplateId`
- `landingPageAnalysisSummary`
- `landingPageGeneratedResult`

### 新增 DOM 節點建議

```text
.ollama-quick-landing-page-builder
|- .ollama-quick-landing-page-source
|- .ollama-quick-landing-page-analysis
|- .ollama-quick-landing-page-template-grid
|  |- button.ollama-quick-landing-page-template-card x N
|- .ollama-quick-landing-page-template-preview
|- .ollama-quick-landing-page-actions
```

## 驗收標準

- 使用者能從 starter 入口進入 landing page builder
- builder 可讀取目前頁面或接收使用者輸入 URL
- 分析完成後，至少顯示 4 種 template cards
- 每張 card 都有圖片預覽
- 使用者可清楚選到其中一種 template
- 系統生成結果時，會明顯依所選 template 呈現不同結構
- 同一份來源內容，切換不同 template 時，生成結果應有可見差異

## 非目標

- 第一版不要求做完整可視化 page editor
- 第一版不要求在 selector 階段就生成 fully dynamic preview image
- 第一版不要求自動輸出 production-ready 多頁網站
- 第一版不要求取代現有 custom starter builder

## 建議實作順序

1. 補上 4 種 template catalog 與固定 preview 圖資產
2. 新增 landing page builder modal
3. 接上 analyze source page 的 prompt
4. 接上 template selection state
5. 接上 generate landing page 的 prompt
6. 最後再補強 revise / regenerate / switch template 體驗
