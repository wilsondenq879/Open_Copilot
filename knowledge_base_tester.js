const STORAGE_KEYS = {
  theme: "kb_qa_tester_theme_v1",
  config: "kb_qa_tester_config_v1",
  knowledge: "kb_qa_tester_knowledge_v1",
  cases: "kb_qa_tester_cases_v1",
  prompts: "kb_qa_tester_prompts_v2",
  advisor: "kb_qa_tester_advisor_v2"
};

const DEFAULT_CHAT_SYSTEM_PROMPT = [
  "你是一個知識庫 QA 測試助理。",
  "你只能根據提供的 chunks 回答。",
  "如果 chunks 不足以支持答案，要明確說資料不足。",
  "不要自行補充 chunks 之外的外部知識。",
  "回答後請附上一行 `Grounded: yes/no`，用來提醒使用者這個回答是否被來源支持。"
].join("\n");

const DEFAULT_JUDGE_SYSTEM_PROMPT = [
  "你是知識庫 QA 的評分助理。",
  "請根據問題、預期答案、實際回答與檢索內容判斷回答是否 grounded、是否答到重點。",
  "若回答超出檢索內容，應降低 grounded 評價。",
  "請用嚴格但公平的標準評分。"
].join("\n");

const OPEN_COPILOT_DEFAULT_CONFIG = {
  ollamaUrl: "http://127.0.0.1:11434",
  ollamaEmbeddingUrl: "http://127.0.0.1:11434",
  ollamaEmbeddingModel: "",
  lmStudioUrl: "http://127.0.0.1:1234",
  lmStudioEmbeddingUrl: "http://127.0.0.1:1234",
  lmStudioModel: "",
  lmStudioEmbeddingModel: "",
  lmStudioApiKey: "lm-studio",
  lmStudioEmbeddingApiKey: "lm-studio",
  geminiModel: "gemini-2.5-flash",
  geminiEmbeddingModel: "gemini-embedding-001",
  geminiEmbeddingApiKey: "",
  azureOpenAiEndpoint: "",
  azureOpenAiEmbeddingEndpoint: "",
  azureOpenAiDeployment: "",
  azureOpenAiEmbeddingDeployment: "",
  azureOpenAiApiVersion: "2024-10-21",
  azureOpenAiEmbeddingApiVersion: "2024-10-21",
  azureOpenAiEmbeddingApiKey: "",
  defaultProvider: "ollama",
  defaultEmbeddingProvider: "ollama",
  selectedModel: ""
};

const DEFAULT_CONFIG = {
  topK: 4,
  temperature: 0.2,
  chunkSize: 900,
  chunkOverlap: 180
};

const WORK_FOLDER_INDEX_PATH = "dataset";
const WORK_FOLDER_INDEX_FILE = "knowledge-base-qa-index.json";
const RUNTIME_TRANSFER_CHUNK_SIZE = 1024 * 1024 * 2;

const SAMPLE_KNOWLEDGE = `# 帳號與登入說明

如果使用者忘記密碼，系統提供兩種恢復方式：
1. 使用註冊 Email 接收一次性驗證碼。
2. 由管理員從後台手動發送密碼重設連結。

連續五次登入失敗後，帳號會被暫時鎖定十五分鐘。

# 退款政策

數位服務一經開通後原則上不提供全額退款，但若因系統故障造成服務完全無法使用，客戶可在七天內提出退款申請。

實體商品必須保持未拆封、未使用，並於收到商品後七天內申請退貨。

# 客服時段

客服時間為週一到週五 09:00 到 18:00，不含國定假日。
緊急故障可透過值班信箱提報，夜間由 on-call 人員處理。`;

const SAMPLE_CASES = [
  {
    question: "如果客戶忘記密碼，可以怎麼恢復登入？",
    expected_answer: "至少要提到 Email 驗證碼與管理員重設連結兩種方式。"
  },
  {
    question: "實體商品退貨期限是多久？",
    expected_answer: "應該回答收到商品後七天內，且商品未拆封未使用。"
  },
  {
    question: "客服晚上有沒有人處理？",
    expected_answer: "應該提到一般客服時段是平日 09:00 到 18:00，但緊急故障有 on-call 信箱和值班人員。"
  }
].map((item) => JSON.stringify(item)).join("\n");

const elements = {
  providerSummary: document.getElementById("providerSummary"),
  modelSummary: document.getElementById("modelSummary"),
  embeddingProviderSummary: document.getElementById("embeddingProviderSummary"),
  embeddingModelSummary: document.getElementById("embeddingModelSummary"),
  themeToggle: document.getElementById("themeToggle"),
  topK: document.getElementById("topK"),
  temperature: document.getElementById("temperature"),
  chunkSize: document.getElementById("chunkSize"),
  chunkOverlap: document.getElementById("chunkOverlap"),
  loadOpenCopilotButton: document.getElementById("loadOpenCopilotButton"),
  saveConfigButton: document.getElementById("saveConfigButton"),
  configStatus: document.getElementById("configStatus"),
  knowledgeInput: document.getElementById("knowledgeInput"),
  knowledgeFile: document.getElementById("knowledgeFile"),
  clearKnowledgeButton: document.getElementById("clearKnowledgeButton"),
  buildIndexButton: document.getElementById("buildIndexButton"),
  loadSavedIndexButton: document.getElementById("loadSavedIndexButton"),
  saveIndexToFolderButton: document.getElementById("saveIndexToFolderButton"),
  indexStatus: document.getElementById("indexStatus"),
  chunkCount: document.getElementById("chunkCount"),
  vectorCount: document.getElementById("vectorCount"),
  sourceLength: document.getElementById("sourceLength"),
  lastIndexedAt: document.getElementById("lastIndexedAt"),
  promptEditToggle: document.getElementById("promptEditToggle"),
  chatSystemPromptInput: document.getElementById("chatSystemPromptInput"),
  judgeSystemPromptInput: document.getElementById("judgeSystemPromptInput"),
  testPromptInput: document.getElementById("testPromptInput"),
  questionInput: document.getElementById("questionInput"),
  expectedAnswerInput: document.getElementById("expectedAnswerInput"),
  runQuestionButton: document.getElementById("runQuestionButton"),
  judgeOnlyButton: document.getElementById("judgeOnlyButton"),
  clearTestStateButton: document.getElementById("clearTestStateButton"),
  questionStatus: document.getElementById("questionStatus"),
  answerMeta: document.getElementById("answerMeta"),
  judgeMeta: document.getElementById("judgeMeta"),
  answerBadge: document.getElementById("answerBadge"),
  judgeBadge: document.getElementById("judgeBadge"),
  answerOutput: document.getElementById("answerOutput"),
  judgeOutput: document.getElementById("judgeOutput"),
  retrievalBadge: document.getElementById("retrievalBadge"),
  retrievalResults: document.getElementById("retrievalResults"),
  casesInput: document.getElementById("casesInput"),
  sampleCasesButton: document.getElementById("sampleCasesButton"),
  runBatchButton: document.getElementById("runBatchButton"),
  batchStatus: document.getElementById("batchStatus"),
  batchResults: document.getElementById("batchResults"),
  advisorShell: document.getElementById("advisorShell"),
  advisorProviderHint: document.getElementById("advisorProviderHint"),
  advisorToggleButton: document.getElementById("advisorToggleButton"),
  advisorClearButton: document.getElementById("advisorClearButton"),
  advisorChatLog: document.getElementById("advisorChatLog"),
  advisorUseQuestionButton: document.getElementById("advisorUseQuestionButton"),
  advisorUseAnswerButton: document.getElementById("advisorUseAnswerButton"),
  advisorUseJudgeButton: document.getElementById("advisorUseJudgeButton"),
  advisorInput: document.getElementById("advisorInput"),
  advisorSendButton: document.getElementById("advisorSendButton"),
  advisorStatus: document.getElementById("advisorStatus")
};

let chunkIndex = [];
let chunkIndexTimestamp = "";
let lastAnswerRun = null;
let openCopilotConfig = { ...OPEN_COPILOT_DEFAULT_CONFIG };
let importedKnowledgeFiles = [];
let themeMediaQuery = null;
let advisorState = {
  collapsed: false,
  messages: [],
  draft: ""
};

function isExtensionRuntimeAvailable() {
  return Boolean(globalThis.chrome?.runtime?.sendMessage);
}

function normalizeBaseUrl(url) {
  return String(url || "").trim().replace(/\/+$/, "");
}

function safeJsonParse(text, fallback = null) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function formatTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat("zh-Hant", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getProviderLabel(provider) {
  return provider === "azureOpenAi"
    ? "Azure OpenAI"
    : provider === "lmStudio"
      ? "LM Studio"
      : provider === "gemini"
        ? "Gemini"
        : "Ollama";
}

function getConfiguredModel(config = {}) {
  const provider = String(config.defaultProvider || "ollama").trim() || "ollama";
  if (provider === "lmStudio") return String(config.lmStudioModel || "").trim();
  if (provider === "gemini") return String(config.geminiModel || "").trim();
  if (provider === "azureOpenAi") return String(config.azureOpenAiDeployment || "").trim();
  return String(config.selectedModel || "").trim();
}

function getConfiguredEmbeddingModel(config = {}) {
  const provider = String(config.defaultEmbeddingProvider || "ollama").trim() || "ollama";
  if (provider === "lmStudio") return String(config.lmStudioEmbeddingModel || "").trim();
  if (provider === "gemini") return String(config.geminiEmbeddingModel || "").trim();
  if (provider === "azureOpenAi") return String(config.azureOpenAiEmbeddingDeployment || "").trim();
  return String(config.ollamaEmbeddingModel || "").trim();
}

function updateProviderSummary() {
  elements.providerSummary.textContent = getProviderLabel(openCopilotConfig.defaultProvider);
  elements.modelSummary.textContent = getConfiguredModel(openCopilotConfig) || "尚未設定";
  elements.embeddingProviderSummary.textContent = getProviderLabel(openCopilotConfig.defaultEmbeddingProvider);
  elements.embeddingModelSummary.textContent = getConfiguredEmbeddingModel(openCopilotConfig) || "尚未設定";
  const providerLabel = getProviderLabel(openCopilotConfig.defaultProvider);
  const modelLabel = getConfiguredModel(openCopilotConfig) || "尚未設定模型";
  elements.advisorProviderHint.textContent = `${providerLabel} / ${modelLabel}`;
}

function getConfig() {
  return {
    topK: Math.max(1, Number.parseInt(elements.topK.value, 10) || DEFAULT_CONFIG.topK),
    temperature: Math.max(0, Math.min(1, Number.parseFloat(elements.temperature.value) || DEFAULT_CONFIG.temperature)),
    chunkSize: Math.max(200, Number.parseInt(elements.chunkSize.value, 10) || DEFAULT_CONFIG.chunkSize),
    chunkOverlap: Math.max(0, Number.parseInt(elements.chunkOverlap.value, 10) || DEFAULT_CONFIG.chunkOverlap)
  };
}

function applyConfig(config = {}) {
  const next = { ...DEFAULT_CONFIG, ...config };
  elements.topK.value = String(next.topK || DEFAULT_CONFIG.topK);
  elements.temperature.value = String(next.temperature ?? DEFAULT_CONFIG.temperature);
  elements.chunkSize.value = String(next.chunkSize || DEFAULT_CONFIG.chunkSize);
  elements.chunkOverlap.value = String(next.chunkOverlap || DEFAULT_CONFIG.chunkOverlap);
}

function saveLocalState() {
  localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(getConfig()));
  localStorage.setItem(STORAGE_KEYS.knowledge, JSON.stringify(importedKnowledgeFiles));
  localStorage.setItem(STORAGE_KEYS.cases, elements.casesInput.value);
  localStorage.setItem(STORAGE_KEYS.prompts, JSON.stringify({
    promptEditMode: elements.promptEditToggle.value,
    chatSystemPrompt: elements.chatSystemPromptInput.value,
    judgeSystemPrompt: elements.judgeSystemPromptInput.value
  }));
  localStorage.setItem(STORAGE_KEYS.advisor, JSON.stringify({
    collapsed: advisorState.collapsed
  }));
}

function loadLocalState() {
  const config = safeJsonParse(localStorage.getItem(STORAGE_KEYS.config) || "", DEFAULT_CONFIG);
  applyConfig(config);
  importedKnowledgeFiles = safeJsonParse(localStorage.getItem(STORAGE_KEYS.knowledge) || "", []);
  renderKnowledgePreview();
  elements.casesInput.value = localStorage.getItem(STORAGE_KEYS.cases) || "";
  const prompts = safeJsonParse(localStorage.getItem(STORAGE_KEYS.prompts) || "", {});
  elements.promptEditToggle.value = prompts?.promptEditMode === "editable" ? "editable" : "locked";
  elements.chatSystemPromptInput.value = String(prompts?.chatSystemPrompt || "").trim() || DEFAULT_CHAT_SYSTEM_PROMPT;
  elements.judgeSystemPromptInput.value = String(prompts?.judgeSystemPrompt || "").trim() || DEFAULT_JUDGE_SYSTEM_PROMPT;
  const savedAdvisor = safeJsonParse(localStorage.getItem(STORAGE_KEYS.advisor) || "", null);
  advisorState = {
    collapsed: Boolean(savedAdvisor?.collapsed),
    messages: [],
    draft: ""
  };
  updatePromptEditState();
}

function updatePromptEditState() {
  const isEditable = elements.promptEditToggle.value === "editable";
  elements.chatSystemPromptInput.readOnly = !isEditable;
  elements.judgeSystemPromptInput.readOnly = !isEditable;
  elements.chatSystemPromptInput.classList.toggle("is-readonly", !isEditable);
  elements.judgeSystemPromptInput.classList.toggle("is-readonly", !isEditable);
}

function applyTheme(theme) {
  const normalized = ["light", "dark", "system"].includes(theme) ? theme : "system";
  const resolved = normalized === "system"
    ? (themeMediaQuery?.matches ? "dark" : "light")
    : normalized;
  document.body.dataset.theme = resolved;
  elements.themeToggle.value = normalized;
}

function loadThemePreference() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || "system";
  applyTheme(savedTheme);
}

function renderKnowledgePreview() {
  if (!importedKnowledgeFiles.length) {
    elements.knowledgeInput.textContent = "尚未匯入知識檔案。";
    return;
  }

  elements.knowledgeInput.textContent = importedKnowledgeFiles
    .map((doc) => `${doc.fileName} (${doc.text.length} chars)`)
    .join("\n");
}

function setStatus(node, message, tone = "") {
  node.textContent = message;
  node.className = `status${tone ? ` ${tone}` : ""}`;
}

function updateIndexStats() {
  elements.chunkCount.textContent = String(chunkIndex.length);
  elements.vectorCount.textContent = String(chunkIndex.filter((item) => Array.isArray(item.embedding)).length);
  const totalLength = importedKnowledgeFiles.reduce((sum, item) => sum + item.text.length, 0);
  elements.sourceLength.textContent = importedKnowledgeFiles.length
    ? `${totalLength} / ${importedKnowledgeFiles.length} files`
    : "0";
  elements.lastIndexedAt.textContent = chunkIndex.length
    ? (chunkIndexTimestamp ? formatTimestamp(new Date(chunkIndexTimestamp)) : formatTimestamp())
    : "-";
}

function hashString(value) {
  const text = String(value || "");
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

function buildIndexCacheKey(documents = importedKnowledgeFiles, config = getConfig(), providerConfig = openCopilotConfig) {
  const provider = String(providerConfig.defaultEmbeddingProvider || "ollama").trim() || "ollama";
  const embeddingModel = getConfiguredEmbeddingModel(providerConfig) || "";
  const sourceSignature = (Array.isArray(documents) ? documents : [])
    .map((doc) => `${doc.fileName}:${doc.text.length}:${hashString(doc.text)}`)
    .join("|");
  return [
    provider,
    embeddingModel,
    config.chunkSize,
    config.chunkOverlap,
    hashString(sourceSignature)
  ].join("::");
}

function buildPersistedIndexPayload() {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    cacheKey: buildIndexCacheKey(),
    config: getConfig(),
    provider: String(openCopilotConfig.defaultEmbeddingProvider || "ollama").trim() || "ollama",
    embeddingModel: getConfiguredEmbeddingModel(openCopilotConfig) || "",
    importedKnowledgeFiles,
    chunkIndex
  };
}

function createRequestHeaders(extraHeaders = {}) {
  return {
    "Cache-Control": "no-store, no-cache, max-age=0",
    Pragma: "no-cache",
    "X-KB-QA-Test-Run-Id": `kbqa-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    ...extraHeaders
  };
}

function formatOllamaEmbeddingForbiddenError(status, responseText = "") {
  const compact = String(responseText || "").replace(/\s+/g, " ").trim();
  const suffix = compact ? ` Server said: ${compact}` : "";
  return `Ollama embedding request failed: ${status}${suffix}\nOllama 有回應，但遠端主機、反向代理或權限設定拒絕了 POST /api/embed。這通常不是 chunk 內容本身的問題。請檢查 Ollama embedding URL、OLLAMA_ORIGINS，以及前面的 proxy / firewall 是否允許 POST /api/embed。`;
}

function buildIsolatedRunPreamble() {
  return [
    "這是一個全新的獨立測試回合。",
    "不要假設你看過任何先前測試、先前回答或其他回合內容。",
    "你只能根據這次請求內提供的內容作答。"
  ].join("\n");
}

async function sendRuntimeMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve);
  });
}

async function saveIndexToWorkFolder() {
  if (!chunkIndex.length) {
    throw new Error("目前還沒有索引可儲存。請先建立 Embedding 索引。");
  }
  if (!isExtensionRuntimeAvailable()) {
    throw new Error("這個頁面目前不在 extension 環境中，無法寫入 Work Folder。");
  }

  const text = JSON.stringify(buildPersistedIndexPayload());
  const begin = await sendRuntimeMessage({
    type: "work-folder:begin-write-json-session",
    path: WORK_FOLDER_INDEX_PATH,
    fileName: WORK_FOLDER_INDEX_FILE
  });
  if (!begin?.ok || !begin?.session?.sessionId) {
    throw new Error(begin?.error || "儲存索引到 Work Folder 失敗。");
  }

  const sessionId = begin.session.sessionId;
  for (let offset = 0; offset < text.length; offset += RUNTIME_TRANSFER_CHUNK_SIZE) {
    const chunk = text.slice(offset, offset + RUNTIME_TRANSFER_CHUNK_SIZE);
    const append = await sendRuntimeMessage({
      type: "work-folder:append-write-json-session",
      sessionId,
      chunk
    });
    if (!append?.ok) {
      throw new Error(append?.error || "儲存索引到 Work Folder 失敗。");
    }
  }

  const finish = await sendRuntimeMessage({
    type: "work-folder:finish-write-json-session",
    sessionId
  });
  if (!finish?.ok) {
    throw new Error(finish?.error || "儲存索引到 Work Folder 失敗。");
  }
  return finish.session;
}

async function loadSavedIndexFromWorkFolder({ silent = false } = {}) {
  if (!isExtensionRuntimeAvailable()) {
    if (!silent) {
      throw new Error("這個頁面目前不在 extension 環境中，無法讀取 Work Folder。");
    }
    return false;
  }

  const begin = await sendRuntimeMessage({
    type: "work-folder:begin-read-json-session",
    path: WORK_FOLDER_INDEX_PATH,
    fileName: WORK_FOLDER_INDEX_FILE
  });

  if (!begin?.ok || !begin?.session?.sessionId) {
    if (silent) return false;
    throw new Error(begin?.error || "讀取已存索引失敗。");
  }

  const sessionId = begin.session.sessionId;
  const size = Math.max(0, Number(begin.session.size) || 0);
  let text = "";
  for (let offset = 0; offset < size; offset += RUNTIME_TRANSFER_CHUNK_SIZE) {
    const chunkResult = await sendRuntimeMessage({
      type: "work-folder:read-json-session-chunk",
      sessionId,
      offset,
      length: RUNTIME_TRANSFER_CHUNK_SIZE
    });
    if (!chunkResult?.ok) {
      if (silent) return false;
      throw new Error(chunkResult?.error || "讀取已存索引失敗。");
    }
    text += String(chunkResult?.session?.chunk || "");
  }
  await sendRuntimeMessage({
    type: "work-folder:finish-read-json-session",
    sessionId
  });

  const payload = safeJsonParse(text, null);
  if (!payload || !Array.isArray(payload.chunkIndex)) {
    if (silent) return false;
    throw new Error("Work Folder 裡的索引檔格式不正確。");
  }

  const expectedCacheKey = buildIndexCacheKey(importedKnowledgeFiles, getConfig(), openCopilotConfig);
  const payloadCacheKey = String(payload.cacheKey || "").trim();
  const payloadKnowledge = Array.isArray(payload.importedKnowledgeFiles) ? payload.importedKnowledgeFiles : [];

  if (!importedKnowledgeFiles.length && payloadKnowledge.length) {
    importedKnowledgeFiles = payloadKnowledge;
    renderKnowledgePreview();
  }

  const activeDocs = importedKnowledgeFiles.length ? importedKnowledgeFiles : payloadKnowledge;
  const activeCacheKey = buildIndexCacheKey(activeDocs, getConfig(), openCopilotConfig);
  if (payloadCacheKey && payloadCacheKey !== activeCacheKey) {
    if (silent) return false;
    throw new Error("已存索引和目前知識內容、chunk 設定或 embedding 模型不一致，為避免答錯，這次沒有自動載入。");
  }

  chunkIndex = payload.chunkIndex;
  chunkIndexTimestamp = String(payload.savedAt || "").trim();
  updateIndexStats();
  renderRetrievedChunks([]);
  renderAnswer("");
  renderJudge(null);
  saveLocalState();
  if (!silent) {
    setStatus(elements.indexStatus, `已從 Work Folder 載入索引，共 ${chunkIndex.length} 個 chunks。`, "good");
  }
  return true;
}

function setBusy(buttons, isBusy) {
  buttons.forEach((button) => {
    if (button) button.disabled = isBusy;
  });
}

function renderAdvisorMessages() {
  if (!advisorState.messages.length) {
    elements.advisorChatLog.innerHTML = '<div class="advisor-empty">這裡適合快速問 AI：「這題怎麼改 prompt 比較穩？」「依目前回答來看，chunk overlap 要不要調整？」</div>';
    return;
  }

  elements.advisorChatLog.innerHTML = advisorState.messages.map((message) => `
    <article class="advisor-message" data-role="${escapeHtml(message.role)}">
      <div class="advisor-message-header">
        <strong>${message.role === "user" ? "你" : "AI 顧問"}</strong>
        <span>${escapeHtml(message.timestamp || "")}</span>
      </div>
      <div class="advisor-message-body">${escapeHtml(message.content)}</div>
    </article>
  `).join("");
  elements.advisorChatLog.scrollTop = elements.advisorChatLog.scrollHeight;
}

function renderAdvisorShell() {
  elements.advisorShell.classList.toggle("is-collapsed", advisorState.collapsed);
  elements.advisorToggleButton.title = advisorState.collapsed ? "展開視窗" : "收合視窗";
  elements.advisorToggleButton.setAttribute("aria-label", advisorState.collapsed ? "展開視窗" : "收合視窗");
  elements.advisorToggleButton.innerHTML = advisorState.collapsed
    ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 14l6-6 6 6"></path></svg>`
    : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 10l6 6 6-6"></path></svg>`;
}

function pushAdvisorMessage(role, content) {
  const trimmed = String(content || "").trim();
  if (!trimmed) return;
  advisorState.messages.push({
    role,
    content: trimmed,
    timestamp: formatTimestamp()
  });
  advisorState.messages = advisorState.messages.slice(-24);
  renderAdvisorMessages();
  saveLocalState();
}

function appendAdvisorInput(text) {
  const next = String(text || "").trim();
  if (!next) return;
  const current = elements.advisorInput.value.trim();
  elements.advisorInput.value = current ? `${current}\n\n${next}` : next;
  elements.advisorInput.focus();
}

function buildAdvisorContext() {
  const parts = [
    "你是知識庫 QA 測試頁中的快速 AI 顧問。",
    "你的任務是幫使用者調整測試方式、prompt、chunk 策略、top-k、評分標準與問題寫法。",
    "優先根據頁面當前狀態給具體可執行建議，回答請精簡、實用、偏操作建議。",
    "如果資訊不足，可以直接說你還缺什麼。"
  ];

  const config = getConfig();
  parts.push("");
  parts.push(`目前回答 provider: ${getProviderLabel(openCopilotConfig.defaultProvider)}`);
  parts.push(`目前回答模型: ${getConfiguredModel(openCopilotConfig) || "尚未設定"}`);
  parts.push(`目前 embedding provider: ${getProviderLabel(openCopilotConfig.defaultEmbeddingProvider)}`);
  parts.push(`目前 embedding model: ${getConfiguredEmbeddingModel(openCopilotConfig) || "尚未設定"}`);
  parts.push(`目前 topK=${config.topK}, temperature=${config.temperature}, chunkSize=${config.chunkSize}, chunkOverlap=${config.chunkOverlap}`);
  parts.push(`已匯入知識檔數量: ${importedKnowledgeFiles.length}`);
  parts.push(`目前 chunk 數量: ${chunkIndex.length}`);

  const question = elements.questionInput.value.trim();
  const testPrompt = elements.testPromptInput.value.trim();
  const expectedAnswer = elements.expectedAnswerInput.value.trim();
  if (testPrompt) parts.push(`本次單題測試 Prompt: ${testPrompt}`);
  if (question) parts.push(`目前測試問題: ${question}`);
  if (expectedAnswer) parts.push(`目前預期答案或檢核標準: ${expectedAnswer}`);
  if (lastAnswerRun?.answer) parts.push(`最近一次模型回答: ${lastAnswerRun.answer}`);
  if (lastAnswerRun?.judge) {
    parts.push(`最近一次 AI Judge: verdict=${lastAnswerRun.judge.verdict}, grounded=${lastAnswerRun.judge.grounded}, score=${lastAnswerRun.judge.score}/5, explanation=${lastAnswerRun.judge.explanation}`);
  }
  if (Array.isArray(lastAnswerRun?.retrieval) && lastAnswerRun.retrieval.length) {
    const retrievalSummary = lastAnswerRun.retrieval
      .map((chunk, index) => `Chunk ${index + 1} [${chunk.score.toFixed(4)}] ${chunk.sourceName || ""}: ${String(chunk.content || "").slice(0, 280)}`)
      .join("\n");
    parts.push(`最近一次檢索摘要:\n${retrievalSummary}`);
  }

  return parts.join("\n");
}

async function sendAdvisorMessage() {
  const userInput = elements.advisorInput.value.trim();
  if (!userInput) {
    setStatus(elements.advisorStatus, "請先輸入想諮詢 AI 的內容。", "warn");
    return;
  }

  setBusy([elements.advisorSendButton], true);
  try {
    pushAdvisorMessage("user", userInput);
    elements.advisorInput.value = "";
    setStatus(elements.advisorStatus, "AI 顧問正在整理建議...", "warn");

    const history = advisorState.messages
      .slice(-8)
      .map((message) => `${message.role === "user" ? "使用者" : "AI 顧問"}：${message.content}`)
      .join("\n\n");

    const prompt = [
      buildAdvisorContext(),
      "",
      "以下是這個快速諮詢視窗的最近對話：",
      history || "目前沒有歷史對話。",
      "",
      "請直接回答使用者最新問題，並盡量給出可以立刻修改的建議。"
    ].join("\n");

    const answer = await runDefaultProviderPrompt(prompt, getConfig().temperature);
    pushAdvisorMessage("assistant", answer || "這次沒有收到可用回覆。");
    setStatus(elements.advisorStatus, "已更新建議。這裡用的是和頁面回答區同一個 provider。", "good");
  } catch (error) {
    setStatus(elements.advisorStatus, explainAzureError(error), "bad");
  } finally {
    setBusy([elements.advisorSendButton], false);
  }
}

async function loadOpenCopilotConfig() {
  if (!globalThis.chrome?.storage?.sync) {
    setStatus(elements.configStatus, "這個頁面目前不在 extension 環境中，無法直接讀取 Open Copilot 設定。", "warn");
    updateProviderSummary();
    return;
  }

  const [syncConfig, localSecrets] = await Promise.all([
    chrome.storage.sync.get(OPEN_COPILOT_DEFAULT_CONFIG),
    chrome.storage.local.get("providerSecretConfig")
  ]);

  openCopilotConfig = {
    ...OPEN_COPILOT_DEFAULT_CONFIG,
    ...syncConfig,
    ...(localSecrets.providerSecretConfig || {})
  };

  applyConfig(getConfig());
  updateProviderSummary();
  saveLocalState();
  setStatus(elements.configStatus, `已載入 Open Copilot 設定。回答會跟著 ${getProviderLabel(openCopilotConfig.defaultProvider)}，embedding 會跟著 ${getProviderLabel(openCopilotConfig.defaultEmbeddingProvider)}。`, "good");
  await loadSavedIndexFromWorkFolder({ silent: true }).catch(() => false);
}

function extractStructuredTextFromObject(value) {
  if (!value || typeof value !== "object") return "";
  const priorityKeys = [
    "content",
    "text",
    "body",
    "description",
    "summary",
    "answer",
    "answers",
    "message",
    "question",
    "canonical_question",
    "title"
  ];
  const parts = [];
  for (const key of priorityKeys) {
    const item = value[key];
    if (typeof item === "string") parts.push(item.trim());
    if (Array.isArray(item)) {
      item.forEach((entry) => {
        if (typeof entry === "string") parts.push(entry.trim());
      });
    }
  }
  if (parts.length) return parts.filter(Boolean).join("\n\n");
  return JSON.stringify(value, null, 2);
}

function normalizeKnowledgeText(rawText, fileName = "") {
  const text = String(rawText || "").trim();
  if (!text) return "";

  const lowerName = fileName.toLowerCase();
  if (lowerName.endsWith(".jsonl")) {
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => extractStructuredTextFromObject(safeJsonParse(line, { raw: line })))
      .filter(Boolean)
      .join("\n\n---\n\n");
  }

  if (lowerName.endsWith(".json")) {
    const parsed = safeJsonParse(text, null);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => extractStructuredTextFromObject(item)).join("\n\n---\n\n");
    }
    if (parsed && typeof parsed === "object") {
      return extractStructuredTextFromObject(parsed);
    }
  }

  return text;
}

function buildKnowledgeDocument(text, fileName = "") {
  const normalized = normalizeKnowledgeText(text, fileName);
  return {
    fileName: fileName || "pasted-content.txt",
    text: normalized.trim()
  };
}

function splitOversizedParagraph(paragraph, chunkSize, overlap = 0) {
  const text = String(paragraph || "").trim();
  if (!text) return [];
  if (text.length <= chunkSize) return [text];

  const segments = [];
  const sentenceParts = text
    .split(/(?<=[。！？!?\.])\s+|\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (sentenceParts.length <= 1) {
    const step = Math.max(1, chunkSize - Math.max(0, Math.min(overlap, chunkSize - 1)));
    for (let index = 0; index < text.length; index += step) {
      segments.push(text.slice(index, index + chunkSize).trim());
    }
    return segments.filter(Boolean);
  }

  let buffer = "";
  sentenceParts.forEach((part) => {
    if (part.length > chunkSize) {
      if (buffer.trim()) {
        segments.push(buffer.trim());
        buffer = "";
      }
      splitOversizedParagraph(part, chunkSize, overlap).forEach((segment) => segments.push(segment));
      return;
    }

    const next = buffer ? `${buffer} ${part}` : part;
    if (next.length <= chunkSize) {
      buffer = next;
      return;
    }

    if (buffer.trim()) {
      segments.push(buffer.trim());
    }
    buffer = part;
  });

  if (buffer.trim()) {
    segments.push(buffer.trim());
  }

  return segments.filter(Boolean);
}

function splitIntoChunks(text, chunkSize, overlap) {
  const cleaned = String(text || "").replace(/\r/g, "").trim();
  if (!cleaned) return [];

  const paragraphs = cleaned
    .split(/\n{2,}/)
    .flatMap((part) => splitOversizedParagraph(part.trim(), chunkSize, overlap))
    .filter(Boolean);

  const chunks = [];
  let buffer = "";
  let index = 0;

  paragraphs.forEach((paragraph) => {
    const next = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    if (next.length <= chunkSize || !buffer) {
      buffer = next;
      return;
    }

    chunks.push({
      id: `chunk-${index + 1}`,
      title: `Chunk ${index + 1}`,
      content: buffer
    });
    index += 1;

    const tail = overlap > 0 ? buffer.slice(-overlap) : "";
    buffer = tail ? `${tail}\n\n${paragraph}` : paragraph;
  });

  if (buffer.trim()) {
    chunks.push({
      id: `chunk-${index + 1}`,
      title: `Chunk ${index + 1}`,
      content: buffer.trim()
    });
  }

  return chunks;
}

function splitDocumentsIntoChunks(documents, chunkSize, overlap) {
  const chunks = [];
  let chunkIndexNumber = 0;
  documents.forEach((document, docIndex) => {
    const docChunks = splitIntoChunks(document.text, chunkSize, overlap);
    docChunks.forEach((chunk, index) => {
      chunkIndexNumber += 1;
      chunks.push({
        id: `chunk-${chunkIndexNumber}`,
        title: `${document.fileName} / Chunk ${index + 1}`,
        sourceName: document.fileName,
        sourceOrder: docIndex,
        content: chunk.content
      });
    });
  });
  return chunks;
}

function extractAssistantText(data) {
  if (!data) return "";
  if (typeof data.output_text === "string") return data.output_text;
  if (Array.isArray(data?.choices) && data.choices[0]?.message?.content) {
    return data.choices[0].message.content;
  }
  if (typeof data.message?.content === "string") return data.message.content;
  if (Array.isArray(data.message?.content)) {
    return data.message.content.map((item) => item.text || "").join("");
  }
  return "";
}

async function azureRequest(path, payload, config) {
  const endpoint = normalizeBaseUrl(config.azureOpenAiEndpoint).replace(/\/openai$/i, "");
  if (!endpoint) throw new Error("Azure endpoint 尚未設定。");
  if (!config.azureOpenAiApiKey) throw new Error("Azure API key 尚未設定。");

  const response = await fetch(`${endpoint}${path}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      ...createRequestHeaders({ "Content-Type": "application/json" }),
      "api-key": config.azureOpenAiApiKey
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Azure request failed: ${response.status}${text ? `\n${text}` : ""}`);
  }

  return response.json();
}

function extractGeminiText(data) {
  return (Array.isArray(data?.candidates) ? data.candidates : [])
    .flatMap((candidate) => Array.isArray(candidate?.content?.parts) ? candidate.content.parts : [])
    .map((part) => String(part?.text || ""))
    .filter(Boolean)
    .join("");
}

async function callOllama(prompt, config) {
  const endpoint = normalizeBaseUrl(config.ollamaUrl || "http://127.0.0.1:11434");
  const model = String(config.selectedModel || "").trim();
  if (!model) {
    throw new Error("Ollama model is not configured.");
  }
  const response = await fetch(`${endpoint}/api/chat`, {
    method: "POST",
    cache: "no-store",
    headers: createRequestHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      model,
      stream: false,
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status}`);
  }
  return extractAssistantText(await response.json()).trim();
}

async function callLmStudio(prompt, config) {
  const endpoint = normalizeBaseUrl(config.lmStudioUrl);
  const model = String(config.lmStudioModel || "").trim();
  if (!endpoint) {
    throw new Error("LM Studio URL is not configured.");
  }
  if (!model) {
    throw new Error("LM Studio model is not configured.");
  }
  const apiKey = String(config.lmStudioApiKey || "").trim();
  const response = await fetch(`${endpoint}/v1/chat/completions`, {
    method: "POST",
    cache: "no-store",
    headers: {
      ...createRequestHeaders({ "Content-Type": "application/json" }),
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: getConfig().temperature,
      stream: false
    })
  });
  if (!response.ok) {
    throw new Error(`LM Studio request failed: ${response.status}`);
  }
  return extractAssistantText(await response.json()).trim();
}

async function callGemini(prompt, config) {
  const model = String(config.geminiModel || "").trim();
  const apiKey = String(config.geminiApiKey || "").trim();
  if (!model) {
    throw new Error("Gemini model is not configured.");
  }
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    cache: "no-store",
    headers: {
      ...createRequestHeaders({ "Content-Type": "application/json" }),
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    })
  });
  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }
  return extractGeminiText(await response.json()).trim();
}

async function callAzureChat(prompt, config, temperature = 0.2) {
  const endpoint = normalizeBaseUrl(config.azureOpenAiEndpoint).replace(/\/openai$/i, "");
  const deployment = String(config.azureOpenAiDeployment || "").trim();
  const apiVersion = String(config.azureOpenAiApiVersion || "2024-10-21").trim();
  const apiKey = String(config.azureOpenAiApiKey || "").trim();
  if (!endpoint) {
    throw new Error("Azure endpoint 尚未設定。");
  }
  if (!deployment) {
    throw new Error("Azure deployment 尚未設定。");
  }
  if (!apiKey) {
    throw new Error("Azure API key 尚未設定。");
  }
  const response = await fetch(`${endpoint}/openai/deployments/${encodeURIComponent(deployment)}/chat/completions?api-version=${encodeURIComponent(apiVersion)}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      ...createRequestHeaders({ "Content-Type": "application/json" }),
      "api-key": apiKey
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      temperature
    })
  });
  if (!response.ok) {
    throw new Error(`Azure request failed: ${response.status}`);
  }
  return extractAssistantText(await response.json()).trim();
}

async function runDefaultProviderPrompt(prompt, temperature = 0.2) {
  const provider = String(openCopilotConfig.defaultProvider || "ollama").trim() || "ollama";
  if (provider === "azureOpenAi") {
    return callAzureChat(prompt, openCopilotConfig, temperature);
  }
  if (provider === "lmStudio") {
    return callLmStudio(prompt, openCopilotConfig);
  }
  if (provider === "gemini") {
    return callGemini(prompt, openCopilotConfig);
  }
  return callOllama(prompt, openCopilotConfig);
}

async function createOllamaEmbeddings(inputs, config) {
  const endpoint = normalizeBaseUrl(config.ollamaEmbeddingUrl || config.ollamaUrl || "http://127.0.0.1:11434");
  const model = String(config.ollamaEmbeddingModel || "").trim();
  if (!model) throw new Error("Ollama embedding model 尚未設定。");
  const response = await fetch(`${endpoint}/api/embed`, {
    method: "POST",
    cache: "no-store",
    headers: createRequestHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      model,
      input: inputs
    })
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    if (response.status === 403) {
      throw new Error(formatOllamaEmbeddingForbiddenError(response.status, text));
    }
    throw new Error(`Ollama embedding request failed: ${response.status}${text ? `\n${text}` : ""}`);
  }
  const data = await response.json();
  return Array.isArray(data?.embeddings) ? data.embeddings : [];
}

async function createLmStudioEmbeddings(inputs, config) {
  const endpoint = normalizeBaseUrl(config.lmStudioEmbeddingUrl || config.lmStudioUrl);
  const model = String(config.lmStudioEmbeddingModel || "").trim();
  if (!endpoint) throw new Error("LM Studio URL 尚未設定。");
  if (!model) throw new Error("LM Studio embedding model 尚未設定。");
  const apiKey = String(config.lmStudioEmbeddingApiKey || config.lmStudioApiKey || "").trim();
  const response = await fetch(`${endpoint}/v1/embeddings`, {
    method: "POST",
    cache: "no-store",
    headers: {
      ...createRequestHeaders({ "Content-Type": "application/json" }),
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify({
      model,
      input: inputs
    })
  });
  if (!response.ok) {
    throw new Error(`LM Studio embedding request failed: ${response.status}`);
  }
  const data = await response.json();
  return Array.isArray(data?.data) ? data.data.map((item) => item.embedding) : [];
}

async function createGeminiEmbeddings(inputs, config) {
  const model = String(config.geminiEmbeddingModel || "").trim();
  const apiKey = String(config.geminiEmbeddingApiKey || config.geminiApiKey || "").trim();
  if (!model) throw new Error("Gemini embedding model 尚未設定。");
  if (!apiKey) throw new Error("Gemini API key 尚未設定。");
  const normalizedModel = model.startsWith("models/") ? model : `models/${model}`;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${normalizedModel}:batchEmbedContents`, {
    method: "POST",
    cache: "no-store",
    headers: {
      ...createRequestHeaders({ "Content-Type": "application/json" }),
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      requests: inputs.map((text) => ({
        model: normalizedModel,
        content: {
          parts: [{ text }]
        },
        taskType: "RETRIEVAL_DOCUMENT"
      }))
    })
  });
  if (!response.ok) {
    throw new Error(`Gemini embedding request failed: ${response.status}`);
  }
  const data = await response.json();
  return Array.isArray(data?.embeddings) ? data.embeddings.map((item) => item?.values || []) : [];
}

async function createAzureEmbeddings(inputs, config) {
  const deployment = String(config.azureOpenAiEmbeddingDeployment || "").trim();
  const apiVersion = String(config.azureOpenAiEmbeddingApiVersion || config.azureOpenAiApiVersion || "2024-10-21").trim();
  if (!deployment) throw new Error("Azure embedding deployment 尚未設定。");
  const data = await azureRequest(
    `/openai/deployments/${encodeURIComponent(deployment)}/embeddings?api-version=${encodeURIComponent(apiVersion)}`,
    { input: inputs },
    {
      ...config,
      azureOpenAiEndpoint: config.azureOpenAiEmbeddingEndpoint || config.azureOpenAiEndpoint,
      azureOpenAiApiKey: config.azureOpenAiEmbeddingApiKey || config.azureOpenAiApiKey
    }
  );
  return Array.isArray(data?.data) ? data.data.map((item) => item.embedding) : [];
}

async function createEmbeddings(inputs, config, onProgress) {
  const batchSize = String(config.defaultEmbeddingProvider || "ollama").trim() === "ollama" ? 8 : 16;
  const results = [];
  const provider = String(config.defaultEmbeddingProvider || "ollama").trim() || "ollama";
  for (let i = 0; i < inputs.length; i += batchSize) {
    const batch = inputs.slice(i, i + batchSize);
    let embeddings;
    try {
      embeddings = provider === "azureOpenAi"
        ? await createAzureEmbeddings(batch, config)
        : provider === "lmStudio"
          ? await createLmStudioEmbeddings(batch, config)
          : provider === "gemini"
            ? await createGeminiEmbeddings(batch, config)
            : await createOllamaEmbeddings(batch, config);
    } catch (error) {
      if (batch.length === 1) {
        const failedText = String(batch[0] || "");
        throw new Error([
          String(error?.message || error || "Embedding request failed."),
          `出錯 chunk index: ${i + 1}`,
          `chunk 長度: ${failedText.length} chars`,
          `chunk 前 200 字: ${failedText.slice(0, 200)}`
        ].join("\n"));
      }

      // If a batch fails halfway through, retry one by one so we can isolate the offending chunk.
      for (let j = 0; j < batch.length; j += 1) {
        const singleInput = [batch[j]];
        try {
          const singleEmbedding = provider === "azureOpenAi"
            ? await createAzureEmbeddings(singleInput, config)
            : provider === "lmStudio"
              ? await createLmStudioEmbeddings(singleInput, config)
              : provider === "gemini"
                ? await createGeminiEmbeddings(singleInput, config)
                : await createOllamaEmbeddings(singleInput, config);
          results.push(singleEmbedding[0] || []);
          if (typeof onProgress === "function") {
            onProgress(Math.min(inputs.length, i + j + 1), inputs.length);
          }
        } catch (singleError) {
          const failedText = String(batch[j] || "");
          throw new Error([
            String(singleError?.message || singleError || error || "Embedding request failed."),
            `出錯 chunk index: ${i + j + 1}`,
            `chunk 長度: ${failedText.length} chars`,
            `chunk 前 200 字: ${failedText.slice(0, 200)}`
          ].join("\n"));
        }
      }
      continue;
    }
    results.push(...embeddings);
    if (typeof onProgress === "function") {
      onProgress(Math.min(inputs.length, i + batch.length), inputs.length);
    }
  }
  return results;
}

async function generateAnswer(question, contextChunks, config, testPrompt = "") {
  if (!getConfiguredModel(openCopilotConfig)) {
    throw new Error("Open Copilot 預設 provider 尚未設定可用模型。");
  }

  const contextText = contextChunks
    .map((chunk, index) => `[[Chunk ${index + 1} | score=${chunk.score.toFixed(4)}]]\n${chunk.content}`)
    .join("\n\n");

  const systemPrompt = elements.chatSystemPromptInput.value.trim() || DEFAULT_CHAT_SYSTEM_PROMPT;
  const perTestPrompt = String(testPrompt || "").trim();

  const userPrompt = [
    buildIsolatedRunPreamble(),
    "",
    perTestPrompt ? `本次測試補充要求：\n${perTestPrompt}` : "",
    perTestPrompt ? "" : "",
    `問題：${question}`,
    "",
    "可用知識片段：",
    contextText || "沒有找到任何可用片段。"
  ].filter(Boolean).join("\n");

  return runDefaultProviderPrompt(`${systemPrompt}\n\n${userPrompt}`, config.temperature);
}

function normalizeJudgeResult(result, fallbackExplanation = "") {
  if (!result || typeof result !== "object") {
    return {
      score: 0,
      grounded: "unknown",
      verdict: "評分失敗",
      explanation: fallbackExplanation || "無法解析 AI Judge 結果。"
    };
  }

  return {
    score: Math.max(0, Math.min(5, Number.parseInt(result.score, 10) || 0)),
    grounded: String(result.grounded || "unknown"),
    verdict: String(result.verdict || "未提供結論"),
    explanation: String(result.explanation || fallbackExplanation || "")
  };
}

async function judgeAnswer(question, expectedAnswer, answer, contextChunks, config) {
  if (!expectedAnswer.trim()) {
    return {
      score: 0,
      grounded: "not_checked",
      verdict: "未提供預期答案",
      explanation: "你沒有填預期答案，所以這次只做檢索與回答，不做 AI Judge。"
    };
  }

  const retrievalContext = contextChunks
    .map((chunk, index) => `Chunk ${index + 1}:\n${chunk.content}`)
    .join("\n\n");

  const prompt = [
    buildIsolatedRunPreamble(),
    "",
    elements.judgeSystemPromptInput.value.trim() || DEFAULT_JUDGE_SYSTEM_PROMPT,
    "",
    "請擔任知識庫 QA judge，根據問題、預期答案、實際回答、檢索到的內容進行評分。",
    "只輸出 JSON，不要加其他文字。",
    '格式：{"score":1-5,"grounded":"yes|partial|no","verdict":"...","explanation":"..."}',
    "",
    `問題：${question}`,
    `預期答案：${expectedAnswer}`,
    `實際回答：${answer}`,
    "",
    "檢索內容：",
    retrievalContext || "沒有檢索內容"
  ].join("\n");

  const raw = await runDefaultProviderPrompt(prompt, 0);
  const fenced = raw.match(/```json\s*([\s\S]*?)```/i) || raw.match(/```\s*([\s\S]*?)```/i);
  const payload = fenced ? fenced[1] : raw;
  return normalizeJudgeResult(safeJsonParse(payload, null), raw);
}

function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length || !a.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    const left = Number(a[i]) || 0;
    const right = Number(b[i]) || 0;
    dot += left * right;
    normA += left * left;
    normB += right * right;
  }
  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function buildIndex() {
  const config = getConfig();
  if (!importedKnowledgeFiles.length) {
    setStatus(elements.indexStatus, "請先匯入至少一個知識檔案。", "warn");
    return;
  }

  setBusy([elements.buildIndexButton, elements.loadSavedIndexButton, elements.saveIndexToFolderButton], true);
  try {
    const chunks = splitDocumentsIntoChunks(importedKnowledgeFiles, config.chunkSize, config.chunkOverlap);
    if (!chunks.length) {
      throw new Error("切 chunk 後沒有可用內容。");
    }

    setStatus(elements.indexStatus, `已切出 ${chunks.length} 個 chunks，正在建立 embeddings...`, "warn");
    const embeddings = await createEmbeddings(
      chunks.map((chunk) => chunk.content),
      openCopilotConfig,
      (done, total) => {
        setStatus(elements.indexStatus, `正在建立 embeddings：${done}/${total}`, "warn");
      }
    );

    chunkIndex = chunks.map((chunk, index) => ({
      ...chunk,
      embedding: embeddings[index] || []
    }));
    chunkIndexTimestamp = new Date().toISOString();

    updateIndexStats();
    let saveMessage = "";
    try {
      await saveIndexToWorkFolder();
      saveMessage = " 已同步存到 Work Folder。";
    } catch (saveError) {
      saveMessage = ` 但存到 Work Folder 失敗：${String(saveError?.message || saveError || "")}`;
    }
    setStatus(elements.indexStatus, `索引完成，共 ${chunkIndex.length} 個 chunks。現在可以開始問答測試。${saveMessage}`, saveMessage.startsWith(" 但") ? "warn" : "good");
  } catch (error) {
    chunkIndex = [];
    chunkIndexTimestamp = "";
    updateIndexStats();
    setStatus(elements.indexStatus, explainAzureError(error), "bad");
  } finally {
    setBusy([elements.buildIndexButton, elements.loadSavedIndexButton, elements.saveIndexToFolderButton], false);
    saveLocalState();
  }
}

async function retrieveRelevantChunks(question, config) {
  if (!chunkIndex.length) {
    throw new Error("還沒有索引。請先建立 Embedding 索引。");
  }

  const [queryEmbedding] = await createEmbeddings([question], openCopilotConfig);
  const ranked = chunkIndex
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, config.topK);

  return ranked;
}

function renderRetrievedChunks(chunks) {
  if (!chunks.length) {
    elements.retrievalResults.innerHTML = '<div class="chunk-card">尚未有檢索結果。</div>';
    elements.retrievalBadge.textContent = "Top K 未執行";
    return;
  }

  elements.retrievalBadge.textContent = `Top ${chunks.length}`;
  elements.retrievalResults.innerHTML = chunks.map((chunk) => `
    <article class="chunk-card">
      <div class="chunk-header">
        <strong>${escapeHtml(chunk.title)}</strong>
        <span class="badge mono">${chunk.score.toFixed(4)}</span>
      </div>
      <div class="case-body"><strong>Source:</strong> ${escapeHtml(chunk.sourceName || "-")}</div>
      <div class="chunk-body">${escapeHtml(chunk.content)}</div>
    </article>
  `).join("");
}

function renderAnswer(answer) {
  elements.answerOutput.textContent = answer || "尚未執行。";
  elements.answerBadge.textContent = answer ? "Answered" : "No Answer";
  elements.answerMeta.textContent = answer
    ? `回答長度 ${answer.length} 字元`
    : "尚未執行";
}

function renderJudge(judge) {
  elements.judgeOutput.textContent = judge
    ? `Verdict: ${judge.verdict}\nGrounded: ${judge.grounded}\nScore: ${judge.score}/5\n\n${judge.explanation}`
    : "尚未評分。";
  elements.judgeBadge.textContent = judge ? `${judge.score}/5` : "No Score";
  elements.judgeMeta.textContent = judge
    ? `${judge.verdict} | grounded: ${judge.grounded}`
    : "尚未評分";
}

function explainAzureError(error) {
  const message = String(error?.message || error || "");
  const provider = String(openCopilotConfig.defaultProvider || "ollama").trim() || "ollama";
  const providerLabel = getProviderLabel(provider);
  const embeddingProvider = String(openCopilotConfig.defaultEmbeddingProvider || "ollama").trim() || "ollama";
  const embeddingProviderLabel = getProviderLabel(embeddingProvider);
  if (message.includes("Failed to fetch") || message.includes("Load failed") || message.includes("NetworkError")) {
    const hints = [`目前無法連到目前的回答 provider：${providerLabel}，或 embedding provider：${embeddingProviderLabel}。`];
    if (window.location.protocol === "file:") {
      hints.push("你現在如果是直接用 file:// 開啟頁面，瀏覽器可能會擋請求。建議改成 extension page 或本機 HTTP server。");
    }
    hints.push("請確認 Open Copilot 的預設 provider 與預設 embedding provider 都可正常連線。");
    return hints.join("\n");
  }
  if (message.startsWith("Ollama request failed:")) {
    return `${message}\n請確認 Ollama 正在執行，而且 Open Copilot 的 selected model 有設定。`;
  }
  if (message.startsWith("Ollama embedding request failed:")) {
    if (message.includes("POST /api/embed")) {
      return message;
    }
    return `${message}\n請確認 Ollama 正在執行，而且 Settings 裡已設定可用的 Ollama embedding model。`;
  }
  if (message.startsWith("LM Studio request failed:")) {
    return `${message}\n請確認 LM Studio local server、model 與 API key 設定是否正確。`;
  }
  if (message.startsWith("LM Studio embedding request failed:")) {
    return `${message}\n請確認 LM Studio local server 已啟動，而且 embedding model 設定正確。`;
  }
  if (message.startsWith("Gemini request failed:")) {
    return `${message}\n請確認 Gemini model 與 API key 是否正確。`;
  }
  if (message.startsWith("Gemini embedding request failed:")) {
    return `${message}\n請確認 Gemini embedding model 與 API key 是否正確。`;
  }
  return message || "未知錯誤";
}

function clearLastAnswerRunState() {
  lastAnswerRun = null;
  renderRetrievedChunks([]);
  renderAnswer("");
  renderJudge(null);
}

function clearTestState({ clearInputs = true, clearAdvisor = false } = {}) {
  clearLastAnswerRunState();
  if (clearInputs) {
    elements.testPromptInput.value = "";
    elements.questionInput.value = "";
    elements.expectedAnswerInput.value = "";
  }
  if (clearAdvisor) {
    advisorState.messages = [];
    elements.advisorInput.value = "";
    renderAdvisorMessages();
  }
  saveLocalState();
}

async function runSingleQuestion({ judgeOnly = false } = {}) {
  const config = getConfig();
  const question = elements.questionInput.value.trim();
  const testPrompt = elements.testPromptInput.value.trim();
  const expectedAnswer = elements.expectedAnswerInput.value.trim();
  if (!question) {
    setStatus(elements.questionStatus, "請先輸入測試問題。", "warn");
    return;
  }

  setBusy([elements.runQuestionButton, elements.judgeOnlyButton], true);
  try {
    if (!judgeOnly) {
      clearLastAnswerRunState();
    }
    let retrieval = lastAnswerRun?.question === question ? lastAnswerRun.retrieval : null;
    let answer = judgeOnly ? lastAnswerRun?.answer || "" : "";

    if (!judgeOnly || !lastAnswerRun || lastAnswerRun.question !== question) {
      setStatus(elements.questionStatus, "正在建立 query embedding 並檢索最相關 chunks...", "warn");
      retrieval = await retrieveRelevantChunks(question, config);
      renderRetrievedChunks(retrieval);

      setStatus(elements.questionStatus, "正在根據檢索結果生成回答...", "warn");
      answer = await generateAnswer(question, retrieval, config, testPrompt);
      renderAnswer(answer);
      lastAnswerRun = { question, testPrompt, expectedAnswer, retrieval, answer };
    }

    setStatus(elements.questionStatus, "正在執行 AI Judge...", "warn");
    const judge = await judgeAnswer(question, expectedAnswer, answer, retrieval, config);
    renderJudge(judge);
    lastAnswerRun = { question, testPrompt, expectedAnswer, retrieval, answer, judge };
    setStatus(elements.questionStatus, "單題測試完成。你可以看回答、評分與命中 chunks 是否一致。", "good");
  } catch (error) {
    setStatus(elements.questionStatus, explainAzureError(error), "bad");
  } finally {
    setBusy([elements.runQuestionButton, elements.judgeOnlyButton], false);
    saveLocalState();
  }
}

function parseCases(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parsed = safeJsonParse(line, null);
      if (!parsed || typeof parsed !== "object" || !String(parsed.question || "").trim()) {
        throw new Error(`第 ${index + 1} 行不是合法的 JSONL test case。`);
      }
      const expected = Array.isArray(parsed.expected_keywords)
        ? parsed.expected_keywords.join("、")
        : String(parsed.expected_answer || "").trim();
      return {
        question: String(parsed.question || "").trim(),
        expectedAnswer: expected
      };
    });
}

function renderBatchResults(results) {
  elements.batchResults.innerHTML = results.map((item, index) => `
    <article class="case-card">
      <div class="case-header">
        <strong>Case ${index + 1}</strong>
        <span class="badge">${escapeHtml(item.scoreLabel)}</span>
      </div>
      <div class="case-body"><strong>Q:</strong> ${escapeHtml(item.question)}</div>
      <div class="case-body"><strong>A:</strong> ${escapeHtml(item.answer)}</div>
      <div class="case-body"><strong>Judge:</strong> ${escapeHtml(item.judgeText)}</div>
    </article>
  `).join("");
}

async function runBatch() {
  const config = getConfig();
  const testPrompt = elements.testPromptInput.value.trim();
  const cases = parseCases(elements.casesInput.value);
  if (!cases.length) {
    setStatus(elements.batchStatus, "請先提供至少一筆測試題目。", "warn");
    return;
  }

  setBusy([elements.runBatchButton], true);
  const results = [];

  try {
    clearLastAnswerRunState();
    for (let i = 0; i < cases.length; i += 1) {
      const item = cases[i];
      setStatus(elements.batchStatus, `正在跑批次測試 ${i + 1}/${cases.length}：${item.question}`, "warn");
      const retrieval = await retrieveRelevantChunks(item.question, config);
      const answer = await generateAnswer(item.question, retrieval, config, testPrompt);
      const judge = await judgeAnswer(item.question, item.expectedAnswer, answer, retrieval, config);
      results.push({
        question: item.question,
        answer,
        judgeText: `${judge.verdict} | grounded=${judge.grounded} | ${judge.score}/5`,
        scoreLabel: `${judge.score}/5`
      });
      renderBatchResults(results);
    }

    const average = results.length
      ? (results.reduce((sum, item) => sum + Number.parseFloat(item.scoreLabel) || 0, 0) / results.length).toFixed(2)
      : "0.00";
    setStatus(elements.batchStatus, `批次完成，共 ${results.length} 題，平均分數約 ${average}/5。`, "good");
  } catch (error) {
    setStatus(elements.batchStatus, explainAzureError(error), "bad");
  } finally {
    setBusy([elements.runBatchButton], false);
    saveLocalState();
  }
}

async function handleKnowledgeFile(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  const docs = [];
  for (const file of files) {
    const text = await file.text();
    const doc = buildKnowledgeDocument(text, file.name);
    if (doc.text) docs.push(doc);
  }

  importedKnowledgeFiles = docs;
  renderKnowledgePreview();
  saveLocalState();
  setStatus(elements.indexStatus, `已載入 ${docs.length} 個檔案。下一步請建立 Embedding 索引。`, "good");
  updateIndexStats();
}

elements.loadOpenCopilotButton.addEventListener("click", () => {
  loadOpenCopilotConfig().catch((error) => {
    setStatus(elements.configStatus, explainAzureError(error), "bad");
  });
});

elements.saveConfigButton.addEventListener("click", () => {
  saveLocalState();
  setStatus(elements.configStatus, "本頁設定已儲存。", "good");
});

elements.knowledgeFile.addEventListener("change", (event) => {
  handleKnowledgeFile(event).catch((error) => {
    setStatus(elements.indexStatus, `載入檔案失敗：${error.message}`, "bad");
  });
});

elements.clearKnowledgeButton.addEventListener("click", () => {
  importedKnowledgeFiles = [];
  renderKnowledgePreview();
  chunkIndex = [];
  chunkIndexTimestamp = "";
  updateIndexStats();
  renderRetrievedChunks([]);
  renderAnswer("");
  renderJudge(null);
  setStatus(elements.indexStatus, "知識內容已清空。", "warn");
  saveLocalState();
});

elements.buildIndexButton.addEventListener("click", () => {
  buildIndex();
});

elements.loadSavedIndexButton.addEventListener("click", () => {
  setBusy([elements.buildIndexButton, elements.loadSavedIndexButton, elements.saveIndexToFolderButton], true);
  loadSavedIndexFromWorkFolder()
    .catch((error) => {
      setStatus(elements.indexStatus, String(error?.message || error || "讀取已存索引失敗。"), "bad");
    })
    .finally(() => {
      setBusy([elements.buildIndexButton, elements.loadSavedIndexButton, elements.saveIndexToFolderButton], false);
    });
});

elements.saveIndexToFolderButton.addEventListener("click", () => {
  setBusy([elements.buildIndexButton, elements.loadSavedIndexButton, elements.saveIndexToFolderButton], true);
  saveIndexToWorkFolder()
    .then(() => {
      setStatus(elements.indexStatus, `已把目前索引存到 Work Folder：${WORK_FOLDER_INDEX_PATH}/${WORK_FOLDER_INDEX_FILE}`, "good");
    })
    .catch((error) => {
      setStatus(elements.indexStatus, String(error?.message || error || "儲存索引失敗。"), "bad");
    })
    .finally(() => {
      setBusy([elements.buildIndexButton, elements.loadSavedIndexButton, elements.saveIndexToFolderButton], false);
    });
});

elements.runQuestionButton.addEventListener("click", () => {
  runSingleQuestion();
});

elements.judgeOnlyButton.addEventListener("click", () => {
  runSingleQuestion({ judgeOnly: true });
});

elements.clearTestStateButton.addEventListener("click", () => {
  clearTestState({ clearInputs: true, clearAdvisor: false });
  setStatus(elements.questionStatus, "已清空本輪測試狀態。下一次送出會是新的乾淨測試。", "good");
});

elements.sampleCasesButton.addEventListener("click", () => {
  elements.casesInput.value = SAMPLE_CASES;
  saveLocalState();
  setStatus(elements.batchStatus, "已載入範例題目。", "good");
});

elements.runBatchButton.addEventListener("click", () => {
  runBatch().catch((error) => {
    setStatus(elements.batchStatus, explainAzureError(error), "bad");
  });
});

elements.advisorToggleButton.addEventListener("click", () => {
  advisorState.collapsed = !advisorState.collapsed;
  renderAdvisorShell();
  saveLocalState();
});

elements.advisorClearButton.addEventListener("click", () => {
  advisorState.messages = [];
  renderAdvisorMessages();
  setStatus(elements.advisorStatus, "已清空快速諮詢紀錄。", "good");
  saveLocalState();
});

elements.advisorUseQuestionButton.addEventListener("click", () => {
  appendAdvisorInput(elements.questionInput.value.trim() ? `目前測試問題：${elements.questionInput.value.trim()}` : "");
});

elements.advisorUseAnswerButton.addEventListener("click", () => {
  appendAdvisorInput(lastAnswerRun?.answer ? `目前回答：\n${lastAnswerRun.answer}` : "");
});

elements.advisorUseJudgeButton.addEventListener("click", () => {
  appendAdvisorInput(lastAnswerRun?.judge
    ? `目前評分：${lastAnswerRun.judge.verdict} / grounded=${lastAnswerRun.judge.grounded} / score=${lastAnswerRun.judge.score}/5\n${lastAnswerRun.judge.explanation}`
    : "");
});

elements.advisorSendButton.addEventListener("click", () => {
  sendAdvisorMessage();
});

elements.advisorInput.addEventListener("input", saveLocalState);
elements.advisorInput.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    sendAdvisorMessage();
  }
});

elements.themeToggle.addEventListener("change", () => {
  const nextTheme = elements.themeToggle.value || "system";
  localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
  applyTheme(nextTheme);
});

elements.promptEditToggle.addEventListener("change", () => {
  updatePromptEditState();
  saveLocalState();
});

[
  elements.topK,
  elements.temperature,
  elements.chunkSize,
  elements.chunkOverlap,
  elements.questionInput,
  elements.expectedAnswerInput,
  elements.casesInput,
  elements.testPromptInput,
  elements.chatSystemPromptInput,
  elements.judgeSystemPromptInput
].forEach((node) => {
  node.addEventListener("input", saveLocalState);
});

loadLocalState();
themeMediaQuery = globalThis.matchMedia?.("(prefers-color-scheme: dark)") || null;
if (themeMediaQuery?.addEventListener) {
  themeMediaQuery.addEventListener("change", () => {
    if ((localStorage.getItem(STORAGE_KEYS.theme) || "system") === "system") {
      applyTheme("system");
    }
  });
}
if (themeMediaQuery?.addListener) {
  themeMediaQuery.addListener(() => {
    if ((localStorage.getItem(STORAGE_KEYS.theme) || "system") === "system") {
      applyTheme("system");
    }
  });
}
loadThemePreference();
if (!elements.casesInput.value.trim()) {
  elements.casesInput.value = SAMPLE_CASES;
}
updateIndexStats();
updateProviderSummary();
renderRetrievedChunks([]);
renderAnswer("");
renderJudge(null);
elements.advisorInput.value = "";
renderAdvisorShell();
renderAdvisorMessages();
setStatus(elements.configStatus, "你可以按「讀取 Open Copilot 設定」，讓回答與 embedding 都同步目前的預設 provider。", "warn");
setStatus(elements.advisorStatus, "這個視窗會沿用目前回答 provider 與模型；重新開頁後不會保留舊諮詢內容。", "warn");

loadSavedIndexFromWorkFolder({ silent: true }).catch(() => false);

if (globalThis.chrome?.storage?.sync) {
  loadOpenCopilotConfig().catch(() => {});
}
