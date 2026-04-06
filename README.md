# Edge AI Chat

這個專案是一個 Microsoft Edge Manifest V3 擴充套件，會在網頁中注入一個可收合的聊天面板，將目前頁面內容、選取文字與附件整理後送到本機 Ollama。

它不是 GitHub 官方 Copilot provider 整合，而是一個瀏覽器端的本機 AI chat bridge。重點是讓你在任何頁面上，直接用本機模型做摘要、翻譯、解釋程式碼、分析圖片與文字檔。

## 功能概要

- 預設連到本機 Ollama：`http://127.0.0.1:11434`
- 從 Ollama `/api/tags` 讀取已安裝模型
- 在擴充功能 popup 中快速切換目前使用模型
- 在網頁右下角注入 Edge AI Chat 浮動面板
- 可把目前頁面內容當成 prompt context 一起送出
- 可直接帶入目前選取文字
- 支援串流回應
- 支援圖片附件與文字檔附件
- 內建快捷 starter prompts
- 支援多語系回覆語言設定

## 預設設定

- Ollama URL: `http://127.0.0.1:11434`
- LM Studio URL: `http://127.0.0.1:1234`
- 預設回覆語言: `zh-TW`

Ollama URL 可以在擴充功能設定頁中修改。

## 使用前準備

請先確認本機 Ollama 已啟動，而且至少有一個模型可用。例如：

```bash
ollama serve
```

另一個終端機可以確認模型列表：

```bash
ollama list
```

如果沒有模型，可以先拉一個：

```bash
ollama pull llama3.2
```

如果你要分析圖片，請改用支援 vision 的模型，例如名稱裡有 `vision`、`vl`、`llava`、`qwen-vl` 這類模型。

## 安裝到 Edge

1. 開啟 `edge://extensions`
2. 打開 `Developer mode`
3. 點 `Load unpacked`
4. 選擇這個專案資料夾

載入後，建議先做兩件事：

1. 點一下擴充功能圖示，確認能抓到 Ollama 模型
2. 打開 `Settings`，確認 Ollama URL 是 `http://127.0.0.1:11434`

## 介面說明

### 1. Popup

點擊瀏覽器工具列上的擴充功能圖示後，可以看到：

- Endpoint：目前 Ollama 端點
- Settings：開啟設定頁
- Models：目前偵測到的 Ollama 模型
- Refresh：重新抓取模型列表

直接點模型卡片，就會把它設成目前使用模型。

### 2. Settings 頁

設定頁目前包含：

- Ollama URL
- LM Studio URL
- LM Studio 預設模型 ID
- LM Studio API Key
- Reply Language
- Test Connection
- Installed Models / Refresh

雖然介面已經有 LM Studio 設定欄位，但目前主要聊天路徑仍是走 Ollama。

### 3. 網頁右下角聊天面板

載入一般網頁後，右下角會出現浮動聊天按鈕。打開後可使用：

- 模型下拉選單：切換當前 Ollama 模型
- `Context` 開關：決定是否把目前頁面內容一起送給模型
- Starter 按鈕
- `✦`：把目前反白選取的文字直接放進輸入框
- `Clear`：清空目前對話與附件
- `⚙`：開啟設定頁
- `-`：收合面板
- `⊕`：上傳圖片或文字檔附件
- `➤`：送出訊息

## 面板會帶哪些頁面資訊

當 `Context` 開啟時，送出的 prompt 會自動包含：

- 頁面標題
- 頁面 URL
- meta description
- 頁面上的 `h1` / `h2` / `h3`
- 使用者目前選取的文字
- 頁面可見文字內容的一部分
- 最近幾輪對話歷史

如果 `Context` 關掉，就不會附帶這些頁面內容。

## Starter Prompts

目前內建的快速範本有：

- `Summarize This Page`
- `Translate Page To <目前回覆語言>`
- `Explain Code Clearly`
- `Analyze Image`
- `Analyze Image To md/mermaid`

這些按鈕只會幫你先填入 prompt，你還是可以再自行修改後送出。

## 快捷鍵

- `Ctrl + /` 或 `Cmd + /`：開啟 / 收合聊天面板
- `Ctrl + Enter` 或 `Cmd + Enter`：在輸入框內送出訊息

注意：

- `Ctrl/Cmd + /` 只有在你沒有把游標放在輸入框、textarea 或可編輯區塊裡時才會觸發
- 純 `Enter` 不會直接送出，會保留給多行輸入

## 附件支援

### 圖片

支援從以下方式附加圖片：

- 點 `⊕` 選檔
- 把圖片拖放進聊天面板
- 在輸入框中直接貼上剪貼簿圖片

### 文字檔

支援以下格式：

- `.txt`
- `.md`
- `.json`
- `.csv`

文字檔內容會被讀進 prompt，一起送給模型分析。

## 建議使用流程

1. 先在 popup 或設定頁確認 Ollama 連線成功
2. 選一個模型
3. 打開任意網頁右下角面板
4. 視需求決定是否開啟 `Context`
5. 直接輸入問題，或先用 starter / 選取文字 / 附件
6. 用 `Ctrl/Cmd + Enter` 送出

## 常見情境

### 摘要整頁內容

1. 打開面板
2. 保持 `Context` 開啟
3. 點 `Summarize This Page`
4. 送出

### 解釋目前頁面的程式碼片段

1. 在頁面上先反白程式碼
2. 點 `✦`
3. 補上你想問的內容
4. 送出

### 分析截圖或設計稿

1. 切到支援 vision 的模型
2. 貼上圖片或拖放圖片
3. 點 `Analyze Image` 或自己輸入 prompt
4. 送出

## 目前限制

- 這不是 GitHub 官方模型供應商整合
- 主要功能是瀏覽器內嵌聊天，不是直接取代 GitHub 後端 AI 基礎設施
- 圖片分析是否成功取決於你選的 Ollama 模型是否支援 vision
- 文字附件目前只支援 `.txt`、`.md`、`.json`、`.csv`
- 頁面內容只會截取一部分，不是整站全文索引

## 專案重點檔案

- [manifest.json](/Users/wilsondenq879/Documents/GitHub/wilsondenq879-gamehub/ollama_ext/manifest.json)
- [src/background.js](/Users/wilsondenq879/Documents/GitHub/wilsondenq879-gamehub/ollama_ext/src/background.js)
- [src/content-script.js](/Users/wilsondenq879/Documents/GitHub/wilsondenq879-gamehub/ollama_ext/src/content-script.js)
- [src/popup.js](/Users/wilsondenq879/Documents/GitHub/wilsondenq879-gamehub/ollama_ext/src/popup.js)
- [src/options.js](/Users/wilsondenq879/Documents/GitHub/wilsondenq879-gamehub/ollama_ext/src/options.js)
