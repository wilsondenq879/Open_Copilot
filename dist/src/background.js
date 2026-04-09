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
const SUPPORTED_LOCAL_DOCUMENT_EXTENSIONS = new Set(["txt", "md", "markdown", "json", "csv"]);

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

async function getConfig() {
  const config = await chrome.storage.sync.get(DEFAULT_CONFIG);
  return { ...DEFAULT_CONFIG, ...config };
}

async function setConfig(nextConfig) {
  const current = await getConfig();
  const merged = { ...current, ...nextConfig };
  await chrome.storage.sync.set(merged);
  return merged;
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
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
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
      case "ollama:save-chat-session": {
        sendResponse({ ok: true, result: await saveChatSession(message.session || {}) });
        return;
      }
      case "ollama:get-latest-chat-session": {
        sendResponse({ ok: true, session: await getLatestChatSession() });
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
