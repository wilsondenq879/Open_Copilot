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

const DEFAULT_CONFIG = {
  ollamaUrl: "http://127.0.0.1:11434",
  lmStudioUrl: "http://127.0.0.1:1234",
  lmStudioModel: "",
  lmStudioApiKey: "lm-studio",
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

async function getWorkFolderHandle() {
  return idbGet(WORK_FOLDER_HANDLE_KEY);
}

async function setWorkFolderHandle(handle) {
  await idbSet(WORK_FOLDER_HANDLE_KEY, handle);
  await chrome.storage.local.set({
    [LOCAL_META_KEY]: {
      name: handle?.name || "",
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

  if (handle?.queryPermission) {
    permission = await handle.queryPermission({ mode: "readwrite" });
  }

  return {
    configured: Boolean(handle),
    folderName: meta?.name || handle?.name || "",
    configuredAt: meta?.configuredAt || "",
    permission,
  };
}

async function saveChatSession(session) {
  const payload = {
    ...session,
    savedAt: session?.savedAt || new Date().toISOString(),
  };

  await chrome.storage.local.set({
    [LATEST_CHAT_SESSION_KEY]: payload,
  });

  const handle = await getWorkFolderHandle();
  if (!handle) {
    return { savedToFolder: false, reason: "not-configured" };
  }

  let permission = "prompt";
  if (handle?.queryPermission) {
    permission = await handle.queryPermission({ mode: "readwrite" });
  }
  if (permission !== "granted") {
    return { savedToFolder: false, reason: "permission-denied" };
  }

  try {
    const pageTitle = sanitizeFileSegment(payload.pageTitle, "page");
    const filename = `${timestampForFile(new Date(payload.savedAt))}-${pageTitle}.json`;
    const fileHandle = await handle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(payload, null, 2));
    await writable.close();

    return {
      savedToFolder: true,
      fileName: filename,
      folderName: handle.name || "",
    };
  } catch (error) {
    return {
      savedToFolder: false,
      reason: "write-failed",
      error: error instanceof Error ? error.message : String(error),
    };
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
