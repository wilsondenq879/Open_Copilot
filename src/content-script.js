const HOST_ID = "ollama-quick-chat-host";
const MAX_PAGE_TEXT = 8000;
const MAX_SELECTION_TEXT = 2000;

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

const STARTER_KEYS = ["pageSummary", "translatePage", "codeExplain", "imageAnalysis", "imageAnalysisMarkdown"];
const CONTENT_I18N = {
  "zh-TW": {
    quickAccess: "快速工具",
    liveChat: "Edge AI Chat",
    clear: "清除",
    context: "脈絡",
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
    currentPageContextDisabled: "CURRENT PAGE CONTEXT\nDisabled",
    selectionPrompt: "請幫我處理這段選取文字：\n\n{selection}",
    noSelectedText: "這個頁面沒有選取文字。",
    insertedSelection: "已把目前選取內容放進輸入框。",
    removedAttachment: "已移除附件。",
    starterReady: "已填入範本：{starter}",
    chatCleared: "對話已清除。",
    messageNotFound: "找不到訊息。",
    copiedResponse: "已複製助理回覆。",
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
    streamingFailed: "串流失敗。",
    starter_pageSummary: "網頁內容精華",
    starter_translatePage: "網頁翻譯{language}",
    starter_codeExplain: "code 內容白話文解析",
    starter_imageAnalysis: "圖片分析",
    starter_imageAnalysisMarkdown: "圖片分析後 md/mermaid 輸出",
    translationPrompt: "請把這個網頁內容翻譯成{language}。",
  },
  en: {
    quickAccess: "Quick Access",
    liveChat: "Edge AI Chat",
    clear: "Clear",
    context: "Context",
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
    currentPageContextDisabled: "CURRENT PAGE CONTEXT\nDisabled",
    selectionPrompt: "Please help me with this selected text:\n\n{selection}",
    noSelectedText: "No selected text found on this page.",
    insertedSelection: "Inserted current selection into the prompt.",
    removedAttachment: "Removed attachment.",
    starterReady: "Starter ready: {starter}",
    chatCleared: "Chat cleared.",
    messageNotFound: "Message not found.",
    copiedResponse: "Copied assistant response.",
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
    streamingFailed: "Streaming failed.",
    starter_pageSummary: "Summarize This Page",
    starter_translatePage: "Translate Page To {language}",
    starter_codeExplain: "Explain Code Clearly",
    starter_imageAnalysis: "Analyze Image",
    starter_imageAnalysisMarkdown: "Analyze Image To md/mermaid",
    translationPrompt: "Translate this page into {language}.",
  },
};
CONTENT_I18N.ja = { ...CONTENT_I18N.en, quickAccess: "クイックアクセス", liveChat: "Ollama ライブチャット", clear: "クリア", context: "コンテキスト", ready: "準備完了。", empty: "このページや選択テキスト、または他の内容について質問してください。", copy: "コピー", dropzone: "画像またはテキストファイルをここにドロップして添付", uploadFile: "ファイルをアップロード", promptPlaceholder: "このページについて Ollama に質問...", openQuickChat: "Ollama クイックチャットを開く", collapse: "折りたたむ", useSelection: "選択内容を使用", clearChat: "チャットをクリア", openSettings: "設定を開く", noSelectedText: "このページで選択されたテキストがありません。", insertedSelection: "現在の選択内容を入力欄に入れました。", removedAttachment: "添付を削除しました。", starterReady: "テンプレートを入力しました: {starter}", chatCleared: "チャットをクリアしました。", messageNotFound: "メッセージが見つかりません。", copiedResponse: "回答をコピーしました。", copyFailed: "コピーに失敗しました。クリップボード権限がブロックされている可能性があります。", modelSelected: "使用中のモデル: {model}", modelSelectFailed: "モデルの選択に失敗しました。", pageContextEnabled: "ページコンテキストを有効にしました。", pageContextDisabled: "ページコンテキストを無効にしました。", filesUnsupported: "画像とテキストファイル（.txt、.md、.json、.csv）のみ対応しています。", imagesOnly: "画像ファイルのみ対応しています。", attachedImagesVisionWarning: "{count} 枚の画像を添付しました。現在のモデルは視覚に対応していない可能性があります。", attachedImages: "{count} 枚の画像を添付しました。", attachedFiles: "{items} を添付しました。", pastedImage: "クリップボードから画像を貼り付けました。", typePromptOrAttach: "質問を入力するか、画像 / テキストファイルを添付してください。", pickModelFirst: "先に Ollama モデルを選択してください。", sendingVisionWarning: "{model} で {count} 枚の画像を送信します。画像を拒否する場合は視覚対応モデルに切り替えてください。", preparingRequest: "{model} のリクエストを準備中...", waitingForModel: "{model}{details} を待機中...", waitingWith: "（{items} 付き）", doneWithModel: "{model} が完了しました。", analyzeTextFile: "添付されたテキストファイルを分析してください。", analyzeImage: "添付された画像を分析してください。", attachedFileLabel: "FILE", runningModel: "{model} を実行中...", usingModel: "使用中のモデル: {model}", pickModelToStart: "開始するにはモデルを選択してください。", starter_pageSummary: "ページ内容を要約", starter_translatePage: "ページを{language}に翻訳", starter_codeExplain: "code 内容をわかりやすく解説", starter_imageAnalysis: "画像を分析", starter_imageAnalysisMarkdown: "画像分析を md/mermaid で出力", translationPrompt: "このページを{language}に翻訳してください。"};
CONTENT_I18N.ko = { ...CONTENT_I18N.en, quickAccess: "빠른 실행", liveChat: "Ollama 라이브 채팅", clear: "지우기", context: "문맥", ready: "준비됨.", empty: "이 페이지나 선택한 텍스트, 또는 다른 내용을 물어보세요.", copy: "복사", dropzone: "이미지 또는 텍스트 파일을 여기에 놓아 첨부", uploadFile: "파일 업로드", promptPlaceholder: "이 페이지에 대해 Ollama에게 물어보세요...", openQuickChat: "Ollama 빠른 채팅 열기", collapse: "접기", useSelection: "선택 내용 사용", clearChat: "대화 지우기", openSettings: "설정 열기", noSelectedText: "이 페이지에 선택된 텍스트가 없습니다.", insertedSelection: "현재 선택 내용을 입력창에 넣었습니다.", removedAttachment: "첨부를 제거했습니다.", starterReady: "스타터 입력됨: {starter}", chatCleared: "대화를 지웠습니다.", messageNotFound: "메시지를 찾을 수 없습니다.", copiedResponse: "응답을 복사했습니다.", copyFailed: "복사에 실패했습니다. 클립보드 권한이 차단되었을 수 있습니다.", modelSelected: "사용 중인 모델: {model}", modelSelectFailed: "모델 선택에 실패했습니다.", pageContextEnabled: "페이지 문맥을 켰습니다.", pageContextDisabled: "페이지 문맥을 껐습니다.", filesUnsupported: "이미지와 텍스트 파일(.txt, .md, .json, .csv)만 지원합니다.", imagesOnly: "이미지 파일만 지원합니다.", attachedImagesVisionWarning: "이미지 {count}개를 첨부했습니다. 현재 모델이 비전을 지원하지 않을 수 있습니다.", attachedImages: "이미지 {count}개를 첨부했습니다.", attachedFiles: "{items} 첨부됨.", pastedImage: "클립보드에서 이미지를 붙여넣었습니다.", typePromptOrAttach: "먼저 질문을 입력하거나 이미지 / 텍스트 파일을 첨부하세요.", pickModelFirst: "먼저 Ollama 모델을 선택하세요.", sendingVisionWarning: "{model}으로 이미지 {count}개를 보냅니다. 이미지가 거부되면 비전 모델로 바꾸세요.", preparingRequest: "{model} 요청 준비 중...", waitingForModel: "{model}{details} 대기 중...", waitingWith: " ({items} 포함)", doneWithModel: "{model} 완료.", analyzeTextFile: "첨부된 텍스트 파일을 분석해 주세요.", analyzeImage: "첨부된 이미지를 분석해 주세요.", runningModel: "{model} 실행 중...", usingModel: "사용 중인 모델: {model}", pickModelToStart: "시작하려면 모델을 선택하세요.", starter_pageSummary: "웹페이지 요약", starter_translatePage: "페이지를 {language}(으)로 번역", starter_codeExplain: "code 내용을 쉽게 설명", starter_imageAnalysis: "이미지 분석", starter_imageAnalysisMarkdown: "이미지 분석 후 md/mermaid 출력", translationPrompt: "이 페이지를 {language}(으)로 번역해 주세요." };
CONTENT_I18N["zh-CN"] = { ...CONTENT_I18N["zh-TW"], quickAccess: "快速工具", liveChat: "Ollama 实时聊天", context: "上下文", empty: "询问这个页面、选中文本，或任何你想问的内容。", dropzone: "拖放图片或文本文件到这里附加", promptPlaceholder: "输入你想问 Ollama 的内容...", noSelectedText: "这个页面没有选中文本。", insertedSelection: "已把当前选中内容放进输入框。", chatCleared: "对话已清除。", copiedResponse: "已复制助手回复。", modelSelectFailed: "选择模型失败。", pageContextEnabled: "已启用页面上下文。", pageContextDisabled: "已停用页面上下文。", filesUnsupported: "目前只支持图片与文本文件（.txt、.md、.json、.csv）。", imagesOnly: "目前只支持图片文件。", attachedImagesVisionWarning: "已附加 {count} 张图片。当前模型可能不支持视觉，建议切换模型。", attachedImages: "已附加 {count} 张图片。", typePromptOrAttach: "请先输入问题，或附加图片 / 文本文件。", pickModelFirst: "请先选择 Ollama 模型。", analyzeTextFile: "请分析附加的文本文件。", analyzeImage: "请分析附加的图片。", starter_pageSummary: "网页内容精华", starter_translatePage: "网页翻译{language}", starter_codeExplain: "code 内容白话解析", starter_imageAnalysis: "图片分析", starter_imageAnalysisMarkdown: "图片分析后 md/mermaid 输出", translationPrompt: "请把这个网页翻译成{language}。" };
CONTENT_I18N.es = { ...CONTENT_I18N.en, quickAccess: "Acceso rápido", liveChat: "Chat en vivo de Ollama", clear: "Limpiar", context: "Contexto", ready: "Listo.", empty: "Pregunta sobre esta página, el texto seleccionado o cualquier otra cosa.", copy: "Copiar", dropzone: "Suelta una imagen o archivo de texto aquí para adjuntarlo", uploadFile: "Subir archivo", promptPlaceholder: "Pregunta a Ollama sobre esta página...", openQuickChat: "Abrir chat rápido de Ollama", collapse: "Colapsar", useSelection: "Usar selección", clearChat: "Borrar chat", openSettings: "Abrir configuración", starter_pageSummary: "Resumir esta página", starter_translatePage: "Traducir página a {language}", starter_codeExplain: "Explicar código claramente", starter_imageAnalysis: "Analizar imagen", starter_imageAnalysisMarkdown: "Analizar imagen a md/mermaid", translationPrompt: "Traduce esta página a {language}." };
CONTENT_I18N.fr = { ...CONTENT_I18N.en, quickAccess: "Accès rapide", liveChat: "Chat en direct Ollama", clear: "Effacer", context: "Contexte", ready: "Prêt.", empty: "Posez une question sur cette page, le texte sélectionné ou autre chose.", copy: "Copier", dropzone: "Déposez une image ou un fichier texte ici pour l’ajouter", uploadFile: "Téléverser un fichier", promptPlaceholder: "Demandez à Ollama à propos de cette page...", openQuickChat: "Ouvrir le chat rapide Ollama", collapse: "Réduire", useSelection: "Utiliser la sélection", clearChat: "Effacer le chat", openSettings: "Ouvrir les paramètres", starter_pageSummary: "Résumer cette page", starter_translatePage: "Traduire la page en {language}", starter_codeExplain: "Expliquer le code clairement", starter_imageAnalysis: "Analyser l’image", starter_imageAnalysisMarkdown: "Analyser l’image vers md/mermaid", translationPrompt: "Traduisez cette page en {language}." };
CONTENT_I18N.de = { ...CONTENT_I18N.en, quickAccess: "Schnellzugriff", liveChat: "Ollama Live-Chat", clear: "Leeren", context: "Kontext", ready: "Bereit.", empty: "Frage etwas zu dieser Seite, markiertem Text oder etwas anderem.", copy: "Kopieren", dropzone: "Bild oder Textdatei hier ablegen, um sie anzuhängen", uploadFile: "Datei hochladen", promptPlaceholder: "Frage Ollama zu dieser Seite...", openQuickChat: "Ollama-Schnellchat öffnen", collapse: "Einklappen", useSelection: "Auswahl verwenden", clearChat: "Chat leeren", openSettings: "Einstellungen öffnen", starter_pageSummary: "Diese Seite zusammenfassen", starter_translatePage: "Seite auf {language} übersetzen", starter_codeExplain: "Code verständlich erklären", starter_imageAnalysis: "Bild analysieren", starter_imageAnalysisMarkdown: "Bild zu md/mermaid analysieren", translationPrompt: "Übersetze diese Seite in {language}." };
CONTENT_I18N["pt-BR"] = { ...CONTENT_I18N.en, quickAccess: "Acesso rápido", liveChat: "Chat ao vivo Ollama", clear: "Limpar", context: "Contexto", ready: "Pronto.", empty: "Pergunte sobre esta página, o texto selecionado ou qualquer outra coisa.", copy: "Copiar", dropzone: "Solte uma imagem ou arquivo de texto aqui para anexar", uploadFile: "Enviar arquivo", promptPlaceholder: "Pergunte ao Ollama sobre esta página...", openQuickChat: "Abrir chat rápido do Ollama", collapse: "Recolher", useSelection: "Usar seleção", clearChat: "Limpar chat", openSettings: "Abrir configurações", starter_pageSummary: "Resumir esta página", starter_translatePage: "Traduzir página para {language}", starter_codeExplain: "Explicar código claramente", starter_imageAnalysis: "Analisar imagem", starter_imageAnalysisMarkdown: "Analisar imagem para md/mermaid", translationPrompt: "Traduza esta página para {language}." };
CONTENT_I18N.hi = { ...CONTENT_I18N.en, quickAccess: "त्वरित पहुँच", liveChat: "Ollama लाइव चैट", clear: "साफ़ करें", context: "संदर्भ", ready: "तैयार।", empty: "इस पेज, चुने गए टेक्स्ट या किसी और चीज़ के बारे में पूछें।", copy: "कॉपी", dropzone: "संलग्न करने के लिए यहाँ छवि या टेक्स्ट फ़ाइल छोड़ें", uploadFile: "फ़ाइल अपलोड करें", promptPlaceholder: "इस पेज के बारे में Ollama से पूछें...", openQuickChat: "Ollama क्विक चैट खोलें", collapse: "समेटें", useSelection: "चयनित पाठ उपयोग करें", clearChat: "चैट साफ़ करें", openSettings: "सेटिंग्स खोलें", starter_pageSummary: "इस पेज का सारांश", starter_translatePage: "पेज को {language} में अनुवाद करें", starter_codeExplain: "कोड को सरल ढंग से समझाएँ", starter_imageAnalysis: "छवि विश्लेषण", starter_imageAnalysisMarkdown: "छवि विश्लेषण से md/mermaid", translationPrompt: "इस पेज का {language} में अनुवाद करें।" };

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
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve);
  });
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

function getStarterText(starterKey) {
  if (starterKey === "translatePage") {
    const language = getTargetLanguageLabel();
    return tl("starter_translatePage", { language });
  }

  return tl(`starter_${starterKey}`);
}

function formatAttachmentSummary(parts) {
  return parts.join(getUiLanguage().startsWith("zh") ? "、" : " and ");
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

function getPageContext() {
  const selection = window.getSelection?.()?.toString().trim() || "";
  const mainNode =
    document.querySelector("main") ||
    document.querySelector("article") ||
    document.querySelector("[role='main']") ||
    document.body;

  const pageText = (mainNode?.innerText || document.body?.innerText || "")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, MAX_PAGE_TEXT);

  const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
    .map((node) => node.textContent?.trim() || "")
    .filter(Boolean)
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

function buildPrompt(userMessage) {
  const context = includePageContext ? getPageContext() : null;
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
    "You are an Ollama quick assistant inside the user's browser.",
    "Answer using the current page as context when it is relevant.",
    "If the page context is insufficient, say what is missing.",
    "When you mention a URL or file path, format it as a Markdown link.",
    "For external URLs, use [label](https://example.com). For repo or site-relative file paths, use [path](relative/or/absolute/path).",
    `Reply language: ${replyLanguage}. Always answer in this language unless the user explicitly asks for another language.`,
    contextBlock,
    history ? `CHAT HISTORY\n\n${history}` : "",
    `USER MESSAGE\n${userMessage}`,
  ]
    .filter(Boolean)
    .join("\n\n");
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

  const starters = ensureHost().querySelector(".ollama-quick-starters");
  if (starters) {
    starters.classList.toggle("is-hidden", chatMessages.length > 0);
  }

  if (!chatMessages.length) {
    list.innerHTML = `<div class="ollama-quick-empty">${escapeHtml(tl("empty"))}</div>`;
    return;
  }

  list.innerHTML = chatMessages
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
    <section class="ollama-quick-panel" data-role="panel">
      <header class="ollama-quick-header">
        <div class="ollama-quick-header-main">
          <div class="ollama-quick-eyebrow">${escapeHtml(tl("quickAccess"))}</div>
          <h2>${escapeHtml(tl("liveChat"))}</h2>
        </div>
        <div class="ollama-quick-header-actions">
          <button class="ollama-quick-icon-button" type="button" data-action="use-selection" title="${escapeHtml(tl("useSelection"))}" aria-label="${escapeHtml(tl("useSelection"))}">✦</button>
          <button class="ollama-quick-secondary" type="button" data-action="clear-chat" title="${escapeHtml(tl("clearChat"))}" aria-label="${escapeHtml(tl("clearChat"))}">${escapeHtml(tl("clear"))}</button>
          <button class="ollama-quick-icon-button" type="button" data-action="open-settings" title="${escapeHtml(tl("openSettings"))}" aria-label="${escapeHtml(tl("openSettings"))}">⚙</button>
          <button class="ollama-quick-icon-button" type="button" data-action="toggle-panel" aria-label="${escapeHtml(tl("collapse"))}">-</button>
        </div>
      </header>
      <div class="ollama-quick-controls">
        <select class="ollama-quick-select" data-role="model-select">${modelOptions}</select>
        <label class="ollama-quick-toggle">
          <input type="checkbox" data-role="include-context" ${includePageContext ? "checked" : ""} />
          <span>${escapeHtml(tl("context"))}</span>
        </label>
      </div>
      <div class="ollama-quick-starters">
        ${STARTER_KEYS.map((starterKey) => `<button class="ollama-quick-starter" type="button" data-action="use-starter" data-starter-key="${escapeHtml(starterKey)}">${escapeHtml(getStarterText(starterKey))}</button>`).join("")}
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
  panel.classList.toggle("is-open", next);
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
    const starter = starterKey === "translatePage"
      ? tl("translationPrompt", { language: getTargetLanguageLabel() })
      : getStarterText(starterKey);
    prompt.value = starter;
    prompt.focus();
    setStatus(tl("starterReady", { starter }));
    return;
  }

  if (action === "clear-chat") {
    chatMessages = [];
    attachedImages.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    attachedImages = [];
    attachedDocuments = [];
    renderMessages();
    renderAttachments();
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
  promptNode.value = "";
  const displayMessage = userMessage || (attachedDocuments.length ? tl("analyzeTextFile") : tl("analyzeImage"));
  chatMessages.push({ id: Date.now(), role: "user", content: displayMessage });
  chatMessages.push({ id: Date.now() + 1, role: "assistant", content: "" });
  renderMessages();
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
    await startStreamingChat(buildChatMessages(displayMessage), currentConfig.selectedModel);
    attachedImages.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    attachedImages = [];
    attachedDocuments = [];
    renderAttachments();
    isGenerating = false;
    setStatus(tl("doneWithModel", { model: currentConfig.selectedModel }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    chatMessages[chatMessages.length - 1].content = `Error: ${message}`;
    renderMessages();
    isGenerating = false;
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
}

function buildChatMessages(userMessage) {
  const markdownAttachmentBlock = attachedDocuments.length
    ? [
        tl("attachedTextFilesHeading"),
        ...attachedDocuments.map((item) => `FILE: ${item.name}\n${item.text}`),
      ].join("\n\n")
    : "";
  const contextPrompt = [buildPrompt(userMessage), markdownAttachmentBlock].filter(Boolean).join("\n\n");
  return [
    {
      role: "user",
      content: contextPrompt,
      images: attachedImages.map((item) => item.base64),
    },
  ];
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
    const port = chrome.runtime.connect({ name: "ollama-stream" });
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
        reject(new Error(chrome.runtime.lastError.message));
      }
    });

    port.postMessage({
      type: "ollama:stream-chat",
      messages,
      model,
    });
  });
}

async function bootstrap() {
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
  if (areaName !== "sync") {
    return;
  }

  if (changes.ollamaUrl || changes.selectedModel) {
    bootstrap().catch(() => {});
  }
});

window.setTimeout(() => {
  bootstrap().catch(() => {});
}, 250);

window.addEventListener("keydown", (event) => {
  handleKeydown(event).catch?.(() => {});
}, true);
