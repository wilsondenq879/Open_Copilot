# GitHub Article Structure Review Starter

## 目的

這份文件定義一種固定用途的 custom starter skill：

- 先讀取使用者附加的 GitHub 文章或文件
- 抽出文章的章節結構、評估框架與重點欄位
- 再用同一套架構去 review 目前頁面

這很適合拿來做：

- PRD / spec 對照頁面檢查
- README / design doc 對照現有介面 review
- external article / framework 對照目前網站或文件

## 依賴前提

- 使用者已在 settings 設定 GitHub API Key
- 使用者會透過 `GitHub Sources` 把文章、README 或單一文件附加進來
- 目前頁面 context 保持 `Auto` 或 `Always`

這個 starter 依賴的是既有的 attachment / page context 機制，不需要新增另一套 GitHub article 執行器。

## 核心行為

模型收到 prompt 後應依序做：

1. 先辨識附加的 GitHub source 中，哪一份是主要參考文章
2. 抽出文章的 review 架構，例如：
   - sections
   - criteria
   - questions
   - required evidence
3. 用這個架構檢查目前頁面
4. 清楚區分：
   - 文章原本要求了什麼
   - 目前頁面已滿足什麼
   - 缺了什麼
   - 有哪些不一致、風險、模糊點
5. 如果 GitHub 文章不足、頁面 context 不足，必須明說缺少什麼

## 建議輸出格式

- `Framework`
  - 用短條列整理 GitHub 文章的章節或 review 面向
- `Findings`
  - 依嚴重程度排序
- `Coverage Map`
  - 標示每個章節在目前頁面的對應情況：`covered` / `partial` / `missing`
- `Open Questions`
  - 無法從目前頁面確認的地方
- `Recommended Next Fixes`
  - 最多 3 項，優先處理高影響缺口

## Starter JSON

下面這組 JSON 可以直接貼進 Settings 的 custom starter 區塊：

```json
[
  {
    "id": "github-article-structure-review",
    "label": "GitHub Article Review",
    "description": "Read an attached GitHub article or doc, extract its structure, and review the current page against that framework.",
    "prompt": "請先閱讀我附加的 GitHub source，找出最主要的文章、README 或 spec，整理出它的章節結構、評估面向、關鍵問題與要求。接著不要改寫成另一套框架，而是直接沿用那篇文章的原始結構，review 目前頁面。請明確指出：1. 文章的每個章節或面向在目前頁面是否有對應；2. 哪些內容已覆蓋、哪些只有部分覆蓋、哪些缺失；3. 哪些地方與文章的要求或精神不一致；4. 哪些地方會造成理解落差、資訊不足、UX 風險或需求風險。請優先依嚴重程度列出 findings，再補一個 coverage map。若附加的 GitHub 文章不足以形成穩定框架，或目前頁面資訊不足以判斷，請直接說明缺少哪些內容，不要硬猜。",
    "scopes": ["github", "article", "document", "generic"],
    "mode": "chat"
  }
]
```

## 使用方式

1. 打開要 review 的頁面
2. 把 `Current Page Context` 保持在 `Auto` 或切成 `Always`
3. 用 `GitHub Sources` 附加目標文章、README 或 spec 檔案
4. 點這個 starter
5. 若需要，可以再補一句額外要求，例如：
   - `請偏重 UX readability`
   - `請偏重 onboarding flow`
   - `請偏重需求缺口與 PM 風險`

## 設計注意事項

- 這個 starter 應該優先吃 `GitHub Sources`，不是只靠目前頁面猜文章內容
- 它適合做「文章框架映射到頁面」；不適合假裝自己能自動追多篇 repo 文件
- 如果要做多篇文件比對，建議升級成 flow，而不是把單一 starter prompt 撐太胖
- 若目前頁面本身就是 GitHub 頁面，這個 starter 仍可運作，但要提醒模型不要把 PR diff 當成唯一真相，仍需以附加文章作為主框架
