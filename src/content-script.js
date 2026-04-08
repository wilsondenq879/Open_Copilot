const HOST_ID = "ollama-quick-chat-host";
const MAX_PAGE_TEXT = 8000;
const MAX_SELECTION_TEXT = 2000;
const MAX_FRAME_DEPTH = 2;
const MAX_CONTEXT_BLOCKS = 24;
const FRAME_CONTEXT_REQUEST_TIMEOUT_MS = 350;
const FRAME_CONTEXT_MESSAGE_SOURCE = "edge-ai-chat-frame-context";
const CONTEXT_TEXT_SELECTORS = [
  "main",
  "article",
  "[role='main']",
  "[role='document']",
  "[role='textbox']",
  "[contenteditable='true']",
  "[contenteditable='plaintext-only']",
  "textarea",
  ".ql-editor",
  ".ProseMirror",
  ".ck-content",
  ".public-DraftEditor-content",
];
const MICROSOFT_CONTEXT_SELECTORS = [
  "[data-tid*='message']",
  "[data-tid*='chat-pane']",
  "[data-tid*='message-body']",
  "[data-tid*='reply']",
  "[data-track-module-name*='message']",
  "[data-track-module-name*='chat']",
  "[data-tid*='cell']",
  "[data-automationid*='Message']",
  "[data-automationid*='message']",
  "[data-automation-id*='message']",
  "[role='listitem']",
  "[role='row']",
  "[role='gridcell']",
  "[role='paragraph']",
  "[role='document'] [aria-label]",
];

let currentConfig = null;
let cachedModels = [];
let activeStreamPort = null;
let activeStreamText = "";
let includePageContext = true;
let chatMessages = [];
let isGenerating = false;
let attachedImages = [];
let attachedDocuments = [];
let isDragActive = false;
let pendingMessageRenderFrame = 0;
let pendingSessionSaveTimer = 0;
let areStartersExpanded = false;
let isPanelOpen = false;
let currentPageCopilot = null;
let composeMode = "chat";
let latestPerspectiveRun = null;
const PERSPECTIVE_PREVIEW_LENGTH = 180;
const IS_TOP_FRAME = (() => {
  try {
    return window.top === window;
  } catch (_error) {
    return true;
  }
})();

const DEFAULT_STARTER_KEYS = ["pageSummary", "translatePage", "reflectionArticle", "codeExplain", "imageAnalysis", "imageAnalysisMarkdown"];
const PAGE_COPILOT_STARTERS = {
  article: ["multiPerspective", "pageSummary", "articleTimeline", "bullVsBear", "catalystMap", "pricedIn", "tickerImpact", "reflectionArticle", "memeCaption", "darkMeme", "xPost", "templateIdeas", "lowIqMeme", "articleBiasCheck"],
  code: ["multiPerspective", "codeExplain", "codeRiskReview", "codeTeachBack", "xPost", "memeCaption", "translatePage"],
  github: ["multiPerspective", "githubSummary", "githubReviewFocus", "githubNextSteps", "bullVsBear", "pricedIn", "tickerImpact", "xPost", "memeCaption", "templateIdeas", "codeExplain"],
  market: ["multiPerspective", "bullVsBear", "catalystMap", "pricedIn", "tickerImpact", "pageSummary", "articleTimeline", "xPost"],
  entertainment: ["multiPerspective", "memeCaption", "darkMeme", "xPost", "templateIdeas", "lowIqMeme", "pageSummary", "reflectionArticle"],
  generic: ["multiPerspective", "pageSummary", "translatePage", "bullVsBear", "catalystMap", "pricedIn", "tickerImpact", "reflectionArticle", "memeCaption", "darkMeme", "xPost", "templateIdeas", "lowIqMeme", "codeExplain"],
};
const CONTENT_I18N = {
  "zh-TW": {
    quickAccess: "快速工具",
    liveChat: "Edge AI Chat",
    clear: "清除",
    context: "使用這個網頁作為 context",
    ready: "已就緒。",
    empty: "詢問這個頁面、選取文字，或任何你想問的內容。",
    assistantThinking: "助理思考中",
    assistantRole: "助理",
    userRole: "你",
    copy: "複製",
    dropzone: "拖放圖片或文字檔到這裡附加",
    uploadFile: "上傳檔案",
    promptPlaceholder: "輸入你想問 Ollama 的內容...",
    openQuickChat: "開啟 Ollama 快速聊天",
    collapse: "收合",
    refreshModels: "重新整理模型",
    useSelection: "使用選取內容",
    clearChat: "清除對話",
    openSettings: "開啟設定",
    loadLatestChat: "載入最近",
    currentPageContextDisabled: "CURRENT PAGE CONTEXT\nDisabled",
    selectionPrompt: "請幫我處理這段選取文字：\n\n{selection}",
    noSelectedText: "這個頁面沒有選取文字。",
    insertedSelection: "已把目前選取內容放進輸入框。",
    removedAttachment: "已移除附件。",
    starterReady: "已填入範本：{starter}",
    starterTools: "快捷指令",
    pageCopilot: "Page Copilot",
    siteAdapter: "Site Adapter",
    adapterDetected: "使用 {adapter}",
    pageTypeDetected: "已辨識 {type}",
    expandStarters: "展開",
    collapseStarters: "收合",
    chatCleared: "對話已清除。",
    messageNotFound: "找不到訊息。",
    copiedResponse: "已複製助理回覆。",
    copyPerspective: "複製",
    expandPerspective: "展開",
    collapsePerspective: "收合",
    copyFailed: "複製失敗，可能被瀏覽器權限擋住。",
    modelSelected: "目前模型：{model}",
    modelSelectFailed: "選擇模型失敗。",
    pageContextEnabled: "已啟用頁面脈絡。",
    pageContextDisabled: "已停用頁面脈絡。",
    filesUnsupported: "目前只支援圖片與文字檔（.txt、.md、.json、.csv）。",
    imagesOnly: "目前只支援圖片檔。",
    attachedImagesVisionWarning: "已附加 {count} 張圖片。目前模型可能不支援視覺，建議切換模型。",
    attachedImages: "已附加 {count} 張圖片。",
    attachedFiles: "已附加 {items}。",
    pastedImage: "已從剪貼簿貼上圖片。",
    typePromptOrAttach: "請先輸入問題，或附加圖片 / 文字檔。",
    pickModelFirst: "請先選擇 Ollama 模型。",
    sendingVisionWarning: "將以 {model} 傳送 {count} 張圖片。若模型拒絕圖片，請改用支援視覺的模型。",
    preparingRequest: "正在為 {model} 準備請求...",
    waitingForModel: "等待 {model}{details}...",
    waitingWith: "，附帶 {items}",
    doneWithModel: "{model} 已完成。",
    analyzeTextFile: "請分析附加的文字檔。",
    analyzeImage: "請分析附加的圖片。",
    attachedTextFilesHeading: "ATTACHED TEXT FILES",
    attachedFileLabel: "檔案",
    runningModel: "{model} 執行中...",
    usingModel: "目前使用模型：{model}",
    pickModelToStart: "請先選擇模型開始使用。",
    loadConfigFailed: "載入 Ollama 設定失敗。",
    fetchModelsFailed: "取得 Ollama 模型失敗。",
    openSettingsFailed: "開啟設定失敗。",
    loadChatFailed: "載入最近對談失敗。",
    noSavedChat: "目前沒有已儲存的對談。",
    latestChatLoaded: "已載入最近一次對談。",
    extensionReloadRequired: "擴充功能剛更新或重新載入，這個頁面的舊聊天面板已失效。請重新整理目前頁面後再試一次。",
    streamingFailed: "串流失敗。",
    starter_pageSummary: "網頁內容精華",
    starter_translatePage: "網頁翻譯{language}",
    starter_reflectionArticle: "依照網頁內容生成心得文",
    starter_codeExplain: "code 內容白話文解析",
    starter_articleTimeline: "整理事件時間線",
    starter_articleBiasCheck: "檢查觀點與可能盲點",
    starter_codeRiskReview: "找出程式風險點",
    starter_codeTeachBack: "轉成教學筆記",
    starter_githubSummary: "整理這個 GitHub 頁面",
    starter_githubReviewFocus: "建議 review 重點",
    starter_githubNextSteps: "列出下一步建議",
    starter_bullVsBear: "Bull vs Bear",
    starter_catalystMap: "Catalyst Map",
    starter_pricedIn: "Priced In?",
    starter_tickerImpact: "Ticker Impact",
    starter_memeCaption: "梗圖文案",
    starter_darkMeme: "地獄梗版本",
    starter_xPost: "X 貼文版",
    starter_templateIdeas: "梗圖模板建議",
    starter_lowIqMeme: "低智商梗圖文案",
    starter_multiPerspective: "多視角分析",
    starter_imageAnalysis: "圖片分析",
    starter_imageAnalysisMarkdown: "圖片分析後 md/mermaid 輸出",
    translationPrompt: "請把這個網頁內容翻譯成{language}。",
    reflectionArticlePrompt: "請依照這個網頁內容生成一篇心得文。先簡短整理重點，再用自然、有觀點的語氣寫出閱讀心得、啟發與可延伸思考。請使用{language}輸出，避免只是逐段重述原文。",
    multiPerspectivePrompt: "請從多個視角分析這個頁面，最後整合成一份決策友善的結論。",
    articleTimelinePrompt: "請依照這個頁面內容整理出事件時間線。若時間資訊不完整，請標記不確定處。先列時間線，再補充三個關鍵觀察。請使用{language}回答。",
    articleBiasCheckPrompt: "請分析這個頁面的主要論點、隱含假設與可能忽略的反面觀點。請分成「核心主張 / 依據 / 可能盲點 / 我還應該查什麼」四段，並使用{language}回答。",
    codeRiskReviewPrompt: "請把這個頁面中的程式內容當成 code review 對象，找出高風險處、潛在 bug、可讀性問題與建議改善方向。請優先列出最重要的問題，並使用{language}回答。",
    codeTeachBackPrompt: "請把這個頁面中的程式或技術內容轉成容易吸收的教學筆記。先講它在做什麼，再講關鍵概念，最後補上初學者容易卡住的點。請使用{language}回答。",
    githubSummaryPrompt: "請整理這個 GitHub 頁面的重點。如果是 repository，請說明用途、結構與值得先看的地方；如果是 PR 或 issue，請整理背景、重點變更與目前狀態。請使用{language}回答。",
    githubReviewFocusPrompt: "請站在 reviewer 角度，根據這個 GitHub 頁面整理最值得優先檢查的項目。請分成「風險最高 / 建議先看 / 可追問問題」三段，並使用{language}回答。",
    githubNextStepsPrompt: "請根據這個 GitHub 頁面，列出最合理的下一步行動。若資訊不足，請明確說明缺什麼。請使用{language}回答。",
    bullVsBearPrompt: "請根據這個頁面，用股市視角做 `Bull vs Bear` 分析。請分成：\n1. 多頭論點\n2. 空頭論點\n3. 市場最可能先交易哪一段敘事\n4. 我還要觀察什麼\n請使用{language}回答，避免直接給買賣建議。",
    catalystMapPrompt: "請根據這個頁面整理股市 `Catalyst Map`。請分成：\n1. 立即催化\n2. 中期催化\n3. 長期敘事\n4. 可能只是噪音的部分\n請使用{language}回答。",
    pricedInPrompt: "請根據這個頁面分析這個消息對市場來說是 `已反映` 還是 `未完全反映`。請分成：\n1. 市場可能早知道的部分\n2. 真正的 surprise\n3. 可能被高估的反應\n4. 可能被低估的風險或機會\n請使用{language}回答。",
    tickerImpactPrompt: "請根據這個頁面整理可能受影響的股票 / 類股 / ETF。請分成：\n1. 直接受益\n2. 間接受益\n3. 可能受害\n4. 為什麼\n若頁面不足以支持具體標的，請明確說明。請使用{language}回答。",
    memeCaptionPrompt: "請根據這個頁面產出 3 組適合梗圖使用的文案。每組都請用以下格式輸出：\n1. 情境摘要\n2. Top text\n3. Bottom text\n4. 為什麼這個梗成立\n請使用{language}回答，語氣要俏皮、好分享。",
    darkMemePrompt: "請根據這個頁面產出 3 組黑色幽默 / 地獄梗版本的 meme 文案。要保留嘲諷感，但避免仇恨言論與明確鼓勵傷害。每組請用：情境 / Top text / Bottom text / 備註。請使用{language}回答。",
    xPostPrompt: "請把這個頁面濃縮成 3 則適合發在 X 的短貼文。每則都要有 hook、主句、結尾 punchline，風格要精簡、有記憶點、可分享。請使用{language}回答。",
    templateIdeasPrompt: "請根據這個頁面推薦 5 個適合套用的迷因模板。每個模板都請包含：模板名稱、為什麼適合、建議 caption。請使用{language}回答。",
    lowIqMemePrompt: "請根據這個頁面產出 5 條故意白爛、低智商、很短的梗圖文案。每條都要夠短、夠蠢、夠好笑，適合社群快速分享。請使用{language}回答。",
    perspectiveSummaryLabel: "摘要者",
    perspectiveSkepticLabel: "懷疑者",
    perspectiveActionLabel: "行動建議者",
    perspectiveSynthesisLabel: "整合者",
    perspectiveSummaryInstruction: "你的任務是快速整理這個頁面的背景、重點與核心結論。請精煉但完整，方便其他角色接手。",
    perspectiveSkepticInstruction: "你的任務是找出這個頁面的漏洞、假設、證據不足處、反面觀點與需要進一步驗證的地方。請保持具體。",
    perspectiveActionInstruction: "你的任務是根據這個頁面提出最實際的下一步、判斷建議、值得追問的問題與可執行行動。",
    perspectiveSynthesisInstruction: "請整合多個角色的輸出，產出一份清楚、可執行、適合做判斷的結論。請先給總結，再給重點依據與建議下一步。",
    perspectiveRunning: "正在進行多視角分析...",
    perspectiveStageRunning: "正在執行 {label}...",
    perspectiveDone: "多視角分析完成。",
    perspectiveImagesUnsupported: "多視角分析第一版暫不支援圖片附件。",
    perspectiveModeReady: "已切換為多視角分析模式。",
    perspectivePanelTitle: "Multi-View Answer",
    perspectiveFinalTitle: "整合結論",
    perspectiveInputFallback: "請從摘要、質疑與行動建議三個角度分析這個頁面，最後整合成一份結論。",
    perspectivePreviewSuffix: "…",
    adapter_generic: "Generic",
    adapter_github: "GitHub",
    adapter_market: "Market",
    adapter_entertainment: "Entertainment",
    pageType_article: "文章頁",
    pageType_code: "程式頁",
    pageType_github: "GitHub 頁",
    pageType_market: "股市頁",
    pageType_entertainment: "娛樂頁",
    pageType_generic: "一般頁",
  },
  en: {
    quickAccess: "Quick Access",
    liveChat: "Edge AI Chat",
    clear: "Clear",
    context: "Use this page as context",
    ready: "Ready.",
    empty: "Ask about this page, selected text, or anything else.",
    assistantThinking: "assistant is thinking",
    assistantRole: "assistant",
    userRole: "you",
    copy: "Copy",
    dropzone: "Drop image or text file here to attach",
    uploadFile: "Upload file",
    promptPlaceholder: "Ask Ollama about this page...",
    openQuickChat: "Open Ollama quick chat",
    collapse: "Collapse",
    refreshModels: "Refresh models",
    useSelection: "Use selection",
    clearChat: "Clear chat",
    openSettings: "Open settings",
    loadLatestChat: "Load latest",
    currentPageContextDisabled: "CURRENT PAGE CONTEXT\nDisabled",
    selectionPrompt: "Please help me with this selected text:\n\n{selection}",
    noSelectedText: "No selected text found on this page.",
    insertedSelection: "Inserted current selection into the prompt.",
    removedAttachment: "Removed attachment.",
    starterReady: "Starter ready: {starter}",
    starterTools: "Starters",
    pageCopilot: "Page Copilot",
    siteAdapter: "Site Adapter",
    adapterDetected: "Using {adapter}",
    pageTypeDetected: "Detected {type}",
    expandStarters: "More",
    collapseStarters: "Less",
    chatCleared: "Chat cleared.",
    messageNotFound: "Message not found.",
    copiedResponse: "Copied assistant response.",
    copyPerspective: "Copy",
    expandPerspective: "Expand",
    collapsePerspective: "Collapse",
    copyFailed: "Copy failed. Clipboard permission may be blocked.",
    modelSelected: "Using model: {model}",
    modelSelectFailed: "Failed to select model.",
    pageContextEnabled: "Page context enabled.",
    pageContextDisabled: "Page context disabled.",
    filesUnsupported: "Only images and text files (.txt, .md, .json, .csv) are supported.",
    imagesOnly: "Only image files are supported.",
    attachedImagesVisionWarning: "Attached {count} image(s). Current model may not support vision. Consider switching models.",
    attachedImages: "Attached {count} image(s).",
    attachedFiles: "Attached {items}.",
    pastedImage: "Pasted image from clipboard.",
    typePromptOrAttach: "Type a prompt or attach an image or text file first.",
    pickModelFirst: "Pick an Ollama model first.",
    sendingVisionWarning: "Sending {count} image(s) with {model}. If the model rejects images, switch to a vision model.",
    preparingRequest: "Preparing request for {model}...",
    waitingForModel: "Waiting for {model}{details}...",
    waitingWith: " with {items}",
    doneWithModel: "Done with {model}.",
    analyzeTextFile: "Please analyze the attached text file.",
    analyzeImage: "Please analyze the attached image.",
    attachedTextFilesHeading: "ATTACHED TEXT FILES",
    attachedFileLabel: "FILE",
    runningModel: "Running {model}...",
    usingModel: "Using model: {model}",
    pickModelToStart: "Pick a model to start.",
    loadConfigFailed: "Failed to load Ollama config.",
    fetchModelsFailed: "Failed to fetch Ollama models.",
    openSettingsFailed: "Failed to open settings.",
    loadChatFailed: "Failed to load the latest chat.",
    noSavedChat: "No saved conversation is available yet.",
    latestChatLoaded: "Loaded the latest saved conversation.",
    extensionReloadRequired: "The extension was updated or reloaded, so this page is still using an old chat panel. Refresh this page and try again.",
    streamingFailed: "Streaming failed.",
    starter_pageSummary: "Summarize This Page",
    starter_translatePage: "Translate Page To {language}",
    starter_reflectionArticle: "Write a Reflection Article",
    starter_codeExplain: "Explain Code Clearly",
    starter_articleTimeline: "Build a Timeline",
    starter_articleBiasCheck: "Check Claims and Blind Spots",
    starter_codeRiskReview: "Review Code Risks",
    starter_codeTeachBack: "Turn Into Study Notes",
    starter_githubSummary: "Summarize This GitHub Page",
    starter_githubReviewFocus: "Suggest Review Focus",
    starter_githubNextSteps: "Recommend Next Steps",
    starter_bullVsBear: "Bull vs Bear",
    starter_catalystMap: "Catalyst Map",
    starter_pricedIn: "Priced In?",
    starter_tickerImpact: "Ticker Impact",
    starter_memeCaption: "Meme Caption",
    starter_darkMeme: "Dark Meme",
    starter_xPost: "X Post",
    starter_templateIdeas: "Template Ideas",
    starter_lowIqMeme: "Low-IQ Meme",
    starter_multiPerspective: "Multi-View Answer",
    starter_imageAnalysis: "Analyze Image",
    starter_imageAnalysisMarkdown: "Analyze Image To md/mermaid",
    translationPrompt: "Translate this page into {language}.",
    reflectionArticlePrompt: "Write a reflection article based on this page. Start with a brief recap of the key points, then write thoughtful takeaways, insights, and possible follow-up ideas in a natural voice. Respond in {language}, and do not just restate the page section by section.",
    multiPerspectivePrompt: "Analyze this page from multiple perspectives, then combine the results into one decision-friendly conclusion.",
    articleTimelinePrompt: "Build a timeline from this page. If dates or sequence details are incomplete, mark the uncertainty. Start with the timeline, then add three key observations. Respond in {language}.",
    articleBiasCheckPrompt: "Analyze this page's main claims, hidden assumptions, and possible blind spots. Structure the answer as Core claims, Evidence, Blind spots, and What to verify next. Respond in {language}.",
    codeRiskReviewPrompt: "Treat the code or technical content on this page like a code review. Identify the highest-risk areas, possible bugs, readability issues, and practical improvements. Prioritize the most important findings first and respond in {language}.",
    codeTeachBackPrompt: "Turn the code or technical content on this page into easy-to-follow study notes. Explain what it does, the key concepts behind it, and where a beginner is most likely to get stuck. Respond in {language}.",
    githubSummaryPrompt: "Summarize this GitHub page. If it is a repository, explain what it is for, how it seems organized, and what is worth reading first. If it is a PR or issue, summarize the background, key changes, and current status. Respond in {language}.",
    githubReviewFocusPrompt: "Act like a reviewer and identify the most important things to inspect on this GitHub page. Structure the answer as Highest risk, Review first, and Questions to ask. Respond in {language}.",
    githubNextStepsPrompt: "Based on this GitHub page, recommend the most reasonable next steps. If critical information is missing, say what is missing. Respond in {language}.",
    bullVsBearPrompt: "Analyze this page from a market perspective using a Bull vs Bear format. Structure the answer as Bull case, Bear case, Which narrative the market is most likely to trade first, and What to watch next. Respond in {language} and avoid direct buy/sell advice.",
    catalystMapPrompt: "Turn this page into a market Catalyst Map. Structure the answer as Immediate catalysts, Mid-term catalysts, Long-term narrative, and What may just be noise. Respond in {language}.",
    pricedInPrompt: "Analyze whether this news looks priced in or not. Structure the answer as What the market likely already knew, The real surprise, What may be overreacted to, and What may still be underestimated. Respond in {language}.",
    tickerImpactPrompt: "Identify the stocks, sectors, or ETFs that could be affected by this page. Structure the answer as Direct beneficiaries, Indirect beneficiaries, Potential losers, and Why. If the page is not strong enough to support concrete tickers, say so clearly. Respond in {language}.",
    memeCaptionPrompt: "Create 3 meme-caption options based on this page. For each option, use this format: Situation, Top text, Bottom text, and Why it works. Respond in {language} and keep the tone playful and shareable.",
    darkMemePrompt: "Create 3 dark-humor meme-caption options based on this page. Keep them edgy and sarcastic, but avoid hateful or explicitly harmful content. For each option, use Situation, Top text, Bottom text, and Note. Respond in {language}.",
    xPostPrompt: "Turn this page into 3 short X posts. Each one should have a hook, the main point, and a punchy ending. Keep them concise, memorable, and highly shareable. Respond in {language}.",
    templateIdeasPrompt: "Recommend 5 meme templates that fit this page. For each one, include Template name, Why it fits, and Suggested caption. Respond in {language}.",
    lowIqMemePrompt: "Create 5 intentionally dumb, short, low-IQ meme captions based on this page. They should be brief, silly, and easy to share. Respond in {language}.",
    perspectiveSummaryLabel: "Summarizer",
    perspectiveSkepticLabel: "Skeptic",
    perspectiveActionLabel: "Action Advisor",
    perspectiveSynthesisLabel: "Synthesizer",
    perspectiveSummaryInstruction: "Your job is to extract the page background, key points, and core conclusion quickly and clearly so other roles can build on it.",
    perspectiveSkepticInstruction: "Your job is to identify weak points, hidden assumptions, missing evidence, alternative interpretations, and what should be verified before trusting the page.",
    perspectiveActionInstruction: "Your job is to propose the most practical next steps, decisions, follow-up questions, and actions based on this page.",
    perspectiveSynthesisInstruction: "Combine the outputs from the other roles into one clear, actionable conclusion. Start with a concise recommendation, then explain the supporting reasoning and next steps.",
    perspectiveRunning: "Running multi-view analysis...",
    perspectiveStageRunning: "Running {label}...",
    perspectiveDone: "Multi-view analysis complete.",
    perspectiveImagesUnsupported: "The first multi-view version does not support image attachments yet.",
    perspectiveModeReady: "Multi-view analysis mode is ready.",
    perspectivePanelTitle: "Multi-View Answer",
    perspectiveFinalTitle: "Final Synthesis",
    perspectiveInputFallback: "Analyze this page from summary, skepticism, and action-planning perspectives, then synthesize the result.",
    perspectivePreviewSuffix: "...",
    adapter_generic: "Generic",
    adapter_github: "GitHub",
    adapter_market: "Market",
    adapter_entertainment: "Entertainment",
    pageType_article: "Article",
    pageType_code: "Code",
    pageType_github: "GitHub",
    pageType_market: "Market",
    pageType_entertainment: "Entertainment",
    pageType_generic: "General",
  },
};
CONTENT_I18N.ja = { ...CONTENT_I18N.en, quickAccess: "クイックアクセス", liveChat: "Ollama ライブチャット", clear: "クリア", context: "このページをコンテキストとして使う", ready: "準備完了。", empty: "このページや選択テキスト、または他の内容について質問してください。", copy: "コピー", dropzone: "画像またはテキストファイルをここにドロップして添付", uploadFile: "ファイルをアップロード", promptPlaceholder: "このページについて Ollama に質問...", openQuickChat: "Ollama クイックチャットを開く", collapse: "折りたたむ", useSelection: "選択内容を使用", clearChat: "チャットをクリア", openSettings: "設定を開く", noSelectedText: "このページで選択されたテキストがありません。", insertedSelection: "現在の選択内容を入力欄に入れました。", removedAttachment: "添付を削除しました。", starterReady: "テンプレートを入力しました: {starter}", chatCleared: "チャットをクリアしました。", messageNotFound: "メッセージが見つかりません。", copiedResponse: "回答をコピーしました。", copyFailed: "コピーに失敗しました。クリップボード権限がブロックされている可能性があります。", modelSelected: "使用中のモデル: {model}", modelSelectFailed: "モデルの選択に失敗しました。", pageContextEnabled: "ページコンテキストを有効にしました。", pageContextDisabled: "ページコンテキストを無効にしました。", filesUnsupported: "画像とテキストファイル（.txt、.md、.json、.csv）のみ対応しています。", imagesOnly: "画像ファイルのみ対応しています。", attachedImagesVisionWarning: "{count} 枚の画像を添付しました。現在のモデルは視覚に対応していない可能性があります。", attachedImages: "{count} 枚の画像を添付しました。", attachedFiles: "{items} を添付しました。", pastedImage: "クリップボードから画像を貼り付けました。", typePromptOrAttach: "質問を入力するか、画像 / テキストファイルを添付してください。", pickModelFirst: "先に Ollama モデルを選択してください。", sendingVisionWarning: "{model} で {count} 枚の画像を送信します。画像を拒否する場合は視覚対応モデルに切り替えてください。", preparingRequest: "{model} のリクエストを準備中...", waitingForModel: "{model}{details} を待機中...", waitingWith: "（{items} 付き）", doneWithModel: "{model} が完了しました。", analyzeTextFile: "添付されたテキストファイルを分析してください。", analyzeImage: "添付された画像を分析してください。", attachedFileLabel: "FILE", runningModel: "{model} を実行中...", usingModel: "使用中のモデル: {model}", pickModelToStart: "開始するにはモデルを選択してください。", starter_pageSummary: "ページ内容を要約", starter_translatePage: "ページを{language}に翻訳", starter_reflectionArticle: "ページ内容をもとに感想文を作成", starter_codeExplain: "code 内容をわかりやすく解説", starter_imageAnalysis: "画像を分析", starter_imageAnalysisMarkdown: "画像分析を md/mermaid で出力", translationPrompt: "このページを{language}に翻訳してください。", reflectionArticlePrompt: "このページの内容をもとに感想文を書いてください。最初に要点を短く整理し、その後に自然で自分の視点がある語り口で、学び、気づき、広げられる考えを書いてください。回答は{language}で、原文の言い換えだけにはしないでください。"};
CONTENT_I18N.ko = { ...CONTENT_I18N.en, quickAccess: "빠른 실행", liveChat: "Ollama 라이브 채팅", clear: "지우기", context: "이 웹페이지를 문맥으로 사용", ready: "준비됨.", empty: "이 페이지나 선택한 텍스트, 또는 다른 내용을 물어보세요.", copy: "복사", dropzone: "이미지 또는 텍스트 파일을 여기에 놓아 첨부", uploadFile: "파일 업로드", promptPlaceholder: "이 페이지에 대해 Ollama에게 물어보세요...", openQuickChat: "Ollama 빠른 채팅 열기", collapse: "접기", useSelection: "선택 내용 사용", clearChat: "대화 지우기", openSettings: "설정 열기", noSelectedText: "이 페이지에 선택된 텍스트가 없습니다.", insertedSelection: "현재 선택 내용을 입력창에 넣었습니다.", removedAttachment: "첨부를 제거했습니다.", starterReady: "스타터 입력됨: {starter}", chatCleared: "대화를 지웠습니다.", messageNotFound: "메시지를 찾을 수 없습니다.", copiedResponse: "응답을 복사했습니다.", copyFailed: "복사에 실패했습니다. 클립보드 권한이 차단되었을 수 있습니다.", modelSelected: "사용 중인 모델: {model}", modelSelectFailed: "모델 선택에 실패했습니다.", pageContextEnabled: "페이지 문맥을 켰습니다.", pageContextDisabled: "페이지 문맥을 껐습니다.", filesUnsupported: "이미지와 텍스트 파일(.txt, .md, .json, .csv)만 지원합니다.", imagesOnly: "이미지 파일만 지원합니다.", attachedImagesVisionWarning: "이미지 {count}개를 첨부했습니다. 현재 모델이 비전을 지원하지 않을 수 있습니다.", attachedImages: "이미지 {count}개를 첨부했습니다.", attachedFiles: "{items} 첨부됨.", pastedImage: "클립보드에서 이미지를 붙여넣었습니다.", typePromptOrAttach: "먼저 질문을 입력하거나 이미지 / 텍스트 파일을 첨부하세요.", pickModelFirst: "먼저 Ollama 모델을 선택하세요.", sendingVisionWarning: "{model}으로 이미지 {count}개를 보냅니다. 이미지가 거부되면 비전 모델로 바꾸세요.", preparingRequest: "{model} 요청 준비 중...", waitingForModel: "{model}{details} 대기 중...", waitingWith: " ({items} 포함)", doneWithModel: "{model} 완료.", analyzeTextFile: "첨부된 텍스트 파일을 분석해 주세요.", analyzeImage: "첨부된 이미지를 분석해 주세요.", runningModel: "{model} 실행 중...", usingModel: "사용 중인 모델: {model}", pickModelToStart: "시작하려면 모델을 선택하세요.", starter_pageSummary: "웹페이지 요약", starter_translatePage: "페이지를 {language}(으)로 번역", starter_reflectionArticle: "페이지 기반 감상문 작성", starter_codeExplain: "code 내용을 쉽게 설명", starter_imageAnalysis: "이미지 분석", starter_imageAnalysisMarkdown: "이미지 분석 후 md/mermaid 출력", translationPrompt: "이 페이지를 {language}(으)로 번역해 주세요.", reflectionArticlePrompt: "이 페이지 내용을 바탕으로 감상문을 작성해 주세요. 먼저 핵심을 짧게 정리한 뒤, 자연스럽고 관점이 드러나는 톤으로 느낀 점, 배운 점, 더 확장해 볼 생각을 써 주세요. 답변은 {language}로 작성하고, 원문을 단순히 다시 풀어쓰지만은 마세요." };
CONTENT_I18N["zh-CN"] = { ...CONTENT_I18N["zh-TW"], quickAccess: "快速工具", liveChat: "Ollama 实时聊天", context: "使用这个网页作为 context", empty: "询问这个页面、选中文本，或任何你想问的内容。", dropzone: "拖放图片或文本文件到这里附加", promptPlaceholder: "输入你想问 Ollama 的内容...", noSelectedText: "这个页面没有选中文本。", insertedSelection: "已把当前选中内容放进输入框。", chatCleared: "对话已清除。", copiedResponse: "已复制助手回复。", modelSelectFailed: "选择模型失败。", pageContextEnabled: "已启用页面上下文。", pageContextDisabled: "已停用页面上下文。", filesUnsupported: "目前只支持图片与文本文件（.txt、.md、.json、.csv）。", imagesOnly: "目前只支持图片文件。", attachedImagesVisionWarning: "已附加 {count} 张图片。当前模型可能不支持视觉，建议切换模型。", attachedImages: "已附加 {count} 张图片。", typePromptOrAttach: "请先输入问题，或附加图片 / 文本文件。", pickModelFirst: "请先选择 Ollama 模型。", analyzeTextFile: "请分析附加的文本文件。", analyzeImage: "请分析附加的图片。", starter_pageSummary: "网页内容精华", starter_translatePage: "网页翻译{language}", starter_reflectionArticle: "根据网页内容生成心得文", starter_codeExplain: "code 内容白话解析", starter_imageAnalysis: "图片分析", starter_imageAnalysisMarkdown: "图片分析后 md/mermaid 输出", translationPrompt: "请把这个网页翻译成{language}。", reflectionArticlePrompt: "请根据这个网页内容生成一篇心得文。先简短整理重点，再用自然、有观点的语气写出阅读心得、启发与可延伸思考。请使用{language}输出，避免只是逐段重述原文。" };
CONTENT_I18N.es = { ...CONTENT_I18N.en, quickAccess: "Acceso rápido", liveChat: "Chat en vivo de Ollama", clear: "Limpiar", context: "Usar esta web como contexto", ready: "Listo.", empty: "Pregunta sobre esta página, el texto seleccionado o cualquier otra cosa.", copy: "Copiar", dropzone: "Suelta una imagen o archivo de texto aquí para adjuntarlo", uploadFile: "Subir archivo", promptPlaceholder: "Pregunta a Ollama sobre esta página...", openQuickChat: "Abrir chat rápido de Ollama", collapse: "Colapsar", useSelection: "Usar selección", clearChat: "Borrar chat", openSettings: "Abrir configuración", starter_pageSummary: "Resumir esta página", starter_translatePage: "Traducir página a {language}", starter_reflectionArticle: "Escribir reflexión del artículo", starter_codeExplain: "Explicar código claramente", starter_imageAnalysis: "Analizar imagen", starter_imageAnalysisMarkdown: "Analizar imagen a md/mermaid", translationPrompt: "Traduce esta página a {language}.", reflectionArticlePrompt: "Escribe un artículo de reflexión basado en esta página. Empieza con un breve resumen de las ideas clave y luego desarrolla aprendizajes, impresiones e ideas que valga la pena ampliar con una voz natural. Responde en {language} y evita limitarte a reformular el contenido sección por sección." };
CONTENT_I18N.fr = { ...CONTENT_I18N.en, quickAccess: "Accès rapide", liveChat: "Chat en direct Ollama", clear: "Effacer", context: "Utiliser cette page comme contexte", ready: "Prêt.", empty: "Posez une question sur cette page, le texte sélectionné ou autre chose.", copy: "Copier", dropzone: "Déposez une image ou un fichier texte ici pour l’ajouter", uploadFile: "Téléverser un fichier", promptPlaceholder: "Demandez à Ollama à propos de cette page...", openQuickChat: "Ouvrir le chat rapide Ollama", collapse: "Réduire", useSelection: "Utiliser la sélection", clearChat: "Effacer le chat", openSettings: "Ouvrir les paramètres", starter_pageSummary: "Résumer cette page", starter_translatePage: "Traduire la page en {language}", starter_reflectionArticle: "Rédiger un texte de réflexion", starter_codeExplain: "Expliquer le code clairement", starter_imageAnalysis: "Analyser l’image", starter_imageAnalysisMarkdown: "Analyser l’image vers md/mermaid", translationPrompt: "Traduisez cette page en {language}.", reflectionArticlePrompt: "Rédige un texte de réflexion à partir de cette page. Commence par un bref rappel des points clés, puis développe les enseignements, les impressions et les pistes de réflexion dans un ton naturel. Réponds en {language} et évite de simplement reformuler la page section par section." };
CONTENT_I18N.de = { ...CONTENT_I18N.en, quickAccess: "Schnellzugriff", liveChat: "Ollama Live-Chat", clear: "Leeren", context: "Diese Seite als Kontext verwenden", ready: "Bereit.", empty: "Frage etwas zu dieser Seite, markiertem Text oder etwas anderem.", copy: "Kopieren", dropzone: "Bild oder Textdatei hier ablegen, um sie anzuhängen", uploadFile: "Datei hochladen", promptPlaceholder: "Frage Ollama zu dieser Seite...", openQuickChat: "Ollama-Schnellchat öffnen", collapse: "Einklappen", useSelection: "Auswahl verwenden", clearChat: "Chat leeren", openSettings: "Einstellungen öffnen", starter_pageSummary: "Diese Seite zusammenfassen", starter_translatePage: "Seite auf {language} übersetzen", starter_reflectionArticle: "Reflexionsartikel schreiben", starter_codeExplain: "Code verständlich erklären", starter_imageAnalysis: "Bild analysieren", starter_imageAnalysisMarkdown: "Bild zu md/mermaid analysieren", translationPrompt: "Übersetze diese Seite in {language}.", reflectionArticlePrompt: "Schreibe einen Reflexionsartikel auf Grundlage dieser Seite. Beginne mit einer kurzen Zusammenfassung der wichtigsten Punkte und formuliere danach Einsichten, Gedanken und mögliche weiterführende Ideen in einem natürlichen Ton. Antworte in {language} und wiederhole den Inhalt nicht nur Abschnitt für Abschnitt." };
CONTENT_I18N["pt-BR"] = { ...CONTENT_I18N.en, quickAccess: "Acesso rápido", liveChat: "Chat ao vivo Ollama", clear: "Limpar", context: "Usar esta pagina como contexto", ready: "Pronto.", empty: "Pergunte sobre esta página, o texto selecionado ou qualquer outra coisa.", copy: "Copiar", dropzone: "Solte uma imagem ou arquivo de texto aqui para anexar", uploadFile: "Enviar arquivo", promptPlaceholder: "Pergunte ao Ollama sobre esta página...", openQuickChat: "Abrir chat rápido do Ollama", collapse: "Recolher", useSelection: "Usar seleção", clearChat: "Limpar chat", openSettings: "Abrir configurações", starter_pageSummary: "Resumir esta página", starter_translatePage: "Traduzir página para {language}", starter_reflectionArticle: "Escrever texto de reflexão", starter_codeExplain: "Explicar código claramente", starter_imageAnalysis: "Analisar imagem", starter_imageAnalysisMarkdown: "Analisar imagem para md/mermaid", translationPrompt: "Traduza esta página para {language}.", reflectionArticlePrompt: "Escreva um texto de reflexão com base nesta página. Comece com um breve resumo dos pontos principais e depois desenvolva aprendizados, impressões e possíveis ideias para aprofundar, em um tom natural. Responda em {language} e evite apenas reescrever a página seção por seção." };
CONTENT_I18N.hi = { ...CONTENT_I18N.en, quickAccess: "त्वरित पहुँच", liveChat: "Ollama लाइव चैट", clear: "साफ़ करें", context: "इस पेज को संदर्भ के रूप में उपयोग करें", ready: "तैयार।", empty: "इस पेज, चुने गए टेक्स्ट या किसी और चीज़ के बारे में पूछें।", copy: "कॉपी", dropzone: "संलग्न करने के लिए यहाँ छवि या टेक्स्ट फ़ाइल छोड़ें", uploadFile: "फ़ाइल अपलोड करें", promptPlaceholder: "इस पेज के बारे में Ollama से पूछें...", openQuickChat: "Ollama क्विक चैट खोलें", collapse: "समेटें", useSelection: "चयनित पाठ उपयोग करें", clearChat: "चैट साफ़ करें", openSettings: "सेटिंग्स खोलें", starter_pageSummary: "इस पेज का सारांश", starter_translatePage: "पेज को {language} में अनुवाद करें", starter_reflectionArticle: "विचार-लेख लिखें", starter_codeExplain: "कोड को सरल ढंग से समझाएँ", starter_imageAnalysis: "छवि विश्लेषण", starter_imageAnalysisMarkdown: "छवि विश्लेषण से md/mermaid", translationPrompt: "इस पेज का {language} में अनुवाद करें।", reflectionArticlePrompt: "इस पेज के आधार पर एक विचार-लेख लिखिए। पहले मुख्य बिंदुओं का संक्षिप्त सार दें, फिर स्वाभाविक और विचारपूर्ण शैली में सीख, अंतर्दृष्टि और आगे बढ़ाई जा सकने वाली बातों पर लिखें। उत्तर {language} में दें और केवल पेज को हिस्सों में दोहराने तक सीमित न रहें।" };

Object.assign(CONTENT_I18N.ja, {
  starter_bullVsBear: "強気 vs 弱気",
  starter_catalystMap: "カタリストマップ",
  starter_pricedIn: "織り込み済み？",
  starter_tickerImpact: "影響ティッカー",
  starter_memeCaption: "ミーム文案",
  starter_darkMeme: "ダークミーム版",
  starter_xPost: "X 投稿版",
  starter_templateIdeas: "ミームテンプレ案",
  starter_lowIqMeme: "低知能ミーム文案",
});

Object.assign(CONTENT_I18N.ko, {
  starter_bullVsBear: "상승 vs 하락",
  starter_catalystMap: "촉매 지도",
  starter_pricedIn: "이미 반영됐나?",
  starter_tickerImpact: "영향 종목",
  starter_memeCaption: "밈 문구",
  starter_darkMeme: "다크 밈 버전",
  starter_xPost: "X 게시글 버전",
  starter_templateIdeas: "밈 템플릿 추천",
  starter_lowIqMeme: "저지능 밈 문구",
});

Object.assign(CONTENT_I18N["zh-CN"], {
  starter_bullVsBear: "Bull vs Bear",
  starter_catalystMap: "Catalyst Map",
  starter_pricedIn: "Priced In?",
  starter_tickerImpact: "Ticker Impact",
  starter_memeCaption: "梗图文案",
  starter_darkMeme: "地狱梗版本",
  starter_xPost: "X 发帖版",
  starter_templateIdeas: "梗图模板建议",
  starter_lowIqMeme: "低智商梗图文案",
});

Object.assign(CONTENT_I18N.es, {
  starter_bullVsBear: "Alcista vs Bajista",
  starter_catalystMap: "Mapa de Catalizadores",
  starter_pricedIn: "¿Ya descontado?",
  starter_tickerImpact: "Impacto en Tickers",
  starter_memeCaption: "Texto para Meme",
  starter_darkMeme: "Versión Humor Negro",
  starter_xPost: "Versión para X",
  starter_templateIdeas: "Ideas de Plantillas",
  starter_lowIqMeme: "Meme Low-IQ",
});

Object.assign(CONTENT_I18N.fr, {
  starter_bullVsBear: "Haussier vs Baissier",
  starter_catalystMap: "Carte des Catalyseurs",
  starter_pricedIn: "Déjà intégré ?",
  starter_tickerImpact: "Impact sur les Tickers",
  starter_memeCaption: "Texte de Mème",
  starter_darkMeme: "Version Humour Noir",
  starter_xPost: "Version Post X",
  starter_templateIdeas: "Idées de Templates",
  starter_lowIqMeme: "Mème Low-IQ",
});

Object.assign(CONTENT_I18N.de, {
  starter_bullVsBear: "Bullen vs Bären",
  starter_catalystMap: "Katalysator-Karte",
  starter_pricedIn: "Schon eingepreist?",
  starter_tickerImpact: "Ticker-Auswirkung",
  starter_memeCaption: "Meme-Text",
  starter_darkMeme: "Dark-Meme-Version",
  starter_xPost: "X-Post-Version",
  starter_templateIdeas: "Meme-Vorlagen",
  starter_lowIqMeme: "Low-IQ-Meme",
});

Object.assign(CONTENT_I18N["pt-BR"], {
  starter_bullVsBear: "Alta vs Baixa",
  starter_catalystMap: "Mapa de Catalisadores",
  starter_pricedIn: "Já está no preço?",
  starter_tickerImpact: "Impacto nos Tickers",
  starter_memeCaption: "Legenda de Meme",
  starter_darkMeme: "Versão Humor Negro",
  starter_xPost: "Versão para X",
  starter_templateIdeas: "Ideias de Templates",
  starter_lowIqMeme: "Meme Low-IQ",
});

Object.assign(CONTENT_I18N.hi, {
  starter_bullVsBear: "तेजी बनाम मंदी",
  starter_catalystMap: "कैटलिस्ट मैप",
  starter_pricedIn: "क्या पहले से कीमत में है?",
  starter_tickerImpact: "टिकर प्रभाव",
  starter_memeCaption: "मीम कैप्शन",
  starter_darkMeme: "डार्क मीम संस्करण",
  starter_xPost: "X पोस्ट संस्करण",
  starter_templateIdeas: "मीम टेम्पलेट सुझाव",
  starter_lowIqMeme: "लो-IQ मीम कैप्शन",
});

const LANGUAGE_LABELS = {
  "zh-TW": "繁體中文",
  en: "English",
  ja: "日本語",
  ko: "한국어",
  "zh-CN": "简体中文",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  "pt-BR": "Português (Brasil)",
  hi: "हिन्दी",
};

function runtimeMessage(message) {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(normalizeRuntimeError(chrome.runtime.lastError.message));
          return;
        }
        resolve(response);
      });
    } catch (error) {
      reject(normalizeRuntimeError(error));
    }
  });
}

function normalizeRuntimeError(error) {
  const message = error instanceof Error ? error.message : String(error || "");
  if (/Extension context invalidated/i.test(message)) {
    return new Error(t("extensionReloadRequired"));
  }
  return new Error(message);
}

function getUiLanguage() {
  return currentConfig?.replyLanguage || "zh-TW";
}

function tl(key, vars = {}) {
  const locale = CONTENT_I18N[getUiLanguage()] || CONTENT_I18N.en;
  const template = locale[key] || CONTENT_I18N.en[key] || key;
  return template.replace(/\{(\w+)\}/g, (_match, name) => String(vars[name] ?? ""));
}

function getTargetLanguageLabel() {
  return LANGUAGE_LABELS[getUiLanguage()] || getUiLanguage();
}

function getPageTypeLabel(pageType) {
  return tl(`pageType_${pageType || "generic"}`);
}

function getAdapterLabel(adapterId) {
  return tl(`adapter_${adapterId || "generic"}`);
}

function normalizeExtractedText(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function isMicrosoftAppHost() {
  const hostname = window.location.hostname.toLowerCase();
  return (
    hostname.includes("teams.microsoft.com") ||
    hostname.includes("office.com") ||
    hostname.includes("officeapps.live.com") ||
    hostname.includes("sharepoint.com") ||
    hostname.includes("word-edit.officeapps.live.com") ||
    hostname.includes("excel.officeapps.live.com") ||
    hostname.includes("powerpoint.officeapps.live.com")
  );
}

function isElementVisible(node) {
  if (!(node instanceof Element)) {
    return false;
  }

  if (node.id === HOST_ID || node.closest?.(`#${HOST_ID}`)) {
    return false;
  }

  const style = window.getComputedStyle?.(node);
  if (!style) {
    return true;
  }

  if (style.display === "none" || style.visibility === "hidden") {
    return false;
  }

  return true;
}

function getNodeVisibleText(node) {
  if (!node) {
    return "";
  }

  if (node instanceof Element && !isElementVisible(node)) {
    return "";
  }

  if (node instanceof HTMLTextAreaElement || node instanceof HTMLInputElement) {
    return normalizeExtractedText(node.value);
  }

  if (node instanceof Element) {
    const richLabel = [
      node.getAttribute("aria-label"),
      node.getAttribute("title"),
      node.getAttribute("aria-description"),
    ]
      .filter(Boolean)
      .join("\n");

    return normalizeExtractedText(node.innerText || node.textContent || richLabel || "");
  }

  return normalizeExtractedText(node.textContent || "");
}

function appendUniqueTextBlock(blocks, seen, text, maxLength) {
  const normalized = normalizeExtractedText(text);
  if (!normalized) {
    return;
  }

  const dedupeKey = normalized.toLowerCase();
  if (seen.has(dedupeKey)) {
    return;
  }

  seen.add(dedupeKey);
  blocks.push(maxLength ? normalized.slice(0, maxLength) : normalized);
}

function collectAccessibleDocuments(rootWindow = window, maxDepth = MAX_FRAME_DEPTH, depth = 0, docs = [], seen = new Set()) {
  try {
    const doc = rootWindow.document;
    if (doc && !seen.has(doc)) {
      seen.add(doc);
      docs.push(doc);
    }
  } catch (_error) {
    return docs;
  }

  if (depth >= maxDepth) {
    return docs;
  }

  let childFrames = [];
  try {
    childFrames = Array.from(rootWindow.frames || []);
  } catch (_error) {
    return docs;
  }

  childFrames.forEach((childWindow) => {
    try {
      if (!childWindow || childWindow === rootWindow) {
        return;
      }
      collectAccessibleDocuments(childWindow, maxDepth, depth + 1, docs, seen);
    } catch (_error) {
      // Cross-origin frames are expected to fail; skip quietly.
    }
  });

  return docs;
}

function collectChildFrameWindows(rootWindow = window, maxDepth = MAX_FRAME_DEPTH, depth = 0, frames = [], seen = new Set()) {
  if (depth >= maxDepth) {
    return frames;
  }

  let childFrames = [];
  try {
    childFrames = Array.from(rootWindow.frames || []);
  } catch (_error) {
    return frames;
  }

  childFrames.forEach((childWindow) => {
    if (!childWindow || childWindow === rootWindow || seen.has(childWindow)) {
      return;
    }

    seen.add(childWindow);
    frames.push(childWindow);
    collectChildFrameWindows(childWindow, maxDepth, depth + 1, frames, seen);
  });

  return frames;
}

function collectHeadingsFromDocument(doc) {
  try {
    return queryAllIncludingShadow(doc, "h1, h2, h3", 24)
      .map((node) => normalizeExtractedText(node.textContent || ""))
      .filter(Boolean);
  } catch (_error) {
    return [];
  }
}

function queryAllIncludingShadow(root, selectors, maxNodes = 100) {
  const results = [];
  const seen = new Set();
  const selectorList = Array.isArray(selectors) ? selectors : [selectors];

  function visit(nodeRoot) {
    if (!nodeRoot || results.length >= maxNodes) {
      return;
    }

    selectorList.forEach((selector) => {
      try {
        Array.from(nodeRoot.querySelectorAll(selector)).forEach((node) => {
          if (results.length >= maxNodes || seen.has(node)) {
            return;
          }
          seen.add(node);
          results.push(node);
        });
      } catch (_error) {
        // Ignore selector/root combinations that cannot be queried.
      }
    });

    let descendants = [];
    try {
      descendants = Array.from(nodeRoot.querySelectorAll("*"));
    } catch (_error) {
      return;
    }

    descendants.forEach((element) => {
      if (results.length >= maxNodes) {
        return;
      }

      if (element.shadowRoot) {
        visit(element.shadowRoot);
      }
    });
  }

  visit(root);
  return results;
}

function collectVisibleTextNodesIncludingShadow(root, maxNodes = 400) {
  const results = [];
  const seen = new Set();

  function visit(nodeRoot) {
    if (!nodeRoot || results.length >= maxNodes) {
      return;
    }

    let walker;
    try {
      walker = document.createTreeWalker(nodeRoot, NodeFilter.SHOW_TEXT, {
        acceptNode(textNode) {
          const text = normalizeExtractedText(textNode.textContent || "");
          if (!text) {
            return NodeFilter.FILTER_REJECT;
          }

          const parent = textNode.parentElement;
          if (!parent || !isElementVisible(parent)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        },
      });
    } catch (_error) {
      return;
    }

    let currentNode = walker.nextNode();
    while (currentNode && results.length < maxNodes) {
      const value = normalizeExtractedText(currentNode.textContent || "");
      if (value && !seen.has(value.toLowerCase())) {
        seen.add(value.toLowerCase());
        results.push(value);
      }
      currentNode = walker.nextNode();
    }

    let descendants = [];
    try {
      descendants = Array.from(nodeRoot.querySelectorAll("*"));
    } catch (_error) {
      return;
    }

    descendants.forEach((element) => {
      if (results.length >= maxNodes) {
        return;
      }

      if (element.shadowRoot) {
        visit(element.shadowRoot);
      }
    });
  }

  visit(root);
  return results;
}

function collectTextBlocksFromDocument(doc, maxBlocks = MAX_CONTEXT_BLOCKS) {
  const blocks = [];
  const seen = new Set();

  try {
    const primaryNode =
      doc.querySelector("main") ||
      doc.querySelector("article") ||
      doc.querySelector("[role='main']") ||
      doc.querySelector("[role='document']") ||
      doc.body;

    appendUniqueTextBlock(blocks, seen, getNodeVisibleText(primaryNode), MAX_PAGE_TEXT);

    queryAllIncludingShadow(doc, CONTEXT_TEXT_SELECTORS, maxBlocks)
      .slice(0, maxBlocks)
      .forEach((node) => {
        appendUniqueTextBlock(blocks, seen, getNodeVisibleText(node), 2400);
      });

    if (isMicrosoftAppHost()) {
      queryAllIncludingShadow(doc, MICROSOFT_CONTEXT_SELECTORS, maxBlocks * 3)
        .slice(0, maxBlocks * 3)
        .forEach((node) => {
          appendUniqueTextBlock(blocks, seen, getNodeVisibleText(node), 1200);
        });

      collectVisibleTextNodesIncludingShadow(doc, maxBlocks * 12)
        .slice(0, maxBlocks * 12)
        .forEach((text) => {
          appendUniqueTextBlock(blocks, seen, text, 500);
        });
    }
  } catch (_error) {
    return blocks;
  }

  return blocks;
}

function getPageTextSnapshot(maxLength = MAX_PAGE_TEXT, includeChildFrames = true) {
  const documents = includeChildFrames ? collectAccessibleDocuments(window) : [document];
  const blocks = [];
  const seen = new Set();

  documents.forEach((doc) => {
    collectTextBlocksFromDocument(doc).forEach((block) => {
      appendUniqueTextBlock(blocks, seen, block, maxLength);
    });
  });

  return normalizeExtractedText(blocks.join("\n\n")).slice(0, maxLength);
}

function getPageHeadingsSnapshot(maxItems = 12, includeChildFrames = true) {
  const documents = includeChildFrames ? collectAccessibleDocuments(window) : [document];
  const headings = [];
  const seen = new Set();

  documents.forEach((doc) => {
    collectHeadingsFromDocument(doc).forEach((heading) => {
      const key = heading.toLowerCase();
      if (!seen.has(key) && headings.length < maxItems) {
        seen.add(key);
        headings.push(heading);
      }
    });
  });

  return headings;
}

function getSelectionText() {
  const selection = window.getSelection?.()?.toString().trim() || "";
  if (selection) {
    return selection;
  }

  const activeElement = document.activeElement;
  if (activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLInputElement) {
    const { selectionStart = 0, selectionEnd = 0, value = "" } = activeElement;
    if (selectionEnd > selectionStart) {
      return value.slice(selectionStart, selectionEnd).trim();
    }
  }

  return "";
}

function getPageSignals() {
  const hostname = window.location.hostname.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  const title = (document.title || "").trim();
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
  const pageText = getPageTextSnapshot(6000);
  const headingText = getPageHeadingsSnapshot()
    .join(" ")
    .toLowerCase();
  const sampleText = `${title} ${metaDescription} ${headingText} ${pageText.slice(0, 2500)}`.toLowerCase();

  return {
    hostname,
    pathname,
    title,
    metaDescription,
    pageText,
    headingText,
    sampleText,
  };
}

function matchesMarketPage(signals) {
  const { hostname, pathname, sampleText } = signals;
  const financeHostHints = [
    "tradingview.com",
    "finance.yahoo.com",
    "marketwatch.com",
    "investing.com",
    "seekingalpha.com",
    "benzinga.com",
    "fool.com",
    "bloomberg.com",
    "wsj.com",
    "ft.com",
  ];
  const financeKeywords = [
    "stock",
    "stocks",
    "market",
    "markets",
    "earnings",
    "guidance",
    "analyst",
    "downgrade",
    "upgrade",
    "catalyst",
    "etf",
    "fed",
    "oil price",
    "crude",
    "nasdaq",
    "s&p 500",
    "yield",
    "shares",
    "ticker",
    "bullish",
    "bearish",
  ];

  return (
    financeHostHints.some((hint) => hostname === hint || hostname.endsWith(`.${hint}`)) ||
    /\/quote\/|\/markets\/|\/stocks\/|\/equities\/|\/etf\//.test(pathname) ||
    financeKeywords.filter((keyword) => sampleText.includes(keyword)).length >= 2
  );
}

function matchesEntertainmentPage(signals) {
  const { hostname, pathname, sampleText } = signals;
  const entertainmentHostHints = [
    "youtube.com",
    "www.youtube.com",
    "x.com",
    "twitter.com",
    "reddit.com",
    "www.reddit.com",
    "tiktok.com",
    "www.tiktok.com",
    "instagram.com",
    "www.instagram.com",
    "ptt.cc",
    "dcard.tw",
  ];
  const entertainmentKeywords = [
    "drama",
    "controversy",
    "celebrity",
    "viral",
    "gossip",
    "fans",
    "trailer",
    "episode",
    "season finale",
    "leak",
    "beef",
    "reaction",
    "meme",
    "rumor",
  ];

  return (
    entertainmentHostHints.some((hint) => hostname === hint || hostname.endsWith(`.${hint}`)) ||
    /\/watch|\/shorts|\/reel|\/status|\/comments/.test(pathname) ||
    entertainmentKeywords.filter((keyword) => sampleText.includes(keyword)).length >= 2
  );
}

function detectGenericPageType() {
  const { hostname, pathname, pageText, headingText } = getPageSignals();
  const articleNode = document.querySelector("article");
  const codeBlockCount = document.querySelectorAll("pre code, code, table.highlight, .highlight, .pr-reviewable-comment").length;
  const paragraphCount = document.querySelectorAll("article p, main p, p").length;

  if (codeBlockCount >= 8 || (codeBlockCount >= 4 && /\/blob\/|\/pull\/|\/commit\/|\/compare\//.test(pathname)) || /api|sdk|function|class|component|hook|repository/.test(headingText)) {
    return "code";
  }

  if (articleNode || (paragraphCount >= 8 && pageText.length > 1800) || /\/article\/|\/news\/|\/blog\/|\/posts?\//.test(pathname)) {
    return "article";
  }

  return "generic";
}

const PAGE_COPILOT_ADAPTERS = [
  {
    id: "github",
    match() {
      const hostname = window.location.hostname.toLowerCase();
      return (
        hostname === "github.com" ||
        hostname.endsWith(".github.com") ||
        Boolean(document.querySelector('[data-testid="issue-viewer"], [data-testid="pull-request-review-thread"], .js-issue-title, .gh-header-title'))
      );
    },
    resolve() {
      return {
        adapterId: "github",
        adapterLabel: getAdapterLabel("github"),
        type: "github",
        label: getPageTypeLabel("github"),
        starterKeys: PAGE_COPILOT_STARTERS.github,
      };
    },
  },
  {
    id: "market",
    match() {
      return matchesMarketPage(getPageSignals());
    },
    resolve() {
      return {
        adapterId: "market",
        adapterLabel: getAdapterLabel("market"),
        type: "market",
        label: getPageTypeLabel("market"),
        starterKeys: PAGE_COPILOT_STARTERS.market,
      };
    },
  },
  {
    id: "entertainment",
    match() {
      return matchesEntertainmentPage(getPageSignals());
    },
    resolve() {
      return {
        adapterId: "entertainment",
        adapterLabel: getAdapterLabel("entertainment"),
        type: "entertainment",
        label: getPageTypeLabel("entertainment"),
        starterKeys: PAGE_COPILOT_STARTERS.entertainment,
      };
    },
  },
  {
    id: "generic",
    match() {
      return true;
    },
    resolve() {
      const type = detectGenericPageType();
      return {
        adapterId: "generic",
        adapterLabel: getAdapterLabel("generic"),
        type,
        label: getPageTypeLabel(type),
        starterKeys: PAGE_COPILOT_STARTERS[type] || DEFAULT_STARTER_KEYS,
      };
    },
  },
];

function detectPageCopilot() {
  const adapter = PAGE_COPILOT_ADAPTERS.find((item) => item.match()) || PAGE_COPILOT_ADAPTERS[PAGE_COPILOT_ADAPTERS.length - 1];
  return adapter.resolve();
}

function getStarterText(starterKey) {
  if (starterKey === "translatePage") {
    const language = getTargetLanguageLabel();
    return tl("starter_translatePage", { language });
  }

  return tl(`starter_${starterKey}`);
}

function getStarterPrompt(starterKey) {
  if (starterKey === "translatePage") {
    return tl("translationPrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "multiPerspective") {
    return tl("multiPerspectivePrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "reflectionArticle") {
    return tl("reflectionArticlePrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "articleTimeline") {
    return tl("articleTimelinePrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "articleBiasCheck") {
    return tl("articleBiasCheckPrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "codeRiskReview") {
    return tl("codeRiskReviewPrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "codeTeachBack") {
    return tl("codeTeachBackPrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "githubSummary") {
    return tl("githubSummaryPrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "githubReviewFocus") {
    return tl("githubReviewFocusPrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "githubNextSteps") {
    return tl("githubNextStepsPrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "bullVsBear") {
    return tl("bullVsBearPrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "catalystMap") {
    return tl("catalystMapPrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "pricedIn") {
    return tl("pricedInPrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "tickerImpact") {
    return tl("tickerImpactPrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "memeCaption") {
    return tl("memeCaptionPrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "darkMeme") {
    return tl("darkMemePrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "xPost") {
    return tl("xPostPrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "templateIdeas") {
    return tl("templateIdeasPrompt", { language: getTargetLanguageLabel() });
  }

  if (starterKey === "lowIqMeme") {
    return tl("lowIqMemePrompt", { language: getTargetLanguageLabel() });
  }

  return getStarterText(starterKey);
}

function formatAttachmentSummary(parts) {
  return parts.join(getUiLanguage().startsWith("zh") ? "、" : " and ");
}

function parsePerspectiveProfiles(rawValue) {
  return String(rawValue || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf("|");
      if (separatorIndex <= 0 || separatorIndex === line.length - 1) {
        return null;
      }

      const label = line.slice(0, separatorIndex).trim();
      const instruction = line.slice(separatorIndex + 1).trim();
      if (!label || !instruction) {
        return null;
      }

      return {
        id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `perspective-${Date.now()}`,
        label,
        instruction,
      };
    })
    .filter(Boolean)
    .slice(0, 4);
}

function getPerspectivePreset() {
  const customProfiles = parsePerspectiveProfiles(currentConfig?.multiPerspectiveProfiles);
  if (customProfiles.length) {
    return customProfiles;
  }

  const type = currentPageCopilot?.type || "generic";

  if (type === "code" || type === "github") {
    return [
      { id: "summary", label: tl("perspectiveSummaryLabel"), instruction: tl("perspectiveSummaryInstruction") },
      { id: "skeptic", label: tl("perspectiveSkepticLabel"), instruction: tl("codeRiskReviewPrompt", { language: getTargetLanguageLabel() }) },
      { id: "action", label: tl("perspectiveActionLabel"), instruction: tl("githubNextStepsPrompt", { language: getTargetLanguageLabel() }) },
    ];
  }

  if (type === "article") {
    return [
      { id: "summary", label: tl("perspectiveSummaryLabel"), instruction: tl("perspectiveSummaryInstruction") },
      { id: "skeptic", label: tl("perspectiveSkepticLabel"), instruction: tl("articleBiasCheckPrompt", { language: getTargetLanguageLabel() }) },
      { id: "action", label: tl("perspectiveActionLabel"), instruction: tl("perspectiveActionInstruction") },
    ];
  }

  return [
    { id: "summary", label: tl("perspectiveSummaryLabel"), instruction: tl("perspectiveSummaryInstruction") },
    { id: "skeptic", label: tl("perspectiveSkepticLabel"), instruction: tl("perspectiveSkepticInstruction") },
    { id: "action", label: tl("perspectiveActionLabel"), instruction: tl("perspectiveActionInstruction") },
  ];
}

async function buildPerspectivePrompt(userMessage, roleInstruction, previousOutputs = []) {
  const previousBlock = previousOutputs.length
    ? [
        "PREVIOUS PERSPECTIVES",
        ...previousOutputs.map((item) => `${item.label}\n${item.content}`),
      ].join("\n\n")
    : "";

  return [buildSystemPrompt(), roleInstruction, previousBlock, await buildPrompt(userMessage)]
    .filter(Boolean)
    .join("\n\n");
}

function getPerspectivePreview(text) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "";
  }

  if (normalized.length <= PERSPECTIVE_PREVIEW_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, PERSPECTIVE_PREVIEW_LENGTH).trim()}${tl("perspectivePreviewSuffix")}`;
}

function renderPerspectivePanel(run) {
  if (!run) {
    return "";
  }

  const stageCards = run.stages
    .map((stage) => {
      const statusClass = stage.status === "done" ? "is-done" : "is-running";
      const isExpanded = run.expandedKey === stage.id;
      const preview = getPerspectivePreview(stage.content);
      const body = stage.content
        ? renderMarkdown(stage.content)
        : `
          <div class="ollama-quick-typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        `;
      const previewBody = stage.content
        ? `<div class="ollama-quick-perspective-preview">${escapeHtml(preview)}</div>`
        : body;

      return `
        <article class="ollama-quick-perspective-card ${statusClass} ${isExpanded ? "is-expanded" : ""}">
          <div class="ollama-quick-perspective-card-top">
            <div class="ollama-quick-perspective-card-title">${escapeHtml(stage.label)}</div>
            <div class="ollama-quick-perspective-card-actions">
              ${stage.content ? `<button class="ollama-quick-copy" type="button" data-action="copy-perspective" data-perspective-key="${escapeHtml(stage.id)}">${escapeHtml(tl("copyPerspective"))}</button>` : ""}
              <button class="ollama-quick-copy" type="button" data-action="toggle-perspective" data-perspective-key="${escapeHtml(stage.id)}">${escapeHtml(isExpanded ? tl("collapsePerspective") : tl("expandPerspective"))}</button>
            </div>
          </div>
          <div class="ollama-quick-perspective-card-body ${isExpanded ? "rendered-markdown" : ""}">${isExpanded ? body : previewBody}</div>
        </article>
      `;
    })
    .join("");

  const finalKey = "final";
  const isFinalExpanded = run.expandedKey === finalKey;
  const finalBody = run.finalContent
    ? renderMarkdown(run.finalContent)
    : `
      <div class="ollama-quick-typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
  const finalPreview = run.finalContent
    ? `<div class="ollama-quick-perspective-preview">${escapeHtml(getPerspectivePreview(run.finalContent))}</div>`
    : finalBody;

  return `
    <section class="ollama-quick-perspective-panel">
      <div class="ollama-quick-perspective-head">
        <div class="ollama-quick-perspective-title">${escapeHtml(tl("perspectivePanelTitle"))}</div>
      </div>
      <div class="ollama-quick-perspective-grid">${stageCards}</div>
      <article class="ollama-quick-perspective-final ${run.isComplete ? "is-done" : "is-running"} ${isFinalExpanded ? "is-expanded" : ""}">
        <div class="ollama-quick-perspective-card-top">
          <div class="ollama-quick-perspective-card-title">${escapeHtml(tl("perspectiveFinalTitle"))}</div>
          <div class="ollama-quick-perspective-card-actions">
            ${run.finalContent ? `<button class="ollama-quick-copy" type="button" data-action="copy-perspective" data-perspective-key="${finalKey}">${escapeHtml(tl("copyPerspective"))}</button>` : ""}
            <button class="ollama-quick-copy" type="button" data-action="toggle-perspective" data-perspective-key="${finalKey}">${escapeHtml(isFinalExpanded ? tl("collapsePerspective") : tl("expandPerspective"))}</button>
          </div>
        </div>
        <div class="ollama-quick-perspective-card-body ${isFinalExpanded ? "rendered-markdown" : ""}">${isFinalExpanded ? finalBody : finalPreview}</div>
      </article>
    </section>
  `;
}

async function loadConfig() {
  const result = await runtimeMessage({ type: "ollama:get-config" });
  if (!result?.ok) {
    throw new Error(result?.error || "Failed to load Ollama config.");
  }

  currentConfig = result.config;
}

async function loadModels() {
  const result = await runtimeMessage({ type: "ollama:list-models" });
  if (!result?.ok) {
    throw new Error(result?.error || "Failed to fetch Ollama models.");
  }

  cachedModels = result.models || [];
  if (result.config) {
    currentConfig = result.config;
  }
}

function ensureHost() {
  let host = document.getElementById(HOST_ID);
  if (host) {
    return host;
  }

  host = document.createElement("div");
  host.id = HOST_ID;
  document.documentElement.appendChild(host);
  return host;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeMarkdownLinkTarget(target) {
  const value = (target || "").trim();
  if (!value) {
    return "";
  }

  const lowerValue = value.toLowerCase();
  if (
    lowerValue.startsWith("javascript:") ||
    lowerValue.startsWith("data:") ||
    lowerValue.startsWith("vbscript:")
  ) {
    return "";
  }

  return value;
}

function renderInlineMarkdown(text) {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label, target) => {
      const href = normalizeMarkdownLinkTarget(target);
      if (!href) {
        return label;
      }

      const safeLabel = label;
      const escapedHref = escapeHtml(href);
      const isExternal = /^https?:\/\//i.test(href);
      const targetAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${escapedHref}"${targetAttrs}>${safeLabel}</a>`;
    });
}

function renderMarkdown(markdown) {
  const escaped = escapeHtml(markdown || "");
  const codeBlocks = [];
  let working = escaped.replace(/```([\s\S]*?)```/g, (_match, code) => {
    const token = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(`<pre><code>${code.trim()}</code></pre>`);
    return token;
  });

  const blocks = working
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (/^###\s+/.test(block)) {
        return `<h3>${renderInlineMarkdown(block.replace(/^###\s+/, ""))}</h3>`;
      }
      if (/^##\s+/.test(block)) {
        return `<h2>${renderInlineMarkdown(block.replace(/^##\s+/, ""))}</h2>`;
      }
      if (/^#\s+/.test(block)) {
        return `<h1>${renderInlineMarkdown(block.replace(/^#\s+/, ""))}</h1>`;
      }

      const lines = block.split("\n");
      if (lines.every((line) => /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line))) {
        const ordered = lines.every((line) => /^\d+\.\s+/.test(line));
        const items = lines
          .map((line) => line.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""))
          .map((line) => `<li>${renderInlineMarkdown(line)}</li>`)
          .join("");
        return ordered ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
      }

      return `<p>${renderInlineMarkdown(block).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");

  return codeBlocks.reduce((html, block, index) => html.replace(`__CODE_BLOCK_${index}__`, block), blocks);
}

function getPageContext(includeChildFrames = true) {
  const selection = getSelectionText();
  const pageText = getPageTextSnapshot(MAX_PAGE_TEXT, includeChildFrames);
  const headings = getPageHeadingsSnapshot(12, includeChildFrames)
    .slice(0, 12)
    .join(" | ");

  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";

  return {
    title: document.title || "",
    url: window.location.href,
    selection: selection.slice(0, MAX_SELECTION_TEXT),
    headings,
    metaDescription,
    pageText,
  };
}

function mergePageContexts(contexts) {
  const headings = [];
  const headingSeen = new Set();
  const textBlocks = [];
  const textSeen = new Set();

  contexts.forEach((context) => {
    String(context?.headings || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((heading) => {
        const key = heading.toLowerCase();
        if (!headingSeen.has(key) && headings.length < 12) {
          headingSeen.add(key);
          headings.push(heading);
        }
      });

    String(context?.pageText || "")
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((block) => {
        const key = block.toLowerCase();
        if (!textSeen.has(key)) {
          textSeen.add(key);
          textBlocks.push(block);
        }
      });
  });

  const primaryContext = contexts[0] || {};
  const selectionContext = contexts.find((item) => item?.selection)?.selection || "";

  return {
    title: primaryContext.title || document.title || "",
    url: primaryContext.url || window.location.href,
    metaDescription: primaryContext.metaDescription || "",
    selection: selectionContext,
    headings: headings.join(" | "),
    pageText: normalizeExtractedText(textBlocks.join("\n\n")).slice(0, MAX_PAGE_TEXT),
  };
}

function requestFrameContexts() {
  if (!IS_TOP_FRAME) {
    return Promise.resolve([]);
  }

  const childWindows = collectChildFrameWindows(window);
  if (!childWindows.length) {
    return Promise.resolve([]);
  }

  const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return new Promise((resolve) => {
    const responses = [];
    const handleMessage = (event) => {
      const payload = event.data;
      if (!payload || payload.source !== FRAME_CONTEXT_MESSAGE_SOURCE || payload.type !== "frame-context-response" || payload.requestId !== requestId) {
        return;
      }

      if (payload.context) {
        responses.push(payload.context);
      }
    };

    window.addEventListener("message", handleMessage);

    childWindows.forEach((childWindow) => {
      try {
        childWindow.postMessage(
          {
            source: FRAME_CONTEXT_MESSAGE_SOURCE,
            type: "frame-context-request",
            requestId,
          },
          "*"
        );
      } catch (_error) {
        // Ignore frames that cannot receive messages.
      }
    });

    window.setTimeout(() => {
      window.removeEventListener("message", handleMessage);
      resolve(responses);
    }, FRAME_CONTEXT_REQUEST_TIMEOUT_MS);
  });
}

async function getAggregatedPageContext() {
  const localContext = getPageContext(false);
  if (!IS_TOP_FRAME) {
    return localContext;
  }

  const frameContexts = await requestFrameContexts();
  return mergePageContexts([localContext, ...frameContexts]);
}

async function buildPrompt(userMessage) {
  const context = includePageContext ? await getAggregatedPageContext() : null;
  const replyLanguage = currentConfig?.replyLanguage || "zh-TW";
  const history = chatMessages
    .slice(-8)
    .map((message) => `${message.role.toUpperCase()}:\n${message.content}`)
    .join("\n\n");

  const contextBlock = context
    ? [
        "CURRENT PAGE CONTEXT",
        `Title: ${context.title}`,
        `URL: ${context.url}`,
        context.metaDescription ? `Description: ${context.metaDescription}` : "",
        context.headings ? `Headings: ${context.headings}` : "",
        context.selection ? `Selected text:\n${context.selection}` : "",
        context.pageText ? `Visible page text:\n${context.pageText}` : "",
      ]
        .filter(Boolean)
        .join("\n\n")
    : tl("currentPageContextDisabled");

  return [
    `Reply language: ${replyLanguage}. Always answer in this language unless the user explicitly asks for another language.`,
    contextBlock,
    history ? `CHAT HISTORY\n\n${history}` : "",
    `USER MESSAGE\n${userMessage}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildSystemPrompt() {
  const configuredPrompt = (currentConfig?.systemPrompt || "").trim();
  const replyLanguage = currentConfig?.replyLanguage || "zh-TW";

  return [
    configuredPrompt,
    `Reply language: ${replyLanguage}. Always answer in this language unless the user explicitly asks for another language.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildConversationSnapshot() {
  return {
    id: `chat-${Date.now()}`,
    savedAt: new Date().toISOString(),
    pageTitle: document.title || "",
    pageUrl: window.location.href,
    selectedModel: currentConfig?.selectedModel || "",
    replyLanguage: currentConfig?.replyLanguage || "zh-TW",
    includePageContext,
    messages: chatMessages,
    latestPerspectiveRun,
  };
}

async function persistConversationNow() {
  if (!chatMessages.length && !latestPerspectiveRun) {
    return;
  }

  const result = await runtimeMessage({
    type: "ollama:save-chat-session",
    session: buildConversationSnapshot(),
  });

  if (!result?.ok) {
    throw new Error(result?.error || "Failed to save chat session.");
  }
}

function scheduleConversationSave() {
  if (pendingSessionSaveTimer) {
    window.clearTimeout(pendingSessionSaveTimer);
  }

  pendingSessionSaveTimer = window.setTimeout(() => {
    persistConversationNow().catch(() => {});
  }, 800);
}

async function loadLatestConversation() {
  const result = await runtimeMessage({ type: "ollama:get-latest-chat-session" });
  if (!result?.ok) {
    throw new Error(result?.error || tl("loadChatFailed"));
  }

  if (!result.session) {
    setStatus(tl("noSavedChat"));
    return;
  }

  chatMessages = Array.isArray(result.session.messages) ? result.session.messages : [];
  latestPerspectiveRun = result.session.latestPerspectiveRun || null;
  includePageContext = result.session.includePageContext !== false;
  composeMode = "chat";
  renderShell();
  setStatus(tl("latestChatLoaded"));
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error || new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

function fileToText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Failed to read file."));
    reader.readAsText(file);
  });
}

function isImageFile(file) {
  return file.type.startsWith("image/");
}

function isMarkdownFile(file) {
  const name = (file.name || "").toLowerCase();
  return file.type === "text/markdown" || file.type === "text/x-markdown" || name.endsWith(".md") || name.endsWith(".markdown");
}

function isTextDocumentFile(file) {
  const name = (file.name || "").toLowerCase();
  return (
    isMarkdownFile(file) ||
    file.type === "text/plain" ||
    file.type === "application/json" ||
    file.type === "text/json" ||
    file.type === "text/csv" ||
    name.endsWith(".txt") ||
    name.endsWith(".json") ||
    name.endsWith(".csv")
  );
}

function modelLikelySupportsVision(modelName) {
  const value = (modelName || "").toLowerCase();
  if (!value) {
    return false;
  }

  if (
    value.includes("-vl") ||
    value.includes(":vl") ||
    value.includes(" vl") ||
    value.includes("-vision") ||
    value.includes(":vision")
  ) {
    return true;
  }

  const visionHints = [
    "llava",
    "vision",
    "gemma4",
    "gemma 4",
    "qwen2.5vl",
    "qwen2-vl",
    "qwen-vl",
    "qwen3-vl",
    "minicpm-v",
    "bakllava",
    "moondream",
    "gemma3",
    "gemma-3",
  ];

  return visionHints.some((hint) => value.includes(hint));
}

async function attachImageFiles(files) {
  const imageFiles = files.filter(isImageFile);
  if (!imageFiles.length) {
    setStatus(tl("imagesOnly"));
    return;
  }

  const nextImages = await Promise.all(
    imageFiles.map(async (file) => ({
      id: `${Date.now()}-${file.name}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      mimeType: file.type,
      base64: await fileToBase64(file),
      previewUrl: URL.createObjectURL(file),
    }))
  );

  attachedImages = [...attachedImages, ...nextImages];
  renderAttachments();

  if (!modelLikelySupportsVision(currentConfig?.selectedModel)) {
    setStatus(tl("attachedImagesVisionWarning", { count: nextImages.length }));
    return;
  }

  setStatus(tl("attachedImages", { count: nextImages.length }));
}

async function attachTextDocumentFiles(files) {
  const textDocumentFiles = files.filter(isTextDocumentFile);
  if (!textDocumentFiles.length) {
    return 0;
  }

  const nextDocuments = await Promise.all(
    textDocumentFiles.map(async (file) => ({
      id: `${Date.now()}-${file.name}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      text: await fileToText(file),
    }))
  );

  attachedDocuments = [...attachedDocuments, ...nextDocuments];
  renderAttachments();
  return nextDocuments.length;
}

async function attachFiles(files) {
  const imageFiles = files.filter(isImageFile);
  const textDocumentFiles = files.filter(isTextDocumentFile);

  if (!imageFiles.length && !textDocumentFiles.length) {
    setStatus(tl("filesUnsupported"));
    return;
  }

  let attachedImageCount = 0;
  let attachedDocumentCount = 0;

  if (imageFiles.length) {
    await attachImageFiles(imageFiles);
    attachedImageCount = imageFiles.length;
  }

  if (textDocumentFiles.length) {
    attachedDocumentCount = await attachTextDocumentFiles(textDocumentFiles);
  }

  if (attachedDocumentCount) {
    const parts = [];
    if (attachedImageCount) {
      parts.push(tl("attachedImages", { count: attachedImageCount }).replace(/^已附加 |^Attached /, "").replace(/\.$/, ""));
    }
    parts.push(`${attachedDocumentCount} ${tl("attachedFileLabel").toLowerCase()}${attachedDocumentCount > 1 ? "s" : ""}`);
    setStatus(tl("attachedFiles", { items: formatAttachmentSummary(parts) }));
  }
}

async function attachClipboardItems(items) {
  const imageFiles = items
    .filter((item) => item.type.startsWith("image/"))
    .map((item) => item.getAsFile())
    .filter(Boolean);

  if (!imageFiles.length) {
    return false;
  }

  await attachImageFiles(imageFiles);
  return true;
}

function renderMessages() {
  pendingMessageRenderFrame = 0;
  const list = ensureHost().querySelector("[data-role='messages']");
  if (!list) {
    return;
  }

  const starters = ensureHost().querySelector(".ollama-quick-starters-panel");
  const startersToggle = ensureHost().querySelector("[data-action='toggle-starters']");
  if (starters) {
    starters.classList.toggle("is-hidden", chatMessages.length > 0);
  }
  if (startersToggle instanceof HTMLButtonElement) {
    startersToggle.hidden = chatMessages.length > 0;
  }

  const perspectivePanel = renderPerspectivePanel(latestPerspectiveRun);

  if (!chatMessages.length && !perspectivePanel) {
    list.innerHTML = `<div class="ollama-quick-empty">${escapeHtml(tl("empty"))}</div>`;
    return;
  }

  const messageMarkup = chatMessages
    .map((message) => {
      const roleClass = message.role === "assistant" ? "is-assistant" : "is-user";
      const isTypingAssistant = message.role === "assistant" && !message.content.trim() && isGenerating;
      const body =
        isTypingAssistant
          ? `
            <div class="ollama-quick-typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          `
          : message.role === "assistant"
          ? renderMarkdown(message.content)
          : `<div class="ollama-quick-user-text">${escapeHtml(message.content).replace(/\n/g, "<br>")}</div>`;
      const copyButton =
        message.role === "assistant" && !isTypingAssistant
          ? `<button class="ollama-quick-copy" type="button" data-action="copy-message" data-index="${message.id}">${escapeHtml(tl("copy"))}</button>`
          : "";
      const roleLabel = isTypingAssistant
        ? tl("assistantThinking")
        : message.role === "assistant"
        ? tl("assistantRole")
        : tl("userRole");
      return `
        <article class="ollama-quick-message ${roleClass}">
          <div class="ollama-quick-message-top">
            <div class="ollama-quick-message-role">${escapeHtml(roleLabel)}</div>
          </div>
          <div class="ollama-quick-message-body rendered-markdown">${body}</div>
          ${copyButton ? `<div class="ollama-quick-message-actions">${copyButton}</div>` : ""}
        </article>
      `;
    })
    .join("");

  list.innerHTML = [perspectivePanel, messageMarkup].filter(Boolean).join("");

  list.scrollTop = list.scrollHeight;
}

function scheduleMessagesRender() {
  if (pendingMessageRenderFrame) {
    return;
  }

  pendingMessageRenderFrame = window.requestAnimationFrame(() => {
    renderMessages();
  });
}

function setStatus(text) {
  const node = ensureHost().querySelector("[data-role='status']");
  if (node) {
    node.textContent = text;
  }

  const indicator = ensureHost().querySelector("[data-role='status-indicator']");
  if (indicator) {
    indicator.classList.toggle("is-busy", isGenerating);
  }
}

function setDragState(active) {
  isDragActive = active;
  const dropzone = ensureHost().querySelector("[data-role='dropzone']");
  if (dropzone) {
    dropzone.classList.toggle("is-active", active);
  }
}

function renderShell() {
  const host = ensureHost();
  currentPageCopilot = detectPageCopilot();
  const activeStarterKeys = currentPageCopilot?.starterKeys || DEFAULT_STARTER_KEYS;
  const modelOptions = cachedModels.length
    ? cachedModels
        .map((model) => {
          const selected = currentConfig?.selectedModel === model.name ? "selected" : "";
          return `<option value="${escapeHtml(model.name)}" ${selected}>${escapeHtml(model.name)}</option>`;
        })
        .join("")
    : `<option value="">${escapeHtml(tl("pickModelToStart"))}</option>`;

  host.innerHTML = `
    <button class="ollama-quick-launcher" type="button" data-action="toggle-panel" aria-label="${escapeHtml(tl("openQuickChat"))}" title="${escapeHtml(tl("openQuickChat"))}">
      <span class="ollama-quick-launcher-core"></span>
    </button>
    <section class="ollama-quick-panel ${isPanelOpen ? "is-open" : ""}" data-role="panel">
      <header class="ollama-quick-header">
        <div class="ollama-quick-header-main">
          <div class="ollama-quick-eyebrow">${escapeHtml(tl("quickAccess"))}</div>
          <h2>${escapeHtml(tl("liveChat"))}</h2>
        </div>
        <div class="ollama-quick-header-actions">
          <button class="ollama-quick-icon-button" type="button" data-action="use-selection" title="${escapeHtml(tl("useSelection"))}" aria-label="${escapeHtml(tl("useSelection"))}">✦</button>
          <button class="ollama-quick-secondary" type="button" data-action="load-latest-chat" title="${escapeHtml(tl("loadLatestChat"))}" aria-label="${escapeHtml(tl("loadLatestChat"))}">${escapeHtml(tl("loadLatestChat"))}</button>
          <button class="ollama-quick-secondary" type="button" data-action="clear-chat" title="${escapeHtml(tl("clearChat"))}" aria-label="${escapeHtml(tl("clearChat"))}">${escapeHtml(tl("clear"))}</button>
          <button class="ollama-quick-icon-button" type="button" data-action="open-settings" title="${escapeHtml(tl("openSettings"))}" aria-label="${escapeHtml(tl("openSettings"))}">⚙</button>
          <button class="ollama-quick-icon-button" type="button" data-action="toggle-panel" aria-label="${escapeHtml(tl("collapse"))}">-</button>
        </div>
      </header>
      <div class="ollama-quick-controls">
        <select class="ollama-quick-select" data-role="model-select">${modelOptions}</select>
        <label class="ollama-quick-toggle ollama-quick-toggle-below">
          <input type="checkbox" data-role="include-context" ${includePageContext ? "checked" : ""} />
          <span>${escapeHtml(tl("context"))}</span>
        </label>
      </div>
      <div class="ollama-quick-starters-panel ${areStartersExpanded ? "is-expanded" : ""}">
        <div class="ollama-quick-starters-head">
          <div class="ollama-quick-starters-meta">
            <div class="ollama-quick-starters-label">${escapeHtml(tl("starterTools"))}</div>
            <div class="ollama-quick-page-copilot-summary">
              <span class="ollama-quick-page-copilot-pill" title="${escapeHtml(tl("pageTypeDetected", { type: currentPageCopilot.label }))}">
                <span class="ollama-quick-page-copilot-icon" aria-hidden="true">◈</span>
                <span>${escapeHtml(currentPageCopilot.label)}</span>
              </span>
              <span class="ollama-quick-page-copilot-pill" title="${escapeHtml(tl("adapterDetected", { adapter: currentPageCopilot.adapterLabel }))}">
                <span class="ollama-quick-page-copilot-icon" aria-hidden="true">↗</span>
                <span>${escapeHtml(currentPageCopilot.adapterLabel)}</span>
              </span>
            </div>
          </div>
          <button class="ollama-quick-starters-toggle" type="button" data-action="toggle-starters" aria-expanded="${areStartersExpanded ? "true" : "false"}">${escapeHtml(areStartersExpanded ? tl("collapseStarters") : tl("expandStarters"))}</button>
        </div>
        <div class="ollama-quick-starters">
        ${activeStarterKeys.map((starterKey) => `<button class="ollama-quick-starter" type="button" data-action="use-starter" data-starter-key="${escapeHtml(starterKey)}">${escapeHtml(getStarterText(starterKey))}</button>`).join("")}
        </div>
      </div>
      <div class="ollama-quick-status-wrap">
        <span class="ollama-quick-status-indicator" data-role="status-indicator"></span>
        <div class="ollama-quick-status" data-role="status">${escapeHtml(tl("ready"))}</div>
      </div>
      <div class="ollama-quick-messages" data-role="messages"></div>
      <div class="ollama-quick-compose">
        <div class="ollama-quick-dropzone" data-role="dropzone">${escapeHtml(tl("dropzone"))}</div>
        <div class="ollama-quick-compose-main">
          <div class="ollama-quick-compose-attachments" data-role="attachments"></div>
          <div class="ollama-quick-compose-input">
            <label class="ollama-quick-compose-upload" title="${escapeHtml(tl("uploadFile"))}" aria-label="${escapeHtml(tl("uploadFile"))}">
              ⊕
              <input type="file" accept="image/*,.txt,.md,.json,.csv,text/plain,text/markdown,application/json,text/json,text/csv" data-role="image-upload" hidden multiple />
            </label>
            <textarea class="ollama-quick-textarea" data-role="prompt" placeholder="${escapeHtml(tl("promptPlaceholder"))}"></textarea>
          </div>
        </div>
        <button class="ollama-quick-primary" type="button" data-action="send-message">➤</button>
      </div>
    </section>
  `;

  host.onclick = handleClick;
  host.onchange = handleChange;
  host.onpaste = handlePaste;
  host.ondragenter = handleDragEnter;
  host.ondragover = handleDragOver;
  host.ondragleave = handleDragLeave;
  host.ondrop = handleDrop;
  renderMessages();
  renderAttachments();
  setDragState(isDragActive);

  const sendButton = host.querySelector('[data-action="send-message"]');
  if (sendButton instanceof HTMLButtonElement) {
    sendButton.onclick = async (event) => {
      event.preventDefault();
      event.stopPropagation();
      await sendCurrentPrompt();
    };
  }
}

function togglePanel(force) {
  const panel = ensureHost().querySelector("[data-role='panel']");
  if (!panel) {
    return;
  }

  const next = typeof force === "boolean" ? force : !panel.classList.contains("is-open");
  isPanelOpen = next;
  panel.classList.toggle("is-open", next);
}

async function runGenerate(prompt, model) {
  const result = await runtimeMessage({ type: "ollama:generate", prompt, model });
  if (!result?.ok) {
    throw new Error(result?.error || tl("streamingFailed"));
  }

  return result.response || "";
}

async function runMultiPerspectiveAnalysis(userMessage) {
  if (attachedImages.length) {
    setStatus(tl("perspectiveImagesUnsupported"));
    return;
  }

  const promptText = userMessage || tl("perspectiveInputFallback");
  const preset = getPerspectivePreset();
  latestPerspectiveRun = {
    id: Date.now(),
    stages: preset.map((item) => ({ ...item, content: "", status: "pending" })),
    finalContent: "",
    isComplete: false,
    expandedKey: preset[0]?.id || "final",
  };
  renderMessages();
  togglePanel(true);
  isGenerating = true;
  setStatus(tl("perspectiveRunning"));

  try {
    const collected = [];

    for (const stage of latestPerspectiveRun.stages) {
      stage.status = "running";
      renderMessages();
      scheduleConversationSave();
      setStatus(tl("perspectiveStageRunning", { label: stage.label }));
      stage.content = await runGenerate(await buildPerspectivePrompt(promptText, stage.instruction, collected), currentConfig.selectedModel);
      stage.status = "done";
      collected.push({ label: stage.label, content: stage.content });
      renderMessages();
      scheduleConversationSave();
    }

    latestPerspectiveRun.finalContent = await runGenerate(
      await buildPerspectivePrompt(
        promptText,
        tl("perspectiveSynthesisInstruction"),
        collected
      ),
      currentConfig.selectedModel
    );
    latestPerspectiveRun.isComplete = true;
    renderMessages();
    scheduleConversationSave();
    setStatus(tl("perspectiveDone"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    latestPerspectiveRun.finalContent = `Error: ${message}`;
    latestPerspectiveRun.isComplete = true;
    renderMessages();
    scheduleConversationSave();
    setStatus(message);
  } finally {
    isGenerating = false;
    composeMode = "chat";
  }
}

async function handleClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const actionNode = target.closest("[data-action]");
  if (!(actionNode instanceof HTMLElement)) {
    return;
  }

  const action = actionNode.dataset.action;
  if (action === "toggle-panel") {
    togglePanel();
    return;
  }

  if (action === "open-settings") {
    const result = await runtimeMessage({ type: "ollama:open-options" });
    if (!result?.ok) {
      setStatus(result?.error || tl("openSettingsFailed"));
    }
    return;
  }

  if (action === "load-latest-chat") {
    try {
      await loadLatestConversation();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    }
    return;
  }

  if (action === "toggle-starters") {
    areStartersExpanded = !areStartersExpanded;
    renderShell();
    return;
  }

  if (action === "use-selection") {
    const prompt = ensureHost().querySelector("[data-role='prompt']");
    if (!(prompt instanceof HTMLTextAreaElement)) {
      return;
    }

    const selectedText = window.getSelection?.()?.toString().trim() || "";
    if (!selectedText) {
      setStatus(tl("noSelectedText"));
      return;
    }

    prompt.value = tl("selectionPrompt", { selection: selectedText.slice(0, MAX_SELECTION_TEXT) });
    prompt.focus();
    setStatus(tl("insertedSelection"));
    return;
  }

  if (action === "remove-attachment") {
    const imageId = actionNode.dataset.imageId;
    const removed = attachedImages.find((item) => item.id === imageId);
    if (removed?.previewUrl) {
      URL.revokeObjectURL(removed.previewUrl);
    }
    attachedImages = attachedImages.filter((item) => item.id !== imageId);
    attachedDocuments = attachedDocuments.filter((item) => item.id !== imageId);
    renderAttachments();
    setStatus(tl("removedAttachment"));
    return;
  }

  if (action === "use-starter") {
    const prompt = ensureHost().querySelector("[data-role='prompt']");
    if (!(prompt instanceof HTMLTextAreaElement)) {
      return;
    }

    const starterKey = actionNode.dataset.starterKey || "";
    const starter = getStarterPrompt(starterKey);
    composeMode = starterKey === "multiPerspective" ? "perspective" : "chat";
    prompt.value = starter;
    prompt.focus();
    setStatus(starterKey === "multiPerspective" ? tl("perspectiveModeReady") : tl("starterReady", { starter }));
    return;
  }

  if (action === "toggle-perspective") {
    if (!latestPerspectiveRun) {
      return;
    }

    const perspectiveKey = actionNode.dataset.perspectiveKey || "";
    latestPerspectiveRun.expandedKey = latestPerspectiveRun.expandedKey === perspectiveKey ? "" : perspectiveKey;
    renderMessages();
    return;
  }

  if (action === "copy-perspective") {
    if (!latestPerspectiveRun) {
      return;
    }

    const perspectiveKey = actionNode.dataset.perspectiveKey || "";
    const stage = latestPerspectiveRun.stages.find((item) => item.id === perspectiveKey);
    const content = perspectiveKey === "final" ? latestPerspectiveRun.finalContent : stage?.content;
    if (!content) {
      setStatus(tl("messageNotFound"));
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      setStatus(tl("copiedResponse"));
    } catch {
      setStatus(tl("copyFailed"));
    }
    return;
  }

  if (action === "clear-chat") {
    chatMessages = [];
    latestPerspectiveRun = null;
    composeMode = "chat";
    attachedImages.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    attachedImages = [];
    attachedDocuments = [];
    renderMessages();
    renderAttachments();
    scheduleConversationSave();
    setStatus(tl("chatCleared"));
    return;
  }

  if (action === "copy-message") {
    const id = actionNode.dataset.index;
    const message = chatMessages.find((item) => String(item.id) === String(id));
    if (!message) {
      setStatus(tl("messageNotFound"));
      return;
    }

    try {
      await navigator.clipboard.writeText(message.content);
      setStatus(tl("copiedResponse"));
    } catch {
      setStatus(tl("copyFailed"));
    }
    return;
  }

  if (action === "send-message") {
    await sendCurrentPrompt();
  }
}

async function handleChange(event) {
  const target = event.target;
  if (target instanceof HTMLSelectElement && target.dataset.role === "model-select") {
    const result = await runtimeMessage({ type: "ollama:select-model", model: target.value });
    if (result?.ok) {
      currentConfig = result.config;
      setStatus(tl("modelSelected", { model: currentConfig.selectedModel || "none" }));
    } else {
      setStatus(result?.error || tl("modelSelectFailed"));
    }
    return;
  }

  if (target instanceof HTMLInputElement && target.dataset.role === "include-context") {
    includePageContext = target.checked;
    setStatus(includePageContext ? tl("pageContextEnabled") : tl("pageContextDisabled"));
    return;
  }

  if (target instanceof HTMLInputElement && target.dataset.role === "image-upload") {
    const files = Array.from(target.files || []);
    if (!files.length) {
      return;
    }

    try {
      await attachFiles(files);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      target.value = "";
    }
  }
}

async function handleKeydown(event) {
  const target = event.target;
  if (
    (event.ctrlKey || event.metaKey) &&
    event.key === "/" &&
    !(target instanceof HTMLInputElement) &&
    !(target instanceof HTMLTextAreaElement) &&
    !(target instanceof HTMLElement && target.isContentEditable)
  ) {
    event.preventDefault();
    togglePanel();
    return;
  }

  if (!(target instanceof HTMLTextAreaElement)) {
    return;
  }

  if (target.dataset.role === "prompt" && event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    await sendCurrentPrompt();
  }
}

async function handlePaste(event) {
  const target = event.target;
  if (!(target instanceof HTMLTextAreaElement) || target.dataset.role !== "prompt") {
    return;
  }

  const items = Array.from(event.clipboardData?.items || []);
  const hasImage = items.some((item) => item.type.startsWith("image/"));
  if (!hasImage) {
    return;
  }

  event.preventDefault();

  try {
    const attached = await attachClipboardItems(items);
    if (attached) {
      setStatus(tl("pastedImage"));
    }
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error));
  }
}

async function sendCurrentPrompt() {
  const promptNode = ensureHost().querySelector("[data-role='prompt']");
  if (!(promptNode instanceof HTMLTextAreaElement)) {
    return;
  }

  const userMessage = promptNode.value.trim();
  if (!userMessage && !attachedImages.length && !attachedDocuments.length) {
    setStatus(tl("typePromptOrAttach"));
    return;
  }

  if (!currentConfig?.selectedModel) {
    setStatus(tl("pickModelFirst"));
    return;
  }

  if (attachedImages.length && !modelLikelySupportsVision(currentConfig.selectedModel)) {
    setStatus(tl("sendingVisionWarning", { count: attachedImages.length, model: currentConfig.selectedModel }));
  }

  setStatus(tl("preparingRequest", { model: currentConfig.selectedModel }));
  const displayMessage = userMessage || (attachedDocuments.length ? tl("analyzeTextFile") : tl("analyzeImage"));
  promptNode.value = "";

  if (composeMode === "perspective") {
    chatMessages.push({ id: Date.now(), role: "user", content: displayMessage });
    renderMessages();
    scheduleConversationSave();
    await runMultiPerspectiveAnalysis(userMessage);
    attachedDocuments = [];
    renderAttachments();
    return;
  }

  chatMessages.push({ id: Date.now(), role: "user", content: displayMessage });
  chatMessages.push({ id: Date.now() + 1, role: "assistant", content: "" });
  renderMessages();
  scheduleConversationSave();
  togglePanel(true);
  isGenerating = true;
  const waitingParts = [];
  if (attachedImages.length) {
    waitingParts.push(tl("attachedImages", { count: attachedImages.length }).replace(/^已附加 |^Attached /, "").replace(/\.$/, ""));
  }
  if (attachedDocuments.length) {
    waitingParts.push(`${attachedDocuments.length} ${tl("attachedFileLabel").toLowerCase()}${attachedDocuments.length > 1 ? "s" : ""}`);
  }
  setStatus(tl("waitingForModel", { model: currentConfig.selectedModel, details: waitingParts.length ? tl("waitingWith", { items: formatAttachmentSummary(waitingParts) }) : "" }));

  try {
    await startStreamingChat(await buildChatMessages(displayMessage), currentConfig.selectedModel);
    attachedImages.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    attachedImages = [];
    attachedDocuments = [];
    renderAttachments();
    isGenerating = false;
    scheduleConversationSave();
    setStatus(tl("doneWithModel", { model: currentConfig.selectedModel }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    chatMessages[chatMessages.length - 1].content = `Error: ${message}`;
    renderMessages();
    isGenerating = false;
    scheduleConversationSave();
    setStatus(message);
  }
}

function handleDragEnter(event) {
  if (!event.dataTransfer?.types?.includes("Files")) {
    return;
  }

  event.preventDefault();
  setDragState(true);
}

function handleDragOver(event) {
  if (!event.dataTransfer?.types?.includes("Files")) {
    return;
  }

  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
  setDragState(true);
}

function handleDragLeave(event) {
  const host = ensureHost();
  const related = event.relatedTarget;
  if (related instanceof Node && host.contains(related)) {
    return;
  }

  setDragState(false);
}

async function handleDrop(event) {
  if (!event.dataTransfer?.files?.length) {
    return;
  }

  event.preventDefault();
  setDragState(false);

  try {
    await attachFiles(Array.from(event.dataTransfer.files));
    togglePanel(true);
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error));
  }
}

function updateAssistantDraft(text) {
  if (!chatMessages.length) {
    return;
  }

  const last = chatMessages[chatMessages.length - 1];
  if (last.role !== "assistant") {
    return;
  }

  last.content = text;
  scheduleMessagesRender();
  scheduleConversationSave();
}

async function buildChatMessages(userMessage) {
  const markdownAttachmentBlock = attachedDocuments.length
    ? [
        tl("attachedTextFilesHeading"),
        ...attachedDocuments.map((item) => `FILE: ${item.name}\n${item.text}`),
      ].join("\n\n")
    : "";
  const contextPrompt = [await buildPrompt(userMessage), markdownAttachmentBlock].filter(Boolean).join("\n\n");
  const systemPrompt = buildSystemPrompt();
  const messages = [];

  if (systemPrompt) {
    messages.push({
      role: "system",
      content: systemPrompt,
    });
  }

  messages.push({
    role: "user",
    content: contextPrompt,
    images: attachedImages.map((item) => item.base64),
  });

  return messages;
}

function renderAttachments() {
  const node = ensureHost().querySelector("[data-role='attachments']");
  if (!node) {
    return;
  }

  if (!attachedImages.length && !attachedDocuments.length) {
    node.innerHTML = "";
    return;
  }

  node.innerHTML = [
    ...attachedImages.map(
      (item) => `
        <div class="ollama-quick-attachment">
          <img src="${item.previewUrl}" alt="${escapeHtml(item.name)}" />
          <button type="button" class="ollama-quick-remove-attachment" data-action="remove-attachment" data-image-id="${item.id}">×</button>
        </div>
      `
    ),
    ...attachedDocuments.map(
      (item) => `
        <div class="ollama-quick-attachment ollama-quick-attachment-doc">
          <div class="ollama-quick-attachment-doc-label">${escapeHtml(tl("attachedFileLabel"))}</div>
          <div class="ollama-quick-attachment-doc-name">${escapeHtml(item.name)}</div>
          <button type="button" class="ollama-quick-remove-attachment" data-action="remove-attachment" data-image-id="${item.id}">×</button>
        </div>
      `
    ),
  ].join("");
}

function startStreamingChat(messages, model) {
  if (activeStreamPort) {
    activeStreamPort.disconnect();
    activeStreamPort = null;
  }

  activeStreamText = "";

  return new Promise((resolve, reject) => {
    let port;
    try {
      port = chrome.runtime.connect({ name: "ollama-stream" });
    } catch (error) {
      reject(normalizeRuntimeError(error));
      return;
    }
    let settled = false;
    activeStreamPort = port;

    port.onMessage.addListener((message) => {
      if (message?.type === "ollama:stream-start") {
        isGenerating = true;
        setStatus(tl("runningModel", { model: message.model || model }));
        return;
      }

      if (message?.type === "ollama:stream-chunk") {
        activeStreamText += message.response || "";
        updateAssistantDraft(activeStreamText);

        if (message.done) {
          settled = true;
          isGenerating = false;
          port.disconnect();
          activeStreamPort = null;
          resolve();
        }
        return;
      }

      if (message?.type === "ollama:stream-complete") {
        settled = true;
        isGenerating = false;
        port.disconnect();
        activeStreamPort = null;
        resolve();
        return;
      }

      if (message?.type === "ollama:stream-error") {
        settled = true;
        isGenerating = false;
        port.disconnect();
        activeStreamPort = null;
        reject(new Error(message.error || tl("streamingFailed")));
      }
    });

    port.onDisconnect.addListener(() => {
      if (!settled && chrome.runtime.lastError) {
        settled = true;
        activeStreamPort = null;
        reject(normalizeRuntimeError(chrome.runtime.lastError.message));
      }
    });

    try {
      port.postMessage({
        type: "ollama:stream-chat",
        messages,
        model,
      });
    } catch (error) {
      settled = true;
      activeStreamPort = null;
      reject(normalizeRuntimeError(error));
    }
  });
}

async function bootstrap() {
  if (!IS_TOP_FRAME) {
    return;
  }

  try {
    await loadConfig();
    await loadModels();
    renderShell();
    setStatus(currentConfig?.selectedModel ? tl("usingModel", { model: currentConfig.selectedModel }) : tl("pickModelToStart"));
  } catch (error) {
    renderShell();
    setStatus(error instanceof Error ? error.message : String(error));
  }
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (!IS_TOP_FRAME) {
    return;
  }

  if (areaName !== "sync") {
    return;
  }

  if (changes.ollamaUrl || changes.selectedModel || changes.replyLanguage || changes.systemPrompt || changes.multiPerspectiveProfiles) {
    bootstrap().catch(() => {});
  }
});

window.addEventListener("message", (event) => {
  const payload = event.data;
  if (!payload || payload.source !== FRAME_CONTEXT_MESSAGE_SOURCE || payload.type !== "frame-context-request") {
    return;
  }

  try {
    window.top?.postMessage(
      {
        source: FRAME_CONTEXT_MESSAGE_SOURCE,
        type: "frame-context-response",
        requestId: payload.requestId,
        context: getPageContext(false),
      },
      "*"
    );
  } catch (_error) {
    // Ignore frames that cannot reply to the top window.
  }
});

if (IS_TOP_FRAME) {
  window.setTimeout(() => {
    bootstrap().catch(() => {});
  }, 250);

  window.addEventListener("keydown", (event) => {
    handleKeydown(event).catch?.(() => {});
  }, true);
}
