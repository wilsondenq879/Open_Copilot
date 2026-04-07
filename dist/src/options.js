const OPTION_I18N = {
  "zh-TW": {
    pageTitle: "Edge AI Chat 設定",
    eyebrow: "Edge AI Chat",
    title: "設定",
    description: "調校 Ollama 與 LM Studio 的本機推論路由，並設定瀏覽器聊天的預設體驗。",
    ollamaUrlLabel: "Ollama 網址",
    ollamaSectionTitle: "Ollama 控制台",
    ollamaSectionTag: "即時模型掃描",
    lmStudioSectionTitle: "LM Studio 橋接",
    lmStudioSectionTag: "OpenAI 相容",
    lmStudioUrlLabel: "LM Studio 網址",
    lmStudioModelLabel: "預設模型 ID",
    lmStudioApiKeyLabel: "API Key",
    lmStudioHint: "可先儲存 LM Studio 本機伺服器資訊，之後要接 OpenAI 相容呼叫或多路由時就能直接使用。",
    generalSectionTitle: "互動體驗",
    replyLanguageLabel: "回覆語言",
    saveSettings: "儲存設定",
    testConnection: "測試連線",
    installedModels: "已安裝模型",
    refresh: "重新整理",
    waiting: "等待連線檢查。",
    noModels: "Ollama 沒有回傳任何模型。",
    saveSuccess: "設定已儲存。",
    loadingModels: "載入模型中...",
    fetchModelsFailed: "取得模型失敗。",
    saveFailed: "儲存設定失敗。",
    connectedSummary: "已連線到 {baseUrl}。找到 {count} 個模型。",
  },
  en: {
    pageTitle: "Edge AI Chat Settings",
    eyebrow: "Edge AI Chat",
    title: "Settings",
    description: "Tune local inference routing for Ollama and LM Studio, then define the default browser chat experience.",
    ollamaUrlLabel: "Ollama URL",
    ollamaSectionTitle: "Ollama Control",
    ollamaSectionTag: "Live Model Scan",
    lmStudioSectionTitle: "LM Studio Bridge",
    lmStudioSectionTag: "OpenAI Compatible",
    lmStudioUrlLabel: "LM Studio URL",
    lmStudioModelLabel: "Default Model ID",
    lmStudioApiKeyLabel: "API Key",
    lmStudioHint: "Store LM Studio server details here so future OpenAI-compatible routing can use them directly.",
    generalSectionTitle: "Experience",
    replyLanguageLabel: "Reply Language",
    saveSettings: "Save Settings",
    testConnection: "Test Connection",
    installedModels: "Installed Models",
    refresh: "Refresh",
    waiting: "Waiting for connection check.",
    noModels: "No models returned from Ollama.",
    saveSuccess: "Settings saved.",
    loadingModels: "Loading models...",
    fetchModelsFailed: "Failed to fetch models.",
    saveFailed: "Failed to save settings.",
    connectedSummary: "Connected to {baseUrl}. Found {count} model(s).",
  },
  ja: {
    pageTitle: "Edge AI Chat 設定",
    eyebrow: "Edge AI Chat",
    title: "設定",
    description: "Ollama のエンドポイント、インストール済みモデル、ブラウザー上のチャットで使う既定の応答言語を設定します。",
    ollamaUrlLabel: "Ollama URL",
    replyLanguageLabel: "応答言語",
    saveSettings: "設定を保存",
    testConnection: "接続をテスト",
    installedModels: "インストール済みモデル",
    refresh: "更新",
    waiting: "接続確認を待機しています。",
    noModels: "Ollama からモデルが返されませんでした。",
    saveSuccess: "設定を保存しました。",
    loadingModels: "モデルを読み込み中...",
    fetchModelsFailed: "モデルの取得に失敗しました。",
    saveFailed: "設定の保存に失敗しました。",
    connectedSummary: "{baseUrl} に接続しました。{count} 個のモデルが見つかりました。",
  },
  ko: {
    pageTitle: "Edge AI Chat 설정",
    eyebrow: "Edge AI Chat",
    title: "설정",
    description: "브라우저 채팅용 Ollama 엔드포인트, 설치된 모델, 기본 응답 언어를 설정합니다.",
    ollamaUrlLabel: "Ollama URL",
    replyLanguageLabel: "응답 언어",
    saveSettings: "설정 저장",
    testConnection: "연결 테스트",
    installedModels: "설치된 모델",
    refresh: "새로고침",
    waiting: "연결 확인을 기다리는 중입니다.",
    noModels: "Ollama에서 반환한 모델이 없습니다.",
    saveSuccess: "설정을 저장했습니다.",
    loadingModels: "모델 불러오는 중...",
    fetchModelsFailed: "모델을 가져오지 못했습니다.",
    saveFailed: "설정 저장에 실패했습니다.",
    connectedSummary: "{baseUrl}에 연결되었습니다. 모델 {count}개를 찾았습니다.",
  },
  "zh-CN": {
    pageTitle: "Edge AI Chat 设置",
    eyebrow: "Edge AI Chat",
    title: "设置",
    description: "配置 Ollama 端点、已安装模型，以及浏览器聊天的默认回复语言。",
    ollamaUrlLabel: "Ollama 地址",
    replyLanguageLabel: "回复语言",
    saveSettings: "保存设置",
    testConnection: "测试连接",
    installedModels: "已安装模型",
    refresh: "刷新",
    waiting: "等待连接检查。",
    noModels: "Ollama 没有返回任何模型。",
    saveSuccess: "设置已保存。",
    loadingModels: "正在加载模型...",
    fetchModelsFailed: "获取模型失败。",
    saveFailed: "保存设置失败。",
    connectedSummary: "已连接到 {baseUrl}。找到 {count} 个模型。",
  },
  es: {
    pageTitle: "Configuración de Edge AI Chat",
    eyebrow: "Edge AI Chat",
    title: "Configuración",
    description: "Configura el endpoint de Ollama, los modelos instalados y el idioma de respuesta predeterminado para el chat en el navegador.",
    ollamaUrlLabel: "URL de Ollama",
    replyLanguageLabel: "Idioma de respuesta",
    saveSettings: "Guardar configuración",
    testConnection: "Probar conexión",
    installedModels: "Modelos instalados",
    refresh: "Actualizar",
    waiting: "Esperando la comprobación de conexión.",
    noModels: "Ollama no devolvió ningún modelo.",
    saveSuccess: "Configuración guardada.",
    loadingModels: "Cargando modelos...",
    fetchModelsFailed: "No se pudieron obtener los modelos.",
    saveFailed: "No se pudo guardar la configuración.",
    connectedSummary: "Conectado a {baseUrl}. Se encontraron {count} modelo(s).",
  },
  fr: {
    pageTitle: "Paramètres Edge AI Chat",
    eyebrow: "Edge AI Chat",
    title: "Paramètres",
    description: "Configurez le point de terminaison Ollama, les modèles installés et la langue de réponse par défaut pour le chat dans le navigateur.",
    ollamaUrlLabel: "URL Ollama",
    replyLanguageLabel: "Langue de réponse",
    saveSettings: "Enregistrer",
    testConnection: "Tester la connexion",
    installedModels: "Modèles installés",
    refresh: "Actualiser",
    waiting: "En attente de la vérification de connexion.",
    noModels: "Aucun modèle renvoyé par Ollama.",
    saveSuccess: "Paramètres enregistrés.",
    loadingModels: "Chargement des modèles...",
    fetchModelsFailed: "Échec de récupération des modèles.",
    saveFailed: "Échec de l’enregistrement des paramètres.",
    connectedSummary: "Connecté à {baseUrl}. {count} modèle(s) trouvé(s).",
  },
  de: {
    pageTitle: "Edge AI Chat Einstellungen",
    eyebrow: "Edge AI Chat",
    title: "Einstellungen",
    description: "Konfiguriere den Ollama-Endpunkt, installierte Modelle und die Standard-Antwortsprache für den Browser-Chat.",
    ollamaUrlLabel: "Ollama-URL",
    replyLanguageLabel: "Antwortsprache",
    saveSettings: "Einstellungen speichern",
    testConnection: "Verbindung testen",
    installedModels: "Installierte Modelle",
    refresh: "Aktualisieren",
    waiting: "Warte auf Verbindungsprüfung.",
    noModels: "Keine Modelle von Ollama zurückgegeben.",
    saveSuccess: "Einstellungen gespeichert.",
    loadingModels: "Modelle werden geladen...",
    fetchModelsFailed: "Modelle konnten nicht geladen werden.",
    saveFailed: "Einstellungen konnten nicht gespeichert werden.",
    connectedSummary: "Mit {baseUrl} verbunden. {count} Modell(e) gefunden.",
  },
  "pt-BR": {
    pageTitle: "Configurações do Edge AI Chat",
    eyebrow: "Edge AI Chat",
    title: "Configurações",
    description: "Configure o endpoint do Ollama, os modelos instalados e o idioma padrão de resposta para o chat no navegador.",
    ollamaUrlLabel: "URL do Ollama",
    replyLanguageLabel: "Idioma da resposta",
    saveSettings: "Salvar configurações",
    testConnection: "Testar conexão",
    installedModels: "Modelos instalados",
    refresh: "Atualizar",
    waiting: "Aguardando verificação de conexão.",
    noModels: "Nenhum modelo retornado pelo Ollama.",
    saveSuccess: "Configurações salvas.",
    loadingModels: "Carregando modelos...",
    fetchModelsFailed: "Falha ao buscar modelos.",
    saveFailed: "Falha ao salvar configurações.",
    connectedSummary: "Conectado a {baseUrl}. Encontrado(s) {count} modelo(s).",
  },
  hi: {
    pageTitle: "Edge AI Chat सेटिंग्स",
    eyebrow: "Edge AI Chat",
    title: "सेटिंग्स",
    description: "ब्राउज़र चैट के लिए Ollama endpoint, इंस्टॉल किए गए मॉडल और डिफ़ॉल्ट उत्तर भाषा सेट करें।",
    ollamaUrlLabel: "Ollama URL",
    replyLanguageLabel: "उत्तर भाषा",
    saveSettings: "सेटिंग्स सहेजें",
    testConnection: "कनेक्शन जाँचें",
    installedModels: "इंस्टॉल किए गए मॉडल",
    refresh: "रीफ़्रेश",
    waiting: "कनेक्शन जाँच की प्रतीक्षा है।",
    noModels: "Ollama से कोई मॉडल प्राप्त नहीं हुआ।",
    saveSuccess: "सेटिंग्स सहेजी गईं।",
    loadingModels: "मॉडल लोड हो रहे हैं...",
    fetchModelsFailed: "मॉडल प्राप्त नहीं हो सके।",
    saveFailed: "सेटिंग्स सहेजने में विफल।",
    connectedSummary: "{baseUrl} से जुड़ा। {count} मॉडल मिले।",
  },
};

let currentLocale = OPTION_I18N.en;

function sendMessage(message) {
  return new Promise((resolve) => chrome.runtime.sendMessage(message, resolve));
}

function t(key, vars = {}) {
  const template = currentLocale[key] || OPTION_I18N.en[key] || key;
  return template.replace(/\{(\w+)\}/g, (_match, name) => String(vars[name] ?? ""));
}

function applyTranslations() {
  document.title = t("pageTitle");
  document.getElementById("settingsEyebrow").textContent = t("eyebrow");
  document.getElementById("settingsTitle").textContent = t("title");
  document.getElementById("settingsDescription").textContent = t("description");
  document.getElementById("ollamaSectionTitle").textContent = t("ollamaSectionTitle");
  document.getElementById("ollamaSectionTag").textContent = t("ollamaSectionTag");
  document.getElementById("ollamaUrlLabel").textContent = t("ollamaUrlLabel");
  document.getElementById("lmStudioSectionTitle").textContent = t("lmStudioSectionTitle");
  document.getElementById("lmStudioSectionTag").textContent = t("lmStudioSectionTag");
  document.getElementById("lmStudioUrlLabel").textContent = t("lmStudioUrlLabel");
  document.getElementById("lmStudioModelLabel").textContent = t("lmStudioModelLabel");
  document.getElementById("lmStudioApiKeyLabel").textContent = t("lmStudioApiKeyLabel");
  document.getElementById("lmStudioHint").textContent = t("lmStudioHint");
  document.getElementById("generalSectionTitle").textContent = t("generalSectionTitle");
  document.getElementById("replyLanguageLabel").textContent = t("replyLanguageLabel");
  document.getElementById("saveButton").textContent = t("saveSettings");
  document.getElementById("testButton").textContent = t("testConnection");
  document.getElementById("installedModelsTitle").textContent = t("installedModels");
  document.getElementById("refreshButton").textContent = t("refresh");
}

function formatSize(size) {
  if (!size) {
    return "";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = Number(size);
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function renderModels(models) {
  const list = document.getElementById("modelsList");
  list.innerHTML = "";

  if (!models.length) {
    list.innerHTML = `<div class="empty-state">${t("noModels")}</div>`;
    return;
  }

  models.forEach((model) => {
    const card = document.createElement("article");
    card.className = "model-card";
    card.innerHTML = `
      <div class="model-card-name">${model.name}</div>
      <div class="model-card-meta">${formatSize(model.size)}</div>
    `;
    list.appendChild(card);
  });
}

function setStatus(message, isError = false) {
  const node = document.getElementById("statusMessage");
  node.textContent = message;
  node.classList.toggle("is-error", isError);
}

async function loadConfig() {
  const result = await sendMessage({ type: "ollama:get-config" });
  if (result?.ok) {
    const replyLanguage = result.config.replyLanguage || "en";
    currentLocale = OPTION_I18N[replyLanguage] || OPTION_I18N.en;
    applyTranslations();
    document.getElementById("ollamaUrl").value = result.config.ollamaUrl || "";
    document.getElementById("lmStudioUrl").value = result.config.lmStudioUrl || "";
    document.getElementById("lmStudioModel").value = result.config.lmStudioModel || "";
    document.getElementById("lmStudioApiKey").value = result.config.lmStudioApiKey || "";
    document.getElementById("replyLanguage").value = replyLanguage;
    setStatus(t("waiting"));
  }
}

async function saveConfig() {
  const ollamaUrl = document.getElementById("ollamaUrl").value.trim();
  const lmStudioUrl = document.getElementById("lmStudioUrl").value.trim();
  const lmStudioModel = document.getElementById("lmStudioModel").value.trim();
  const lmStudioApiKey = document.getElementById("lmStudioApiKey").value.trim();
  const replyLanguage = document.getElementById("replyLanguage").value;
  currentLocale = OPTION_I18N[replyLanguage] || OPTION_I18N.en;
  applyTranslations();
  const result = await sendMessage({
    type: "ollama:set-config",
    config: { ollamaUrl, lmStudioUrl, lmStudioModel, lmStudioApiKey, replyLanguage },
  });

  if (!result?.ok) {
    throw new Error(result?.error || t("saveFailed"));
  }

  setStatus(t("saveSuccess"));
}

async function refreshModels() {
  setStatus(t("loadingModels"));
  const result = await sendMessage({ type: "ollama:list-models" });
  if (!result?.ok) {
    renderModels([]);
    throw new Error(result?.error || t("fetchModelsFailed"));
  }

  renderModels(result.models || []);
  setStatus(t("connectedSummary", { baseUrl: result.baseUrl, count: result.models.length }));
}

document.getElementById("saveButton").addEventListener("click", async () => {
  try {
    await saveConfig();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
});

document.getElementById("testButton").addEventListener("click", async () => {
  try {
    await saveConfig();
    await refreshModels();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
});

document.getElementById("refreshButton").addEventListener("click", async () => {
  try {
    await refreshModels();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
});

loadConfig();
