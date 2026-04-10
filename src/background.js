const DEFAULT_MULTI_PERSPECTIVE_PROFILES = [
  "Summarizer|Extract the key facts, context, and conclusion.",
  "Skeptic|Challenge assumptions, missing evidence, and weak points.",
  "Action Advisor|Recommend practical next steps and decisions.",
].join("\n");
const LOCAL_DB_NAME = "edge-ai-chat-local-db";
const LOCAL_DB_VERSION = 1;
const LOCAL_DB_STORE = "kv";
const WORK_FOLDER_HANDLE_KEY = "work-folder-handle";
const LOCAL_META_KEY = "localWorkFolderMeta";
const LATEST_CHAT_SESSION_KEY = "latestChatSession";
const EXPORT_SEQUENCE_KEY = "chatExportSequence";
const TASKS_STORAGE_KEY = "taskReminderItems";
const GOOGLE_DRIVE_SYNC_META_KEY = "googleDriveSyncMeta";
const GOOGLE_DRIVE_SYNC_DOCUMENTS_KEY = "googleDriveSyncDocuments";
const GOOGLE_DRIVE_SYNC_FILE_NAME = "edge-ai-chat-sync.json";
const GOOGLE_DRIVE_SYNC_SCOPE = "https://www.googleapis.com/auth/drive.appdata";
const GOOGLE_DRIVE_SYNC_VERSION = 1;
const MAX_GOOGLE_DRIVE_SYNC_DOCUMENTS = 50;
const WORK_FOLDER_SKILL_DIR = "skill";
const WORK_FOLDER_TASK_DIR = "task";
const WORK_FOLDER_SYNC_DIR = "sync";
const WORK_FOLDER_STARTERS_FILE = "starter-skills.json";
const WORK_FOLDER_TASKS_FILE = "task-reminders.json";
const TASK_ALARM_PREFIX = "task-reminder:";
const TASK_NOTIFICATION_PREFIX = "task-notification:";
const SUPPORTED_LOCAL_DOCUMENT_EXTENSIONS = new Set(["txt", "md", "markdown", "json", "csv"]);
const DEFAULT_TASK_EXTRACTION_WINDOW_DAYS = 3;
const MAX_TASK_EXTRACTION_WINDOW_DAYS = 7;

const DEFAULT_CONFIG = {
  ollamaUrl: "http://127.0.0.1:11434",
  lmStudioUrl: "http://127.0.0.1:1234",
  lmStudioModel: "",
  lmStudioApiKey: "lm-studio",
  githubApiKey: "",
  geminiApiKey: "",
  geminiModel: "gemini-2.5-flash",
  azureOpenAiEndpoint: "",
  azureOpenAiApiKey: "",
  azureOpenAiDeployment: "",
  azureOpenAiApiVersion: "2024-10-21",
  defaultProvider: "ollama",
  selectedModel: "",
  replyLanguage: "zh-TW",
  taskExtractionWindowDays: DEFAULT_TASK_EXTRACTION_WINDOW_DAYS,
  googleDriveClientId: "",
  googleDriveSyncEnabled: false,
  googleDriveAutoSync: true,
  multiPerspectiveProfiles: DEFAULT_MULTI_PERSPECTIVE_PROFILES,
  customStarters: [],
  recentGithubFiles: [],
  systemPrompt: [
    "You are an Ollama quick assistant inside the user's browser.",
    "Answer using the current page as context when it is relevant.",
    "If the page context is insufficient, say what is missing.",
    "When you mention a URL or file path, format it as a Markdown link.",
    "For external URLs, use [label](https://example.com). For repo or site-relative file paths, use [path](relative/or/absolute/path).",
  ].join("\n"),
};

function openLocalDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(LOCAL_DB_NAME, LOCAL_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(LOCAL_DB_STORE)) {
        db.createObjectStore(LOCAL_DB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB."));
  });
}

async function idbGet(key) {
  const db = await openLocalDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOCAL_DB_STORE, "readonly");
    const store = tx.objectStore(LOCAL_DB_STORE);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Failed to read IndexedDB."));
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error || new Error("IndexedDB transaction failed."));
  });
}

async function idbSet(key, value) {
  const db = await openLocalDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOCAL_DB_STORE, "readwrite");
    const store = tx.objectStore(LOCAL_DB_STORE);
    const request = store.put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error("Failed to write IndexedDB."));
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error || new Error("IndexedDB transaction failed."));
  });
}

async function idbDelete(key) {
  const db = await openLocalDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOCAL_DB_STORE, "readwrite");
    const store = tx.objectStore(LOCAL_DB_STORE);
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error("Failed to delete IndexedDB key."));
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error || new Error("IndexedDB transaction failed."));
  });
}

function sanitizeFileSegment(value, fallback = "chat") {
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

function createStableId(prefix = "item") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeMarkdownText(value) {
  return String(value || "").replace(/\r\n/g, "\n").trim();
}

function stripMarkdownForFilename(value) {
  return String(value || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function shortenFileTitle(value, maxLength = 48) {
  const normalized = stripMarkdownForFilename(value)
    .replace(/[<>:"/\\|?*\u0000-\u001F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return "";
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return normalized.slice(0, maxLength).replace(/[\s.,;:!?-]+$/g, "").trim();
}

function deriveConversationFileTitle(session = {}) {
  const messages = Array.isArray(session?.messages) ? session.messages : [];
  const firstUserMessage = messages.find((message) => String(message?.role || "").toLowerCase() === "user" && normalizeMarkdownText(message?.content));
  const latestAssistantMessage = [...messages]
    .reverse()
    .find((message) => String(message?.role || "").toLowerCase() === "assistant" && normalizeMarkdownText(message?.content));
  const finalPerspective = normalizeMarkdownText(session?.latestPerspectiveRun?.finalContent);
  const candidates = [
    firstUserMessage?.content,
    finalPerspective,
    latestAssistantMessage?.content,
    session?.pageTitle,
  ];

  for (const candidate of candidates) {
    const title = shortenFileTitle(candidate);
    if (title) {
      return title;
    }
  }

  return "chat";
}

async function getNextExportSequence() {
  const { [EXPORT_SEQUENCE_KEY]: current } = await chrome.storage.local.get(EXPORT_SEQUENCE_KEY);
  const nextValue = Number.isFinite(Number(current)) ? Number(current) + 1 : 1;
  await chrome.storage.local.set({ [EXPORT_SEQUENCE_KEY]: nextValue });
  return String(nextValue).padStart(4, "0");
}

function buildChatMarkdown(session = {}) {
  const savedAt = session?.savedAt || new Date().toISOString();
  const pageTitle = String(session?.pageTitle || "Untitled conversation").trim();
  const pageUrl = String(session?.pageUrl || "").trim();
  const selectedModel = String(session?.selectedModel || "").trim();
  const replyLanguage = String(session?.replyLanguage || "").trim();
  const includePageContext = session?.includePageContext !== false ? "Enabled" : "Disabled";
  const messages = Array.isArray(session?.messages) ? session.messages : [];
  const stages = Array.isArray(session?.latestPerspectiveRun?.stages) ? session.latestPerspectiveRun.stages : [];
  const finalPerspective = normalizeMarkdownText(session?.latestPerspectiveRun?.finalContent);

  const lines = [
    `# ${pageTitle}`,
    "",
    `- Saved at: ${savedAt}`,
    `- Page URL: ${pageUrl || "N/A"}`,
    `- Model: ${selectedModel || "N/A"}`,
    `- Reply language: ${replyLanguage || "N/A"}`,
    `- Page context: ${includePageContext}`,
  ];

  if (stages.length || finalPerspective) {
    lines.push("", "## Multi-View Answer");

    stages.forEach((stage, index) => {
      const content = normalizeMarkdownText(stage?.content);
      if (!content) {
        return;
      }
      const label = String(stage?.label || `Stage ${index + 1}`).trim();
      lines.push("", `### ${label}`, "", content);
    });

    if (finalPerspective) {
      lines.push("", "### Final Synthesis", "", finalPerspective);
    }
  }

  lines.push("", "## Conversation");

  if (!messages.length) {
    lines.push("", "_No chat messages saved._");
    return lines.join("\n");
  }

  messages.forEach((message, index) => {
    const role = String(message?.role || "").trim().toLowerCase() === "assistant" ? "Assistant" : "User";
    const content = normalizeMarkdownText(message?.content) || "_Empty message_";
    lines.push("", `### ${index + 1}. ${role}`, "", content);
  });

  return lines.join("\n");
}

async function writeTextFile(handle, filename, contents) {
  const fileHandle = await handle.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}

async function readTextFile(handle, filename) {
  const fileHandle = await handle.getFileHandle(filename);
  const file = await fileHandle.getFile();
  return file.text();
}

async function getWorkFolderHandle() {
  return idbGet(WORK_FOLDER_HANDLE_KEY);
}

function isDirectoryHandleLike(handle) {
  return Boolean(
    handle &&
    (handle.kind === "directory" || typeof handle.kind === "undefined") &&
    typeof handle.getFileHandle === "function" &&
    typeof handle.getDirectoryHandle === "function"
  );
}

function splitRelativePath(path) {
  return String(path || "")
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      if (segment === "." || segment === "..") {
        throw new Error("Invalid local work folder path.");
      }
      return segment;
    });
}

async function resolveDirectoryHandle(rootHandle, path = "") {
  const parts = splitRelativePath(path);
  let currentHandle = rootHandle;
  for (const part of parts) {
    currentHandle = await currentHandle.getDirectoryHandle(part);
  }
  return currentHandle;
}

async function ensureDirectoryHandle(rootHandle, path = "") {
  const parts = splitRelativePath(path);
  let currentHandle = rootHandle;
  for (const part of parts) {
    currentHandle = await currentHandle.getDirectoryHandle(part, { create: true });
  }
  return currentHandle;
}

async function ensureWorkFolderSyncDirectories(rootHandle) {
  await ensureDirectoryHandle(rootHandle, WORK_FOLDER_SKILL_DIR);
  await ensureDirectoryHandle(rootHandle, WORK_FOLDER_TASK_DIR);
  await ensureDirectoryHandle(rootHandle, WORK_FOLDER_SYNC_DIR);
}

function getPathExtension(path) {
  const fileName = String(path || "").split("/").filter(Boolean).pop() || "";
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex <= 0 || dotIndex === fileName.length - 1) {
    return "";
  }
  return fileName.slice(dotIndex + 1).toLowerCase();
}

function isSupportedLocalDocumentPath(path) {
  return SUPPORTED_LOCAL_DOCUMENT_EXTENSIONS.has(getPathExtension(path));
}

async function ensureWorkFolderReadableHandle() {
  const handle = await getWorkFolderHandle();
  if (!handle) {
    throw new Error("Local work folder is not configured.");
  }
  if (!isDirectoryHandleLike(handle)) {
    throw new Error("Local work folder handle is invalid.");
  }
  return handle;
}

async function setWorkFolderHandle(handle) {
  if (isDirectoryHandleLike(handle)) {
    await ensureWorkFolderSyncDirectories(handle);
  }
  await idbSet(WORK_FOLDER_HANDLE_KEY, handle);
  await chrome.storage.local.set({
    [LOCAL_META_KEY]: {
      name: handle?.name || "",
      displayPath: handle?.name ? `/${handle.name}` : "",
      configuredAt: new Date().toISOString(),
    },
  });
}

async function clearWorkFolderHandle() {
  await idbDelete(WORK_FOLDER_HANDLE_KEY);
  await chrome.storage.local.remove(LOCAL_META_KEY);
}

async function getWorkFolderStatus() {
  const { [LOCAL_META_KEY]: meta } = await chrome.storage.local.get(LOCAL_META_KEY);
  const handle = await getWorkFolderHandle();
  let permission = "missing";

  if (isDirectoryHandleLike(handle) && handle?.queryPermission) {
    try {
      permission = await handle.queryPermission({ mode: "readwrite" });
    } catch (_error) {
      permission = "prompt";
    }
  } else if (isDirectoryHandleLike(handle)) {
    permission = "granted";
  }

  return {
    configured: Boolean(handle),
    folderName: meta?.name || handle?.name || "",
    folderPath: meta?.displayPath || (meta?.name ? `/${meta.name}` : handle?.name ? `/${handle.name}` : ""),
    configuredAt: meta?.configuredAt || "",
    permission,
  };
}

async function saveChatSession(session) {
  const payload = {
    ...session,
    savedAt: session?.savedAt || new Date().toISOString(),
  };
  const saveToFolder = session?.saveToFolder === true;
  const requestedFormats = Array.isArray(session?.formats) && session.formats.length ? session.formats : ["md"];

  await chrome.storage.local.set({
    [LATEST_CHAT_SESSION_KEY]: payload,
  });

  if (saveToFolder) {
    await addGoogleDriveDocumentFromSession(payload);
  }

  maybePushWorkFolderSync();
  maybeAutoSyncGoogleDrive();

  if (!saveToFolder) {
    return { savedToFolder: false, reason: "not-requested" };
  }

  const handle = await getWorkFolderHandle();
  if (!handle) {
    return { savedToFolder: false, reason: "not-configured" };
  }
  if (!isDirectoryHandleLike(handle)) {
    return { savedToFolder: false, reason: "invalid-handle", error: "Local work folder handle is invalid." };
  }

  try {
    const sequence = await getNextExportSequence();
    const descriptiveTitle = sanitizeFileSegment(deriveConversationFileTitle(payload), "chat");
    const baseFilename = `${sequence}-${descriptiveTitle}`;
    let jsonFileName = "";
    let markdownFileName = "";

    if (requestedFormats.includes("json")) {
      jsonFileName = `${baseFilename}.json`;
      await writeTextFile(handle, jsonFileName, JSON.stringify(payload, null, 2));
    }
    if (requestedFormats.includes("md")) {
      markdownFileName = `${baseFilename}.md`;
      await writeTextFile(handle, markdownFileName, buildChatMarkdown(payload));
    }

    return {
      savedToFolder: true,
      fileName: markdownFileName || jsonFileName,
      jsonFileName,
      markdownFileName,
      folderName: handle.name || "",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const errorName = error && typeof error === "object" && "name" in error ? String(error.name || "") : "";
    if (errorName === "NotAllowedError" || /permission|denied|not allowed/i.test(message)) {
      return {
        savedToFolder: false,
        reason: "permission-denied",
        error: message,
      };
    }
    if (/getFileHandle is not a function|invalid/i.test(message)) {
      return {
        savedToFolder: false,
        reason: "invalid-handle",
        error: message,
      };
    }
    return {
      savedToFolder: false,
      reason: "write-failed",
      error: message,
    };
  }
}

async function listLocalWorkFolderDirectory(options = {}) {
  try {
    const rootHandle = await ensureWorkFolderReadableHandle();
    const normalizedPath = splitRelativePath(options.path || "").join("/");
    const directoryHandle = await resolveDirectoryHandle(rootHandle, normalizedPath);
    const entries = [];

    for await (const [name, entryHandle] of directoryHandle.entries()) {
      const nextPath = normalizedPath ? `${normalizedPath}/${name}` : name;
      if (entryHandle.kind === "directory") {
        entries.push({ type: "dir", name, path: nextPath });
        continue;
      }

      if (!isSupportedLocalDocumentPath(nextPath)) {
        continue;
      }

      entries.push({ type: "file", name, path: nextPath });
    }

    entries.sort((left, right) => {
      if (left.type !== right.type) {
        return left.type === "dir" ? -1 : 1;
      }
      return left.name.localeCompare(right.name);
    });

    return {
      path: normalizedPath,
      entries,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const errorName = error && typeof error === "object" && "name" in error ? String(error.name || "") : "";
    if (errorName === "NotAllowedError" || /permission|denied|not allowed|invalid/i.test(message)) {
      throw new Error("Local work folder permission is unavailable.");
    }
    throw error;
  }
}

async function readLocalWorkFolderFile(options = {}) {
  try {
    const rootHandle = await ensureWorkFolderReadableHandle();
    const normalizedPath = splitRelativePath(options.path || "").join("/");
    if (!normalizedPath) {
      throw new Error("Local work folder file path is required.");
    }
    if (!isSupportedLocalDocumentPath(normalizedPath)) {
      throw new Error("This local file type is not supported.");
    }

    const parts = splitRelativePath(normalizedPath);
    const fileName = parts.pop();
    const parentHandle = await resolveDirectoryHandle(rootHandle, parts.join("/"));
    const fileHandle = await parentHandle.getFileHandle(fileName);
    const file = await fileHandle.getFile();

    return {
      name: file.name,
      path: normalizedPath,
      text: await file.text(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const errorName = error && typeof error === "object" && "name" in error ? String(error.name || "") : "";
    if (errorName === "NotAllowedError" || /permission|denied|not allowed|invalid/i.test(message)) {
      throw new Error("Local work folder permission is unavailable.");
    }
    throw error;
  }
}

async function getLatestChatSession() {
  const { [LATEST_CHAT_SESSION_KEY]: latestChatSession } = await chrome.storage.local.get(LATEST_CHAT_SESSION_KEY);
  return latestChatSession || null;
}

function normalizeTaskText(value, maxLength = 400) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function normalizeTaskIsoDate(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  const timestamp = Date.parse(raw);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : "";
}

function createTaskId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildTaskAlarmName(taskId) {
  return `${TASK_ALARM_PREFIX}${taskId}`;
}

function getTaskIdFromAlarmName(alarmName) {
  return String(alarmName || "").startsWith(TASK_ALARM_PREFIX) ? String(alarmName).slice(TASK_ALARM_PREFIX.length) : "";
}

function buildTaskNotificationId(taskId) {
  return `${TASK_NOTIFICATION_PREFIX}${taskId}`;
}

function getTaskIdFromNotificationId(notificationId) {
  return String(notificationId || "").startsWith(TASK_NOTIFICATION_PREFIX) ? String(notificationId).slice(TASK_NOTIFICATION_PREFIX.length) : "";
}

function normalizeTaskRecord(task = {}) {
  if (!task || typeof task !== "object") {
    return null;
  }

  const id = normalizeTaskText(task.id || "", 120) || createTaskId();
  const status = String(task.status || "").trim().toLowerCase() === "completed" ? "completed" : "open";
  const dueAt = normalizeTaskIsoDate(task.dueAt || task.due_at_iso || "");
  const reminderAt = normalizeTaskIsoDate(task.reminderAt || task.reminder_at_iso || "");
  const reminderSentAt = normalizeTaskIsoDate(task.reminderSentAt || "");
  const createdAt = normalizeTaskIsoDate(task.createdAt || "") || new Date().toISOString();
  const updatedAt = normalizeTaskIsoDate(task.updatedAt || "") || createdAt;
  const completedAt = status === "completed"
    ? normalizeTaskIsoDate(task.completedAt || "") || updatedAt
    : "";

  return {
    id,
    title: normalizeTaskText(task.title || task.task || "", 180),
    summary: normalizeTaskText(task.summary || task.details || "", 600),
    owner: normalizeTaskText(task.owner || "", 120),
    dueAt,
    dueText: normalizeTaskText(task.dueText || task.due_text || "", 160),
    reminderAt,
    reminderSentAt: reminderAt ? reminderSentAt : "",
    status,
    confidence: normalizeTaskText(task.confidence || "", 40).toLowerCase(),
    evidence: normalizeTaskText(task.evidence || task.sourceMessage || "", 500),
    sourceUrl: normalizeTaskText(task.sourceUrl || "", 1200),
    sourceTitle: normalizeTaskText(task.sourceTitle || "", 240),
    sourceApp: normalizeTaskText(task.sourceApp || "", 120),
    createdAt,
    updatedAt,
    completedAt,
  };
}

function sortTaskRecords(tasks = []) {
  return [...tasks].sort((left, right) => {
    if (left.status !== right.status) {
      return left.status === "open" ? -1 : 1;
    }

    const leftWhen = Date.parse(left.reminderAt || left.dueAt || left.updatedAt || left.createdAt || "") || Number.MAX_SAFE_INTEGER;
    const rightWhen = Date.parse(right.reminderAt || right.dueAt || right.updatedAt || right.createdAt || "") || Number.MAX_SAFE_INTEGER;
    if (leftWhen !== rightWhen) {
      return leftWhen - rightWhen;
    }

    return String(right.updatedAt || "").localeCompare(String(left.updatedAt || ""));
  });
}

async function getTaskRecords() {
  const { [TASKS_STORAGE_KEY]: storedTasks } = await chrome.storage.local.get(TASKS_STORAGE_KEY);
  return sortTaskRecords(
    (Array.isArray(storedTasks) ? storedTasks : [])
      .map((item) => normalizeTaskRecord(item))
      .filter((item) => item?.title)
  );
}

async function saveTaskRecords(tasks) {
  const normalizedTasks = sortTaskRecords(
    (Array.isArray(tasks) ? tasks : [])
      .map((item) => normalizeTaskRecord(item))
      .filter((item) => item?.title)
  );

  await chrome.storage.local.set({
    [TASKS_STORAGE_KEY]: normalizedTasks,
  });

  maybePushWorkFolderSync();
  maybeAutoSyncGoogleDrive();

  return normalizedTasks;
}

async function clearTaskAlarm(taskId) {
  await chrome.alarms.clear(buildTaskAlarmName(taskId));
}

async function scheduleTaskAlarm(task) {
  const normalized = normalizeTaskRecord(task);
  if (!normalized?.id) {
    return false;
  }

  await clearTaskAlarm(normalized.id);

  if (normalized.status === "completed" || !normalized.reminderAt) {
    return false;
  }

  const reminderTimestamp = Date.parse(normalized.reminderAt);
  const sentTimestamp = Date.parse(normalized.reminderSentAt || "");
  if (!Number.isFinite(reminderTimestamp) || (Number.isFinite(sentTimestamp) && sentTimestamp >= reminderTimestamp)) {
    return false;
  }

  chrome.alarms.create(buildTaskAlarmName(normalized.id), {
    when: Math.max(reminderTimestamp, Date.now() + 1000),
  });
  return true;
}

async function restoreTaskAlarms() {
  const tasks = await getTaskRecords();
  for (const task of tasks) {
    await scheduleTaskAlarm(task);
  }
}

function buildTaskNotificationMessage(task) {
  const parts = [];
  if (task.owner) {
    parts.push(`Owner: ${task.owner}`);
  }
  if (task.dueAt) {
    parts.push(`Due: ${new Date(task.dueAt).toLocaleString()}`);
  } else if (task.dueText) {
    parts.push(`Due: ${task.dueText}`);
  }
  if (task.sourceTitle) {
    parts.push(task.sourceTitle);
  } else if (task.sourceApp) {
    parts.push(task.sourceApp);
  }

  return parts.join(" • ").slice(0, 240) || "Time to follow up on this chat task.";
}

async function upsertTaskRecord(taskInput = {}) {
  const normalizedInput = normalizeTaskRecord(taskInput);
  if (!normalizedInput?.title) {
    throw new Error("Task title is required.");
  }

  const tasks = await getTaskRecords();
  const index = tasks.findIndex((item) => item.id === normalizedInput.id);
  const existing = index >= 0 ? tasks[index] : null;
  const nowIso = new Date().toISOString();
  const reminderChanged = !existing || existing.reminderAt !== normalizedInput.reminderAt;
  const merged = normalizeTaskRecord({
    ...existing,
    ...normalizedInput,
    id: existing?.id || normalizedInput.id || createTaskId(),
    createdAt: existing?.createdAt || normalizedInput.createdAt || nowIso,
    updatedAt: nowIso,
    completedAt:
      normalizedInput.status === "completed"
        ? existing?.completedAt || normalizedInput.completedAt || nowIso
        : "",
    reminderSentAt: reminderChanged ? "" : normalizedInput.reminderSentAt || existing?.reminderSentAt || "",
  });

  if (!merged?.title) {
    throw new Error("Task title is required.");
  }

  const nextTasks = [...tasks];
  if (index >= 0) {
    nextTasks[index] = merged;
  } else {
    nextTasks.push(merged);
  }

  const savedTasks = await saveTaskRecords(nextTasks);
  await scheduleTaskAlarm(merged);

  return {
    task: savedTasks.find((item) => item.id === merged.id) || merged,
    tasks: savedTasks,
  };
}

async function deleteTaskRecord(taskId) {
  const normalizedTaskId = normalizeTaskText(taskId || "", 120);
  if (!normalizedTaskId) {
    throw new Error("Task id is required.");
  }

  const tasks = await getTaskRecords();
  const nextTasks = tasks.filter((item) => item.id !== taskId && normalizeTaskText(item.id || "", 120) !== normalizedTaskId);
  await saveTaskRecords(nextTasks);
  await clearTaskAlarm(normalizedTaskId);
  return {
    deletedId: normalizedTaskId,
    deleted: nextTasks.length !== tasks.length,
    tasks: nextTasks,
  };
}

async function getConfig() {
  const config = await chrome.storage.sync.get(DEFAULT_CONFIG);
  const merged = { ...DEFAULT_CONFIG, ...config };
  return {
    ...merged,
    taskExtractionWindowDays: normalizeTaskExtractionWindowDays(merged.taskExtractionWindowDays),
  };
}

async function setConfig(nextConfig) {
  const current = await getConfig();
  const merged = {
    ...current,
    ...nextConfig,
    taskExtractionWindowDays: normalizeTaskExtractionWindowDays(nextConfig?.taskExtractionWindowDays ?? current.taskExtractionWindowDays),
  };
  await chrome.storage.sync.set(merged);
  maybePushWorkFolderSync();
  maybeAutoSyncGoogleDrive();
  return merged;
}

function normalizeTaskExtractionWindowDays(value) {
  const parsed = Number.parseInt(String(value ?? DEFAULT_TASK_EXTRACTION_WINDOW_DAYS), 10);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_TASK_EXTRACTION_WINDOW_DAYS;
  }
  return Math.min(Math.max(parsed, 1), MAX_TASK_EXTRACTION_WINDOW_DAYS);
}

function sanitizeGoogleDriveClientId(value) {
  return String(value || "").trim();
}

function getGoogleDriveRedirectUrl() {
  if (!chrome.identity?.getRedirectURL) {
    throw new Error("Chrome identity API is not available.");
  }
  return chrome.identity.getRedirectURL("google-drive-sync");
}

async function getGoogleDriveSyncMeta() {
  const { [GOOGLE_DRIVE_SYNC_META_KEY]: meta } = await chrome.storage.local.get(GOOGLE_DRIVE_SYNC_META_KEY);
  return meta && typeof meta === "object" ? meta : {};
}

async function setGoogleDriveSyncMeta(patch = {}) {
  const current = await getGoogleDriveSyncMeta();
  const next = {
    ...current,
    ...patch,
  };
  await chrome.storage.local.set({ [GOOGLE_DRIVE_SYNC_META_KEY]: next });
  return next;
}

async function clearGoogleDriveSyncAuth() {
  const meta = await getGoogleDriveSyncMeta();
  if (meta.accessToken && chrome.identity?.removeCachedAuthToken) {
    try {
      await chrome.identity.removeCachedAuthToken({ token: meta.accessToken });
    } catch (_error) {
      // Token cache cleanup is best effort.
    }
  }
  await chrome.storage.local.set({
    [GOOGLE_DRIVE_SYNC_META_KEY]: {
      fileId: meta.fileId || "",
      lastSyncAt: meta.lastSyncAt || "",
      lastError: "",
      tokenExpiresAt: 0,
      accessToken: "",
    },
  });
}

function parseOAuthFragment(url) {
  const parsed = new URL(String(url || ""));
  const fragment = new URLSearchParams(parsed.hash.replace(/^#/, ""));
  const error = fragment.get("error");
  if (error) {
    throw new Error(`Google authorization failed: ${error}`);
  }
  const accessToken = fragment.get("access_token") || "";
  if (!accessToken) {
    throw new Error("Google authorization did not return an access token.");
  }
  const expiresIn = Number.parseInt(fragment.get("expires_in") || "3600", 10);
  return {
    accessToken,
    tokenExpiresAt: Date.now() + Math.max(Number.isFinite(expiresIn) ? expiresIn : 3600, 60) * 1000,
  };
}

async function authorizeGoogleDrive(interactive = false) {
  const config = await getConfig();
  const clientId = sanitizeGoogleDriveClientId(config.googleDriveClientId);
  if (!clientId) {
    throw new Error("Google Drive OAuth Client ID is required.");
  }

  const meta = await getGoogleDriveSyncMeta();
  if (!interactive && meta.accessToken && Number(meta.tokenExpiresAt || 0) > Date.now() + 60000) {
    return meta.accessToken;
  }

  if (!chrome.identity?.launchWebAuthFlow) {
    throw new Error("Chrome identity API is not available.");
  }

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "token");
  authUrl.searchParams.set("redirect_uri", getGoogleDriveRedirectUrl());
  authUrl.searchParams.set("scope", GOOGLE_DRIVE_SYNC_SCOPE);
  authUrl.searchParams.set("prompt", interactive ? "consent" : "none");

  const redirectUrl = await chrome.identity.launchWebAuthFlow({
    url: authUrl.toString(),
    interactive,
  });
  const token = parseOAuthFragment(redirectUrl);
  await setGoogleDriveSyncMeta({
    ...token,
    lastError: "",
  });
  return token.accessToken;
}

async function getGoogleDriveAuthHeader(interactive = false) {
  return {
    Authorization: `Bearer ${await authorizeGoogleDrive(interactive)}`,
  };
}

async function googleDriveFetch(url, init = {}, interactive = false) {
  const headers = {
    ...(init.headers || {}),
    ...(await getGoogleDriveAuthHeader(interactive)),
  };
  const response = await fetch(url, { ...init, headers });
  if (response.status === 401) {
    await clearGoogleDriveSyncAuth();
    const retryHeaders = {
      ...(init.headers || {}),
      ...(await getGoogleDriveAuthHeader(interactive)),
    };
    return fetch(url, { ...init, headers: retryHeaders });
  }
  return response;
}

async function readGoogleDriveJsonResponse(response) {
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Google Drive HTTP ${response.status}: ${text || response.statusText}`);
  }
  return text ? JSON.parse(text) : null;
}

async function findGoogleDriveSyncFile(interactive = false) {
  const meta = await getGoogleDriveSyncMeta();
  if (meta.fileId) {
    return meta.fileId;
  }

  const url = new URL("https://www.googleapis.com/drive/v3/files");
  url.searchParams.set("spaces", "appDataFolder");
  url.searchParams.set("fields", "files(id,name,modifiedTime)");
  url.searchParams.set("q", `name='${GOOGLE_DRIVE_SYNC_FILE_NAME.replaceAll("'", "\\'")}' and 'appDataFolder' in parents and trashed=false`);

  const response = await googleDriveFetch(url.toString(), { method: "GET" }, interactive);
  const payload = await readGoogleDriveJsonResponse(response);
  const fileId = Array.isArray(payload?.files) && payload.files[0]?.id ? payload.files[0].id : "";
  if (fileId) {
    await setGoogleDriveSyncMeta({ fileId });
  }
  return fileId;
}

function buildMultipartBody(metadata, content) {
  const boundary = `edge-ai-chat-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const body = [
    `--${boundary}`,
    "Content-Type: application/json; charset=UTF-8",
    "",
    JSON.stringify(metadata),
    `--${boundary}`,
    "Content-Type: application/json; charset=UTF-8",
    "",
    JSON.stringify(content, null, 2),
    `--${boundary}--`,
    "",
  ].join("\r\n");
  return {
    body,
    contentType: `multipart/related; boundary=${boundary}`,
  };
}

async function uploadGoogleDriveSyncPayload(payload, interactive = false) {
  const existingFileId = await findGoogleDriveSyncFile(interactive);
  const metadata = existingFileId
    ? { name: GOOGLE_DRIVE_SYNC_FILE_NAME, mimeType: "application/json" }
    : { name: GOOGLE_DRIVE_SYNC_FILE_NAME, mimeType: "application/json", parents: ["appDataFolder"] };
  const multipart = buildMultipartBody(metadata, payload);
  const url = existingFileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(existingFileId)}?uploadType=multipart&fields=id,name,modifiedTime`
    : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime";
  const response = await googleDriveFetch(
    url,
    {
      method: existingFileId ? "PATCH" : "POST",
      headers: {
        "Content-Type": multipart.contentType,
      },
      body: multipart.body,
    },
    interactive
  );
  const result = await readGoogleDriveJsonResponse(response);
  await setGoogleDriveSyncMeta({
    fileId: result?.id || existingFileId || "",
    lastSyncAt: new Date().toISOString(),
    lastError: "",
  });
  return result;
}

async function downloadGoogleDriveSyncPayload(interactive = false) {
  const fileId = await findGoogleDriveSyncFile(interactive);
  if (!fileId) {
    return null;
  }
  const response = await googleDriveFetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`,
    { method: "GET" },
    interactive
  );
  return readGoogleDriveJsonResponse(response);
}

async function getGoogleDriveDocuments() {
  const { [GOOGLE_DRIVE_SYNC_DOCUMENTS_KEY]: documents } = await chrome.storage.local.get(GOOGLE_DRIVE_SYNC_DOCUMENTS_KEY);
  return Array.isArray(documents) ? documents : [];
}

async function saveGoogleDriveDocuments(documents) {
  const normalized = (Array.isArray(documents) ? documents : [])
    .filter((item) => item && typeof item === "object")
    .sort((left, right) => String(right.savedAt || "").localeCompare(String(left.savedAt || "")))
    .slice(0, MAX_GOOGLE_DRIVE_SYNC_DOCUMENTS);
  await chrome.storage.local.set({ [GOOGLE_DRIVE_SYNC_DOCUMENTS_KEY]: normalized });
  return normalized;
}

async function addGoogleDriveDocumentFromSession(session = {}) {
  const savedAt = session?.savedAt || new Date().toISOString();
  const fileName = `${timestampForFile(new Date(savedAt))}-${sanitizeFileSegment(deriveConversationFileTitle(session), "chat")}.md`;
  const document = {
    id: createStableId("doc"),
    fileName,
    savedAt,
    pageTitle: String(session?.pageTitle || "Untitled conversation"),
    pageUrl: String(session?.pageUrl || ""),
    markdown: buildChatMarkdown(session),
    session,
  };
  const documents = await getGoogleDriveDocuments();
  await saveGoogleDriveDocuments([document, ...documents]);
  return document;
}

async function buildGoogleDriveSyncPayload() {
  const config = await getConfig();
  const latestChatSession = await getLatestChatSession();
  return {
    version: GOOGLE_DRIVE_SYNC_VERSION,
    updatedAt: new Date().toISOString(),
    customStarters: Array.isArray(config.customStarters) ? config.customStarters : [],
    tasks: await getTaskRecords(),
    latestChatSession,
    documents: await getGoogleDriveDocuments(),
  };
}

function mergeById(localItems, remoteItems, getTimestamp) {
  const merged = new Map();
  for (const item of [...(Array.isArray(localItems) ? localItems : []), ...(Array.isArray(remoteItems) ? remoteItems : [])]) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const id = String(item.id || "").trim();
    if (!id) {
      continue;
    }
    const existing = merged.get(id);
    const itemTime = Date.parse(getTimestamp(item) || "") || 0;
    const existingTime = Date.parse(getTimestamp(existing) || "") || 0;
    if (!existing || itemTime >= existingTime) {
      merged.set(id, item);
    }
  }
  return Array.from(merged.values());
}

function chooseLatestByTime(localItem, remoteItem, field) {
  const localTime = Date.parse(localItem?.[field] || "") || 0;
  const remoteTime = Date.parse(remoteItem?.[field] || "") || 0;
  return remoteTime > localTime ? remoteItem : localItem;
}

async function applyGoogleDriveSyncPayload(remotePayload = {}) {
  const config = await getConfig();
  const mergedStarters = mergeById(config.customStarters, remotePayload.customStarters, (item) => item.updatedAt || item.id);
  await chrome.storage.sync.set({
    ...config,
    customStarters: mergedStarters,
  });

  const mergedTasks = sortTaskRecords(mergeById(await getTaskRecords(), remotePayload.tasks, (item) => item.updatedAt || item.createdAt));
  await chrome.storage.local.set({ [TASKS_STORAGE_KEY]: mergedTasks });
  await restoreTaskAlarms();

  const localLatestSession = await getLatestChatSession();
  const nextLatestSession = chooseLatestByTime(localLatestSession, remotePayload.latestChatSession, "savedAt");
  if (nextLatestSession) {
    await chrome.storage.local.set({ [LATEST_CHAT_SESSION_KEY]: nextLatestSession });
  }

  const mergedDocuments = mergeById(await getGoogleDriveDocuments(), remotePayload.documents, (item) => item.savedAt);
  await saveGoogleDriveDocuments(mergedDocuments);

  return buildGoogleDriveSyncPayload();
}

async function getWritableWorkFolderHandle() {
  const handle = await getWorkFolderHandle();
  if (!handle) {
    throw new Error("Local work folder is not configured.");
  }
  if (!isDirectoryHandleLike(handle)) {
    throw new Error("Local work folder handle is invalid.");
  }
  await ensureWorkFolderSyncDirectories(handle);
  return handle;
}

async function writeWorkFolderJson(path, fileName, data) {
  const rootHandle = await getWritableWorkFolderHandle();
  const directoryHandle = await ensureDirectoryHandle(rootHandle, path);
  await writeTextFile(directoryHandle, fileName, JSON.stringify(data, null, 2));
}

async function readWorkFolderJson(path, fileName) {
  const rootHandle = await getWritableWorkFolderHandle();
  const directoryHandle = await resolveDirectoryHandle(rootHandle, path);
  return JSON.parse(await readTextFile(directoryHandle, fileName));
}

async function writeWorkFolderStarters(starters) {
  await writeWorkFolderJson(WORK_FOLDER_SKILL_DIR, WORK_FOLDER_STARTERS_FILE, {
    version: GOOGLE_DRIVE_SYNC_VERSION,
    updatedAt: new Date().toISOString(),
    customStarters: Array.isArray(starters) ? starters : [],
  });
}

async function writeWorkFolderTasks(tasks) {
  await writeWorkFolderJson(WORK_FOLDER_TASK_DIR, WORK_FOLDER_TASKS_FILE, {
    version: GOOGLE_DRIVE_SYNC_VERSION,
    updatedAt: new Date().toISOString(),
    tasks: Array.isArray(tasks) ? tasks : [],
  });
}

async function writeWorkFolderSyncPayload(payload) {
  await writeWorkFolderJson(WORK_FOLDER_SYNC_DIR, GOOGLE_DRIVE_SYNC_FILE_NAME, payload);
}

async function pushWorkFolderSync() {
  const payload = await buildGoogleDriveSyncPayload();
  await writeWorkFolderSyncPayload(payload);
  await writeWorkFolderStarters(payload.customStarters);
  await writeWorkFolderTasks(payload.tasks);
  return {
    pushedAt: payload.updatedAt,
    payload,
  };
}

async function pullWorkFolderSync() {
  let payload = null;

  try {
    payload = await readWorkFolderJson(WORK_FOLDER_SYNC_DIR, GOOGLE_DRIVE_SYNC_FILE_NAME);
  } catch (_error) {
    const [startersPayload, tasksPayload] = await Promise.all([
      readWorkFolderJson(WORK_FOLDER_SKILL_DIR, WORK_FOLDER_STARTERS_FILE).catch(() => null),
      readWorkFolderJson(WORK_FOLDER_TASK_DIR, WORK_FOLDER_TASKS_FILE).catch(() => null),
    ]);
    payload = {
      version: GOOGLE_DRIVE_SYNC_VERSION,
      updatedAt: new Date().toISOString(),
      customStarters: Array.isArray(startersPayload?.customStarters) ? startersPayload.customStarters : [],
      tasks: Array.isArray(tasksPayload?.tasks) ? tasksPayload.tasks : [],
      latestChatSession: null,
      documents: [],
    };
  }

  const mergedPayload = await applyGoogleDriveSyncPayload(payload || {});
  await writeWorkFolderSyncPayload(mergedPayload);
  await writeWorkFolderStarters(mergedPayload.customStarters);
  await writeWorkFolderTasks(mergedPayload.tasks);
  return {
    pulledAt: new Date().toISOString(),
    payload: mergedPayload,
  };
}

async function maybePushWorkFolderSync() {
  try {
    const handle = await getWorkFolderHandle();
    if (!handle || !isDirectoryHandleLike(handle)) {
      return;
    }
    await pushWorkFolderSync();
  } catch (error) {
    console.warn("[Edge AI Chat] Failed to sync local work folder", error);
  }
}

async function syncGoogleDriveNow(direction = "push", interactive = false) {
  const config = await getConfig();
  if (!config.googleDriveSyncEnabled && direction !== "status") {
    throw new Error("Google Drive sync is disabled.");
  }

  if (direction === "pull") {
    const remote = await downloadGoogleDriveSyncPayload(interactive);
    if (!remote) {
      const payload = await buildGoogleDriveSyncPayload();
      await uploadGoogleDriveSyncPayload(payload, interactive);
      return { direction: "push", created: true, payload };
    }
    const payload = await applyGoogleDriveSyncPayload(remote);
    await uploadGoogleDriveSyncPayload(payload, interactive);
    return { direction: "pull", payload };
  }

  const payload = await buildGoogleDriveSyncPayload();
  await uploadGoogleDriveSyncPayload(payload, interactive);
  return { direction: "push", payload };
}

async function maybeAutoSyncGoogleDrive() {
  try {
    const config = await getConfig();
    if (!config.googleDriveSyncEnabled || !config.googleDriveAutoSync) {
      return;
    }
    await syncGoogleDriveNow("push", false);
  } catch (error) {
    await setGoogleDriveSyncMeta({
      lastError: error instanceof Error ? error.message : String(error),
    });
  }
}

async function getGoogleDriveSyncStatus() {
  const config = await getConfig();
  const meta = await getGoogleDriveSyncMeta();
  return {
    enabled: Boolean(config.googleDriveSyncEnabled),
    autoSync: config.googleDriveAutoSync !== false,
    hasClientId: Boolean(sanitizeGoogleDriveClientId(config.googleDriveClientId)),
    connected: Boolean(meta.accessToken && Number(meta.tokenExpiresAt || 0) > Date.now()),
    redirectUrl: chrome.identity?.getRedirectURL ? getGoogleDriveRedirectUrl() : "",
    lastSyncAt: meta.lastSyncAt || "",
    lastError: meta.lastError || "",
    fileId: meta.fileId || "",
  };
}

async function reconcileSelectedModel(config, models) {
  const availableNames = new Set(models.map((model) => model.name).filter(Boolean));
  const hasSelectedModel = Boolean(config.selectedModel);
  const selectedModelStillExists = hasSelectedModel && availableNames.has(config.selectedModel);

  if (selectedModelStillExists) {
    return config;
  }

  if (models.length === 1 && models[0]?.name) {
    return setConfig({ selectedModel: models[0].name });
  }

  if (hasSelectedModel && !selectedModelStillExists) {
    return setConfig({ selectedModel: "" });
  }

  return config;
}

function normalizeBaseUrl(url) {
  return (url || "").trim().replace(/\/+$/, "");
}

async function fetchJson(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }

  return response.json();
}

async function fetchText(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }

  return response.text();
}

function getGithubRequestHeaders(token, accept = "application/vnd.github+json") {
  const headers = {
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function fetchGithubPages(urlFactory, headers, maxPages = 10) {
  const items = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const url = urlFactory(page);
    const payload = await fetchJson(url.toString(), { headers });
    const pageItems = Array.isArray(payload) ? payload : [];
    items.push(...pageItems);

    if (pageItems.length < 100) {
      break;
    }
  }

  return items;
}

async function fetchGithubFile({ owner, repo, path, ref, token }) {
  const normalizedOwner = String(owner || "").trim();
  const normalizedRepo = String(repo || "").trim();
  const normalizedPath = String(path || "").replace(/^\/+/, "").trim();
  const normalizedRef = String(ref || "").trim();

  if (!normalizedOwner || !normalizedRepo || !normalizedPath) {
    throw new Error("GitHub file request is missing owner, repo, or path.");
  }

  const config = await getConfig();
  const githubToken = String(token || config.githubApiKey || "").trim();
  const encodedPath = normalizedPath
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const url = new URL(`https://api.github.com/repos/${encodeURIComponent(normalizedOwner)}/${encodeURIComponent(normalizedRepo)}/contents/${encodedPath}`);
  if (normalizedRef) {
    url.searchParams.set("ref", normalizedRef);
  }

  const content = await fetchText(url.toString(), {
    headers: getGithubRequestHeaders(githubToken, "application/vnd.github.raw"),
  });
  return {
    owner: normalizedOwner,
    repo: normalizedRepo,
    path: normalizedPath,
    ref: normalizedRef,
    content,
  };
}

async function listGithubDirectory({ owner, repo, path, ref, token }) {
  const normalizedOwner = String(owner || "").trim();
  const normalizedRepo = String(repo || "").trim();
  const normalizedPath = String(path || "").replace(/^\/+|\/+$/g, "").trim();
  const normalizedRef = String(ref || "").trim();

  if (!normalizedOwner || !normalizedRepo) {
    throw new Error("GitHub directory request is missing owner or repo.");
  }

  const config = await getConfig();
  const githubToken = String(token || config.githubApiKey || "").trim();
  const suffix = normalizedPath
    ? `/${normalizedPath
        .split("/")
        .filter(Boolean)
        .map((segment) => encodeURIComponent(segment))
        .join("/")}`
    : "";
  const url = new URL(`https://api.github.com/repos/${encodeURIComponent(normalizedOwner)}/${encodeURIComponent(normalizedRepo)}/contents${suffix}`);
  if (normalizedRef) {
    url.searchParams.set("ref", normalizedRef);
  }

  const payload = await fetchJson(url.toString(), {
    headers: getGithubRequestHeaders(githubToken),
  });

  const entries = Array.isArray(payload) ? payload : [payload];
  return {
    owner: normalizedOwner,
    repo: normalizedRepo,
    path: normalizedPath,
    ref: normalizedRef,
    entries: entries
      .map((entry) => ({
        name: entry.name || "",
        path: entry.path || "",
        type: entry.type || "",
        size: entry.size || 0,
      }))
      .sort((left, right) => {
        if (left.type === right.type) {
          return left.name.localeCompare(right.name);
        }
        return left.type === "dir" ? -1 : 1;
      }),
  };
}

async function fetchGithubReadme({ owner, repo, ref, token }) {
  const normalizedOwner = String(owner || "").trim();
  const normalizedRepo = String(repo || "").trim();
  const normalizedRef = String(ref || "").trim();

  if (!normalizedOwner || !normalizedRepo) {
    throw new Error("GitHub README request is missing owner or repo.");
  }

  const config = await getConfig();
  const githubToken = String(token || config.githubApiKey || "").trim();
  const url = new URL(`https://api.github.com/repos/${encodeURIComponent(normalizedOwner)}/${encodeURIComponent(normalizedRepo)}/readme`);
  if (normalizedRef) {
    url.searchParams.set("ref", normalizedRef);
  }

  const content = await fetchText(url.toString(), {
    headers: getGithubRequestHeaders(githubToken, "application/vnd.github.raw"),
  });

  return {
    owner: normalizedOwner,
    repo: normalizedRepo,
    ref: normalizedRef,
    content,
  };
}

async function listGithubRepositories({ query, token }) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  const config = await getConfig();
  const githubToken = String(token || config.githubApiKey || "").trim();
  const headers = getGithubRequestHeaders(githubToken);
  const items = [];
  const seenRepoIds = new Set();
  const warnings = [];
  let userRepos = [];

  try {
    userRepos = await fetchGithubPages((page) => {
      const url = new URL("https://api.github.com/user/repos");
      url.searchParams.set("sort", "updated");
      url.searchParams.set("per_page", "100");
      url.searchParams.set("page", String(page));
      url.searchParams.set("affiliation", "owner,collaborator,organization_member");
      return url;
    }, headers);
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : String(error));
  }

  userRepos.forEach((repo) => {
    if (seenRepoIds.has(repo.id)) {
      return;
    }
    seenRepoIds.add(repo.id);
    items.push(repo);
  });

  let orgs = [];
  try {
    orgs = await fetchGithubPages((page) => {
      const url = new URL("https://api.github.com/user/orgs");
      url.searchParams.set("per_page", "100");
      url.searchParams.set("page", String(page));
      return url;
    }, headers, 5);
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : String(error));
  }

  for (const org of orgs) {
    const orgLogin = String(org?.login || "").trim();
    if (!orgLogin) {
      continue;
    }

    let orgRepos = [];
    try {
      orgRepos = await fetchGithubPages((page) => {
        const url = new URL(`https://api.github.com/orgs/${encodeURIComponent(orgLogin)}/repos`);
        url.searchParams.set("type", "all");
        url.searchParams.set("sort", "updated");
        url.searchParams.set("per_page", "100");
        url.searchParams.set("page", String(page));
        return url;
      }, headers);
    } catch (error) {
      warnings.push(`${orgLogin}: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }

    orgRepos.forEach((repo) => {
      if (seenRepoIds.has(repo.id)) {
        return;
      }
      seenRepoIds.add(repo.id);
      items.push(repo);
    });
  }

  return {
    repositories: items
      .map((repo) => ({
        id: repo.id,
        fullName: repo.full_name || "",
        owner: repo.owner?.login || "",
        name: repo.name || "",
        private: Boolean(repo.private),
        defaultBranch: repo.default_branch || "",
      }))
      .filter((repo) => !normalizedQuery || repo.fullName.toLowerCase().includes(normalizedQuery)),
    warnings,
  };
}

async function fetchGithubRepository({ owner, repo, token }) {
  const normalizedOwner = String(owner || "").trim();
  const normalizedRepo = String(repo || "").trim();

  if (!normalizedOwner || !normalizedRepo) {
    throw new Error("GitHub repository request is missing owner or repo.");
  }

  const config = await getConfig();
  const githubToken = String(token || config.githubApiKey || "").trim();
  const url = new URL(`https://api.github.com/repos/${encodeURIComponent(normalizedOwner)}/${encodeURIComponent(normalizedRepo)}`);
  const payload = await fetchJson(url.toString(), {
    headers: getGithubRequestHeaders(githubToken),
  });

  return {
    owner: normalizedOwner,
    repo: normalizedRepo,
    fullName: payload.full_name || `${normalizedOwner}/${normalizedRepo}`,
    defaultBranch: payload.default_branch || "",
    private: Boolean(payload.private),
  };
}

function getCommonsImageMimeRank(value) {
  const mime = String(value || "").toLowerCase();
  if (mime === "image/jpeg" || mime === "image/png" || mime === "image/webp") {
    return 0;
  }
  if (mime === "image/gif") {
    return 1;
  }
  if (mime === "image/svg+xml") {
    return 2;
  }
  return 3;
}

async function searchCommonsImages({ query, limit = 6 } = {}) {
  const normalizedQuery = String(query || "").trim();
  const normalizedLimit = Math.max(1, Math.min(Number.parseInt(String(limit), 10) || 6, 8));

  if (!normalizedQuery) {
    throw new Error("Commons image search query is missing.");
  }

  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", normalizedQuery);
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", String(normalizedLimit));
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|mime|size");
  url.searchParams.set("iiurlwidth", "1600");

  const payload = await fetchJson(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  const results = Object.values(payload?.query?.pages || {})
    .map((page) => {
      const imageInfo = Array.isArray(page?.imageinfo) ? page.imageinfo[0] || null : null;
      const originalUrl = String(imageInfo?.url || "").trim();
      const thumbUrl = String(imageInfo?.thumburl || "").trim();
      if (!originalUrl && !thumbUrl) {
        return null;
      }

      return {
        title: String(page?.title || "").replace(/^File:/i, "").trim(),
        descriptionUrl: String(imageInfo?.descriptionurl || "").trim(),
        url: originalUrl,
        thumbUrl,
        mime: String(imageInfo?.mime || "").trim(),
        width: Number(imageInfo?.width) || 0,
        height: Number(imageInfo?.height) || 0,
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const mimeRank = getCommonsImageMimeRank(left.mime) - getCommonsImageMimeRank(right.mime);
      if (mimeRank !== 0) {
        return mimeRank;
      }
      return (right.width || 0) - (left.width || 0);
    });

  return {
    query: normalizedQuery,
    results,
  };
}

async function listModels() {
  const config = await getConfig();
  const baseUrl = normalizeBaseUrl(config.ollamaUrl);

  if (!baseUrl) {
    throw new Error("Ollama URL is not configured.");
  }

  const payload = await fetchJson(`${baseUrl}/api/tags`);
  const models = Array.isArray(payload.models)
    ? payload.models.map((model) => ({
        name: model.name,
        size: model.size,
        modifiedAt: model.modified_at,
        digest: model.digest,
      }))
    : [];
  const nextConfig = await reconcileSelectedModel(config, models);

  return {
    baseUrl,
    config: nextConfig,
    models,
  };
}

function isBrowserTabCandidate(tab, excludedTabId) {
  if (!tab || !Number.isFinite(Number(tab.id))) {
    return false;
  }

  if (Number(tab.id) === Number(excludedTabId)) {
    return false;
  }

  return /^https?:\/\//i.test(String(tab.url || ""));
}

async function listBrowserTabs({ excludedTabId } = {}) {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  return tabs
    .filter((tab) => isBrowserTabCandidate(tab, excludedTabId))
    .map((tab) => ({
      id: Number(tab.id),
      title: String(tab.title || tab.url || "Untitled tab"),
      url: String(tab.url || ""),
      active: Boolean(tab.active),
    }));
}

async function getBrowserTabContexts({ tabIds = [], excludedTabId } = {}) {
  const ids = Array.from(
    new Set(
      (Array.isArray(tabIds) ? tabIds : [tabIds])
        .map((value) => Number.parseInt(String(value), 10))
        .filter((value) => Number.isFinite(value) && value > 0 && value !== Number(excludedTabId))
    )
  );

  const results = [];

  for (const tabId of ids) {
    let tab;
    try {
      tab = await chrome.tabs.get(tabId);
    } catch (_error) {
      continue;
    }

    if (!isBrowserTabCandidate(tab, excludedTabId)) {
      continue;
    }

    try {
      const response = await chrome.tabs.sendMessage(tabId, { type: "edge-ai-chat:get-page-context" });
      results.push({
        id: tabId,
        title: String(tab.title || response?.context?.title || tab.url || "Untitled tab"),
        url: String(tab.url || response?.context?.url || ""),
        context: response?.ok && response.context ? response.context : null,
        contextAvailable: Boolean(response?.ok && response.context),
      });
    } catch (_error) {
      results.push({
        id: tabId,
        title: String(tab.title || tab.url || "Untitled tab"),
        url: String(tab.url || ""),
        context: null,
        contextAvailable: false,
      });
    }
  }

  return results;
}

async function generateWithOllama(prompt, model) {
  const config = await getConfig();
  const baseUrl = normalizeBaseUrl(config.ollamaUrl);
  const selectedModel = model || config.selectedModel;

  if (!baseUrl) {
    throw new Error("Ollama URL is not configured.");
  }

  if (!selectedModel) {
    throw new Error("No Ollama model selected.");
  }

  const payload = await fetchJson(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: selectedModel,
      prompt,
      stream: false,
    }),
  });

  return {
    model: selectedModel,
    response: payload.response || "",
    done: payload.done,
  };
}

async function streamGenerateWithOllama(port, prompt, model) {
  const config = await getConfig();
  const baseUrl = normalizeBaseUrl(config.ollamaUrl);
  const selectedModel = model || config.selectedModel;

  if (!baseUrl) {
    throw new Error("Ollama URL is not configured.");
  }

  if (!selectedModel) {
    throw new Error("No Ollama model selected.");
  }

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: selectedModel,
      prompt,
      stream: true,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }

  if (!response.body) {
    throw new Error("Streaming response body is unavailable.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  port.postMessage({
    type: "ollama:stream-start",
    model: selectedModel,
  });

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        continue;
      }

      const json = JSON.parse(trimmed);
      port.postMessage({
        type: "ollama:stream-chunk",
        model: selectedModel,
        response: json.response || "",
        done: Boolean(json.done),
      });
    }
  }

  const trailing = buffer.trim();
  if (trailing) {
    const json = JSON.parse(trailing);
    port.postMessage({
      type: "ollama:stream-chunk",
      model: selectedModel,
      response: json.response || "",
      done: Boolean(json.done),
    });
  }

  port.postMessage({
    type: "ollama:stream-complete",
    model: selectedModel,
  });
}

async function streamChatWithOllama(port, messages, model) {
  const config = await getConfig();
  const baseUrl = normalizeBaseUrl(config.ollamaUrl);
  const selectedModel = model || config.selectedModel;

  if (!baseUrl) {
    throw new Error("Ollama URL is not configured.");
  }

  if (!selectedModel) {
    throw new Error("No Ollama model selected.");
  }

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: selectedModel,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }

  if (!response.body) {
    throw new Error("Streaming response body is unavailable.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  port.postMessage({
    type: "ollama:stream-start",
    model: selectedModel,
  });

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        continue;
      }

      const json = JSON.parse(trimmed);
      port.postMessage({
        type: "ollama:stream-chunk",
        model: selectedModel,
        response: json.message?.content || "",
        done: Boolean(json.done),
      });
    }
  }

  const trailing = buffer.trim();
  if (trailing) {
    const json = JSON.parse(trailing);
    port.postMessage({
      type: "ollama:stream-chunk",
      model: selectedModel,
      response: json.message?.content || "",
      done: Boolean(json.done),
    });
  }

  port.postMessage({
    type: "ollama:stream-complete",
    model: selectedModel,
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  const config = await getConfig();
  await chrome.storage.sync.set(config);
  await restoreTaskAlarms();
});

chrome.runtime.onStartup?.addListener(() => {
  restoreTaskAlarms().catch((error) => {
    console.warn("[Edge AI Chat] Failed to restore task alarms on startup", error);
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  const taskId = getTaskIdFromAlarmName(alarm?.name || "");
  if (!taskId) {
    return;
  }

  (async () => {
    const tasks = await getTaskRecords();
    const task = tasks.find((item) => item.id === taskId);
    if (!task || task.status === "completed" || !task.reminderAt) {
      return;
    }

    await chrome.notifications.create(buildTaskNotificationId(taskId), {
      type: "basic",
      iconUrl: "assets/icons/icon-128.png",
      title: task.title,
      message: buildTaskNotificationMessage(task),
      priority: 2,
    });

    const nextTasks = tasks.map((item) => (item.id === taskId ? { ...item, reminderSentAt: new Date().toISOString() } : item));
    await saveTaskRecords(nextTasks);
  })().catch((error) => {
    console.warn("[Edge AI Chat] Failed to deliver task reminder", error);
  });
});

chrome.notifications.onClicked.addListener((notificationId) => {
  const taskId = getTaskIdFromNotificationId(notificationId);
  if (!taskId) {
    return;
  }

  (async () => {
    const tasks = await getTaskRecords();
    const task = tasks.find((item) => item.id === taskId);
    if (task?.sourceUrl) {
      await chrome.tabs.create({ url: task.sourceUrl });
    }
    await chrome.notifications.clear(notificationId);
  })().catch((error) => {
    console.warn("[Edge AI Chat] Failed to open task source", error);
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    switch (message?.type) {
      case "ollama:get-config": {
        sendResponse({ ok: true, config: await getConfig() });
        return;
      }
      case "ollama:set-config": {
        sendResponse({ ok: true, config: await setConfig(message.config || {}) });
        return;
      }
      case "ollama:list-models": {
        sendResponse({ ok: true, ...(await listModels()) });
        return;
      }
      case "ollama:select-model": {
        const config = await setConfig({ selectedModel: message.model || "" });
        sendResponse({ ok: true, config });
        return;
      }
      case "ollama:generate": {
        sendResponse({ ok: true, ...(await generateWithOllama(message.prompt || "", message.model)) });
        return;
      }
      case "browser:list-tabs": {
        sendResponse({ ok: true, tabs: await listBrowserTabs({ excludedTabId: sender?.tab?.id }) });
        return;
      }
      case "browser:get-tab-contexts": {
        sendResponse({ ok: true, tabs: await getBrowserTabContexts({ tabIds: message.tabIds || [], excludedTabId: sender?.tab?.id }) });
        return;
      }
      case "commons:search-image": {
        sendResponse({ ok: true, ...(await searchCommonsImages(message || {})) });
        return;
      }
      case "ollama:open-options": {
        await chrome.runtime.openOptionsPage();
        sendResponse({ ok: true });
        return;
      }
      case "ollama:set-work-folder": {
        await setWorkFolderHandle(message.handle);
        sendResponse({ ok: true, status: await getWorkFolderStatus() });
        return;
      }
      case "ollama:clear-work-folder": {
        await clearWorkFolderHandle();
        sendResponse({ ok: true, status: await getWorkFolderStatus() });
        return;
      }
      case "ollama:get-work-folder-status": {
        sendResponse({ ok: true, status: await getWorkFolderStatus() });
        return;
      }
      case "work-folder:sync-push": {
        sendResponse({ ok: true, result: await pushWorkFolderSync(), status: await getWorkFolderStatus() });
        return;
      }
      case "work-folder:sync-pull": {
        sendResponse({ ok: true, result: await pullWorkFolderSync(), status: await getWorkFolderStatus() });
        return;
      }
      case "google-drive:get-status": {
        sendResponse({ ok: true, status: await getGoogleDriveSyncStatus() });
        return;
      }
      case "google-drive:connect": {
        await authorizeGoogleDrive(true);
        sendResponse({ ok: true, status: await getGoogleDriveSyncStatus() });
        return;
      }
      case "google-drive:disconnect": {
        await clearGoogleDriveSyncAuth();
        sendResponse({ ok: true, status: await getGoogleDriveSyncStatus() });
        return;
      }
      case "google-drive:sync-push": {
        const result = await syncGoogleDriveNow("push", true);
        sendResponse({ ok: true, result, status: await getGoogleDriveSyncStatus() });
        return;
      }
      case "google-drive:sync-pull": {
        const result = await syncGoogleDriveNow("pull", true);
        sendResponse({ ok: true, result, status: await getGoogleDriveSyncStatus() });
        return;
      }
      case "ollama:save-chat-session": {
        sendResponse({ ok: true, result: await saveChatSession(message.session || {}) });
        return;
      }
      case "ollama:get-latest-chat-session": {
        sendResponse({ ok: true, session: await getLatestChatSession() });
        return;
      }
      case "task:list": {
        sendResponse({ ok: true, tasks: await getTaskRecords() });
        return;
      }
      case "task:save": {
        sendResponse({ ok: true, ...(await upsertTaskRecord(message.task || {})) });
        return;
      }
      case "task:delete": {
        sendResponse({ ok: true, ...(await deleteTaskRecord(message.taskId || "")) });
        return;
      }
      case "ollama:list-local-work-folder-directory": {
        sendResponse({ ok: true, directory: await listLocalWorkFolderDirectory(message || {}) });
        return;
      }
      case "ollama:read-local-work-folder-file": {
        sendResponse({ ok: true, file: await readLocalWorkFolderFile(message || {}) });
        return;
      }
      case "github:fetch-file": {
        sendResponse({ ok: true, file: await fetchGithubFile(message || {}) });
        return;
      }
      case "github:list-directory": {
        sendResponse({ ok: true, directory: await listGithubDirectory(message || {}) });
        return;
      }
      case "github:fetch-readme": {
        sendResponse({ ok: true, readme: await fetchGithubReadme(message || {}) });
        return;
      }
      case "github:list-repositories": {
        sendResponse({ ok: true, ...(await listGithubRepositories(message || {})) });
        return;
      }
      case "github:fetch-repository": {
        sendResponse({ ok: true, repository: await fetchGithubRepository(message || {}) });
        return;
      }
      default: {
        sendResponse({ ok: false, error: "Unknown message type." });
      }
    }
  })().catch((error) => {
    sendResponse({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  });

  return true;
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "ollama-stream") {
    return;
  }

  port.onMessage.addListener((message) => {
    if (message?.type === "ollama:stream-generate") {
      streamGenerateWithOllama(port, message.prompt || "", message.model)
        .catch((error) => {
          port.postMessage({
            type: "ollama:stream-error",
            error: error instanceof Error ? error.message : String(error),
          });
        });
      return;
    }

    if (message?.type === "ollama:stream-chat") {
      streamChatWithOllama(port, message.messages || [], message.model)
        .catch((error) => {
          port.postMessage({
            type: "ollama:stream-error",
            error: error instanceof Error ? error.message : String(error),
          });
        });
    }
  });
});
