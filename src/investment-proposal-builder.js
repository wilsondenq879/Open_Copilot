const DOCX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const APP_TITLE = "Open Copilot";
const PROPOSAL_DRAFT_STORAGE_KEY = "investmentProposalBuilderDraft";
const formNode = document.getElementById("proposalForm");
const topicNode = document.getElementById("proposalTopic");
const scheduleNode = document.getElementById("researchSchedule");
const itemsNode = document.getElementById("researchItems");
const benchmarkNode = document.getElementById("leadingBenchmark");
const patentNode = document.getElementById("patentNotes");
const supportImageInputNode = document.getElementById("supportImageInput");
const supportImageGridNode = document.getElementById("supportImageGrid");
const generateButton = document.getElementById("generateButton");
const downloadAppendix6Button = document.getElementById("downloadAppendix6Button");
const downloadAppendix7Button = document.getElementById("downloadAppendix7Button");
const clearDraftButton = document.getElementById("clearDraftButton");
const statusNode = document.getElementById("statusMessage");
const providerValueNode = document.getElementById("providerValue");
const modelValueNode = document.getElementById("modelValue");
const fileNameValueNode = document.getElementById("fileNameValue");
const progressLabelNode = document.getElementById("progressLabel");
const progressValueNode = document.getElementById("progressValue");
const progressFillNode = document.getElementById("progressFill");
const progressTrackNode = document.querySelector(".proposal-progress-track");

let currentConfig = null;
let lastGeneratedArtifacts = {
  appendix6: null,
  appendix7: null,
};
let draftSaveTimer = null;
let attachedSupportImages = [];

function runtimeMessage(message) {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message || "Runtime message failed."));
          return;
        }
        resolve(response);
      });
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error || "Runtime message failed.")));
    }
  });
}

function setStatus(message, tone = "neutral") {
  statusNode.textContent = String(message || "").trim() || "準備完成。";
  statusNode.classList.remove("is-error", "is-success");
  if (tone === "error") {
    statusNode.classList.add("is-error");
    return;
  }
  if (tone === "success") {
    statusNode.classList.add("is-success");
  }
}

function setProgress(value, label = "") {
  const normalizedValue = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  if (progressFillNode) {
    progressFillNode.style.width = `${normalizedValue}%`;
  }
  if (progressValueNode) {
    progressValueNode.textContent = `${normalizedValue}%`;
  }
  if (progressLabelNode && label) {
    progressLabelNode.textContent = label;
  }
  if (progressTrackNode) {
    progressTrackNode.setAttribute("aria-valuenow", String(normalizedValue));
  }
}

function normalizeText(value, fallback = "") {
  const normalized = String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\u0000/g, "")
    .trim();
  return normalized || fallback;
}

function normalizeLines(value) {
  return String(value || "")
    .split(/\r?\n|[;,，；]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function createStableLocalId(prefix = "item") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getDraftPayload() {
  return {
    topic: String(topicNode?.value || ""),
    researchSchedule: String(scheduleNode?.value || ""),
    researchItems: String(itemsNode?.value || ""),
    leadingBenchmark: String(benchmarkNode?.value || ""),
    patentNotes: String(patentNode?.value || ""),
    supportImages: attachedSupportImages.map((item) => ({
      id: item.id,
      name: item.name,
      mimeType: item.mimeType,
      dataUrl: item.dataUrl,
      width: item.width,
      height: item.height,
    })),
    updatedAt: new Date().toISOString(),
  };
}

function draftHasContent(draft = {}) {
  return ["topic", "researchSchedule", "researchItems", "leadingBenchmark", "patentNotes"]
    .some((key) => normalizeText(draft?.[key]))
    || normalizeDraftImages(draft?.supportImages).length > 0;
}

function applyDraftPayload(draft = {}) {
  topicNode.value = String(draft?.topic || "");
  scheduleNode.value = String(draft?.researchSchedule || "");
  itemsNode.value = String(draft?.researchItems || "");
  benchmarkNode.value = String(draft?.leadingBenchmark || "");
  patentNode.value = String(draft?.patentNotes || "");
  attachedSupportImages = normalizeDraftImages(draft?.supportImages);
  renderSupportImageGrid();
}

async function saveDraftNow() {
  await chrome.storage.local.set({
    [PROPOSAL_DRAFT_STORAGE_KEY]: getDraftPayload(),
  });
}

function scheduleDraftSave() {
  if (draftSaveTimer) {
    window.clearTimeout(draftSaveTimer);
  }
  draftSaveTimer = window.setTimeout(() => {
    saveDraftNow().catch((error) => {
      console.warn("[Open Copilot] Failed to save investment proposal draft", error);
    });
  }, 250);
}

async function loadDraft() {
  const stored = await chrome.storage.local.get(PROPOSAL_DRAFT_STORAGE_KEY);
  const draft = stored?.[PROPOSAL_DRAFT_STORAGE_KEY];
  if (!draft || typeof draft !== "object" || Array.isArray(draft) || !draftHasContent(draft)) {
    return false;
  }
  applyDraftPayload(draft);
  return true;
}

function bindDraftAutoSave() {
  [topicNode, scheduleNode, itemsNode, benchmarkNode, patentNode]
    .filter(Boolean)
    .forEach((node) => {
      node.addEventListener("input", scheduleDraftSave);
      node.addEventListener("change", scheduleDraftSave);
    });
}

function normalizeDraftImages(value) {
  return (Array.isArray(value) ? value : [])
    .map((item, index) => ({
      id: String(item?.id || createStableLocalId(`image-${index + 1}`)),
      name: normalizeText(item?.name, `佐證圖片-${index + 1}.png`),
      mimeType: normalizeText(item?.mimeType, "image/png"),
      dataUrl: String(item?.dataUrl || "").trim(),
      width: Number(item?.width || 0) || 0,
      height: Number(item?.height || 0) || 0,
    }))
    .filter((item) => item.dataUrl.startsWith("data:image/"));
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSupportImageGrid() {
  if (!supportImageGridNode) {
    return;
  }
  if (!attachedSupportImages.length) {
    supportImageGridNode.innerHTML = "";
    return;
  }
  supportImageGridNode.innerHTML = attachedSupportImages.map((image) => `
    <article class="proposal-image-card" data-image-id="${escapeHtml(image.id)}">
      <div class="proposal-image-preview">
        <img src="${escapeHtml(image.dataUrl)}" alt="${escapeHtml(image.name)}" />
      </div>
      <div class="proposal-image-name">${escapeHtml(image.name)}</div>
      <button class="proposal-image-remove" type="button" data-remove-image="${escapeHtml(image.id)}">移除圖片</button>
    </article>
  `).join("");
}

function dataUrlToUint8Array(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("圖片資料格式無效。");
  }
  const base64 = match[2];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("無法讀取圖片檔案。"));
    reader.readAsDataURL(blob);
  });
}

async function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("無法載入圖片。"));
    image.src = dataUrl;
  });
}

async function normalizeImageFile(file, providedName = "") {
  const initialDataUrl = await blobToDataUrl(file);
  const image = await loadImageFromDataUrl(initialDataUrl);
  const maxDimension = 1600;
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth || 1, image.naturalHeight || 1));
  const width = Math.max(1, Math.round((image.naturalWidth || image.width || 1) * scale));
  const height = Math.max(1, Math.round((image.naturalHeight || image.height || 1) * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("無法建立圖片處理畫布。");
  }
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  const pngBlob = await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }
      reject(new Error("圖片轉換失敗。"));
    }, "image/png");
  });
  const dataUrl = await blobToDataUrl(pngBlob);
  const baseName = normalizeText(providedName || file?.name || "", "support-image");
  const sanitizedName = baseName.replace(/\.[a-z0-9]+$/i, "");
  return {
    id: createStableLocalId("support-image"),
    name: `${sanitizedName || "support-image"}.png`,
    mimeType: "image/png",
    dataUrl,
    width,
    height,
  };
}

async function addSupportImagesFromFiles(files = []) {
  const imageFiles = (Array.isArray(files) ? files : Array.from(files || []))
    .filter((file) => file && String(file.type || "").startsWith("image/"));
  if (!imageFiles.length) {
    setStatus("目前只支援上傳或貼上圖片檔案。", "error");
    return;
  }

  const normalizedImages = [];
  for (const file of imageFiles.slice(0, 8)) {
    normalizedImages.push(await normalizeImageFile(file));
  }

  attachedSupportImages = [...attachedSupportImages, ...normalizedImages].slice(0, 8);
  renderSupportImageGrid();
  scheduleDraftSave();
  setStatus(`已加入 ${normalizedImages.length} 張圖片佐證，生成 Word 時會一併插入。`, "success");
}

async function handleSupportImageInputChange(event) {
  const files = event?.target?.files;
  await addSupportImagesFromFiles(files);
  if (supportImageInputNode) {
    supportImageInputNode.value = "";
  }
}

async function handleImagePaste(event) {
  const items = Array.from(event?.clipboardData?.items || []);
  const imageFiles = items
    .filter((item) => String(item.type || "").startsWith("image/"))
    .map((item) => item.getAsFile())
    .filter(Boolean);
  if (!imageFiles.length) {
    return;
  }
  event.preventDefault();
  await addSupportImagesFromFiles(imageFiles);
}

function handleSupportImageGridClick(event) {
  const button = event.target instanceof Element ? event.target.closest("[data-remove-image]") : null;
  if (!button) {
    return;
  }
  const imageId = String(button.getAttribute("data-remove-image") || "").trim();
  if (!imageId) {
    return;
  }
  attachedSupportImages = attachedSupportImages.filter((item) => item.id !== imageId);
  renderSupportImageGrid();
  scheduleDraftSave();
  setStatus("已移除圖片佐證。", "success");
}

function resetDraftFields() {
  if (supportImageInputNode) {
    supportImageInputNode.value = "";
  }
  applyDraftPayload({});
}

async function clearSavedDraft() {
  if (draftSaveTimer) {
    window.clearTimeout(draftSaveTimer);
    draftSaveTimer = null;
  }
  await chrome.storage.local.remove(PROPOSAL_DRAFT_STORAGE_KEY);
}

function getProviderLabel(config = {}) {
  const provider = String(config.defaultProvider || "ollama").trim();
  if (provider === "lmStudio") {
    return "LM Studio";
  }
  if (provider === "gemini") {
    return "Gemini";
  }
  if (provider === "azureOpenAi") {
    return "Azure OpenAI";
  }
  return "Ollama";
}

function getModelLabel(config = {}) {
  const provider = String(config.defaultProvider || "ollama").trim();
  if (provider === "gemini") {
    return String(config.geminiModel || "").trim() || "未設定";
  }
  if (provider === "azureOpenAi") {
    return String(config.azureOpenAiDeployment || "").trim() || "未設定";
  }
  if (provider === "lmStudio") {
    return String(config.lmStudioModel || "").trim() || "未設定";
  }
  return String(config.selectedModel || "").trim() || "未設定";
}

function renderConfigSummary() {
  providerValueNode.textContent = currentConfig ? getProviderLabel(currentConfig) : "未載入";
  modelValueNode.textContent = currentConfig ? getModelLabel(currentConfig) : "未載入";
  const appendix6File = lastGeneratedArtifacts.appendix6?.fileName || "尚未生成";
  const appendix7File = lastGeneratedArtifacts.appendix7?.fileName || "尚未生成";
  fileNameValueNode.textContent = `附表6：${appendix6File}\n附表7：${appendix7File}`;
}

function sanitizeFileSegment(value, fallback = "investment-proposal") {
  const normalized = String(value || "")
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || fallback;
}

function timestampForFile(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}-${hour}${minute}${second}`;
}

function buildDocxFilename(topic, appendixLabel) {
  return `${timestampForFile(new Date())}-${sanitizeFileSegment(topic, "investment-proposal")}-${sanitizeFileSegment(appendixLabel, "appendix")}.docx`;
}

function randomSalesUnits() {
  return 50000 + Math.floor(Math.random() * 50001);
}

function resolveGenerationModel(config = {}) {
  const provider = String(config.defaultProvider || "ollama").trim();
  if (provider === "gemini") {
    return String(config.geminiModel || "").trim();
  }
  if (provider === "azureOpenAi") {
    return String(config.azureOpenAiDeployment || "").trim();
  }
  if (provider === "lmStudio") {
    return String(config.lmStudioModel || "").trim();
  }
  return String(config.selectedModel || "").trim();
}

function ensureModelReady(config = {}) {
  const provider = String(config.defaultProvider || "ollama").trim();
  if (provider === "ollama" && !String(config.selectedModel || "").trim()) {
    throw new Error("目前使用 Ollama，但還沒有選擇模型。請先到 Open Copilot 設定或聊天面板選好模型。");
  }
}

function buildSupportImagesPromptText(supportImages = []) {
  const safeImages = Array.isArray(supportImages) ? supportImages : [];
  if (!safeImages.length) {
    return "未提供";
  }
  return safeImages
    .slice(0, 8)
    .map((image, index) => `${index + 1}. ${normalizeText(image?.name, `圖片佐證-${index + 1}.png`)}`)
    .join("\n");
}

function buildCommonPromptSections({ topic, researchSchedule, researchItems, leadingBenchmark, patentNotes, supportImages, salesUnits, revenueUsd }) {
  const researchItemText = researchItems.map((item, index) => `${index + 1}. ${item}`).join("\n");
  const benchmarkText = leadingBenchmark.map((item, index) => `${index + 1}. ${item}`).join("\n");
  const supportImageText = buildSupportImagesPromptText(supportImages);
  return [
    "你是一位台灣投資抵減企畫書撰寫顧問型 AI，專門協助企業撰寫、優化與補強投資抵減申請企畫書。",
    "適用情境包括：產業創新條例投資抵減、中小企業投資抵減，以及 AI、資安、數位轉型、智慧製造、節能減碳、研發相關投資案。",
    "你的核心任務是把使用者提供的技術與投資內容，轉寫成政府與審查單位看得懂、看得過的企畫書內容。",
    "",
    "非常重要的寫作原則：",
    "1. 一律使用繁體中文，不得使用任何簡體中文、中國用語或中國式措辭。",
    "2. 一律採政府審查導向與制度語言，不可寫成行銷文、廣告文、口號式文案。",
    "3. 重點放在投資目的、技術自主性、國內產業升級、生產力或效能改善。",
    "4. 不可使用「一定符合」「保證核准」等保證性語句，請改用「可強化申請正當性」「有助於符合審查方向」等審慎措辭。",
    "5. 所有內容需維持正式、務實、可審查、可佐證的語氣。",
    "6. 請合理延伸內容，但不要捏造專利號、政府補助案號、特定客戶名稱或已核准事實。",
    "",
    "使用者輸入：",
    `提案主題：${topic}`,
    `研發時程需求：\n${researchSchedule}`,
    `主要研發項目：\n${researchItemText}`,
    `領先業界指標：\n${benchmarkText}`,
    `專利申請資訊：\n${normalizeText(patentNotes, "未提供")}`,
    `圖片佐證檔案：\n${supportImageText}`,
    "",
    "固定生成規則：",
    "1. 附表6 與附表7 的研發時程，必須嚴格依照使用者填寫的期間區間、月份、里程碑與階段安排，不可擅自改寫成別的年份區間；若需要補充，只能在使用者提供的時程範圍內補足更細的工作節奏。",
    `2. 附表6 的 2026 年導入銷售量請使用這個固定整數：${salesUnits}。`,
    `3. ASP 固定為 100 USD，因此預估 revenue 固定為 ${revenueUsd} USD。`,
    "4. 若屬軟體項目，功能規格中的代碼對照請提供簡短軟體代碼或偽代碼；若偏硬體，請提供硬體運算邏輯或控制邏輯。",
    "5. 附表6 的「研發計畫緣由」需約 1500 字，並另外提供一段 mermaid flowchart 語法做產品設計流程圖。",
    "6. 附表6 的「申請年度之執行績效及成果」正文至少 600 字。",
    "7. 附表6 的「創新性」正文至少 1000 字，且明確寫出與業界其他產品的差異與獨特處。",
    "8. 附表6 的「可行性或商業性」約 500 字。",
    "9. 附表6 的「必要性及合理性」至少 500 字。",
    "10. 附表7 的六個大段正文，各段都請寫成約 1000 到 1500 字的正式段落文字；有要求表格的段落請另外提供表格資料。",
    "11. 如果使用者提供專利申請資訊，請務必把專利內容納入附表6與附表7，並明確當作自主研發成果、技術布局或創新佐證的一部分，不可忽略。",
    "12. 如果使用者有提供圖片佐證檔案，請在相關佐證文件、研發過程、功能規格或技術層次等段落中自然提及有對應的圖片、示意圖、測試截圖或結構照片可供審查參考，但不要憑空描述未提供的細節。",
  ];
}

function buildAppendix6Prompt(inputs) {
  return [
    ...buildCommonPromptSections(inputs),
    "",
    "本次只需要生成附表6內容。",
    "章節骨架必須比照以下結構與段落層級輸出內容，不可自行改寫章名或合併章節：",
    "壹、計畫基本概述",
    "一、研發計畫緣由",
    "二、研發時程及各年度預計投入之研發經費",
    "三、研發成果",
    "（一）各年度預期效益",
    "（二）前一年度之執行績效及成果",
    "（三）申請年度之執行績效及成果",
    "（四）相關佐證文件",
    "貳、計畫內容",
    "一、研發內容及方向",
    "二、研發過程",
    "三、研發項目",
    "四、功能規格",
    "五、技術層次",
    "六、創新性",
    "七、可行性或商業性",
    "叁、公司技術能力",
    "一、公司研發實績",
    "二、執行計畫之研發能力",
    "三、技術來源",
    "四、必要性及合理性",
    "五、國內外同領域領先業者之比較分析",
    "肆、投入研發人員名單",
    "請只回覆一個合法 JSON 物件，不要加 Markdown code fence，不要加前後說明，不要加註解。",
    "JSON 結構必須完全符合以下 schema，key 名稱不可更改：",
    "{",
    '  "reason": { "body": "string", "mermaid": "string" },',
    '  "timeline": { "body": "string", "rows": [{ "period": "string", "phase": "string", "details": "string", "budget": "string" }] },',
    '  "outcome": { "annualBenefitBody": "string", "annualBenefitRows": [{ "year": "string", "units": "string", "asp": "string", "revenue": "string", "qualitative": "string" }], "previousYearPerformanceBody": "string", "body": "string", "salesYear": 2026, "estimatedUnits": 0, "aspUsd": 100, "revenueUsd": 0 },',
    '  "executionPerformance": { "body": "string", "rows": [{ "goal": "string", "metric": "string", "futureApplication": "string" }] },',
    '  "supportingDocuments": { "body": "string", "rows": [{ "proposalNo": "string", "applicationDate": "string", "caseName": "string", "inventor": "string", "patentType": "string", "status": "string" }] },',
    '  "contentDirections": { "body": "string", "rows": [{ "content": "string", "details": "string" }] },',
    '  "process": { "body": "string", "rows": [{ "stage": "string", "details": "string" }] },',
    '  "projectItems": { "body": "string", "rows": [{ "item": "string", "content": "string" }] },',
    '  "functionalSpecs": { "body": "string", "rows": [{ "item": "string", "contentPurpose": "string", "codeReference": "string" }] },',
    '  "technologyLevel": { "body": "string", "rows": [{ "innovationItem": "string", "benchmark": "string", "technicalLevel": "string" }] },',
    '  "innovation": { "body": "string", "rows": [{ "aspect": "string", "difference": "string", "reviewValue": "string" }] },',
    '  "feasibility": { "body": "string" },',
    '  "companyTrackRecord": { "body": "string" },',
    '  "rdCapabilities": ["string"],',
    '  "technologySource": { "body": "string" },',
    '  "necessity": { "body": "string" },',
    '  "benchmarkComparison": { "body": "string", "rows": [{ "innovationItem": "string", "benchmark": "string", "technicalLevel": "string" }] },',
    '  "personnel": { "rows": [{ "index": "string", "name": "string", "work": "string" }] }',
    "}",
    "",
    "補充要求：",
    "1. reason.mermaid 只放 mermaid 原始碼，例如 flowchart TD 開頭，不要包在 ``` 內。",
    "2. JSON 中的文字值不得再夾帶 Markdown 表格、Markdown 標題或三個反引號。",
    "3. 表格列數請充實，不要只給 2 或 3 列就結束；至少讓內容看起來像可送審的初稿。",
    "4. 附表6 的第 5、6、7、8 章除了表格資料之外，body 也必須各自提供完整文字說明，不可只回表格陣列。",
    "5. 如果使用者有提供專利申請資訊，supportingDocuments 與 innovation、technologyLevel、benchmarkComparison 等欄位要明確引用專利作為自主研發成果。",
    "6. 所有段落都要直接圍繞提案主題、研發項目與領先業界指標展開。",
  ].join("\n");
}

function buildAppendix7Prompt(inputs) {
  return [
    ...buildCommonPromptSections(inputs),
    "",
    "本次只需要生成附表7內容。",
    "章節骨架必須比照以下結構與段落層級輸出內容，不可自行改寫章名或合併章節：",
    "壹、研發計畫內容",
    "一、研發大綱及方向",
    "二、研發時程",
    "三、研發階段及研發過程",
    "四、研發項目",
    "五、功能規格",
    "六、技術層次",
    "貳、投入研發人員名單及其具體工作內容（需與重點摘要書一致）",
    "請只回覆一個合法 JSON 物件，不要加 Markdown code fence，不要加前後說明，不要加註解。",
    "JSON 結構必須完全符合以下 schema，key 名稱不可更改：",
    "{",
    '  "outline": { "body": "string" },',
    '  "timeline": { "body": "string", "rows": [{ "period": "string", "phase": "string", "details": "string" }] },',
    '  "stages": { "body": "string", "rows": [{ "stage": "string", "details": "string", "deliverable": "string" }] },',
    '  "projects": { "body": "string", "rows": [{ "item": "string", "method": "string", "difficultySolution": "string", "exclusiveOutcome": "string", "testFocus": "string" }] },',
    '  "functionalSpecs": { "body": "string", "rows": [{ "item": "string", "contentPurpose": "string", "codeReference": "string" }] },',
    '  "technologyLevel": { "body": "string", "rows": [{ "innovationItem": "string", "benchmark": "string", "technicalLevel": "string" }] },',
    '  "personnel": { "rows": [{ "index": "string", "name": "string", "work": "string" }] }',
    "}",
    "",
    "補充要求：",
    "1. JSON 中的文字值不得再夾帶 Markdown 表格、Markdown 標題或三個反引號。",
    "2. 表格列數請充實，不要只給 2 或 3 列就結束；至少讓內容看起來像可送審的初稿。",
    "3. 如果使用者有提供專利申請資訊，請在 outline、projects、technologyLevel 等內容中明確納入自主研發成果敘述。",
    "4. 所有段落都要直接圍繞提案主題、研發項目與領先業界指標展開。",
  ].join("\n");
}

function buildJsonRepairPrompt(rawText, appendixType) {
  const schemaText = appendixType === "appendix7"
    ? [
        "{",
        '  "outline": { "body": "string" },',
        '  "timeline": { "body": "string", "rows": [{ "period": "string", "phase": "string", "details": "string" }] },',
        '  "stages": { "body": "string", "rows": [{ "stage": "string", "details": "string", "deliverable": "string" }] },',
        '  "projects": { "body": "string", "rows": [{ "item": "string", "method": "string", "difficultySolution": "string", "exclusiveOutcome": "string", "testFocus": "string" }] },',
        '  "functionalSpecs": { "body": "string", "rows": [{ "item": "string", "contentPurpose": "string", "codeReference": "string" }] },',
        '  "technologyLevel": { "body": "string", "rows": [{ "innovationItem": "string", "benchmark": "string", "technicalLevel": "string" }] },',
        '  "personnel": { "rows": [{ "index": "string", "name": "string", "work": "string" }] }',
        "}",
      ].join("\n")
    : [
        "{",
        '  "reason": { "body": "string", "mermaid": "string" },',
        '  "timeline": { "body": "string", "rows": [{ "period": "string", "phase": "string", "details": "string", "budget": "string" }] },',
        '  "outcome": { "annualBenefitBody": "string", "annualBenefitRows": [{ "year": "string", "units": "string", "asp": "string", "revenue": "string", "qualitative": "string" }], "previousYearPerformanceBody": "string", "body": "string", "salesYear": 2026, "estimatedUnits": 0, "aspUsd": 100, "revenueUsd": 0 },',
        '  "executionPerformance": { "body": "string", "rows": [{ "goal": "string", "metric": "string", "futureApplication": "string" }] },',
        '  "supportingDocuments": { "body": "string", "rows": [{ "proposalNo": "string", "applicationDate": "string", "caseName": "string", "inventor": "string", "patentType": "string", "status": "string" }] },',
        '  "contentDirections": { "body": "string", "rows": [{ "content": "string", "details": "string" }] },',
        '  "process": { "body": "string", "rows": [{ "stage": "string", "details": "string" }] },',
        '  "projectItems": { "body": "string", "rows": [{ "item": "string", "content": "string" }] },',
        '  "functionalSpecs": { "body": "string", "rows": [{ "item": "string", "contentPurpose": "string", "codeReference": "string" }] },',
        '  "technologyLevel": { "body": "string", "rows": [{ "innovationItem": "string", "benchmark": "string", "technicalLevel": "string" }] },',
        '  "innovation": { "body": "string", "rows": [{ "aspect": "string", "difference": "string", "reviewValue": "string" }] },',
        '  "feasibility": { "body": "string" },',
        '  "companyTrackRecord": { "body": "string" },',
        '  "rdCapabilities": ["string"],',
        '  "technologySource": { "body": "string" },',
        '  "necessity": { "body": "string" },',
        '  "benchmarkComparison": { "body": "string", "rows": [{ "innovationItem": "string", "benchmark": "string", "technicalLevel": "string" }] },',
        '  "personnel": { "rows": [{ "index": "string", "name": "string", "work": "string" }] }',
        "}",
      ].join("\n");
  return [
    "你是一個專門修復 JSON 的工具。",
    "請把我提供的內容整理成一個合法 JSON 物件。",
    "不要補充說明，不要輸出 Markdown code fence，不要加註解。",
    "如果原文前後有額外說明文字，請移除，只保留 JSON 物件。",
    "如果字串中含有未跳脫的換行、引號或控制字元，請修正成合法 JSON。",
    "若原文已經有足夠資訊，請保留原意，不要任意新增無根據內容。",
    "",
    `目標為 ${appendixType === "appendix7" ? "附表7" : "附表6"} schema：`,
    schemaText,
    "",
    "以下是原始內容：",
    rawText,
  ].join("\n");
}

function tryParseJsonCandidate(rawValue) {
  if (!rawValue) {
    return null;
  }
  let candidate = String(rawValue || "").trim();
  if (!candidate) {
    return null;
  }
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const parsed = JSON.parse(candidate);
      if (typeof parsed === "string") {
        candidate = parsed.trim();
        continue;
      }
      return parsed;
    } catch (_error) {
      try {
        const repaired = JSON.parse(escapeJsonStringLineBreaks(candidate));
        if (typeof repaired === "string") {
          candidate = repaired.trim();
          continue;
        }
        return repaired;
      } catch (_nextError) {
        return null;
      }
    }
  }
  return null;
}

function escapeJsonStringLineBreaks(value) {
  const source = String(value || "");
  let repaired = "";
  let inString = false;
  let escaping = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (escaping) {
      repaired += char;
      escaping = false;
      continue;
    }

    if (char === "\\") {
      repaired += char;
      escaping = true;
      continue;
    }

    if (inString) {
      if (char === "\"") {
        repaired += char;
        inString = false;
        continue;
      }

      if (char === "\r") {
        if (source[index + 1] === "\n") {
          index += 1;
        }
        repaired += "\\n";
        continue;
      }

      if (char === "\n") {
        repaired += "\\n";
        continue;
      }

      repaired += char;
      continue;
    }

    if (char === "\"") {
      inString = true;
    }

    repaired += char;
  }

  return repaired;
}

function parseProposalJson(rawText) {
  const source = String(rawText || "").trim();
  if (!source) {
    return null;
  }

  const attempts = [source];
  const fencedMatch = source.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    attempts.push(fencedMatch[1].trim());
  }

  const objectStart = source.indexOf("{");
  const objectEnd = source.lastIndexOf("}");
  if (objectStart >= 0 && objectEnd > objectStart) {
    attempts.push(source.slice(objectStart, objectEnd + 1));
  }

  for (const attempt of attempts) {
    const parsed = tryParseJsonCandidate(attempt);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
  }

  return null;
}

async function generateSectionJson(prompt, model, appendixType, progressOptions = {}) {
  const sectionLabel = appendixType === "appendix7" ? "附表7" : "附表6";
  if (Number.isFinite(progressOptions.start)) {
    setProgress(progressOptions.start, `${sectionLabel} 內容生成中`);
  }
  const result = await runtimeMessage({
    type: "ollama:generate",
    prompt,
    model,
  });
  if (!result?.ok && result?.response === undefined) {
    throw new Error(`${sectionLabel} 生成失敗：${result?.error || "模型沒有成功回覆。"}`);
  }

  const parsed = parseProposalJson(result.response || "");
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return parsed;
  }

  if (Number.isFinite(progressOptions.repair)) {
    setProgress(progressOptions.repair, `${sectionLabel} JSON 校正中`);
  }
  setStatus(`${sectionLabel} 初稿已回覆，但格式需要自動校正，正在整理 JSON。`);
  const repairResult = await runtimeMessage({
    type: "ollama:generate",
    prompt: buildJsonRepairPrompt(result.response || "", appendixType),
    model,
  });
  if (!repairResult?.ok && repairResult?.response === undefined) {
    throw new Error(`${sectionLabel} JSON 校正失敗：${repairResult?.error || "模型沒有成功回覆。"}`);
  }

  const repaired = parseProposalJson(repairResult.response || "");
  if (repaired && typeof repaired === "object" && !Array.isArray(repaired)) {
    return repaired;
  }

  throw new Error(`${sectionLabel} 已有內容回覆，但仍無法整理成合法 JSON。建議改用更穩定的模型後再試一次。`);
}

function normalizeRowList(value) {
  return Array.isArray(value) ? value.filter((item) => item && typeof item === "object" && !Array.isArray(item)) : [];
}

function normalizeStringList(value) {
  return (Array.isArray(value) ? value : [])
    .map((item) => normalizeText(item))
    .filter(Boolean);
}

function normalizeSectionRows(sectionValue, legacyRows) {
  if (Array.isArray(sectionValue)) {
    return normalizeRowList(sectionValue);
  }
  if (Array.isArray(legacyRows)) {
    return normalizeRowList(legacyRows);
  }
  return normalizeRowList(sectionValue?.rows);
}

function buildAppendix6FallbackBody(sectionLabel, inputs) {
  const topic = normalizeText(inputs?.topic, "本研發計畫");
  const schedule = normalizeText(inputs?.researchSchedule, "使用者提供之研發時程");
  const itemsText = (Array.isArray(inputs?.researchItems) ? inputs.researchItems : []).join("、") || "核心研發項目";
  const benchmarkText = (Array.isArray(inputs?.leadingBenchmark) ? inputs.leadingBenchmark : []).join("、") || "預定技術指標";
  const patentText = normalizeText(inputs?.patentNotes);

  if (sectionLabel === "contentDirections") {
    return `${topic}之研發內容與方向係以${itemsText}為主軸，並依照${schedule}逐步展開技術模組規劃、架構整合與驗證安排。整體方向聚焦於以自主技術建立可落地之產品化能力，同時對準${benchmarkText}等關鍵指標，使研發內容不僅具備功能完整性，也有助於形成可供審查辨識之技術深度與產業升級效益。`;
  }
  if (sectionLabel === "process") {
    return `${topic}之研發過程將依照${schedule}推進，從需求盤點、使用情境分析、系統架構規劃、分階段開發、測試驗證到優化導入，形成可追溯之研發流程。各階段皆以${itemsText}為核心，並以${benchmarkText}作為技術檢核依據，確保整體研發活動具備一致的執行邏輯與成果驗證基準。`;
  }
  if (sectionLabel === "projectItems") {
    return `${topic}之研發項目係依據實際應用需求與技術開發重點所拆解，將${itemsText}區分為可管理之子項目，以利進行人力配置、時程控管與成果驗證。各研發項目彼此具備關聯性，並共同支撐${benchmarkText}等領先業界指標之達成，進一步強化本案之自主研發完整性。`;
  }
  if (sectionLabel === "functionalSpecs") {
    const patentSentence = patentText ? `另如${patentText}等專利申請資訊，亦可作為功能結構與控制方法屬於自主研發成果之佐證。` : "";
    return `${topic}之功能規格設計係依研發目的與應用場景拆解，將各項功能與對應控制邏輯、資料流程或運算方式明確定義，以利後續驗證與量產導入。相關功能規格除了支撐${itemsText}之落地實作，也對應${benchmarkText}等技術目標，${patentSentence}`.trim();
  }
  return "";
}

function buildDefaultPersonnelRows() {
  return [
    {
      index: "1",
      name: "待由申請企業填列",
      work: "請依公司實際投入本研發計畫之人員名單與具體工作內容補充，並與重點摘要書保持一致。",
    },
  ];
}

function buildOutcomeAnnualBodyFallback(inputs, salesUnits, revenueUsd) {
  const topic = normalizeText(inputs?.topic, "本研發計畫");
  return `${topic}之研發成果完成後，預期將於2026年開始導入市場，並形成營收貢獻、技術擴散與品牌能見度提升等多重效益。依本計畫之產品定位、技術門檻及應用情境推估，導入初期可逐步累積市場接受度，並以自主研發成果與差異化規格建立競爭優勢。以2026年為導入年度，預估銷售量約為${salesUnits.toLocaleString("en-US")}台，ASP以100 USD估算，全年預估營收約為${revenueUsd.toLocaleString("en-US")} USD。`;
}

function buildSupportingDocumentsFallback(inputs) {
  const patentText = normalizeText(inputs?.patentNotes);
  if (patentText) {
    return `本計畫如涉及專利申請、技術布局或研發成果保護，將以相關專利申請資料作為重要佐證文件，藉以說明本案具有自主研發基礎與技術延伸價值。就目前輸入內容判斷，可優先納入以下專利申請資訊或相關技術摘要：${patentText}`;
  }
  return "本計畫之相關佐證文件可包括與本研發計畫關聯之專利申請、技術文件、測試報告、得獎紀錄或政府補助資料等，以強化研發成果之可審查性與自主技術證據鏈。";
}

function buildTechnologyLevelFallback(inputs) {
  const topic = normalizeText(inputs?.topic, "本研發計畫");
  const benchmarkText = (Array.isArray(inputs?.leadingBenchmark) ? inputs.leadingBenchmark : []).join("、") || "目標技術指標";
  return `${topic}之技術層次將以${benchmarkText}等核心指標與國內外同級產品進行對照，評估本案於功能整合度、系統效能、使用體驗與技術自主性上的相對位置。相關技術層次說明將以市場現況、預定達成指標與產業落差分析為主，凸顯本案非屬一般既有規格延伸，而係具備明確升級與創新意義之研發投入。`;
}

function buildCompanyTrackRecordFallback(inputs) {
  const topic = normalizeText(inputs?.topic, "本研發計畫");
  return `本公司於相關產品與技術領域已累積硬體設計、韌體開發、軟體整合、測試驗證與量產導入之研發經驗，可作為執行${topic}之基礎。既有研發能量除有助於縮短開發導入時間，亦可降低跨域整合過程之技術風險，提升計畫成果轉化為商品化應用之可行性。`;
}

function buildBenchmarkComparisonFallback(inputs) {
  const benchmarkText = (Array.isArray(inputs?.leadingBenchmark) ? inputs.leadingBenchmark : []).join("、") || "目標技術指標";
  return `本比較分析將以${benchmarkText}等核心指標作為對照基礎，針對國內外同領域領先產品之技術規格、應用型態與系統能力進行比較，藉以說明本計畫之技術差異化、創新應用價值及產業升級效益。`;
}

function shapeProposalData(rawProposal, inputs, salesUnits, revenueUsd) {
  const appendix6 = rawProposal?.appendix6 && typeof rawProposal.appendix6 === "object" ? rawProposal.appendix6 : {};
  const appendix7 = rawProposal?.appendix7 && typeof rawProposal.appendix7 === "object" ? rawProposal.appendix7 : {};
  const appendix6ContentDirections = appendix6?.contentDirections;
  const appendix6Process = appendix6?.process;
  const appendix6ProjectItems = appendix6?.projectItems;
  const appendix6FunctionalSpecs = appendix6?.functionalSpecs;
  const appendix6PersonnelRows = normalizeSectionRows(appendix6?.personnel);
  const appendix7PersonnelRows = normalizeSectionRows(appendix7?.personnel);
  return {
    documentTitle: normalizeText(rawProposal?.documentTitle, "投資抵減申請企畫書"),
    projectTitle: normalizeText(rawProposal?.projectTitle, inputs.topic),
    inputs,
    appendix6: {
      reason: {
        body: normalizeText(appendix6?.reason?.body),
        mermaid: normalizeText(appendix6?.reason?.mermaid),
      },
      timeline: {
        body: normalizeText(appendix6?.timeline?.body, `本計畫研發時程將依據${normalizeText(inputs.researchSchedule, "使用者提供之時程區間")}進行規劃，並配合各階段工作內容、資源投入與驗證節點逐步推進。`),
        rows: normalizeSectionRows(appendix6?.timeline, appendix6?.timelineRows),
      },
      outcome: {
        annualBenefitBody: normalizeText(appendix6?.outcome?.annualBenefitBody, buildOutcomeAnnualBodyFallback(inputs, salesUnits, revenueUsd)),
        annualBenefitRows: normalizeRowList(appendix6?.outcome?.annualBenefitRows),
        previousYearPerformanceBody: normalizeText(appendix6?.outcome?.previousYearPerformanceBody, "如屬首次申請之計畫，前一年度之執行績效及成果可敘明為第一年申請之計畫，並由審查資料佐證其研發起始背景。"),
        body: normalizeText(appendix6?.outcome?.body),
        salesYear: 2026,
        estimatedUnits: salesUnits,
        aspUsd: 100,
        revenueUsd,
      },
      executionPerformance: {
        body: normalizeText(appendix6?.executionPerformance?.body),
        rows: normalizeRowList(appendix6?.executionPerformance?.rows),
      },
      supportingDocuments: {
        body: normalizeText(appendix6?.supportingDocuments?.body, buildSupportingDocumentsFallback(inputs)),
        rows: normalizeRowList(appendix6?.supportingDocuments?.rows),
      },
      contentDirections: {
        body: normalizeText(appendix6ContentDirections?.body, buildAppendix6FallbackBody("contentDirections", inputs)),
        rows: normalizeSectionRows(appendix6ContentDirections),
      },
      process: {
        body: normalizeText(appendix6Process?.body, buildAppendix6FallbackBody("process", inputs)),
        rows: normalizeSectionRows(appendix6Process, appendix6?.processRows),
      },
      projectItems: {
        body: normalizeText(appendix6ProjectItems?.body, buildAppendix6FallbackBody("projectItems", inputs)),
        rows: normalizeSectionRows(appendix6ProjectItems),
      },
      functionalSpecs: {
        body: normalizeText(appendix6FunctionalSpecs?.body, buildAppendix6FallbackBody("functionalSpecs", inputs)),
        rows: normalizeSectionRows(appendix6FunctionalSpecs),
      },
      technologyLevel: {
        body: normalizeText(appendix6?.technologyLevel?.body, buildTechnologyLevelFallback(inputs)),
        rows: normalizeSectionRows(appendix6?.technologyLevel),
      },
      innovation: {
        body: normalizeText(appendix6?.innovation?.body),
        rows: normalizeRowList(appendix6?.innovation?.rows),
      },
      feasibility: {
        body: normalizeText(appendix6?.feasibility?.body),
      },
      companyTrackRecord: {
        body: normalizeText(appendix6?.companyTrackRecord?.body, buildCompanyTrackRecordFallback(inputs)),
      },
      rdCapabilities: normalizeStringList(appendix6?.rdCapabilities),
      technologySource: {
        body: normalizeText(appendix6?.technologySource?.body, "內部自行研發"),
      },
      necessity: {
        body: normalizeText(appendix6?.necessity?.body),
      },
      benchmarkComparison: {
        body: normalizeText(appendix6?.benchmarkComparison?.body, buildBenchmarkComparisonFallback(inputs)),
        rows: normalizeSectionRows(appendix6?.benchmarkComparison),
      },
      personnel: {
        rows: appendix6PersonnelRows.length ? appendix6PersonnelRows : buildDefaultPersonnelRows(),
      },
    },
    appendix7: {
      outline: {
        body: normalizeText(appendix7?.outline?.body),
      },
      timeline: {
        body: normalizeText(appendix7?.timeline?.body),
        rows: normalizeRowList(appendix7?.timeline?.rows),
      },
      stages: {
        body: normalizeText(appendix7?.stages?.body),
        rows: normalizeRowList(appendix7?.stages?.rows),
      },
      projects: {
        body: normalizeText(appendix7?.projects?.body),
        rows: normalizeRowList(appendix7?.projects?.rows),
      },
      functionalSpecs: {
        body: normalizeText(appendix7?.functionalSpecs?.body),
        rows: normalizeRowList(appendix7?.functionalSpecs?.rows),
      },
      technologyLevel: {
        body: normalizeText(appendix7?.technologyLevel?.body),
        rows: normalizeRowList(appendix7?.technologyLevel?.rows),
      },
      personnel: {
        rows: appendix7PersonnelRows.length
          ? appendix7PersonnelRows
          : (appendix6PersonnelRows.length ? appendix6PersonnelRows : buildDefaultPersonnelRows()),
      },
    },
  };
}

function downloadBinaryBlob(filename, bytes, mimeType = "application/octet-stream") {
  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) ? (0xEDB88320 ^ (value >>> 1)) : (value >>> 1);
    }
    table[index] = value >>> 0;
  }
  return table;
})();

function computeCrc32(bytes) {
  let crc = 0xFFFFFFFF;
  for (let index = 0; index < bytes.length; index += 1) {
    crc = CRC32_TABLE[(crc ^ bytes[index]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function concatUint8Arrays(chunks) {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  chunks.forEach((chunk) => {
    result.set(chunk, offset);
    offset += chunk.length;
  });
  return result;
}

function createZipStore(entries) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const now = new Date();
  const dosTime = ((now.getHours() & 0x1F) << 11) | ((now.getMinutes() & 0x3F) << 5) | Math.floor(now.getSeconds() / 2);
  const dosDate = (((now.getFullYear() - 1980) & 0x7F) << 9) | (((now.getMonth() + 1) & 0x0F) << 5) | (now.getDate() & 0x1F);

  entries.forEach((entry) => {
    const nameBytes = encoder.encode(entry.name);
    const dataBytes = entry.data instanceof Uint8Array ? entry.data : encoder.encode(String(entry.data || ""));
    const crc32 = computeCrc32(dataBytes);
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);
    localView.setUint32(0, 0x04034B50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0x0800, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, dosTime, true);
    localView.setUint16(12, dosDate, true);
    localView.setUint32(14, crc32, true);
    localView.setUint32(18, dataBytes.length, true);
    localView.setUint32(22, dataBytes.length, true);
    localView.setUint16(26, nameBytes.length, true);
    localView.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);
    localParts.push(localHeader, dataBytes);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);
    centralView.setUint32(0, 0x02014B50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0x0800, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, dosTime, true);
    centralView.setUint16(14, dosDate, true);
    centralView.setUint32(16, crc32, true);
    centralView.setUint32(20, dataBytes.length, true);
    centralView.setUint32(24, dataBytes.length, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);
    centralParts.push(centralHeader);

    offset += localHeader.length + dataBytes.length;
  });

  const centralDirectory = concatUint8Arrays(centralParts);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054B50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, entries.length, true);
  endView.setUint16(10, entries.length, true);
  endView.setUint32(12, centralDirectory.length, true);
  endView.setUint32(16, offset, true);
  endView.setUint16(20, 0, true);

  return concatUint8Arrays([...localParts, centralDirectory, end]);
}

function buildDocxContentTypesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;
}

function buildDocxRootRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
}

function buildDocxAppXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>${escapeXml(APP_TITLE)}</Application>
  <Company>${escapeXml(APP_TITLE)}</Company>
  <AppVersion>1.0</AppVersion>
</Properties>`;
}

function buildDocxCoreXml(title) {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${escapeXml(title)}</dc:title>
  <dc:creator>${escapeXml(APP_TITLE)}</dc:creator>
  <cp:lastModifiedBy>${escapeXml(APP_TITLE)}</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`;
}

function buildDocxStylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="DFKai-SB" w:hAnsi="DFKai-SB" w:eastAsia="DFKai-SB" w:cs="DFKai-SB"/>
        <w:sz w:val="28"/>
        <w:szCs w:val="28"/>
        <w:lang w:val="zh-TW" w:eastAsia="zh-TW"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:after="120" w:line="420" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:pPr>
      <w:spacing w:after="120" w:line="420" w:lineRule="auto"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="DFKai-SB" w:hAnsi="DFKai-SB" w:eastAsia="DFKai-SB" w:cs="DFKai-SB"/>
      <w:sz w:val="28"/>
      <w:szCs w:val="28"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="CoverTitle">
    <w:name w:val="Cover Title"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:jc w:val="center"/>
      <w:spacing w:before="4200" w:after="0"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:rFonts w:ascii="DFKai-SB" w:hAnsi="DFKai-SB" w:eastAsia="DFKai-SB" w:cs="DFKai-SB"/>
      <w:sz w:val="28"/>
      <w:szCs w:val="28"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:jc w:val="center"/>
      <w:spacing w:before="120" w:after="220"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:rFonts w:ascii="DFKai-SB" w:hAnsi="DFKai-SB" w:eastAsia="DFKai-SB" w:cs="DFKai-SB"/>
      <w:sz w:val="28"/>
      <w:szCs w:val="28"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="AppendixTitle">
    <w:name w:val="Appendix Title"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:jc w:val="center"/>
      <w:spacing w:before="60" w:after="260"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:rFonts w:ascii="DFKai-SB" w:hAnsi="DFKai-SB" w:eastAsia="DFKai-SB" w:cs="DFKai-SB"/>
      <w:sz w:val="28"/>
      <w:szCs w:val="28"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:spacing w:before="320" w:after="140"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:rFonts w:ascii="DFKai-SB" w:hAnsi="DFKai-SB" w:eastAsia="DFKai-SB" w:cs="DFKai-SB"/>
      <w:sz w:val="28"/>
      <w:szCs w:val="28"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:spacing w:before="220" w:after="100"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:rFonts w:ascii="DFKai-SB" w:hAnsi="DFKai-SB" w:eastAsia="DFKai-SB" w:cs="DFKai-SB"/>
      <w:sz w:val="28"/>
      <w:szCs w:val="28"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="CodeBlock">
    <w:name w:val="Code Block"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr>
      <w:spacing w:before="80" w:after="160"/>
      <w:shd w:val="clear" w:color="auto" w:fill="F4F1EA"/>
      <w:ind w:left="180" w:right="180"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="DFKai-SB" w:hAnsi="DFKai-SB" w:eastAsia="DFKai-SB" w:cs="DFKai-SB"/>
      <w:sz w:val="28"/>
      <w:szCs w:val="28"/>
    </w:rPr>
  </w:style>
</w:styles>`;
}

function buildDocxSettingsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:zoom w:percent="100"/>
  <w:defaultTabStop w:val="720"/>
</w:settings>`;
}

function buildDocxDocumentRelsXml(imageEntries = []) {
  const relationships = imageEntries
    .map((entry, index) => `<Relationship Id="${escapeXml(entry.relationshipId || `rIdImage${index + 1}`)}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${escapeXml(entry.fileName)}"/>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${relationships}
</Relationships>`;
}

function createTextRun(text) {
  return `<w:r><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`;
}

function renderTextRuns(text) {
  const normalized = normalizeText(text);
  if (!normalized) {
    return createTextRun("");
  }
  return normalized
    .split("\n")
    .map((line, index) => `${index > 0 ? "<w:r><w:br/></w:r>" : ""}${createTextRun(line)}`)
    .join("");
}

function buildParagraph(text, options = {}) {
  const style = String(options.style || "").trim();
  const spacingBefore = Number.isFinite(options.spacingBefore) ? `<w:spacing w:before="${options.spacingBefore}"/>` : "";
  const spacingAfter = Number.isFinite(options.spacingAfter) ? `<w:spacing w:after="${options.spacingAfter}"/>` : "";
  const keepNext = options.keepNext ? "<w:keepNext/>" : "";
  const pageBreakBefore = options.pageBreakBefore ? "<w:pageBreakBefore/>" : "";
  const align = String(options.align || "").trim();
  const justification = align ? `<w:jc w:val="${escapeXml(align)}"/>` : "";
  const pPr = style || spacingBefore || spacingAfter || keepNext || pageBreakBefore || justification
    ? `<w:pPr>${style ? `<w:pStyle w:val="${escapeXml(style)}"/>` : ""}${spacingBefore}${spacingAfter}${keepNext}${pageBreakBefore}${justification}</w:pPr>`
    : "";
  return `<w:p>${pPr}${renderTextRuns(text)}</w:p>`;
}

function buildImageParagraph({ relationshipId, widthEmu, heightEmu, name, description, docPrId = 1 }) {
  return `<w:p>
    <w:pPr>
      <w:jc w:val="center"/>
      <w:spacing w:after="120"/>
    </w:pPr>
    <w:r>
      <w:drawing>
        <wp:inline distT="0" distB="0" distL="0" distR="0">
          <wp:extent cx="${widthEmu}" cy="${heightEmu}"/>
          <wp:effectExtent l="0" t="0" r="0" b="0"/>
          <wp:docPr id="${docPrId}" name="${escapeXml(name || "Mermaid Flowchart")}" descr="${escapeXml(description || name || "Mermaid Flowchart")}"/>
          <wp:cNvGraphicFramePr>
            <a:graphicFrameLocks noChangeAspect="1"/>
          </wp:cNvGraphicFramePr>
          <a:graphic>
            <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
              <pic:pic>
                <pic:nvPicPr>
                  <pic:cNvPr id="${docPrId}" name="${escapeXml(name || "Mermaid Flowchart")}"/>
                  <pic:cNvPicPr/>
                </pic:nvPicPr>
                <pic:blipFill>
                  <a:blip r:embed="${escapeXml(relationshipId)}"/>
                  <a:stretch><a:fillRect/></a:stretch>
                </pic:blipFill>
                <pic:spPr>
                  <a:xfrm>
                    <a:off x="0" y="0"/>
                    <a:ext cx="${widthEmu}" cy="${heightEmu}"/>
                  </a:xfrm>
                  <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
                </pic:spPr>
              </pic:pic>
            </a:graphicData>
          </a:graphic>
        </wp:inline>
      </w:drawing>
    </w:r>
  </w:p>`;
}

function buildParagraphsFromText(text, options = {}) {
  const normalized = normalizeText(text);
  if (!normalized) {
    return "";
  }
  return normalized
    .split(/\n{2,}/)
    .map((paragraph) => buildParagraph(paragraph, options))
    .join("");
}

function wrapDiagramText(text, maxUnits = 22) {
  const source = normalizeText(text);
  if (!source) {
    return [""];
  }
  const lines = [];
  let current = "";
  let currentUnits = 0;
  const measureUnit = (char) => (/[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u30ff\uac00-\ud7af]/.test(char) ? 2 : 1);

  for (const char of source) {
    const charUnits = measureUnit(char);
    if (current && currentUnits + charUnits > maxUnits) {
      lines.push(current);
      current = char;
      currentUnits = charUnits;
      continue;
    }
    current += char;
    currentUnits += charUnits;
  }

  if (current) {
    lines.push(current);
  }
  return lines.length ? lines : [source];
}

function parseMermaidFlowNodes(mermaidText) {
  const source = normalizeText(mermaidText);
  if (!source) {
    return [];
  }
  const lines = source
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("%%") && !/^(flowchart|graph)\b/i.test(line));
  const nodes = [];
  const seen = new Set();
  const segmentPattern = /(?:-->|==>|-.->|---|~~~)/g;
  const nodePattern = /^\s*([A-Za-z0-9_]+)\s*(?:\[(.*?)\]|\((.*?)\)|\{(.*?)\}|"(.*?)")?\s*$/;

  for (const line of lines) {
    const segments = line.split(segmentPattern).map((segment) => segment.trim()).filter(Boolean);
    for (const segment of segments) {
      const match = segment.match(nodePattern);
      if (!match) {
        continue;
      }
      const id = String(match[1] || "").trim();
      const label = normalizeText(match[2] || match[3] || match[4] || match[5] || id);
      if (!id || seen.has(id)) {
        continue;
      }
      seen.add(id);
      nodes.push({ id, label });
    }
  }

  return nodes;
}

function buildFallbackMermaidSvg(mermaidText) {
  const nodes = parseMermaidFlowNodes(mermaidText);
  const safeNodes = nodes.length
    ? nodes
    : [
        { id: "A", label: "需求盤點" },
        { id: "B", label: "架構規劃" },
        { id: "C", label: "研發實作" },
        { id: "D", label: "整合測試" },
        { id: "E", label: "導入驗證" },
      ];

  const boxWidth = 940;
  const marginX = 90;
  const topPadding = 54;
  const verticalGap = 34;
  const lineHeight = 34;
  let currentY = topPadding;
  const layout = safeNodes.map((node) => {
    const lines = wrapDiagramText(node.label, 26);
    const height = Math.max(92, 42 + (lines.length * lineHeight));
    const item = {
      ...node,
      lines,
      x: marginX,
      y: currentY,
      width: boxWidth,
      height,
    };
    currentY += height + verticalGap;
    return item;
  });

  const width = 1120;
  const height = Math.max(420, currentY + 40);
  const shapes = layout.map((node, index) => {
    const textBaseY = node.y + 34 + ((node.height - 42 - (node.lines.length * lineHeight)) / 2);
    const textXml = node.lines
      .map((line, lineIndex) => `<text x="${node.x + (node.width / 2)}" y="${textBaseY + (lineIndex * lineHeight)}" text-anchor="middle" font-family="'DFKai-SB','BiauKai','KaiTi TC',serif" font-size="24" font-weight="700" fill="#1f2b25">${escapeXml(line)}</text>`)
      .join("");
    const connector = index < layout.length - 1
      ? `<line x1="${node.x + (node.width / 2)}" y1="${node.y + node.height}" x2="${node.x + (node.width / 2)}" y2="${layout[index + 1].y - 10}" stroke="#7b5c2e" stroke-width="6" marker-end="url(#arrowHead)"/>`
      : "";
    return `
      <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="26" fill="#fffdf8" stroke="#c9b694" stroke-width="4"/>
      ${textXml}
      ${connector}
    `;
  }).join("");

  return {
    svg: `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="diagramBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f7f1e8"/>
      <stop offset="100%" stop-color="#edf3ef"/>
    </linearGradient>
    <marker id="arrowHead" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto-start-reverse">
      <path d="M0,0 L12,6 L0,12 z" fill="#7b5c2e"/>
    </marker>
  </defs>
  <rect width="${width}" height="${height}" rx="28" fill="url(#diagramBg)"/>
  ${shapes}
</svg>`,
    width,
    height,
  };
}

async function svgToPngBytes(svgText) {
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const imageUrl = URL.createObjectURL(svgBlob);
  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("無法載入 Mermaid 流程圖 SVG。"));
      img.src = imageUrl;
    });
    const width = Math.max(1120, image.naturalWidth || image.width || 1120);
    const height = Math.max(420, image.naturalHeight || image.height || 420);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("無法建立流程圖繪圖畫布。");
    }
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    const pngBlob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        reject(new Error("Mermaid 流程圖轉成 PNG 失敗。"));
      }, "image/png");
    });
    return new Uint8Array(await pngBlob.arrayBuffer());
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

async function renderMermaidDiagramAsset(mermaidText) {
  const source = normalizeText(mermaidText);
  if (!source) {
    return null;
  }
  const diagram = buildFallbackMermaidSvg(source);
  const bytes = await svgToPngBytes(diagram.svg);
  const widthEmu = 5486400;
  const heightEmu = Math.round(widthEmu * (diagram.height / Math.max(1, diagram.width)));
  return {
    kind: "mermaid",
    fileName: "mermaid-flowchart.png",
    bytes,
    widthEmu,
    heightEmu,
    name: "產品設計流程圖",
    description: "由 Mermaid 流程圖轉製之產品設計流程圖",
  };
}

function fitImageWithinBounds(width, height, maxWidthEmu, maxHeightEmu) {
  const safeWidth = Math.max(1, Number(width || 1));
  const safeHeight = Math.max(1, Number(height || 1));
  const scale = Math.min(maxWidthEmu / safeWidth, maxHeightEmu / safeHeight);
  return {
    widthEmu: Math.max(1905000, Math.round(safeWidth * scale)),
    heightEmu: Math.max(1524000, Math.round(safeHeight * scale)),
  };
}

function buildSupportImageAssets(supportImages = []) {
  return (Array.isArray(supportImages) ? supportImages : [])
    .slice(0, 8)
    .map((image, index) => {
      const bytes = dataUrlToUint8Array(image.dataUrl);
      const { widthEmu, heightEmu } = fitImageWithinBounds(
        image.width,
        image.height,
        4876800,
        3657600
      );
      return {
        kind: "support",
        fileName: `support-image-${index + 1}.png`,
        bytes,
        widthEmu,
        heightEmu,
        name: normalizeText(image.name, `圖片佐證-${index + 1}`),
        description: `使用者提供之圖片佐證 ${index + 1}`,
      };
    });
}

function buildDocxImageEntries(appendixType, assets = {}) {
  const entries = [];
  let relationshipIndex = 1;
  let docPrId = 1;
  const supportImages = Array.isArray(assets.supportImages) ? assets.supportImages : [];

  if (appendixType === "appendix6" && assets.mermaidImage) {
    entries.push({
      ...assets.mermaidImage,
      relationshipId: `rIdImage${relationshipIndex}`,
      docPrId,
      fileName: `appendix6-${assets.mermaidImage.fileName || "mermaid-flowchart.png"}`,
    });
    relationshipIndex += 1;
    docPrId += 1;
  }

  supportImages.forEach((image, index) => {
    entries.push({
      ...image,
      relationshipId: `rIdImage${relationshipIndex}`,
      docPrId,
      fileName: `${appendixType}-support-image-${index + 1}.png`,
    });
    relationshipIndex += 1;
    docPrId += 1;
  });

  return entries;
}

function buildSupportImageSectionXml(imageEntries = [], title = "圖片佐證資料") {
  if (!Array.isArray(imageEntries) || !imageEntries.length) {
    return "";
  }
  const blocks = [
    buildParagraph(title, { keepNext: true, spacingBefore: 120, spacingAfter: 80 }),
    buildParagraph("以下圖片為使用者提供之結構示意、設計截圖、測試畫面或實體照片，可作為研發過程與自主技術成果之輔助佐證。", { spacingAfter: 120 }),
  ];

  imageEntries.forEach((entry, index) => {
    blocks.push(buildImageParagraph({
      relationshipId: entry.relationshipId,
      widthEmu: entry.widthEmu,
      heightEmu: entry.heightEmu,
      name: entry.name,
      description: entry.description,
      docPrId: entry.docPrId,
    }));
    blocks.push(buildParagraph(`圖${index + 1}：${entry.name}`, { align: "center", spacingAfter: 180 }));
  });

  return blocks.join("");
}

function buildPageBreakParagraph() {
  return "<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>";
}

function buildBulletParagraph(text) {
  return buildParagraph(`• ${normalizeText(text)}`, { spacingAfter: 80 });
}

function buildCoverPageXml(proposal) {
  return [
    buildParagraph(proposal.projectTitle, { style: "CoverTitle", align: "center" }),
    buildPageBreakParagraph(),
  ].join("");
}

function buildAppendixStartXml(title) {
  return buildParagraph(title, { style: "AppendixTitle", keepNext: true, align: "center" });
}

function buildTable(headers, rows, options = {}) {
  const safeHeaders = Array.isArray(headers) ? headers : [];
  const safeRows = Array.isArray(rows) && rows.length ? rows : [safeHeaders.reduce((accumulator, header) => ({ ...accumulator, [header.key]: "待補內容" }), {})];
  const totalWidth = 9026;
  const widths = Array.isArray(options.widths) && options.widths.length === safeHeaders.length
    ? options.widths
    : Array.from({ length: safeHeaders.length }, () => Math.floor(totalWidth / Math.max(1, safeHeaders.length)));

  const rowXml = safeRows
    .map((row) => {
      const cells = safeHeaders.map((header, index) => {
        const cellText = normalizeText(row?.[header.key], "—");
        return `<w:tc>
          <w:tcPr>
            <w:tcW w:w="${widths[index]}" w:type="dxa"/>
            <w:vAlign w:val="top"/>
          </w:tcPr>
          ${buildParagraph(cellText, { spacingAfter: 40 })}
        </w:tc>`;
      }).join("");
      return `<w:tr>${cells}</w:tr>`;
    })
    .join("");

  const headerXml = safeHeaders
    .map((header, index) => `<w:tc>
      <w:tcPr>
        <w:tcW w:w="${widths[index]}" w:type="dxa"/>
        <w:shd w:val="clear" w:color="auto" w:fill="ECE4D4"/>
        <w:vAlign w:val="center"/>
      </w:tcPr>
      <w:p>
        <w:pPr><w:spacing w:after="40"/><w:jc w:val="center"/></w:pPr>
        <w:r>
          <w:rPr>
            <w:b/>
            <w:rFonts w:ascii="DFKai-SB" w:hAnsi="DFKai-SB" w:eastAsia="DFKai-SB" w:cs="DFKai-SB"/>
            <w:sz w:val="28"/>
            <w:szCs w:val="28"/>
          </w:rPr>
          <w:t xml:space="preserve">${escapeXml(header.label)}</w:t>
        </w:r>
      </w:p>
    </w:tc>`)
    .join("");

  return `<w:tbl>
    <w:tblPr>
      <w:tblW w:w="5000" w:type="pct"/>
      <w:tblLayout w:type="fixed"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="8" w:space="0" w:color="BFAF90"/>
        <w:left w:val="single" w:sz="8" w:space="0" w:color="BFAF90"/>
        <w:bottom w:val="single" w:sz="8" w:space="0" w:color="BFAF90"/>
        <w:right w:val="single" w:sz="8" w:space="0" w:color="BFAF90"/>
        <w:insideH w:val="single" w:sz="6" w:space="0" w:color="D7CBB6"/>
        <w:insideV w:val="single" w:sz="6" w:space="0" w:color="D7CBB6"/>
      </w:tblBorders>
      <w:tblCellMar>
        <w:top w:w="90" w:type="dxa"/>
        <w:left w:w="90" w:type="dxa"/>
        <w:bottom w:w="90" w:type="dxa"/>
        <w:right w:w="90" w:type="dxa"/>
      </w:tblCellMar>
    </w:tblPr>
    <w:tblGrid>${widths.map((width) => `<w:gridCol w:w="${width}"/>`).join("")}</w:tblGrid>
    <w:tr>${headerXml}</w:tr>
    ${rowXml}
  </w:tbl>`;
}

function buildWordDocumentXml(content) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" mc:Ignorable="w14 w15 wp14">
  <w:body>
    ${content}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1080" w:bottom="1440" w:left="1080" w:header="720" w:footer="720" w:gutter="0"/>
      <w:cols w:space="720"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

function buildProposalHeaderXml(proposal, appendixLabel) {
  return buildAppendixStartXml(appendixLabel);
}

function buildAppendix6DocumentXml(proposal, assets = {}) {
  const appendix6 = proposal.appendix6;
  const mermaidImage = assets.mermaidImageEntry || null;
  const supportImageEntries = Array.isArray(assets.supportImageEntries) ? assets.supportImageEntries : [];
  const annualBenefitRows = appendix6.outcome.annualBenefitRows.length
    ? appendix6.outcome.annualBenefitRows
    : [
        {
          year: String(appendix6.outcome.salesYear || 2026),
          units: `${appendix6.outcome.estimatedUnits} 台`,
          asp: `${appendix6.outcome.aspUsd} USD`,
          revenue: `${appendix6.outcome.revenueUsd.toLocaleString("en-US")} USD`,
          qualitative: "作為導入年度之初步市場效益與技術成果擴散基礎。",
        },
      ];

  const content = [
    buildCoverPageXml(proposal),
    buildProposalHeaderXml(proposal, "附表6 研究發展計畫重點摘要書"),
    buildParagraph("內容："),
    buildParagraph("壹、計畫基本概述", { style: "Heading1", keepNext: true }),
    buildParagraph("一、研發計畫緣由", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix6.reason.body),
    buildParagraph("產品設計流程圖（Mermaid）", { spacingBefore: 80, spacingAfter: 80 }),
    mermaidImage
      ? buildImageParagraph({
          relationshipId: mermaidImage.relationshipId,
          widthEmu: mermaidImage.widthEmu,
          heightEmu: mermaidImage.heightEmu,
          name: mermaidImage.name,
          description: mermaidImage.description,
          docPrId: mermaidImage.docPrId,
        })
      : buildParagraph(appendix6.reason.mermaid || "flowchart TD\nA[需求盤點] --> B[架構規劃]\nB --> C[研發實作]\nC --> D[整合測試]\nD --> E[導入驗證]", { style: "CodeBlock" }),

    buildParagraph("二、研發時程及各年度預計投入之研發經費", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix6.timeline.body),
    buildTable(
      [
        { key: "period", label: "期間" },
        { key: "phase", label: "階段" },
        { key: "details", label: "主要工作內容" },
        { key: "budget", label: "預計投入經費" },
      ],
      appendix6.timeline.rows,
      { widths: [1500, 1800, 3826, 1900] }
    ),

    buildParagraph("三、研發成果", { style: "Heading2", keepNext: true }),
    buildParagraph("（一）各年度預期效益", { keepNext: true }),
    buildParagraphsFromText(appendix6.outcome.annualBenefitBody),
    buildTable(
      [
        { key: "year", label: "年度" },
        { key: "units", label: "預估銷售量" },
        { key: "asp", label: "ASP" },
        { key: "revenue", label: "預估 Revenue" },
        { key: "qualitative", label: "質化效益" },
      ],
      annualBenefitRows
    ),
    buildParagraph("（二）前一年度之執行績效及成果", { keepNext: true }),
    buildParagraphsFromText(appendix6.outcome.previousYearPerformanceBody),
    buildParagraph("（三）申請年度之執行績效及成果", { keepNext: true }),
    buildParagraphsFromText(appendix6.executionPerformance.body),
    buildTable(
      [
        { key: "goal", label: "開發目標" },
        { key: "metric", label: "達到的技術指標" },
        { key: "futureApplication", label: "未來應用層面" },
      ],
      appendix6.executionPerformance.rows
    ),
    buildParagraph("（四）相關佐證文件", { keepNext: true }),
    buildParagraphsFromText(appendix6.supportingDocuments.body),
    buildTable(
      [
        { key: "proposalNo", label: "提案案號" },
        { key: "applicationDate", label: "申請日期" },
        { key: "caseName", label: "案件名稱" },
        { key: "inventor", label: "發明人" },
        { key: "patentType", label: "專利類型" },
        { key: "status", label: "案件狀態" },
      ],
      appendix6.supportingDocuments.rows,
      { widths: [1200, 1200, 2600, 1200, 1000, 1826] }
    ),
    buildSupportImageSectionXml(supportImageEntries, "圖片佐證資料"),

    buildParagraph("貳、計畫內容", { style: "Heading1", keepNext: true }),
    buildParagraph("一、研發內容及方向", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix6.contentDirections.body),
    buildTable(
      [
        { key: "content", label: "研發內容" },
        { key: "details", label: "對應研發內容的開發細項" },
      ],
      appendix6.contentDirections.rows
    ),

    buildParagraph("二、研發過程", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix6.process.body),
    buildTable(
      [
        { key: "stage", label: "研發階段" },
        { key: "details", label: "內容" },
      ],
      appendix6.process.rows
    ),

    buildParagraph("三、研發項目", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix6.projectItems.body),
    buildTable(
      [
        { key: "item", label: "項目" },
        { key: "content", label: "項目內容" },
      ],
      appendix6.projectItems.rows
    ),

    buildParagraph("四、功能規格", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix6.functionalSpecs.body),
    buildTable(
      [
        { key: "item", label: "項目" },
        { key: "contentPurpose", label: "內容與目的" },
        { key: "codeReference", label: "代碼對照" },
      ],
      appendix6.functionalSpecs.rows
    ),

    buildParagraph("五、技術層次", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix6.technologyLevel.body),
    buildTable(
      [
        { key: "innovationItem", label: "創新技術項目及創新應用項目" },
        { key: "benchmark", label: "領先(國內外)業界指標" },
        { key: "technicalLevel", label: "業界技術層次" },
      ],
      appendix6.technologyLevel.rows
    ),

    buildParagraph("六、創新性", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix6.innovation.body),
    buildTable(
      [
        { key: "aspect", label: "創新面向" },
        { key: "difference", label: "與業界差異" },
        { key: "reviewValue", label: "獨特性與審查重點" },
      ],
      appendix6.innovation.rows
    ),

    buildParagraph("七、可行性或商業性", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix6.feasibility.body),

    buildParagraph("叁、公司技術能力", { style: "Heading1", keepNext: true }),
    buildParagraph("一、公司研發實績", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix6.companyTrackRecord.body),

    buildParagraph("二、執行計畫之研發能力", { style: "Heading2", keepNext: true }),
    appendix6.rdCapabilities.length
      ? appendix6.rdCapabilities.map((item) => buildBulletParagraph(item)).join("")
      : buildParagraph("• 內部研發團隊具備跨領域整合、系統架構、產品驗證與導入能力。"),

    buildParagraph("三、技術來源", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix6.technologySource.body || "內部自行研發"),

    buildParagraph("四、必要性及合理性", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix6.necessity.body),

    buildParagraph("五、國內外同領域領先業者之比較分析", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix6.benchmarkComparison.body),
    buildTable(
      [
        { key: "innovationItem", label: "創新技術項目及創新應用項目" },
        { key: "benchmark", label: "領先(國內外)業界指標" },
        { key: "technicalLevel", label: "業界技術層次" },
      ],
      appendix6.benchmarkComparison.rows
    ),

    buildParagraph("肆、投入研發人員名單", { style: "Heading1", keepNext: true }),
    buildTable(
      [
        { key: "index", label: "項次" },
        { key: "name", label: "姓名" },
        { key: "work", label: "具體工作內容" },
      ],
      appendix6.personnel.rows,
      { widths: [900, 1800, 6326] }
    ),
  ].join("");

  return buildWordDocumentXml(content);
}

function buildAppendix7DocumentXml(proposal, assets = {}) {
  const appendix7 = proposal.appendix7;
  const supportImageEntries = Array.isArray(assets.supportImageEntries) ? assets.supportImageEntries : [];
  const content = [
    buildCoverPageXml(proposal),
    buildProposalHeaderXml(proposal, "附表7 投資抵減計畫書"),
    buildParagraph("壹、研發計畫內容", { style: "Heading1", keepNext: true }),
    buildParagraph("一、研發大綱及方向", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix7.outline.body),

    buildParagraph("二、研發時程", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix7.timeline.body),
    buildTable(
      [
        { key: "period", label: "期間" },
        { key: "phase", label: "階段" },
        { key: "details", label: "主要工作內容" },
      ],
      appendix7.timeline.rows
    ),

    buildParagraph("三、研發階段及研發過程", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix7.stages.body),
    buildTable(
      [
        { key: "stage", label: "研發階段" },
        { key: "details", label: "研發過程" },
        { key: "deliverable", label: "主要產出" },
      ],
      appendix7.stages.rows
    ),

    buildParagraph("四、研發項目", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix7.projects.body),
    buildTable(
      [
        { key: "item", label: "項目" },
        { key: "method", label: "開發技術方法" },
        { key: "difficultySolution", label: "困難 / 解決方案" },
        { key: "exclusiveOutcome", label: "專屬成果範圍" },
        { key: "testFocus", label: "測試重點及數據解析" },
      ],
      appendix7.projects.rows
    ),

    buildParagraph("五、功能規格", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix7.functionalSpecs.body),
    buildTable(
      [
        { key: "item", label: "項目" },
        { key: "contentPurpose", label: "內容與目的" },
        { key: "codeReference", label: "代碼對照" },
      ],
      appendix7.functionalSpecs.rows
    ),

    buildParagraph("六、技術層次", { style: "Heading2", keepNext: true }),
    buildParagraphsFromText(appendix7.technologyLevel.body),
    buildTable(
      [
        { key: "innovationItem", label: "創新技術項目及創新應用項目" },
        { key: "benchmark", label: "領先國內外業界指標" },
        { key: "technicalLevel", label: "業界技術層次" },
      ],
      appendix7.technologyLevel.rows
    ),
    buildSupportImageSectionXml(supportImageEntries, "圖片佐證資料"),

    buildParagraph("貳、投入研發人員名單及其具體工作內容（需與重點摘要書一致）", { style: "Heading1", keepNext: true }),
    buildTable(
      [
        { key: "index", label: "項次" },
        { key: "name", label: "姓名" },
        { key: "work", label: "具體工作內容" },
      ],
      appendix7.personnel.rows,
      { widths: [900, 1800, 6326] }
    ),
  ].join("");

  return buildWordDocumentXml(content);
}

function buildInvestmentProposalDocxBytes(proposal, appendixType, assets = {}) {
  const appendixLabel = appendixType === "appendix7" ? "附表7" : "附表6";
  const documentTitle = `${proposal.documentTitle} ${appendixLabel}`;
  const imageEntries = buildDocxImageEntries(appendixType, assets);
  const mermaidImageEntry = imageEntries.find((entry) => entry.kind === "mermaid") || null;
  const supportImageEntries = imageEntries.filter((entry) => entry.kind === "support");
  const documentXml = appendixType === "appendix7"
    ? buildAppendix7DocumentXml(proposal, { supportImageEntries })
    : buildAppendix6DocumentXml(proposal, { mermaidImageEntry, supportImageEntries });
  const entries = [
    { name: "[Content_Types].xml", data: buildDocxContentTypesXml() },
    { name: "_rels/.rels", data: buildDocxRootRelsXml() },
    { name: "docProps/app.xml", data: buildDocxAppXml() },
    { name: "docProps/core.xml", data: buildDocxCoreXml(documentTitle) },
    { name: "word/document.xml", data: documentXml },
    { name: "word/_rels/document.xml.rels", data: buildDocxDocumentRelsXml(imageEntries) },
    { name: "word/styles.xml", data: buildDocxStylesXml() },
    { name: "word/settings.xml", data: buildDocxSettingsXml() },
    ...imageEntries.map((entry) => ({ name: `word/media/${entry.fileName}`, data: entry.bytes })),
  ];
  return createZipStore(entries);
}

async function loadConfig() {
  const result = await runtimeMessage({ type: "ollama:get-config" });
  if (!result?.ok) {
    throw new Error(result?.error || "無法讀取目前設定。");
  }
  currentConfig = result.config || {};
  renderConfigSummary();
}

async function handleGenerate(event) {
  event.preventDefault();
  const topic = normalizeText(topicNode.value);
  const researchSchedule = normalizeText(scheduleNode.value);
  const researchItems = normalizeLines(itemsNode.value);
  const leadingBenchmark = normalizeLines(benchmarkNode.value);
  const patentNotes = normalizeText(patentNode?.value || "");
  const supportImages = attachedSupportImages.map((image) => ({ ...image }));

  if (!topic || !researchSchedule || !researchItems.length || !leadingBenchmark.length) {
    setStatus("請先完整填寫四個必填欄位。", "error");
    return;
  }

  try {
    ensureModelReady(currentConfig || {});
    const salesUnits = randomSalesUnits();
    const revenueUsd = salesUnits * 100;
    const promptInputs = { topic, researchSchedule, researchItems, leadingBenchmark, patentNotes, supportImages, salesUnits, revenueUsd };
    const model = resolveGenerationModel(currentConfig || {});

    generateButton.disabled = true;
    downloadAppendix6Button.disabled = true;
    downloadAppendix7Button.disabled = true;
    lastGeneratedArtifacts = {
      appendix6: null,
      appendix7: null,
    };
    renderConfigSummary();
    setProgress(6, "正在準備生成工作");
    setStatus("正在生成附表6內容，完成後會接著生成附表7，最後各自封裝成獨立 Word 文件。");

    const appendix6 = await generateSectionJson(buildAppendix6Prompt(promptInputs), model, "appendix6", {
      start: 14,
      repair: 28,
    });
    setProgress(48, "附表6 已完成");
    setStatus("附表6 已完成，正在生成附表7內容。");
    const appendix7 = await generateSectionJson(buildAppendix7Prompt(promptInputs), model, "appendix7", {
      start: 58,
      repair: 72,
    });
    setProgress(88, "附表7 已完成");
    setStatus("附表6 與附表7 都已完成，正在整理結構並封裝 DOCX。");

    const proposal = shapeProposalData(
      { appendix6, appendix7 },
      { topic, researchSchedule, researchItems, leadingBenchmark, patentNotes, supportImages },
      salesUnits,
      revenueUsd
    );
    setProgress(92, "正在繪製 Mermaid 流程圖");
    const mermaidImage = await renderMermaidDiagramAsset(proposal.appendix6.reason.mermaid);
    setProgress(94, "正在整理圖片佐證");
    const supportImageAssets = buildSupportImageAssets(supportImages);
    setProgress(96, "正在封裝 Word 檔案");
    const appendix6Bytes = buildInvestmentProposalDocxBytes(proposal, "appendix6", { mermaidImage, supportImages: supportImageAssets });
    const appendix7Bytes = buildInvestmentProposalDocxBytes(proposal, "appendix7", { supportImages: supportImageAssets });
    const appendix6FileName = buildDocxFilename(topic, "附表6");
    const appendix7FileName = buildDocxFilename(topic, "附表7");

    lastGeneratedArtifacts = {
      appendix6: {
        bytes: appendix6Bytes,
        fileName: appendix6FileName,
      },
      appendix7: {
        bytes: appendix7Bytes,
        fileName: appendix7FileName,
      },
    };
    downloadAppendix6Button.disabled = false;
    downloadAppendix7Button.disabled = false;
    renderConfigSummary();
    downloadBinaryBlob(appendix6FileName, appendix6Bytes, DOCX_MIME_TYPE);
    downloadBinaryBlob(appendix7FileName, appendix7Bytes, DOCX_MIME_TYPE);
    setProgress(100, "附表6 與附表7 已完成");
    setStatus(`已完成並開始下載：${appendix6FileName}、${appendix7FileName}`, "success");
  } catch (error) {
    setProgress(0, "生成未完成");
    setStatus(error instanceof Error ? error.message : String(error || "生成失敗。"), "error");
  } finally {
    generateButton.disabled = false;
  }
}

function handleDownloadAppendix6() {
  const artifact = lastGeneratedArtifacts.appendix6;
  if (!(artifact?.bytes instanceof Uint8Array) || !artifact.bytes.length || !artifact.fileName) {
    setStatus("目前還沒有可重新下載的附表6 DOCX。", "error");
    return;
  }
  downloadBinaryBlob(artifact.fileName, artifact.bytes, DOCX_MIME_TYPE);
  setStatus(`已重新下載：${artifact.fileName}`, "success");
}

function handleDownloadAppendix7() {
  const artifact = lastGeneratedArtifacts.appendix7;
  if (!(artifact?.bytes instanceof Uint8Array) || !artifact.bytes.length || !artifact.fileName) {
    setStatus("目前還沒有可重新下載的附表7 DOCX。", "error");
    return;
  }
  downloadBinaryBlob(artifact.fileName, artifact.bytes, DOCX_MIME_TYPE);
  setStatus(`已重新下載：${artifact.fileName}`, "success");
}

async function handleClearDraft() {
  try {
    await clearSavedDraft();
    resetDraftFields();
    lastGeneratedArtifacts = {
      appendix6: null,
      appendix7: null,
    };
    downloadAppendix6Button.disabled = true;
    downloadAppendix7Button.disabled = true;
    renderConfigSummary();
    setProgress(0, "尚未開始生成");
    setStatus("已清除暫存與表單內容。", "success");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error || "清除暫存失敗。"), "error");
  }
}

async function init() {
  formNode.addEventListener("submit", handleGenerate);
  if (supportImageInputNode) {
    supportImageInputNode.addEventListener("change", (event) => {
      handleSupportImageInputChange(event).catch((error) => {
        setStatus(error instanceof Error ? error.message : String(error || "圖片處理失敗。"), "error");
      });
    });
  }
  if (supportImageGridNode) {
    supportImageGridNode.addEventListener("click", handleSupportImageGridClick);
  }
  formNode.addEventListener("paste", (event) => {
    handleImagePaste(event).catch((error) => {
      setStatus(error instanceof Error ? error.message : String(error || "貼上圖片失敗。"), "error");
    });
  });
  downloadAppendix6Button.addEventListener("click", handleDownloadAppendix6);
  downloadAppendix7Button.addEventListener("click", handleDownloadAppendix7);
  clearDraftButton.addEventListener("click", () => {
    handleClearDraft().catch((error) => {
      setStatus(error instanceof Error ? error.message : String(error || "清除暫存失敗。"), "error");
    });
  });
  try {
    bindDraftAutoSave();
    const restoredDraft = await loadDraft();
    await loadConfig();
    setProgress(0, "尚未開始生成");
    setStatus(restoredDraft ? "準備完成，已恢復上次暫存內容。" : "準備完成。請填入四個必填欄位後開始生成。");
  } catch (error) {
    setProgress(0, "初始化失敗");
    setStatus(error instanceof Error ? error.message : String(error || "初始化失敗。"), "error");
  }
}

init().catch((error) => {
  setStatus(error instanceof Error ? error.message : String(error || "初始化失敗。"), "error");
});
