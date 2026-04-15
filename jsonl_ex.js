const STORAGE_KEYS = {
  drafts: "jsonl_qa_editor_drafts_v1",
  prefs: "jsonl_qa_editor_prefs_v1"
};

const OPEN_COPILOT_DEFAULT_CONFIG = {
  ollamaUrl: "http://127.0.0.1:11434",
  lmStudioUrl: "http://127.0.0.1:1234",
  lmStudioModel: "",
  lmStudioApiKey: "lm-studio",
  geminiModel: "gemini-2.5-flash",
  azureOpenAiEndpoint: "",
  azureOpenAiDeployment: "",
  azureOpenAiApiVersion: "2024-10-21",
  defaultProvider: "ollama",
  selectedModel: "",
  settingsTheme: "system"
};

const elements = {
  dropzone: document.getElementById("dropzone"),
  fileInput: document.getElementById("fileInput"),
  openPickerButton: document.getElementById("openPickerButton"),
  sampleButton: document.getElementById("sampleButton"),
  writeButton: document.getElementById("writeButton"),
  downloadButton: document.getElementById("downloadButton"),
  clearButton: document.getElementById("clearButton"),
  reloadProviderButton: document.getElementById("reloadProviderButton"),
  providerSummary: document.getElementById("providerSummary"),
  modelSummary: document.getElementById("modelSummary"),
  endpointSummary: document.getElementById("endpointSummary"),
  systemPromptInput: document.getElementById("systemPromptInput"),
  fileName: document.getElementById("fileName"),
  fileSize: document.getElementById("fileSize"),
  totalLines: document.getElementById("totalLines"),
  parseTime: document.getElementById("parseTime"),
  validCount: document.getElementById("validCount"),
  errorCount: document.getElementById("errorCount"),
  blankCount: document.getElementById("blankCount"),
  dirtyCount: document.getElementById("dirtyCount"),
  keyCount: document.getElementById("keyCount"),
  searchInput: document.getElementById("searchInput"),
  viewer: document.getElementById("viewer"),
  draftStatus: document.getElementById("draftStatus"),
  writeStatus: document.getElementById("writeStatus")
};

let currentRecords = [];
let currentErrors = [];
let currentMeta = null;
let currentFileHandle = null;
let currentSourceName = "";
let currentSourceSize = 0;
let currentDraftKey = "";
let lastSavedAt = "";
let activeAiRecordId = "";
let openCopilotConfig = { ...OPEN_COPILOT_DEFAULT_CONFIG };

const sampleJsonl = [
  JSON.stringify({
    canonical_question: "What is HACS?",
    question_aliases: [
      "What does HACS do for Home Assistant?",
      "Why would I use HACS when I already have Home Assistant?"
    ],
    answers: "HACS (Home Assistant Community Store) is a community repository for Home Assistant. It helps users discover and install custom integrations and frontend components that are not included in the built-in catalog.",
    source_title: "Installing HACS | Official Support",
    source_url: "https://www.example.com/hacs"
  }),
  JSON.stringify({
    canonical_question: "How do I update ASUS router firmware?",
    question_aliases: ["What are the steps to manually update router firmware?"],
    answers: [
      "Open the router admin page and go to the firmware section.",
      "Upload the firmware file or use the built-in online update flow.",
      "Do not power off the router while the update is running."
    ],
    source_title: "ASUS Router FAQ"
  }),
  "{ invalid json line"
].join("\n");

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeJsonParse(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function getPrefs() {
  return {
    systemPrompt: elements.systemPromptInput.value.trim()
  };
}

function savePrefs() {
  localStorage.setItem(STORAGE_KEYS.prefs, JSON.stringify(getPrefs()));
}

function loadPrefs() {
  const prefs = safeJsonParse(localStorage.getItem(STORAGE_KEYS.prefs) || "", null);
  if (!prefs) return;
  elements.systemPromptInput.value = prefs.systemPrompt || "";
}

function normalizeBaseUrl(url) {
  return String(url || "").trim().replace(/\/+$/, "");
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

function getConfiguredEndpoint(config = {}) {
  const provider = String(config.defaultProvider || "ollama").trim() || "ollama";
  if (provider === "lmStudio") return normalizeBaseUrl(config.lmStudioUrl);
  if (provider === "gemini") return "https://generativelanguage.googleapis.com";
  if (provider === "azureOpenAi") return normalizeBaseUrl(config.azureOpenAiEndpoint);
  return normalizeBaseUrl(config.ollamaUrl);
}

function updateProviderSummary() {
  elements.providerSummary.textContent = getProviderLabel(openCopilotConfig.defaultProvider);
  elements.modelSummary.textContent = getConfiguredModel(openCopilotConfig) || "尚未設定";
  elements.endpointSummary.textContent = getConfiguredEndpoint(openCopilotConfig) || "尚未設定";
}

async function loadOpenCopilotSettings() {
  if (!globalThis.chrome?.storage?.sync) {
    updateProviderSummary();
    return openCopilotConfig;
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

  updateProviderSummary();
  return openCopilotConfig;
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function arrayFromValue(value) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => arrayFromValue(item))
      .filter(Boolean);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    return trimmed
      .split(/\n{2,}/)
      .map((part) => part.trim())
      .filter(Boolean);
  }
  if (value && typeof value === "object") {
    if (typeof value.text === "string") return [value.text.trim()].filter(Boolean);
    if (typeof value.content === "string") return [value.content.trim()].filter(Boolean);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return [String(value)];
  }
  return [];
}

function getCanonicalQuestion(value) {
  if (!value || typeof value !== "object") return "";
  const keys = ["canonical_question", "question", "query", "prompt", "input"];
  for (const key of keys) {
    const found = normalizeText(value[key]);
    if (found) return found;
  }
  return "";
}

function getQuestionAliases(value) {
  if (!value || typeof value !== "object") return [];
  return arrayFromValue(value.question_aliases);
}

function getAnswers(value) {
  if (!value || typeof value !== "object") return [];
  const keys = ["answers", "answer", "output", "response", "result", "content", "text", "message", "final"];
  for (const key of keys) {
    const answers = arrayFromValue(value[key]);
    if (answers.length) return answers;
  }
  return [];
}

function draftToSearchText(draft, source) {
  return [
    draft.canonical_question,
    draft.question_aliases.join(" "),
    draft.answers.join(" "),
    JSON.stringify(source || {})
  ].join(" ").toLowerCase();
}

function getDraftKey(name, text) {
  return `${name}::${text.length}`;
}

function getDraftStorageMap() {
  return safeJsonParse(localStorage.getItem(STORAGE_KEYS.drafts) || "", {});
}

function saveDraftStorageMap(map) {
  localStorage.setItem(STORAGE_KEYS.drafts, JSON.stringify(map));
}

function setDraftStatus(text, tone = "saved") {
  elements.draftStatus.textContent = text;
  elements.draftStatus.className = `status-pill ${tone === "dirty" ? "status-dirty" : tone === "ai" ? "status-ai" : "status-saved"}`;
}

function setWriteStatus(text) {
  elements.writeStatus.textContent = text;
}

function applyStoredDrafts() {
  if (!currentDraftKey) return;
  const map = getDraftStorageMap();
  const draftEntries = map[currentDraftKey]?.records || {};
  currentRecords = currentRecords.map((record) => {
    const stored = draftEntries[record.id];
    if (!stored) return record;
    return {
      ...record,
      draft: {
        canonical_question: stored.canonical_question || "",
        question_aliases: Array.isArray(stored.question_aliases) ? stored.question_aliases : [],
        answers: Array.isArray(stored.answers) ? stored.answers : []
      },
      dirty: true
    };
  });
  lastSavedAt = map[currentDraftKey]?.savedAt || "";
}

function persistDrafts(statusTone = "saved", statusPrefix = "已暫存") {
  if (!currentDraftKey) return;
  const map = getDraftStorageMap();
  map[currentDraftKey] = {
    sourceName: currentSourceName,
    savedAt: new Date().toLocaleString(),
    records: Object.fromEntries(currentRecords.map((record) => [record.id, record.draft]))
  };
  saveDraftStorageMap(map);
  lastSavedAt = map[currentDraftKey].savedAt;
  setDraftStatus(`${statusPrefix} ${lastSavedAt}`, statusTone);
}

function clearStoredDrafts() {
  if (!currentDraftKey) return;
  const map = getDraftStorageMap();
  delete map[currentDraftKey];
  saveDraftStorageMap(map);
  lastSavedAt = "";
}

function countDirtyRecords() {
  return currentRecords.filter((record) => record.dirty).length;
}

function markRecordDirty(recordId, patch) {
  currentRecords = currentRecords.map((record) => {
    if (record.id !== recordId) return record;
    const nextDraft = { ...record.draft, ...patch };
    return {
      ...record,
      draft: nextDraft,
      dirty: true,
      searchText: draftToSearchText(nextDraft, record.value)
    };
  });
  elements.dirtyCount.textContent = String(countDirtyRecords());
  persistDrafts("dirty", "有未寫入的編輯，已自動暫存");
  renderResults();
}

function createRecord(parsed, index) {
  const answerArray = getAnswers(parsed);
  return {
    id: `line-${index + 1}`,
    lineNumber: index + 1,
    value: parsed,
    dirty: false,
    answerMode: Array.isArray(parsed.answers) ? "array" : answerArray.length > 1 ? "array" : "string",
    draft: {
      canonical_question: getCanonicalQuestion(parsed),
      question_aliases: getQuestionAliases(parsed),
      answers: answerArray
    },
    searchText: draftToSearchText({
      canonical_question: getCanonicalQuestion(parsed),
      question_aliases: getQuestionAliases(parsed),
      answers: answerArray
    }, parsed)
  };
}

function parseJsonl(text) {
  const start = performance.now();
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const records = [];
  const errors = [];
  const keys = new Set();
  let blanks = 0;

  lines.forEach((line, index) => {
    if (!line.trim()) {
      blanks += 1;
      return;
    }
    try {
      const parsed = JSON.parse(line);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        Object.keys(parsed).forEach((key) => keys.add(key));
      }
      records.push(createRecord(parsed, index));
    } catch (error) {
      errors.push({
        lineNumber: index + 1,
        line,
        message: error.message
      });
    }
  });

  return {
    records,
    errors,
    blanks,
    keyCount: keys.size,
    totalLines: lines.length,
    parseMs: Math.round(performance.now() - start)
  };
}

function updateSummary(meta) {
  elements.totalLines.textContent = String(meta.totalLines);
  elements.parseTime.textContent = `${meta.parseMs} ms`;
  elements.validCount.textContent = String(meta.records.length);
  elements.errorCount.textContent = String(meta.errors.length);
  elements.blankCount.textContent = String(meta.blanks);
  elements.keyCount.textContent = String(meta.keyCount);
  elements.dirtyCount.textContent = String(countDirtyRecords());
}

function previewText(record) {
  const { canonical_question, question_aliases, answers } = record.draft;
  if (canonical_question) return `Canonical Question: ${canonical_question}`;
  if (question_aliases.length) return `Question Aliases: ${question_aliases[0]}`;
  if (answers.length) return `Answers: ${answers[0]}`;
  return JSON.stringify(record.value);
}

function sourceCards(record) {
  const sourceFields = ["source_title", "source_url", "chunk_id"];
  const cards = sourceFields
    .filter((key) => record.value && record.value[key] != null)
    .map((key) => `
      <div class="source-card">
        <h3>${escapeHtml(key)}</h3>
        <div class="source-content">${escapeHtml(String(record.value[key]))}</div>
      </div>
    `)
    .join("");

  if (cards) {
    return `<div class="source-grid">${cards}</div>`;
  }

  const extras = Object.entries(record.value || {})
    .filter(([key]) => !["canonical_question", "question_aliases", "answers", "answer", "output", "response", "result", "source_title", "source_url", "chunk_id"].includes(key))
    .slice(0, 8)
    .map(([key, value]) => `<span class="chip"><strong>${escapeHtml(key)}</strong>${escapeHtml(typeof value === "object" ? JSON.stringify(value) : String(value))}</span>`)
    .join("");

  return extras ? `<div class="chip-row">${extras}</div>` : "";
}

function renderRecord(record) {
  const aliasText = record.draft.question_aliases.join("\n");
  const answerText = record.draft.answers.join("\n\n");
  const isBusy = activeAiRecordId === record.id;
  return `
    <details class="record" open>
      <summary>
        <div class="record-title">
          <strong>第 ${record.lineNumber} 行</strong>
          <div class="record-preview">${escapeHtml(previewText(record))}</div>
        </div>
        <span class="badge ${record.dirty ? "badge-dirty" : "badge-ok"}">${record.dirty ? "已編輯" : "JSON OK"}</span>
      </summary>
      <div class="record-body">
        <div class="editor-grid">
          <div class="editor-card">
            <h3>Canonical Question</h3>
            <input data-role="canonical_question" data-record-id="${record.id}" value="${escapeHtml(record.draft.canonical_question)}" placeholder="輸入 canonical_question">
          </div>
          <div class="editor-card">
            <h3>Question Aliases</h3>
            <textarea data-role="question_aliases" data-record-id="${record.id}" placeholder="一行一個 alias">${escapeHtml(aliasText)}</textarea>
            <div class="aliases-help">每一行會視為一個 alias，寫回 JSONL 時會存成陣列。</div>
          </div>
        </div>

        <div class="editor-card">
          <h3>Answers</h3>
          <textarea data-role="answers" data-record-id="${record.id}" placeholder="若要多個 answers，請用空白行分隔">${escapeHtml(answerText)}</textarea>
          <div class="inline-actions">
            <button class="primary" type="button" data-action="ai-polish" data-record-id="${record.id}" ${isBusy ? "disabled" : ""}>AI 協助整理這筆</button>
            <button class="secondary" type="button" data-action="reset-record" data-record-id="${record.id}">還原這筆</button>
          </div>
        </div>

        ${sourceCards(record)}

        <div class="raw-card">
          <h3>Original JSON</h3>
          <pre class="raw-preview">${escapeHtml(JSON.stringify(record.value, null, 2))}</pre>
        </div>
      </div>
    </details>
  `;
}

function renderErrors(errors) {
  return errors.map((item) => `
    <details class="error-card">
      <summary>
        <div class="record-title">
          <strong>第 ${item.lineNumber} 行解析失敗</strong>
          <div class="record-preview">${escapeHtml(item.message)}</div>
        </div>
        <span class="badge badge-err">JSON ERROR</span>
      </summary>
      <div class="record-body">
        <pre class="error-preview">${escapeHtml(item.line)}</pre>
      </div>
    </details>
  `).join("");
}

function renderResults() {
  const keyword = elements.searchInput.value.trim().toLowerCase();
  const filteredRecords = keyword
    ? currentRecords.filter((record) => record.searchText.includes(keyword) || `line ${record.lineNumber}`.includes(keyword))
    : currentRecords;

  const filteredErrors = keyword
    ? currentErrors.filter((item) =>
        item.message.toLowerCase().includes(keyword) ||
        item.line.toLowerCase().includes(keyword) ||
        `line ${item.lineNumber}`.includes(keyword)
      )
    : currentErrors;

  if (!filteredRecords.length && !filteredErrors.length) {
    elements.viewer.innerHTML = `<div class="empty">查不到符合 "${escapeHtml(keyword)}" 的內容。</div>`;
    return;
  }

  elements.viewer.innerHTML = filteredRecords.map(renderRecord).join("") + renderErrors(filteredErrors);
}

function clearAll() {
  currentRecords = [];
  currentErrors = [];
  currentMeta = null;
  currentFileHandle = null;
  currentSourceName = "";
  currentSourceSize = 0;
  currentDraftKey = "";
  activeAiRecordId = "";
  elements.fileInput.value = "";
  elements.searchInput.value = "";
  elements.fileName.textContent = "尚未載入";
  elements.fileSize.textContent = "-";
  elements.totalLines.textContent = "0";
  elements.parseTime.textContent = "-";
  elements.validCount.textContent = "0";
  elements.errorCount.textContent = "0";
  elements.blankCount.textContent = "0";
  elements.dirtyCount.textContent = "0";
  elements.keyCount.textContent = "0";
  setDraftStatus("暫存已同步", "saved");
  setWriteStatus("尚未寫入檔案");
  elements.viewer.innerHTML = '<div class="empty">載入 JSONL 後，這裡會顯示可編輯的 QA 卡片。</div>';
}

function loadText(text, sourceName = "未命名資料", sourceSize = text.length, fileHandle = null) {
  const result = parseJsonl(text);
  currentRecords = result.records;
  currentErrors = result.errors;
  currentMeta = result;
  currentFileHandle = fileHandle;
  currentSourceName = sourceName;
  currentSourceSize = sourceSize;
  currentDraftKey = getDraftKey(sourceName, text);
  applyStoredDrafts();
  elements.fileName.textContent = sourceName;
  elements.fileSize.textContent = formatBytes(sourceSize);
  updateSummary(result);
  setDraftStatus(lastSavedAt ? `已載入暫存 ${lastSavedAt}` : "暫存已同步", "saved");
  setWriteStatus(fileHandle ? "可直接寫回原檔" : "目前沒有原檔寫入權限，可改用下載副本");
  renderResults();
}

async function handleFile(file) {
  const text = await file.text();
  loadText(text, file.name, file.size, null);
}

async function openFileWithPicker() {
  if (!window.showOpenFilePicker) {
    elements.fileInput.click();
    return;
  }
  const [handle] = await window.showOpenFilePicker({
    multiple: false,
    types: [{ description: "JSONL files", accept: { "application/json": [".jsonl", ".txt", ".json"] } }]
  });
  const file = await handle.getFile();
  const text = await file.text();
  loadText(text, file.name, file.size, handle);
}

function linesFromTextarea(text, separatorPattern) {
  return text
    .split(separatorPattern)
    .map((item) => item.trim())
    .filter(Boolean);
}

function attachEditorEvents() {
  elements.viewer.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
    const recordId = target.dataset.recordId;
    const role = target.dataset.role;
    if (!recordId || !role) return;

    if (role === "canonical_question") {
      markRecordDirty(recordId, { canonical_question: target.value.trim() });
      return;
    }
    if (role === "question_aliases") {
      markRecordDirty(recordId, { question_aliases: linesFromTextarea(target.value, /\n+/) });
      return;
    }
    if (role === "answers") {
      markRecordDirty(recordId, { answers: linesFromTextarea(target.value, /\n{2,}/) });
    }
  });

  elements.viewer.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const action = target.dataset.action;
    const recordId = target.dataset.recordId;
    if (!action || !recordId) return;

    if (action === "reset-record") {
      const original = currentRecords.find((record) => record.id === recordId);
      if (!original) return;
      currentRecords = currentRecords.map((record) => record.id === recordId ? {
        ...record,
        dirty: false,
        draft: {
          canonical_question: getCanonicalQuestion(record.value),
          question_aliases: getQuestionAliases(record.value),
          answers: getAnswers(record.value)
        },
        searchText: draftToSearchText({
          canonical_question: getCanonicalQuestion(record.value),
          question_aliases: getQuestionAliases(record.value),
          answers: getAnswers(record.value)
        }, record.value)
      } : record);
      if (countDirtyRecords()) {
        persistDrafts("dirty", "有未寫入的編輯，已自動暫存");
      } else {
        clearStoredDrafts();
        setDraftStatus("這筆已還原，目前沒有未寫入編輯", "saved");
      }
      updateSummary(currentMeta);
      renderResults();
      return;
    }

    if (action === "ai-polish") {
      await runAiAssist(recordId);
    }
  });
}

function buildRecordForWrite(record) {
  const nextValue = structuredClone(record.value);
  nextValue.canonical_question = record.draft.canonical_question.trim();
  nextValue.question_aliases = record.draft.question_aliases.filter(Boolean);

  const answers = record.draft.answers.filter(Boolean);
  if (record.answerMode === "array" || answers.length > 1) {
    nextValue.answers = answers;
  } else {
    nextValue.answers = answers[0] || "";
  }

  return nextValue;
}

function buildJsonlOutput() {
  return currentRecords
    .map((record) => JSON.stringify(buildRecordForWrite(record)))
    .join("\n");
}

async function writeJsonlFile() {
  if (!currentRecords.length) {
    alert("目前沒有可寫入的資料。");
    return;
  }

  const output = buildJsonlOutput();

  if (currentFileHandle && currentFileHandle.createWritable) {
    const writable = await currentFileHandle.createWritable();
    await writable.write(output);
    await writable.close();
    currentRecords = currentRecords.map((record) => ({ ...record, value: buildRecordForWrite(record), dirty: false }));
    clearStoredDrafts();
    setDraftStatus("編輯已寫入，暫存已清除", "saved");
    updateSummary(currentMeta);
    renderResults();
    setWriteStatus(`已寫回 ${currentSourceName} (${new Date().toLocaleTimeString()})`);
    return;
  }

  if (window.showSaveFilePicker) {
    const handle = await window.showSaveFilePicker({
      suggestedName: currentSourceName || "edited.jsonl",
      types: [{ description: "JSONL files", accept: { "application/json": [".jsonl"] } }]
    });
    const writable = await handle.createWritable();
    await writable.write(output);
    await writable.close();
    currentFileHandle = handle;
    currentRecords = currentRecords.map((record) => ({ ...record, value: buildRecordForWrite(record), dirty: false }));
    clearStoredDrafts();
    setDraftStatus("編輯已另存，暫存已清除", "saved");
    updateSummary(currentMeta);
    renderResults();
    setWriteStatus(`已另存並取得寫入權限 (${new Date().toLocaleTimeString()})`);
    return;
  }

  downloadJsonl();
  setWriteStatus("瀏覽器不支援直接寫入，已改為下載副本");
}

function downloadJsonl() {
  if (!currentRecords.length) {
    alert("目前沒有可下載的資料。");
    return;
  }
  const blob = new Blob([buildJsonlOutput()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = currentSourceName || "edited.jsonl";
  link.click();
  URL.revokeObjectURL(url);
}

function buildAiPrompt(record) {
  return [
    "請協助整理以下 JSONL 記錄，只輸出 JSON，不要加說明文字。",
    "輸出格式必須是：",
    '{"canonical_question":"...","question_aliases":["..."],"answers":["..."]}',
    "",
    "規則：",
    "1. canonical_question 保持最核心的標準問句。",
    "2. question_aliases 請提供自然但不重複的問法。",
    "3. answers 請保留原始事實，不要捏造來源沒有的資訊。",
    "4. 所有欄位請用原本語言，不要任意翻譯。",
    elements.systemPromptInput.value.trim() ? `5. 額外指示：${elements.systemPromptInput.value.trim()}` : "",
    "",
    "目前記錄：",
    JSON.stringify(buildRecordForWrite(record), null, 2)
  ].filter(Boolean).join("\n");
}

function extractAssistantText(data) {
  if (!data) return "";
  if (typeof data.response === "string") return data.response;
  if (typeof data.content === "string") return data.content;
  if (Array.isArray(data.message?.content)) {
    return data.message.content.map((item) => item.text || "").join("");
  }
  if (typeof data.message?.content === "string") return data.message.content;
  if (typeof data.output_text === "string") return data.output_text;
  if (Array.isArray(data.choices) && data.choices[0]?.message?.content) {
    return data.choices[0].message.content;
  }
  return "";
}

async function callOllama(prompt, config) {
  const endpoint = normalizeBaseUrl(config.ollamaUrl || "http://127.0.0.1:11434");
  const model = String(config.selectedModel || "").trim();
  if (!model) {
    throw new Error("Ollama model is not configured.");
  }
  const response = await fetch(`${endpoint}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status}`);
  }
  const data = await response.json();
  return extractAssistantText(data);
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
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      stream: false
    })
  });
  if (!response.ok) {
    throw new Error(`LM Studio request failed: ${response.status}`);
  }
  const data = await response.json();
  return extractAssistantText(data);
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
    headers: {
      "Content-Type": "application/json",
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
  const data = await response.json();
  return (Array.isArray(data?.candidates) ? data.candidates : [])
    .flatMap((candidate) => Array.isArray(candidate?.content?.parts) ? candidate.content.parts : [])
    .map((part) => String(part?.text || ""))
    .filter(Boolean)
    .join("");
}

async function callAzure(prompt, config) {
  const endpoint = normalizeBaseUrl(config.azureOpenAiEndpoint).replace(/\/openai$/i, "");
  const deployment = String(config.azureOpenAiDeployment || "").trim();
  const apiVersion = String(config.azureOpenAiApiVersion || "2024-10-21").trim();
  const apiKey = String(config.azureOpenAiApiKey || "").trim();
  const response = await fetch(`${endpoint}/openai/deployments/${encodeURIComponent(deployment)}/chat/completions?api-version=${encodeURIComponent(apiVersion)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    })
  });
  if (!response.ok) {
    throw new Error(`Azure request failed: ${response.status}`);
  }
  const data = await response.json();
  return extractAssistantText(data);
}

function normalizeAiOutput(rawText) {
  const fenced = rawText.match(/```json\s*([\s\S]*?)```/i) || rawText.match(/```\s*([\s\S]*?)```/i);
  const payload = fenced ? fenced[1] : rawText;
  const parsed = safeJsonParse(payload, null);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("AI 沒有回傳可解析的 JSON。");
  }
  return {
    canonical_question: normalizeText(parsed.canonical_question),
    question_aliases: arrayFromValue(parsed.question_aliases),
    answers: arrayFromValue(parsed.answers)
  };
}

function explainAiError(error, config) {
  const message = String(error?.message || error || "");
  const provider = String(config.defaultProvider || "ollama").trim() || "ollama";
  const providerLabel = getProviderLabel(provider);
  const endpoint = getConfiguredEndpoint(config);

  if (message.includes("Load failed") || message.includes("Failed to fetch") || message.includes("NetworkError")) {
    const hints = [
      `目前無法連到 ${providerLabel}。`
    ];

    if (window.location.protocol === "file:") {
      hints.push("你現在很可能是直接用 file:// 開這個 HTML，瀏覽器可能會擋掉對本機 API 的請求。");
      hints.push("建議改用本機 HTTP 伺服器開這個頁面，例如 Live Server 或 `python3 -m http.server`。");
    }

    if (provider === "ollama") {
      hints.push(`請確認 Ollama 正在執行，而且 endpoint 可連線：${endpoint}`);
      hints.push("常見預設是 `http://127.0.0.1:11434`，並且要先有可用模型。");
    } else if (provider === "azureOpenAi") {
      hints.push("請確認 Azure endpoint、deployment、api-version、api-key 都正確。");
      hints.push(`目前 endpoint：${endpoint || "未填寫"}`);
    } else if (provider === "lmStudio") {
      hints.push(`請確認 LM Studio local server 已啟動，而且 endpoint 可連線：${endpoint}`);
    } else if (provider === "gemini") {
      hints.push("請確認 Gemini model 與 API key 已在 Open Copilot Settings 中設定完成。");
    }

    return hints.join("\n");
  }

  if (message.startsWith("Ollama request failed:")) {
    return `${message}\n請確認 model 名稱正確，並且 Ollama API 可正常回應。`;
  }

  if (message.startsWith("Azure request failed:")) {
    return `${message}\n請確認 deployment、api-key、api-version 與 Azure 資源網址是否正確。`;
  }

  if (message.startsWith("LM Studio request failed:")) {
    return `${message}\n請確認 LM Studio local server、model 與 API key 設定是否正確。`;
  }

  if (message.startsWith("Gemini request failed:")) {
    return `${message}\n請確認 Gemini model 與 API key 是否正確。`;
  }

  return message || "未知錯誤";
}

async function runAiAssist(recordId) {
  const record = currentRecords.find((item) => item.id === recordId);
  if (!record) return;

  const config = await loadOpenCopilotSettings();
  const provider = String(config.defaultProvider || "ollama").trim() || "ollama";
  const model = getConfiguredModel(config);
  if (!model) {
    alert("Open Copilot Settings 的預設 AI provider 尚未設定可用 model / deployment。");
    return;
  }

  activeAiRecordId = recordId;
  setDraftStatus("AI 正在協助整理欄位...", "ai");
  renderResults();

  try {
    const prompt = buildAiPrompt(record);
    const rawText = provider === "azureOpenAi"
      ? await callAzure(prompt, config)
      : provider === "lmStudio"
        ? await callLmStudio(prompt, config)
        : provider === "gemini"
          ? await callGemini(prompt, config)
          : await callOllama(prompt, config);

    const nextDraft = normalizeAiOutput(rawText);
    markRecordDirty(recordId, nextDraft);
    setDraftStatus("AI 結果已套用並暫存", "saved");
  } catch (error) {
    alert(`AI 協助失敗：\n\n${explainAiError(error, config)}`);
    setDraftStatus("AI 協助失敗", "dirty");
  } finally {
    activeAiRecordId = "";
    renderResults();
  }
}

elements.fileInput.addEventListener("change", async (event) => {
  const [file] = event.target.files || [];
  if (file) {
    await handleFile(file);
  }
});

elements.openPickerButton.addEventListener("click", async () => {
  try {
    await openFileWithPicker();
  } catch (error) {
    if (error.name !== "AbortError") {
      alert(`開啟檔案失敗：${error.message}`);
    }
  }
});

["dragenter", "dragover"].forEach((eventName) => {
  elements.dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.dropzone.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  elements.dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.dropzone.classList.remove("dragover");
  });
});

elements.dropzone.addEventListener("drop", async (event) => {
  const [file] = event.dataTransfer.files || [];
  if (file) {
    await handleFile(file);
  }
});

elements.searchInput.addEventListener("input", renderResults);
elements.sampleButton.addEventListener("click", () => loadText(sampleJsonl, "sample.jsonl", sampleJsonl.length, null));
elements.clearButton.addEventListener("click", clearAll);
elements.reloadProviderButton.addEventListener("click", async () => {
  try {
    await loadOpenCopilotSettings();
    setDraftStatus("已重新讀取 Open Copilot 設定", "saved");
  } catch (error) {
    alert(`讀取 Open Copilot 設定失敗：${error.message}`);
  }
});
elements.writeButton.addEventListener("click", async () => {
  try {
    await writeJsonlFile();
  } catch (error) {
    alert(`寫入失敗：${error.message}`);
  }
});
elements.downloadButton.addEventListener("click", downloadJsonl);
elements.systemPromptInput.addEventListener("input", savePrefs);

attachEditorEvents();
loadPrefs();
loadOpenCopilotSettings().catch((error) => {
  console.warn("Failed to load Open Copilot settings", error);
  updateProviderSummary();
});
clearAll();
