const DEFAULT_CONFIG = {
  ollamaUrl: "http://127.0.0.1:11434",
  lmStudioUrl: "http://127.0.0.1:1234",
  lmStudioModel: "",
  lmStudioApiKey: "lm-studio",
  selectedModel: "",
  replyLanguage: "en",
};

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

  return {
    baseUrl,
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
