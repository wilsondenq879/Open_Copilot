const OPTION_I18N = {
  "zh-TW": {
    pageTitle: "Open Copilot 設定",
    eyebrow: "Open Copilot",
    title: "設定",
    description: "調校 Ollama、LM Studio、Gemini 與 Azure OpenAI 的設定，並設定瀏覽器聊天的預設體驗。",
    connectionKicker: "連線",
    ollamaKicker: "本機",
    bridgeKicker: "橋接",
    geminiKicker: "雲端",
    azureKicker: "企業",
    behaviorKicker: "行為",
    providerSectionTitle: "AI Providers",
    providerSectionTag: "分頁設定",
    ollamaUrlLabel: "Ollama 網址",
    ollamaSectionTitle: "Ollama 控制台",
    ollamaSectionTag: "即時模型掃描",
    lmStudioSectionTitle: "LM Studio 橋接",
    lmStudioSectionTag: "OpenAI 相容",
    lmStudioUrlLabel: "LM Studio 網址",
    lmStudioModelLabel: "預設模型 ID",
    lmStudioApiKeyLabel: "API Key",
    lmStudioHint: "可先儲存 LM Studio 本機伺服器資訊，之後要接 OpenAI 相容呼叫或多路由時就能直接使用。",
    geminiSectionTitle: "Gemini",
    geminiSectionTag: "Google AI",
    geminiModelLabel: "模型",
    geminiApiKeyLabel: "API Key",
    geminiHint: "先把 Gemini 的模型與 API Key 存起來，之後接雲端路由時就不用再重新輸入。",
    azureSectionTitle: "Azure OpenAI",
    azureSectionTag: "Azure 上的 OpenAI",
    azureEndpointLabel: "Endpoint",
    azureDeploymentLabel: "Deployment",
    azureApiVersionLabel: "API Version",
    azureApiKeyLabel: "API Key",
    azureHint: "儲存 Azure OpenAI 的資源端點、deployment 名稱、API version 與金鑰，之後接 hosted routing 時可直接使用。",
    githubApiKeyLabel: "GitHub API Key",
    githubApiKeyHint: "建議使用 fine-grained、read-only 的 GitHub personal access token。設定後 extension 就能抓 GitHub 檔案內容，也可讀取你有權限的 private repository。",
    generalSectionTitle: "互動體驗",
    generalSectionTag: "Prompt 路由",
    localWorkFolderLabel: "Local Work Folder",
    localWorkFolderHint: "選擇一個本機資料夾，作為「下載 MD」的儲存位置，也可用來加入本機文件。",
    pickFolder: "選擇資料夾",
    clearFolder: "清除資料夾",
    workFolderPull: "從資料夾拉回",
    workFolderPush: "推送到資料夾",
    folderNotSelected: "尚未選擇資料夾。",
    folderReady: "已連結本機資料夾：{name}",
    folderPermissionMissing: "資料夾已記錄，但寫入權限失效。請重新選擇一次。",
    folderPathLabel: "目前設定資料夾",
    folderPathUnavailable: "瀏覽器目前只能提供資料夾名稱，無法讀取完整系統路徑。",
    folderChooseUnsupported: "這個瀏覽器頁面目前不支援選擇本機資料夾。",
    folderSaveSuccess: "已儲存本機資料夾設定。",
    folderSaveFailed: "儲存本機資料夾失敗。",
    folderClearSuccess: "已清除本機資料夾設定。",
    workFolderPullSuccess: "已從工作資料夾拉回並合併：starters {starters}、tasks {tasks}、chat {chat}、documents {documents}。",
    workFolderPushSuccess: "已推送到工作資料夾：starters {starters}、tasks {tasks}、chat {chat}、documents {documents}。",
    googleDriveSyncLabel: "Google Drive 同步",
    googleDriveClientIdLabel: "OAuth Client ID",
    googleDriveSyncEnabledLabel: "啟用 Drive 同步",
    googleDriveAutoSyncLabel: "儲存後自動同步",
    googleDriveConnect: "連接 Google Drive",
    googleDrivePull: "從 Drive 拉回",
    googleDrivePush: "推送到 Drive",
    googleDriveDisconnect: "中斷連線",
    googleDriveSyncHint: "透過 Google Drive app data 同步生成的聊天文件、Starter Skill Collection 與待辦提醒。",
    googleDriveRedirectLabel: "Redirect URL",
    googleDriveNotConnected: "尚未連接 Google Drive。",
    googleDriveConnected: "Google Drive 已連接。",
    googleDriveLastSync: "上次同步：{time}",
    googleDriveLastError: "Drive 同步錯誤：{error}",
    googleDriveConnectSuccess: "Google Drive 已連接。",
    googleDriveDisconnectSuccess: "Google Drive 已中斷連線。",
    googleDrivePushSuccess: "已推送到 Google Drive。",
    googleDrivePullSuccess: "已從 Google Drive 拉回並合併。",
    googleDriveMissingClientId: "請先填入 Google OAuth Client ID 並儲存設定。",
    defaultProviderLabel: "預設 Provider",
    defaultProviderHint: "選擇未來啟用多路由時，預設要使用的 AI provider。",
    replyLanguageLabel: "回覆語言",
    settingsThemeLabel: "設定頁主題",
    settingsThemeHint: "只影響這個 settings 頁面；預設會跟隨系統外觀。",
    settingsThemeSystem: "跟隨系統",
    settingsThemeDark: "深色",
    settingsThemeLight: "淺色",
    taskExtractionWindowDaysLabel: "Task自動抓取區間",
    taskExtractionWindowDaysHint: "待辦抓取會根據目前可見的聊天內容整理，預設優先近 3 天，最多可調到 7 天。",
    starterHoverTipsEnabledLabel: "顯示 Starter hover 提示",
    starterHoverTipsEnabledHint: "滑過聊天面板中的 starter 時，顯示這個 starter 會做什麼的簡短說明。",
    systemPromptLabel: "System Prompt",
    multiPerspectiveProfilesLabel: "多視角角色",
    utilityTabExperience: "Experience",
    utilityTabStarterSkills: "Starter Skills",
    customStartersLabel: "自訂 Starters",
    customStartersInputLabel: "貼上 Starter JSON",
    starterLibraryKicker: "Starter Skills",
    starterLibraryTitle: "Starter Skill Library",
    starterLibraryDescription: "把可重複使用的 custom starter 集中管理在這裡。貼上新的 JSON、依照 ID 更新既有 skill，讓頁面內聊天面板隨時可用。",
    starterLibraryStoredLabel: "已儲存",
    starterLibraryCapacityLabel: "容量",
    starterLibraryLimitHint: "最多可儲存 20 組 starter skills",
    starterLibraryGridTitle: "Starter Skill Collection",
    starterLibraryGridDescription: "每張 skill 卡都會同步提供給頁面內聊天面板，可在這裡持續更新或刪除。",
    systemPromptHint: "這段內容會先於使用者訊息與頁面 context 一起送給模型，適合放角色設定、格式要求與回覆限制。",
    multiPerspectiveProfilesHint: "每行一個視角，格式為 `標題|指令`。留白時會使用內建的頁型預設。",
    customStartersHint: "把 starter JSON 貼到這裡後加入技能庫。相同 `id` 會更新，新的 `id` 會新增。每個項目至少要有 `label` 和 `prompt`，可選 `scopes` 與 `mode`。",
    customStartersInputPlaceholder: '[{"label":"Email 摘要","prompt":"請整理這封 email 的重點"}]',
    createStarters: "加入技能庫",
    clearStarters: "清空技能庫",
    noCustomStarters: "目前沒有匯入自訂 starters。",
    customStarterImported: "已加入或更新 {count} 個 starters，目前共 {total} / {limit} 組。",
    customStarterCleared: "已清除自訂 starters。",
    customStarterImportFailed: "Starter JSON 匯入失敗。",
    customStarterLimitReached: "最多只能儲存 {limit} 組 custom starters。",
    deleteStarter: "刪除",
    customStarterDeleted: "已刪除 starter：{name}",
    confirmClearFolder: "確定要清除本機資料夾設定嗎？",
    confirmClearStarters: "確定要清除所有匯入的 starters 嗎？",
    confirmDeleteStarter: "確定要刪除 starter「{name}」嗎？",
    starterPreviewScopeAll: "所有頁面",
    starterPreviewModeChat: "聊天",
    starterPreviewModePerspective: "多視角",
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
    pageTitle: "Open Copilot Settings",
    eyebrow: "Open Copilot",
    title: "Settings",
    description: "Configure Ollama, LM Studio, Gemini, and Azure OpenAI, then define the default browser chat experience.",
    connectionKicker: "Connection",
    ollamaKicker: "Local",
    bridgeKicker: "Bridge",
    geminiKicker: "Cloud",
    azureKicker: "Enterprise",
    behaviorKicker: "Behavior",
    providerSectionTitle: "AI Providers",
    providerSectionTag: "Tabbed Setup",
    ollamaUrlLabel: "Ollama URL",
    ollamaSectionTitle: "Ollama Control",
    ollamaSectionTag: "Live Model Scan",
    lmStudioSectionTitle: "LM Studio Bridge",
    lmStudioSectionTag: "OpenAI Compatible",
    lmStudioUrlLabel: "LM Studio URL",
    lmStudioModelLabel: "Default Model ID",
    lmStudioApiKeyLabel: "API Key",
    lmStudioHint: "Store LM Studio server details here so future OpenAI-compatible routing can use them directly.",
    geminiSectionTitle: "Gemini",
    geminiSectionTag: "Google AI",
    geminiModelLabel: "Model",
    geminiApiKeyLabel: "API Key",
    geminiHint: "Store your Gemini model and API key here so future cloud routing can use them directly.",
    azureSectionTitle: "Azure OpenAI",
    azureSectionTag: "OpenAI on Azure",
    azureEndpointLabel: "Endpoint",
    azureDeploymentLabel: "Deployment",
    azureApiVersionLabel: "API Version",
    azureApiKeyLabel: "API Key",
    azureHint: "Save your Azure OpenAI resource endpoint, deployment name, API version, and API key for future hosted routing.",
    githubApiKeyLabel: "GitHub API Key",
    githubApiKeyHint: "Use a fine-grained, read-only GitHub personal access token when possible. The extension can then fetch GitHub file contents, including private repositories you can access.",
    generalSectionTitle: "Experience",
    generalSectionTag: "Prompt Routing",
    localWorkFolderLabel: "Local Work Folder",
    localWorkFolderHint: "Pick a local folder to use as the save location for Download MD, and as the source for adding local documents.",
    pickFolder: "Choose Folder",
    clearFolder: "Clear Folder",
    workFolderPull: "Pull From Folder",
    workFolderPush: "Push To Folder",
    folderNotSelected: "No folder selected.",
    folderReady: "Local folder connected: {name}",
    folderPermissionMissing: "Folder remembered, but write permission is no longer available. Please pick it again.",
    folderPathLabel: "Configured Folder",
    folderPathUnavailable: "The browser only exposes the folder name here, not the full system path.",
    folderChooseUnsupported: "This browser page does not support choosing a local folder here.",
    folderSaveSuccess: "Local work folder saved.",
    folderSaveFailed: "Failed to save local work folder.",
    folderClearSuccess: "Local work folder cleared.",
    workFolderPullSuccess: "Pulled and merged from the work folder: {starters} starter(s), {tasks} task(s), {chat} chat session(s), {documents} document(s).",
    workFolderPushSuccess: "Pushed to the work folder: {starters} starter(s), {tasks} task(s), {chat} chat session(s), {documents} document(s).",
    googleDriveSyncLabel: "Google Drive Sync",
    googleDriveClientIdLabel: "OAuth Client ID",
    googleDriveSyncEnabledLabel: "Enable Drive sync",
    googleDriveAutoSyncLabel: "Auto-sync after saves",
    googleDriveConnect: "Connect Google Drive",
    googleDrivePull: "Pull From Drive",
    googleDrivePush: "Push To Drive",
    googleDriveDisconnect: "Disconnect",
    googleDriveSyncHint: "Sync generated chat documents, Starter Skill Collection, and task reminders through Google Drive app data.",
    googleDriveRedirectLabel: "Redirect URL",
    googleDriveNotConnected: "Google Drive is not connected.",
    googleDriveConnected: "Google Drive is connected.",
    googleDriveLastSync: "Last sync: {time}",
    googleDriveLastError: "Drive sync error: {error}",
    googleDriveConnectSuccess: "Google Drive connected.",
    googleDriveDisconnectSuccess: "Google Drive disconnected.",
    googleDrivePushSuccess: "Pushed to Google Drive.",
    googleDrivePullSuccess: "Pulled from Google Drive and merged.",
    googleDriveMissingClientId: "Enter and save a Google OAuth Client ID first.",
    defaultProviderLabel: "Default Provider",
    defaultProviderHint: "Choose which AI provider should be used by default when future routing is enabled.",
    replyLanguageLabel: "Reply Language",
    settingsThemeLabel: "Settings Theme",
    settingsThemeHint: "Only changes this settings page. System follows your OS appearance.",
    settingsThemeSystem: "Follow System",
    settingsThemeDark: "Dark",
    settingsThemeLight: "Light",
    taskExtractionWindowDaysLabel: "Task Auto Extraction Window",
    taskExtractionWindowDaysHint: "Task extraction uses visible chat content and prioritizes the last 3 days by default. You can increase the window up to 7 days.",
    starterHoverTipsEnabledLabel: "Show starter hover tips",
    starterHoverTipsEnabledHint: "Show a short description of what the starter does when you hover over it in the chat panel.",
    systemPromptLabel: "System Prompt",
    multiPerspectiveProfilesLabel: "Multi-View Profiles",
    utilityTabExperience: "Experience",
    utilityTabStarterSkills: "Starter Skills",
    customStartersLabel: "Custom Starters",
    customStartersInputLabel: "Paste Starter JSON",
    starterLibraryKicker: "Starter Skills",
    starterLibraryTitle: "Starter Skill Library",
    starterLibraryDescription: "Store reusable custom starter skills here. Import new JSON, update an existing skill by ID, and keep a strong library ready for the in-page chat panel.",
    starterLibraryStoredLabel: "Stored",
    starterLibraryCapacityLabel: "Capacity",
    starterLibraryLimitHint: "Store up to 20 starter skills",
    starterLibraryGridTitle: "Starter Skill Collection",
    starterLibraryGridDescription: "Every skill card is available to the in-page chat panel and can be updated or removed here.",
    systemPromptHint: "This prompt is sent before the user message and page context. Use it to define tone, constraints, and output rules.",
    multiPerspectiveProfilesHint: "One perspective per line using `Title|Instruction`. Leave it empty to use the built-in defaults for each page type.",
    customStartersHint: "Paste starter JSON here to add it to the library. Matching `id` values update existing skills, while new `id` values are added. Each item needs at least `label` and `prompt`, with optional `scopes` and `mode`.",
    customStartersInputPlaceholder: '[{"label":"Email Summary","prompt":"Summarize this email"}]',
    createStarters: "Add to Library",
    clearStarters: "Clear Library",
    noCustomStarters: "No custom starters imported yet.",
    customStarterImported: "Added or updated {count} starter(s). Library now has {total} / {limit}.",
    customStarterCleared: "Custom starters cleared.",
    customStarterImportFailed: "Failed to import starter JSON.",
    customStarterLimitReached: "You can store up to {limit} custom starters.",
    deleteStarter: "Delete",
    customStarterDeleted: "Deleted starter: {name}",
    confirmClearFolder: "Clear the local work folder setting?",
    confirmClearStarters: "Clear all imported starters?",
    confirmDeleteStarter: "Delete starter \"{name}\"?",
    starterPreviewScopeAll: "All Pages",
    starterPreviewModeChat: "Chat",
    starterPreviewModePerspective: "Perspective",
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
    pageTitle: "Open Copilot 設定",
    eyebrow: "Open Copilot",
    title: "設定",
    description: "Ollama、LM Studio、Gemini、Azure OpenAI の設定を行い、ブラウザー上のチャット体験を調整します。",
    connectionKicker: "接続",
    ollamaKicker: "ローカル",
    bridgeKicker: "ブリッジ",
    geminiKicker: "クラウド",
    azureKicker: "エンタープライズ",
    behaviorKicker: "動作",
    providerSectionTitle: "AI プロバイダー",
    providerSectionTag: "タブ設定",
    ollamaUrlLabel: "Ollama URL",
    ollamaSectionTitle: "Ollama コントロール",
    ollamaSectionTag: "モデルをライブ検出",
    lmStudioSectionTitle: "LM Studio ブリッジ",
    lmStudioSectionTag: "OpenAI 互換",
    lmStudioUrlLabel: "LM Studio URL",
    lmStudioModelLabel: "既定のモデル ID",
    lmStudioApiKeyLabel: "API キー",
    lmStudioHint: "今後 OpenAI 互換呼び出しやルーティングで使えるように、LM Studio の接続情報を保存します。",
    geminiSectionTitle: "Gemini",
    geminiSectionTag: "Google AI",
    geminiModelLabel: "モデル",
    geminiApiKeyLabel: "API キー",
    geminiHint: "今後のクラウドルーティングで使えるように、Gemini のモデルと API キーを保存します。",
    azureSectionTitle: "Azure OpenAI",
    azureSectionTag: "Azure 上の OpenAI",
    azureEndpointLabel: "エンドポイント",
    azureDeploymentLabel: "デプロイ名",
    azureApiVersionLabel: "API バージョン",
    azureApiKeyLabel: "API キー",
    azureHint: "今後のホスト型ルーティングで使えるように、Azure OpenAI の接続情報を保存します。",
    generalSectionTitle: "体験",
    generalSectionTag: "プロンプトルーティング",
    defaultProviderLabel: "既定のプロバイダー",
    defaultProviderHint: "今後ルーティングを有効にしたときに、既定で使う AI プロバイダーを選択します。",
    replyLanguageLabel: "応答言語",
    systemPromptLabel: "システムプロンプト",
    systemPromptHint: "この内容はユーザー入力とページコンテキストの前に送信されます。口調、制約、出力ルールの指定に使えます。",
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
    pageTitle: "Open Copilot 설정",
    eyebrow: "Open Copilot",
    title: "설정",
    description: "Ollama, LM Studio, Gemini, Azure OpenAI 설정을 관리하고 브라우저 채팅 기본 동작을 조정합니다.",
    connectionKicker: "연결",
    ollamaKicker: "로컬",
    bridgeKicker: "브리지",
    geminiKicker: "클라우드",
    azureKicker: "엔터프라이즈",
    behaviorKicker: "동작",
    providerSectionTitle: "AI 제공자",
    providerSectionTag: "탭 설정",
    ollamaUrlLabel: "Ollama URL",
    ollamaSectionTitle: "Ollama 제어",
    ollamaSectionTag: "실시간 모델 스캔",
    lmStudioSectionTitle: "LM Studio 브리지",
    lmStudioSectionTag: "OpenAI 호환",
    lmStudioUrlLabel: "LM Studio URL",
    lmStudioModelLabel: "기본 모델 ID",
    lmStudioApiKeyLabel: "API 키",
    lmStudioHint: "나중에 OpenAI 호환 호출이나 라우팅에 사용할 수 있도록 LM Studio 서버 정보를 저장합니다.",
    geminiSectionTitle: "Gemini",
    geminiSectionTag: "Google AI",
    geminiModelLabel: "모델",
    geminiApiKeyLabel: "API 키",
    geminiHint: "나중에 클라우드 라우팅에 사용할 수 있도록 Gemini 모델과 API 키를 저장합니다.",
    azureSectionTitle: "Azure OpenAI",
    azureSectionTag: "Azure의 OpenAI",
    azureEndpointLabel: "엔드포인트",
    azureDeploymentLabel: "배포 이름",
    azureApiVersionLabel: "API 버전",
    azureApiKeyLabel: "API 키",
    azureHint: "나중에 호스팅 라우팅에 사용할 수 있도록 Azure OpenAI 연결 정보를 저장합니다.",
    generalSectionTitle: "사용 경험",
    generalSectionTag: "프롬프트 라우팅",
    defaultProviderLabel: "기본 제공자",
    defaultProviderHint: "향후 라우팅을 활성화할 때 기본으로 사용할 AI 제공자를 선택합니다.",
    replyLanguageLabel: "응답 언어",
    systemPromptLabel: "시스템 프롬프트",
    systemPromptHint: "이 프롬프트는 사용자 메시지와 페이지 컨텍스트보다 먼저 전송됩니다. 말투, 제약, 출력 규칙을 정의하는 데 사용하세요.",
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
    pageTitle: "Open Copilot 设置",
    eyebrow: "Open Copilot",
    title: "设置",
    description: "配置 Ollama、LM Studio、Gemini 与 Azure OpenAI，并调整浏览器聊天的默认体验。",
    connectionKicker: "连接",
    ollamaKicker: "本地",
    bridgeKicker: "桥接",
    geminiKicker: "云端",
    azureKicker: "企业",
    behaviorKicker: "行为",
    providerSectionTitle: "AI Providers",
    providerSectionTag: "分页设置",
    ollamaUrlLabel: "Ollama 地址",
    ollamaSectionTitle: "Ollama 控制台",
    ollamaSectionTag: "实时模型扫描",
    lmStudioSectionTitle: "LM Studio 桥接",
    lmStudioSectionTag: "OpenAI 兼容",
    lmStudioUrlLabel: "LM Studio 地址",
    lmStudioModelLabel: "默认模型 ID",
    lmStudioApiKeyLabel: "API Key",
    lmStudioHint: "可先保存 LM Studio 本地服务信息，之后接 OpenAI 兼容调用或多路由时可直接使用。",
    geminiSectionTitle: "Gemini",
    geminiSectionTag: "Google AI",
    geminiModelLabel: "模型",
    geminiApiKeyLabel: "API Key",
    geminiHint: "先把 Gemini 的模型与 API Key 保存起来，之后接云端路由时就不用重新输入。",
    azureSectionTitle: "Azure OpenAI",
    azureSectionTag: "Azure 上的 OpenAI",
    azureEndpointLabel: "Endpoint",
    azureDeploymentLabel: "Deployment",
    azureApiVersionLabel: "API Version",
    azureApiKeyLabel: "API Key",
    azureHint: "保存 Azure OpenAI 的资源端点、deployment 名称、API version 与密钥，之后接 hosted routing 时可直接使用。",
    generalSectionTitle: "体验",
    generalSectionTag: "Prompt 路由",
    defaultProviderLabel: "默认 Provider",
    defaultProviderHint: "选择未来启用多路由时默认使用的 AI provider。",
    replyLanguageLabel: "回复语言",
    systemPromptLabel: "System Prompt",
    systemPromptHint: "这段内容会先于用户消息与页面 context 一起发送给模型，适合放角色设定、格式要求与回复限制。",
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
    pageTitle: "Configuración de Open Copilot",
    eyebrow: "Open Copilot",
    title: "Configuración",
    description: "Configura Ollama, LM Studio, Gemini y Azure OpenAI, y define la experiencia predeterminada del chat en el navegador.",
    connectionKicker: "Conexión",
    ollamaKicker: "Local",
    bridgeKicker: "Puente",
    geminiKicker: "Nube",
    azureKicker: "Empresarial",
    behaviorKicker: "Comportamiento",
    providerSectionTitle: "Proveedores de IA",
    providerSectionTag: "Configuración por pestañas",
    ollamaUrlLabel: "URL de Ollama",
    ollamaSectionTitle: "Control de Ollama",
    ollamaSectionTag: "Escaneo de modelos en vivo",
    lmStudioSectionTitle: "Puente de LM Studio",
    lmStudioSectionTag: "Compatible con OpenAI",
    lmStudioUrlLabel: "URL de LM Studio",
    lmStudioModelLabel: "ID de modelo predeterminado",
    lmStudioApiKeyLabel: "Clave API",
    lmStudioHint: "Guarda aquí los datos del servidor de LM Studio para futuras llamadas compatibles con OpenAI o enrutamiento.",
    geminiSectionTitle: "Gemini",
    geminiSectionTag: "Google AI",
    geminiModelLabel: "Modelo",
    geminiApiKeyLabel: "Clave API",
    geminiHint: "Guarda aquí el modelo y la clave API de Gemini para futuras rutas en la nube.",
    azureSectionTitle: "Azure OpenAI",
    azureSectionTag: "OpenAI en Azure",
    azureEndpointLabel: "Endpoint",
    azureDeploymentLabel: "Deployment",
    azureApiVersionLabel: "Versión de API",
    azureApiKeyLabel: "Clave API",
    azureHint: "Guarda el endpoint, deployment, versión de API y clave de Azure OpenAI para futuras rutas alojadas.",
    generalSectionTitle: "Experiencia",
    generalSectionTag: "Enrutamiento de prompts",
    defaultProviderLabel: "Proveedor predeterminado",
    defaultProviderHint: "Elige qué proveedor de IA se usará por defecto cuando el enrutamiento esté habilitado.",
    replyLanguageLabel: "Idioma de respuesta",
    systemPromptLabel: "Prompt del sistema",
    systemPromptHint: "Este prompt se envía antes del mensaje del usuario y del contexto de la página. Úsalo para definir tono, límites y reglas de salida.",
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
    pageTitle: "Paramètres Open Copilot",
    eyebrow: "Open Copilot",
    title: "Paramètres",
    description: "Configurez Ollama, LM Studio, Gemini et Azure OpenAI, puis définissez l’expérience de chat par défaut dans le navigateur.",
    connectionKicker: "Connexion",
    ollamaKicker: "Local",
    bridgeKicker: "Passerelle",
    geminiKicker: "Cloud",
    azureKicker: "Entreprise",
    behaviorKicker: "Comportement",
    providerSectionTitle: "Fournisseurs IA",
    providerSectionTag: "Configuration par onglets",
    ollamaUrlLabel: "URL Ollama",
    ollamaSectionTitle: "Contrôle Ollama",
    ollamaSectionTag: "Détection des modèles en direct",
    lmStudioSectionTitle: "Passerelle LM Studio",
    lmStudioSectionTag: "Compatible OpenAI",
    lmStudioUrlLabel: "URL LM Studio",
    lmStudioModelLabel: "ID du modèle par défaut",
    lmStudioApiKeyLabel: "Clé API",
    lmStudioHint: "Enregistrez ici les informations du serveur LM Studio pour les futurs appels compatibles OpenAI ou le routage.",
    geminiSectionTitle: "Gemini",
    geminiSectionTag: "Google AI",
    geminiModelLabel: "Modèle",
    geminiApiKeyLabel: "Clé API",
    geminiHint: "Enregistrez ici le modèle Gemini et sa clé API pour un futur routage cloud.",
    azureSectionTitle: "Azure OpenAI",
    azureSectionTag: "OpenAI sur Azure",
    azureEndpointLabel: "Point de terminaison",
    azureDeploymentLabel: "Déploiement",
    azureApiVersionLabel: "Version d’API",
    azureApiKeyLabel: "Clé API",
    azureHint: "Enregistrez l’endpoint, le déploiement, la version d’API et la clé d’Azure OpenAI pour un futur routage hébergé.",
    generalSectionTitle: "Expérience",
    generalSectionTag: "Routage des prompts",
    defaultProviderLabel: "Fournisseur par défaut",
    defaultProviderHint: "Choisissez quel fournisseur IA sera utilisé par défaut lorsque le routage sera activé.",
    replyLanguageLabel: "Langue de réponse",
    systemPromptLabel: "Prompt système",
    systemPromptHint: "Ce prompt est envoyé avant le message utilisateur et le contexte de la page. Utilisez-le pour définir le ton, les contraintes et les règles de sortie.",
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
    pageTitle: "Open Copilot Einstellungen",
    eyebrow: "Open Copilot",
    title: "Einstellungen",
    description: "Konfiguriere Ollama, LM Studio, Gemini und Azure OpenAI und lege das Standardverhalten des Browser-Chats fest.",
    connectionKicker: "Verbindung",
    ollamaKicker: "Lokal",
    bridgeKicker: "Bridge",
    geminiKicker: "Cloud",
    azureKicker: "Enterprise",
    behaviorKicker: "Verhalten",
    providerSectionTitle: "KI-Anbieter",
    providerSectionTag: "Tabs",
    ollamaUrlLabel: "Ollama-URL",
    ollamaSectionTitle: "Ollama-Steuerung",
    ollamaSectionTag: "Live-Modellscan",
    lmStudioSectionTitle: "LM Studio Bridge",
    lmStudioSectionTag: "OpenAI-kompatibel",
    lmStudioUrlLabel: "LM Studio-URL",
    lmStudioModelLabel: "Standard-Modell-ID",
    lmStudioApiKeyLabel: "API-Schlüssel",
    lmStudioHint: "Speichere hier die LM-Studio-Serverdaten für spätere OpenAI-kompatible Aufrufe oder Routing.",
    geminiSectionTitle: "Gemini",
    geminiSectionTag: "Google AI",
    geminiModelLabel: "Modell",
    geminiApiKeyLabel: "API-Schlüssel",
    geminiHint: "Speichere hier Gemini-Modell und API-Schlüssel für zukünftiges Cloud-Routing.",
    azureSectionTitle: "Azure OpenAI",
    azureSectionTag: "OpenAI auf Azure",
    azureEndpointLabel: "Endpoint",
    azureDeploymentLabel: "Deployment",
    azureApiVersionLabel: "API-Version",
    azureApiKeyLabel: "API-Schlüssel",
    azureHint: "Speichere Endpoint, Deployment, API-Version und Schlüssel von Azure OpenAI für zukünftiges gehostetes Routing.",
    generalSectionTitle: "Erlebnis",
    generalSectionTag: "Prompt-Routing",
    defaultProviderLabel: "Standardanbieter",
    defaultProviderHint: "Wähle, welcher KI-Anbieter standardmäßig verwendet werden soll, wenn Routing aktiviert ist.",
    replyLanguageLabel: "Antwortsprache",
    systemPromptLabel: "System-Prompt",
    systemPromptHint: "Dieser Prompt wird vor der Nutzernachricht und dem Seitenkontext gesendet. Nutze ihn für Ton, Einschränkungen und Ausgaberegeln.",
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
    pageTitle: "Configurações do Open Copilot",
    eyebrow: "Open Copilot",
    title: "Configurações",
    description: "Configure Ollama, LM Studio, Gemini e Azure OpenAI e defina a experiência padrão do chat no navegador.",
    connectionKicker: "Conexão",
    ollamaKicker: "Local",
    bridgeKicker: "Ponte",
    geminiKicker: "Nuvem",
    azureKicker: "Corporativo",
    behaviorKicker: "Comportamento",
    providerSectionTitle: "Provedores de IA",
    providerSectionTag: "Configuração por abas",
    ollamaUrlLabel: "URL do Ollama",
    ollamaSectionTitle: "Controle do Ollama",
    ollamaSectionTag: "Varredura de modelos em tempo real",
    lmStudioSectionTitle: "Ponte LM Studio",
    lmStudioSectionTag: "Compatível com OpenAI",
    lmStudioUrlLabel: "URL do LM Studio",
    lmStudioModelLabel: "ID do modelo padrão",
    lmStudioApiKeyLabel: "Chave da API",
    lmStudioHint: "Salve aqui os dados do servidor LM Studio para futuras chamadas compatíveis com OpenAI ou roteamento.",
    geminiSectionTitle: "Gemini",
    geminiSectionTag: "Google AI",
    geminiModelLabel: "Modelo",
    geminiApiKeyLabel: "Chave da API",
    geminiHint: "Salve aqui o modelo Gemini e a chave da API para uso futuro em roteamento na nuvem.",
    azureSectionTitle: "Azure OpenAI",
    azureSectionTag: "OpenAI no Azure",
    azureEndpointLabel: "Endpoint",
    azureDeploymentLabel: "Deployment",
    azureApiVersionLabel: "Versão da API",
    azureApiKeyLabel: "Chave da API",
    azureHint: "Salve endpoint, deployment, versão da API e chave do Azure OpenAI para roteamento hospedado no futuro.",
    generalSectionTitle: "Experiência",
    generalSectionTag: "Roteamento de prompt",
    defaultProviderLabel: "Provedor padrão",
    defaultProviderHint: "Escolha qual provedor de IA deve ser usado por padrão quando o roteamento estiver habilitado.",
    replyLanguageLabel: "Idioma da resposta",
    systemPromptLabel: "Prompt do sistema",
    systemPromptHint: "Este prompt é enviado antes da mensagem do usuário e do contexto da página. Use-o para definir tom, restrições e regras de saída.",
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
    pageTitle: "Open Copilot सेटिंग्स",
    eyebrow: "Open Copilot",
    title: "सेटिंग्स",
    description: "Ollama, LM Studio, Gemini और Azure OpenAI कॉन्फ़िगर करें और ब्राउज़र चैट का डिफ़ॉल्ट अनुभव तय करें।",
    connectionKicker: "कनेक्शन",
    ollamaKicker: "लोकल",
    bridgeKicker: "ब्रिज",
    geminiKicker: "क्लाउड",
    azureKicker: "एंटरप्राइज़",
    behaviorKicker: "व्यवहार",
    providerSectionTitle: "AI प्रदाता",
    providerSectionTag: "टैब सेटअप",
    ollamaUrlLabel: "Ollama URL",
    ollamaSectionTitle: "Ollama नियंत्रण",
    ollamaSectionTag: "लाइव मॉडल स्कैन",
    lmStudioSectionTitle: "LM Studio ब्रिज",
    lmStudioSectionTag: "OpenAI संगत",
    lmStudioUrlLabel: "LM Studio URL",
    lmStudioModelLabel: "डिफ़ॉल्ट मॉडल ID",
    lmStudioApiKeyLabel: "API कुंजी",
    lmStudioHint: "भविष्य में OpenAI-संगत कॉल या रूटिंग के लिए LM Studio सर्वर विवरण यहां सहेजें।",
    geminiSectionTitle: "Gemini",
    geminiSectionTag: "Google AI",
    geminiModelLabel: "मॉडल",
    geminiApiKeyLabel: "API कुंजी",
    geminiHint: "भविष्य की क्लाउड रूटिंग के लिए Gemini मॉडल और API कुंजी यहां सहेजें।",
    azureSectionTitle: "Azure OpenAI",
    azureSectionTag: "Azure पर OpenAI",
    azureEndpointLabel: "एंडपॉइंट",
    azureDeploymentLabel: "डिप्लॉयमेंट",
    azureApiVersionLabel: "API संस्करण",
    azureApiKeyLabel: "API कुंजी",
    azureHint: "भविष्य की होस्टेड रूटिंग के लिए Azure OpenAI endpoint, deployment, API version और कुंजी सहेजें।",
    generalSectionTitle: "अनुभव",
    generalSectionTag: "प्रॉम्प्ट रूटिंग",
    defaultProviderLabel: "डिफ़ॉल्ट प्रदाता",
    defaultProviderHint: "रूटिंग सक्षम होने पर डिफ़ॉल्ट रूप से कौन सा AI प्रदाता उपयोग होगा, यह चुनें।",
    replyLanguageLabel: "उत्तर भाषा",
    systemPromptLabel: "सिस्टम प्रॉम्प्ट",
    systemPromptHint: "यह प्रॉम्प्ट उपयोगकर्ता संदेश और पेज कॉन्टेक्स्ट से पहले भेजा जाता है। इसका उपयोग टोन, सीमाएँ और आउटपुट नियम तय करने के लिए करें।",
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

const LOCAL_DB_NAME = "edge-ai-chat-local-db";
const LOCAL_DB_VERSION = 1;
const LOCAL_DB_STORE = "kv";
const WORK_FOLDER_HANDLE_KEY = "work-folder-handle";
const LOCAL_META_KEY = "localWorkFolderMeta";
const MAX_CUSTOM_STARTERS = 20;

let currentLocale = OPTION_I18N["zh-TW"];
let activeProviderTab = "ollama";
let activeUtilityTab = "experience";
let currentCustomStarters = [];
const SETTINGS_THEME_OPTIONS = new Set(["system", "dark", "light"]);
const SYSTEM_THEME_MEDIA_QUERY = typeof window.matchMedia === "function"
  ? window.matchMedia("(prefers-color-scheme: light)")
  : null;

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

async function persistWorkFolderHandle(handle) {
  await idbSet(WORK_FOLDER_HANDLE_KEY, handle);
  await chrome.storage.local.set({
    [LOCAL_META_KEY]: {
      name: handle?.name || "",
      displayPath: handle?.name ? `/${handle.name}` : "",
      configuredAt: new Date().toISOString(),
    },
  });
}

async function clearPersistedWorkFolderHandle() {
  await idbDelete(WORK_FOLDER_HANDLE_KEY);
  await chrome.storage.local.remove(LOCAL_META_KEY);
}
const STARTER_SCOPE_ORDER = ["all", "generic", "article", "code", "email", "github", "collaboration", "document", "market", "entertainment"];
const STARTER_SCOPE_ALIASES = {
  "*": "all",
  any: "all",
  all: "all",
  default: "generic",
  general: "generic",
  repo: "github",
  repository: "github",
  git: "github",
  docs: "document",
  doc: "document",
  teamwork: "collaboration",
  chat: "collaboration",
  finance: "market",
};

function sendMessage(message) {
  return new Promise((resolve) => chrome.runtime.sendMessage(message, resolve));
}

function t(key, vars = {}) {
  const template = currentLocale[key] || OPTION_I18N.en[key] || key;
  return template.replace(/\{(\w+)\}/g, (_match, name) => String(vars[name] ?? ""));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function applyTranslations() {
  document.title = t("pageTitle");
  document.getElementById("settingsEyebrow").textContent = t("eyebrow");
  document.getElementById("settingsTitle").textContent = t("title");
  document.getElementById("settingsDescription").textContent = t("description");
  document.getElementById("connectionKicker").textContent = t("connectionKicker");
  document.getElementById("ollamaKicker").textContent = t("ollamaKicker");
  document.getElementById("bridgeKicker").textContent = t("bridgeKicker");
  document.getElementById("geminiKicker").textContent = t("geminiKicker");
  document.getElementById("azureKicker").textContent = t("azureKicker");
  document.getElementById("behaviorKicker").textContent = t("behaviorKicker");
  document.getElementById("providerSectionTitle").textContent = t("providerSectionTitle");
  document.getElementById("providerSectionTag").textContent = t("providerSectionTag");
  document.getElementById("ollamaSectionTitle").textContent = t("ollamaSectionTitle");
  document.getElementById("ollamaSectionTag").textContent = t("ollamaSectionTag");
  document.getElementById("ollamaUrlLabel").textContent = t("ollamaUrlLabel");
  document.getElementById("lmStudioSectionTitle").textContent = t("lmStudioSectionTitle");
  document.getElementById("lmStudioSectionTag").textContent = t("lmStudioSectionTag");
  document.getElementById("lmStudioUrlLabel").textContent = t("lmStudioUrlLabel");
  document.getElementById("lmStudioModelLabel").textContent = t("lmStudioModelLabel");
  document.getElementById("lmStudioApiKeyLabel").textContent = t("lmStudioApiKeyLabel");
  document.getElementById("lmStudioHint").textContent = t("lmStudioHint");
  document.getElementById("geminiSectionTitle").textContent = t("geminiSectionTitle");
  document.getElementById("geminiSectionTag").textContent = t("geminiSectionTag");
  document.getElementById("geminiModelLabel").textContent = t("geminiModelLabel");
  document.getElementById("geminiApiKeyLabel").textContent = t("geminiApiKeyLabel");
  document.getElementById("geminiHint").textContent = t("geminiHint");
  document.getElementById("azureSectionTitle").textContent = t("azureSectionTitle");
  document.getElementById("azureSectionTag").textContent = t("azureSectionTag");
  document.getElementById("azureEndpointLabel").textContent = t("azureEndpointLabel");
  document.getElementById("azureDeploymentLabel").textContent = t("azureDeploymentLabel");
  document.getElementById("azureApiVersionLabel").textContent = t("azureApiVersionLabel");
  document.getElementById("azureApiKeyLabel").textContent = t("azureApiKeyLabel");
  document.getElementById("azureHint").textContent = t("azureHint");
  document.getElementById("githubApiKeyLabel").textContent = t("githubApiKeyLabel");
  document.getElementById("githubApiKeyHint").textContent = t("githubApiKeyHint");
  document.getElementById("generalSectionTitle").textContent = t("generalSectionTitle");
  document.getElementById("generalSectionTag").textContent = t("generalSectionTag");
  document.getElementById("localWorkFolderLabel").textContent = t("localWorkFolderLabel");
  document.getElementById("localWorkFolderHint").textContent = t("localWorkFolderHint");
  document.getElementById("pickFolderButton").textContent = t("pickFolder");
  document.getElementById("clearFolderButton").textContent = t("clearFolder");
  document.getElementById("workFolderPullButton").textContent = t("workFolderPull");
  document.getElementById("workFolderPushButton").textContent = t("workFolderPush");
  document.getElementById("localWorkFolderPathLabel").textContent = t("folderPathLabel");
  document.getElementById("googleDriveSyncLabel").textContent = t("googleDriveSyncLabel");
  document.getElementById("googleDriveClientIdLabel").textContent = t("googleDriveClientIdLabel");
  document.getElementById("googleDriveSyncEnabledLabel").textContent = t("googleDriveSyncEnabledLabel");
  document.getElementById("googleDriveAutoSyncLabel").textContent = t("googleDriveAutoSyncLabel");
  document.getElementById("googleDriveConnectButton").textContent = t("googleDriveConnect");
  document.getElementById("googleDrivePullButton").textContent = t("googleDrivePull");
  document.getElementById("googleDrivePushButton").textContent = t("googleDrivePush");
  document.getElementById("googleDriveDisconnectButton").textContent = t("googleDriveDisconnect");
  document.getElementById("googleDriveSyncHint").textContent = t("googleDriveSyncHint");
  document.getElementById("googleDriveRedirectLabel").textContent = t("googleDriveRedirectLabel");
  document.getElementById("defaultProviderLabel").textContent = t("defaultProviderLabel");
  document.getElementById("defaultProviderHint").textContent = t("defaultProviderHint");
  document.getElementById("replyLanguageLabel").textContent = t("replyLanguageLabel");
  document.getElementById("settingsThemeToolbarLabel").textContent = t("settingsThemeLabel");
  document.getElementById("settingsThemeToolbarSystemOption").textContent = t("settingsThemeSystem");
  document.getElementById("settingsThemeToolbarDarkOption").textContent = t("settingsThemeDark");
  document.getElementById("settingsThemeToolbarLightOption").textContent = t("settingsThemeLight");
  document.getElementById("taskExtractionWindowDaysLabel").textContent = t("taskExtractionWindowDaysLabel");
  document.getElementById("taskExtractionWindowDaysHint").textContent = t("taskExtractionWindowDaysHint");
  document.getElementById("starterHoverTipsEnabledLabel").textContent = t("starterHoverTipsEnabledLabel");
  document.getElementById("starterHoverTipsEnabledHint").textContent = t("starterHoverTipsEnabledHint");
  renderTaskExtractionWindowChoices();
  document.getElementById("systemPromptLabel").textContent = t("systemPromptLabel");
  document.getElementById("multiPerspectiveProfilesLabel").textContent = t("multiPerspectiveProfilesLabel");
  document.getElementById("tabExperience").textContent = t("utilityTabExperience");
  document.getElementById("tabStarterSkills").textContent = t("utilityTabStarterSkills");
  document.getElementById("customStartersLabel").textContent = t("customStartersLabel");
  document.getElementById("customStartersInputLabel").textContent = t("customStartersInputLabel");
  document.getElementById("starterLibraryKicker").textContent = t("starterLibraryKicker");
  document.getElementById("starterLibraryTitle").textContent = t("starterLibraryTitle");
  document.getElementById("starterLibraryDescription").textContent = t("starterLibraryDescription");
  document.getElementById("starterLibraryStoredLabel").textContent = t("starterLibraryStoredLabel");
  document.getElementById("starterLibraryCapacityLabel").textContent = t("starterLibraryCapacityLabel");
  document.getElementById("starterLibraryLimitHint").textContent = t("starterLibraryLimitHint");
  document.getElementById("starterLibraryGridTitle").textContent = t("starterLibraryGridTitle");
  document.getElementById("starterLibraryGridDescription").textContent = t("starterLibraryGridDescription");
  document.getElementById("starterLibraryCapacityValue").textContent = String(MAX_CUSTOM_STARTERS);
  document.getElementById("systemPromptHint").textContent = t("systemPromptHint");
  document.getElementById("multiPerspectiveProfilesHint").textContent = t("multiPerspectiveProfilesHint");
  document.getElementById("customStartersHint").textContent = t("customStartersHint");
  document.getElementById("customStartersInput").placeholder = t("customStartersInputPlaceholder");
  document.getElementById("createStartersButton").textContent = t("createStarters");
  document.getElementById("clearStartersButton").textContent = t("clearStarters");
  document.getElementById("saveButton").textContent = t("saveSettings");
  document.getElementById("testButton").textContent = t("testConnection");
  document.getElementById("installedModelsTitle").textContent = t("installedModels");
  document.getElementById("refreshButton").textContent = t("refresh");
  setActiveUtilityTab(activeUtilityTab);
  renderCustomStartersPreview(currentCustomStarters);
}

function slugifyStarterId(value, fallback = "starter") {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || fallback;
}

function normalizeStarterScopeToken(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^type:/, "")
    .replace(/^adapter:/, "");
  return STARTER_SCOPE_ALIASES[normalized] || normalized || "all";
}

function normalizeTaskExtractionWindowDays(value) {
  const parsed = Number.parseInt(String(value || "3"), 10);
  if (!Number.isFinite(parsed)) {
    return 3;
  }
  return Math.min(Math.max(parsed, 1), 7);
}

function normalizeSettingsTheme(value) {
  const normalized = String(value || "system").trim().toLowerCase();
  return SETTINGS_THEME_OPTIONS.has(normalized) ? normalized : "system";
}

function resolveSettingsTheme(value) {
  const normalized = normalizeSettingsTheme(value);
  if (normalized === "system") {
    return SYSTEM_THEME_MEDIA_QUERY?.matches ? "light" : "dark";
  }
  return normalized;
}

function applySettingsTheme(value) {
  const normalized = normalizeSettingsTheme(value);
  document.body.dataset.themePreference = normalized;
  document.body.dataset.theme = resolveSettingsTheme(normalized);
  const toolbarSelect = document.getElementById("settingsThemeToolbar");
  if (toolbarSelect && toolbarSelect.value !== normalized) {
    toolbarSelect.value = normalized;
  }
}

function renderTaskExtractionWindowChoices() {
  const select = document.getElementById("taskExtractionWindowDays");
  if (!(select instanceof HTMLSelectElement)) {
    return;
  }

  const isZh = currentLocale === OPTION_I18N["zh-TW"];
  Array.from(select.options).forEach((option) => {
    const days = normalizeTaskExtractionWindowDays(option.value);
    option.textContent = isZh ? `${days} 天` : `${days} day${days > 1 ? "s" : ""}`;
  });
}

function summarizeSyncPayload(payload = {}) {
  return {
    starters: Array.isArray(payload.customStarters) ? payload.customStarters.length : 0,
    tasks: Array.isArray(payload.tasks) ? payload.tasks.length : 0,
    chat: payload.latestChatSession ? 1 : 0,
    documents: Array.isArray(payload.documents) ? payload.documents.length : 0,
  };
}

function normalizeStarterScopes(value) {
  const rawScopes = Array.isArray(value) ? value : value ? [value] : ["all"];
  const scopes = rawScopes
    .map((item) => normalizeStarterScopeToken(item))
    .filter(Boolean)
    .filter((scope, index, list) => list.indexOf(scope) === index);
  return scopes.length ? scopes : ["all"];
}

function normalizeImportedStarter(item, index) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    throw new Error(t("customStarterImportFailed"));
  }

  const label = String(item.label || item.title || item.name || "").trim();
  const prompt = String(item.prompt || item.instruction || item.text || "").trim();
  if (!label || !prompt) {
    throw new Error(t("customStarterImportFailed"));
  }

  const modeValue = String(item.mode || item.composeMode || "chat").trim().toLowerCase();
  const mode = modeValue === "perspective" ? "perspective" : "chat";
  const description = String(item.description || item.summary || item.hint || "").trim();

  return {
    id: String(item.id || slugifyStarterId(label, `custom-${index + 1}`)).trim() || `custom-${index + 1}`,
    label,
    prompt,
    description,
    scopes: normalizeStarterScopes(item.scopes ?? item.scope ?? item.pageTypes ?? item.pageType),
    mode,
  };
}

function unwrapImportedStarterText(rawText) {
  const text = String(rawText || "").trim();
  if (!text) {
    return text;
  }

  const fencedMatch = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  return text;
}

function parseStarterJsonLikeText(rawText) {
  let candidate = unwrapImportedStarterText(rawText);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const parsed = JSON.parse(candidate);
    if (typeof parsed === "string") {
      candidate = parsed.trim();
      continue;
    }
    return parsed;
  }

  throw new Error(t("customStarterImportFailed"));
}

function parseImportedStarters(rawText) {
  const parsed = parseStarterJsonLikeText(rawText);
  const starters = Array.isArray(parsed) ? parsed : parsed?.starters;
  if (!Array.isArray(starters)) {
    throw new Error(t("customStarterImportFailed"));
  }

  return starters.map((item, index) => normalizeImportedStarter(item, index));
}

function getScopeLabel(scope) {
  if (scope === "all") {
    return t("starterPreviewScopeAll");
  }
  return scope;
}

function getModeLabel(mode) {
  return mode === "perspective" ? t("starterPreviewModePerspective") : t("starterPreviewModeChat");
}

function renderCustomStarterLibraryMeta() {
  const countNode = document.getElementById("customStartersCount");
  if (countNode) {
    countNode.textContent = `${currentCustomStarters.length} / ${MAX_CUSTOM_STARTERS}`;
  }
}

function mergeImportedStarters(existingStarters, importedStarters) {
  const merged = new Map(
    (Array.isArray(existingStarters) ? existingStarters : [])
      .map((item, index) => normalizeImportedStarter(item, index))
      .map((starter) => [starter.id, starter])
  );

  importedStarters.forEach((starter) => {
    merged.set(starter.id, starter);
  });

  const nextStarters = Array.from(merged.values());
  if (nextStarters.length > MAX_CUSTOM_STARTERS) {
    throw new Error(t("customStarterLimitReached", { limit: MAX_CUSTOM_STARTERS }));
  }

  return nextStarters;
}

function setActiveUtilityTab(tab) {
  activeUtilityTab = tab === "starterSkills" ? "starterSkills" : "experience";

  document.querySelectorAll("[data-utility-tab]").forEach((button) => {
    const isActive = button.dataset.utilityTab === activeUtilityTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  document.querySelectorAll(".utility-panel").forEach((panel) => {
    const isActive = panel.id === `panel-${activeUtilityTab === "starterSkills" ? "starter-skills" : "experience"}`;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

function renderCustomStartersPreview(starters) {
  const node = document.getElementById("customStartersPreview");
  if (!node) {
    return;
  }

  renderCustomStarterLibraryMeta();

  if (!starters.length) {
    node.className = "starter-preview-list empty-state";
    node.textContent = t("noCustomStarters");
    return;
  }

  node.className = "starter-preview-list";
  node.innerHTML = starters
    .map((starter) => {
      const orderedScopes = [...starter.scopes].sort((left, right) => {
        const leftIndex = STARTER_SCOPE_ORDER.indexOf(left);
        const rightIndex = STARTER_SCOPE_ORDER.indexOf(right);
        if (leftIndex === -1 && rightIndex === -1) {
          return left.localeCompare(right);
        }
        if (leftIndex === -1) {
          return 1;
        }
        if (rightIndex === -1) {
          return -1;
        }
        return leftIndex - rightIndex;
      });
      return `
        <article class="starter-preview-card">
          <div class="starter-preview-head">
            <div class="starter-preview-skill-meta">
              <div class="starter-preview-skill-kicker">${escapeHtml(starter.id)}</div>
              <div class="starter-preview-name">${escapeHtml(starter.label)}</div>
            </div>
            <div class="starter-preview-actions">
              <div class="starter-preview-mode">${escapeHtml(getModeLabel(starter.mode))}</div>
              <button class="secondary-button danger-button starter-preview-delete" type="button" data-action="delete-custom-starter" data-starter-id="${escapeHtml(starter.id)}">${escapeHtml(t("deleteStarter"))}</button>
            </div>
          </div>
          <div class="starter-preview-scopes">
            ${orderedScopes.map((scope) => `<span class="starter-preview-scope">${escapeHtml(getScopeLabel(scope))}</span>`).join("")}
          </div>
          <div class="starter-preview-prompt">${escapeHtml(starter.prompt)}</div>
        </article>
      `;
    })
    .join("");
}

async function persistCustomStarters(starters) {
  const saved = await sendMessage({
    type: "ollama:set-config",
    config: {
      customStarters: starters,
    },
  });

  if (!saved?.ok) {
    throw new Error(saved?.error || t("saveFailed"));
  }
}

function setActiveProviderTab(provider) {
  activeProviderTab = provider;
  document.querySelectorAll("[data-provider-tab]").forEach((button) => {
    const isActive = button.dataset.providerTab === provider;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  document.querySelectorAll(".provider-panel").forEach((panel) => {
    const isActive = panel.id === `panel-${provider}`;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
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

async function selectModel(model) {
  const result = await sendMessage({ type: "ollama:select-model", model });
  if (!result?.ok) {
    throw new Error(result?.error || t("saveFailed"));
  }
  await refreshModels();
}

function renderModels(models, config = {}) {
  const list = document.getElementById("modelsList");
  list.innerHTML = "";

  if (!models.length) {
    list.innerHTML = `<div class="empty-state">${t("noModels")}</div>`;
    return;
  }

  models.forEach((model) => {
    const button = document.createElement("button");
    const isSelected = config.selectedModel === model.name;
    button.type = "button";
    button.className = "model-card button-card is-detected";
    if (isSelected) {
      button.classList.add("is-selected");
    }
    button.setAttribute("aria-pressed", String(isSelected));
    button.innerHTML = `
      <div class="model-card-name">${model.name}</div>
      <div class="model-card-meta">${formatSize(model.size)}</div>
    `;
    button.addEventListener("click", async () => {
      try {
        await selectModel(model.name);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : String(error), true);
      }
    });
    list.appendChild(button);
  });
}

function setStatus(message, isError = false) {
  const node = document.getElementById("statusMessage");
  node.textContent = message;
  node.classList.toggle("is-error", isError);
}

function renderWorkFolderStatus(status) {
  const node = document.getElementById("localWorkFolderStatus");
  const pathNode = document.getElementById("localWorkFolderPath");
  if (!status?.configured) {
    node.textContent = t("folderNotSelected");
    pathNode.textContent = t("folderPathUnavailable");
    return;
  }

  if (status.permission !== "granted") {
    node.textContent = t("folderPermissionMissing");
  } else {
    node.textContent = t("folderReady", { name: status.folderName || "Unnamed folder" });
  }

  const fallbackPath = status.folderName ? `/${status.folderName}` : "";
  pathNode.textContent = status.folderPath || fallbackPath || t("folderPathUnavailable");
}

async function loadWorkFolderStatus() {
  const result = await sendMessage({ type: "ollama:get-work-folder-status" });
  if (result?.ok) {
    renderWorkFolderStatus(result.status);
  }
}

function renderGoogleDriveStatus(status) {
  const statusNode = document.getElementById("googleDriveSyncStatus");
  const redirectNode = document.getElementById("googleDriveRedirectUrl");
  redirectNode.textContent = status?.redirectUrl || t("folderPathUnavailable");

  const parts = [status?.connected ? t("googleDriveConnected") : t("googleDriveNotConnected")];
  if (status?.lastSyncAt) {
    parts.push(t("googleDriveLastSync", { time: new Date(status.lastSyncAt).toLocaleString() }));
  }
  if (status?.lastError) {
    parts.push(t("googleDriveLastError", { error: status.lastError }));
  }
  statusNode.textContent = parts.join(" ");
  statusNode.classList.toggle("is-error", Boolean(status?.lastError));
}

async function loadGoogleDriveStatus() {
  const result = await sendMessage({ type: "google-drive:get-status" });
  if (result?.ok) {
    renderGoogleDriveStatus(result.status);
  }
}

async function loadConfig() {
  const result = await sendMessage({ type: "ollama:get-config" });
  if (result?.ok) {
    const replyLanguage = result.config.replyLanguage || "zh-TW";
    const settingsTheme = normalizeSettingsTheme(result.config.settingsTheme);
    currentLocale = OPTION_I18N[replyLanguage] || OPTION_I18N.en;
    applyTranslations();
    document.getElementById("ollamaUrl").value = result.config.ollamaUrl || "";
    document.getElementById("lmStudioUrl").value = result.config.lmStudioUrl || "";
    document.getElementById("lmStudioModel").value = result.config.lmStudioModel || "";
    document.getElementById("lmStudioApiKey").value = result.config.lmStudioApiKey || "";
    document.getElementById("geminiModel").value = result.config.geminiModel || "";
    document.getElementById("geminiApiKey").value = result.config.geminiApiKey || "";
    document.getElementById("githubApiKey").value = result.config.githubApiKey || "";
    document.getElementById("azureOpenAiEndpoint").value = result.config.azureOpenAiEndpoint || "";
    document.getElementById("azureOpenAiDeployment").value = result.config.azureOpenAiDeployment || "";
    document.getElementById("azureOpenAiApiVersion").value = result.config.azureOpenAiApiVersion || "";
    document.getElementById("azureOpenAiApiKey").value = result.config.azureOpenAiApiKey || "";
    document.getElementById("googleDriveClientId").value = result.config.googleDriveClientId || "";
    document.getElementById("googleDriveSyncEnabled").checked = Boolean(result.config.googleDriveSyncEnabled);
    document.getElementById("googleDriveAutoSync").checked = result.config.googleDriveAutoSync !== false;
    document.getElementById("defaultProvider").value = result.config.defaultProvider || "ollama";
    document.getElementById("replyLanguage").value = replyLanguage;
    document.getElementById("settingsThemeToolbar").value = settingsTheme;
    document.getElementById("taskExtractionWindowDays").value = String(normalizeTaskExtractionWindowDays(result.config.taskExtractionWindowDays));
    document.getElementById("starterHoverTipsEnabled").checked = result.config.starterHoverTipsEnabled !== false;
    document.getElementById("systemPrompt").value = result.config.systemPrompt || "";
    document.getElementById("multiPerspectiveProfiles").value = result.config.multiPerspectiveProfiles || "";
    try {
      currentCustomStarters = Array.isArray(result.config.customStarters) ? result.config.customStarters.map((item, index) => normalizeImportedStarter(item, index)) : [];
    } catch (_error) {
      currentCustomStarters = [];
    }
    renderCustomStartersPreview(currentCustomStarters);
    applySettingsTheme(settingsTheme);
    setActiveProviderTab(result.config.defaultProvider || "ollama");
    await loadWorkFolderStatus();
    await loadGoogleDriveStatus();
    setStatus(t("waiting"));
  }
}

async function saveConfig() {
  const ollamaUrl = document.getElementById("ollamaUrl").value.trim();
  const lmStudioUrl = document.getElementById("lmStudioUrl").value.trim();
  const lmStudioModel = document.getElementById("lmStudioModel").value.trim();
  const lmStudioApiKey = document.getElementById("lmStudioApiKey").value.trim();
  const geminiModel = document.getElementById("geminiModel").value.trim();
  const geminiApiKey = document.getElementById("geminiApiKey").value.trim();
  const githubApiKey = document.getElementById("githubApiKey").value.trim();
  const azureOpenAiEndpoint = document.getElementById("azureOpenAiEndpoint").value.trim();
  const azureOpenAiDeployment = document.getElementById("azureOpenAiDeployment").value.trim();
  const azureOpenAiApiVersion = document.getElementById("azureOpenAiApiVersion").value.trim();
  const azureOpenAiApiKey = document.getElementById("azureOpenAiApiKey").value.trim();
  const googleDriveClientId = document.getElementById("googleDriveClientId").value.trim();
  const googleDriveSyncEnabled = document.getElementById("googleDriveSyncEnabled").checked;
  const googleDriveAutoSync = document.getElementById("googleDriveAutoSync").checked;
  const defaultProvider = document.getElementById("defaultProvider").value;
  const replyLanguage = document.getElementById("replyLanguage").value;
  const settingsTheme = normalizeSettingsTheme(document.getElementById("settingsThemeToolbar").value);
  const taskExtractionWindowDays = normalizeTaskExtractionWindowDays(document.getElementById("taskExtractionWindowDays").value);
  const starterHoverTipsEnabled = document.getElementById("starterHoverTipsEnabled").checked;
  const systemPrompt = document.getElementById("systemPrompt").value.trim();
  const multiPerspectiveProfiles = document.getElementById("multiPerspectiveProfiles").value.trim();
  currentLocale = OPTION_I18N[replyLanguage] || OPTION_I18N.en;
  applyTranslations();
  applySettingsTheme(settingsTheme);
  const saved = await sendMessage({
    type: "ollama:set-config",
    config: {
      ollamaUrl,
      lmStudioUrl,
      lmStudioModel,
      lmStudioApiKey,
      geminiModel,
      geminiApiKey,
      githubApiKey,
      azureOpenAiEndpoint,
      azureOpenAiDeployment,
      azureOpenAiApiVersion,
      azureOpenAiApiKey,
      googleDriveClientId,
      googleDriveSyncEnabled,
      googleDriveAutoSync,
      defaultProvider,
      replyLanguage,
      settingsTheme,
      taskExtractionWindowDays,
      starterHoverTipsEnabled,
      systemPrompt,
      multiPerspectiveProfiles,
      customStarters: currentCustomStarters,
    },
  });

  if (!saved?.ok) {
    throw new Error(saved?.error || t("saveFailed"));
  }

  setStatus(t("saveSuccess"));
}

async function refreshModels() {
  setStatus(t("loadingModels"));
  const result = await sendMessage({ type: "ollama:list-models" });
  if (!result?.ok) {
    renderModels([], result?.config || {});
    throw new Error(result?.error || t("fetchModelsFailed"));
  }

  renderModels(result.models || [], result.config || {});
  setStatus(t("connectedSummary", { baseUrl: result.baseUrl, count: result.models.length }));
}

document.getElementById("saveButton").addEventListener("click", async () => {
  try {
    await saveConfig();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
});

document.getElementById("settingsThemeToolbar").addEventListener("change", (event) => {
  applySettingsTheme(event.target.value);
});

if (typeof SYSTEM_THEME_MEDIA_QUERY?.addEventListener === "function") {
  SYSTEM_THEME_MEDIA_QUERY.addEventListener("change", () => {
    applySettingsTheme(document.getElementById("settingsThemeToolbar").value);
  });
} else if (typeof SYSTEM_THEME_MEDIA_QUERY?.addListener === "function") {
  SYSTEM_THEME_MEDIA_QUERY.addListener(() => {
    applySettingsTheme(document.getElementById("settingsThemeToolbar").value);
  });
}

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

document.getElementById("createStartersButton").addEventListener("click", async () => {
  try {
    const rawText = document.getElementById("customStartersInput").value.trim();
    if (!rawText) {
      throw new Error(t("customStarterImportFailed"));
    }
    const importedStarters = parseImportedStarters(rawText);
    currentCustomStarters = mergeImportedStarters(currentCustomStarters, importedStarters);
    renderCustomStartersPreview(currentCustomStarters);
    await persistCustomStarters(currentCustomStarters);
    document.getElementById("customStartersInput").value = "";
    setStatus(t("customStarterImported", { count: importedStarters.length, total: currentCustomStarters.length, limit: MAX_CUSTOM_STARTERS }));
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
});

document.getElementById("clearStartersButton").addEventListener("click", async () => {
  try {
    if (!window.confirm(t("confirmClearStarters"))) {
      return;
    }
    currentCustomStarters = [];
    renderCustomStartersPreview(currentCustomStarters);
    await persistCustomStarters([]);
    setStatus(t("customStarterCleared"));
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
});

document.getElementById("customStartersPreview").addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const actionNode = target.closest("[data-action='delete-custom-starter']");
  if (!(actionNode instanceof HTMLElement)) {
    return;
  }

  const starterId = actionNode.dataset.starterId || "";
  const starter = currentCustomStarters.find((item) => item.id === starterId);
  if (!starter) {
    return;
  }

  try {
    if (!window.confirm(t("confirmDeleteStarter", { name: starter.label }))) {
      return;
    }
    currentCustomStarters = currentCustomStarters.filter((item) => item.id !== starterId);
    renderCustomStartersPreview(currentCustomStarters);
    await persistCustomStarters(currentCustomStarters);
    setStatus(t("customStarterDeleted", { name: starter.label }));
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
});

document.getElementById("pickFolderButton").addEventListener("click", async () => {
  try {
    if (typeof window.showDirectoryPicker !== "function") {
      throw new Error(t("folderChooseUnsupported"));
    }

    const handle = await window.showDirectoryPicker({ mode: "readwrite" });
    if (typeof handle.requestPermission === "function") {
      const permission = await handle.requestPermission({ mode: "readwrite" });
      if (permission !== "granted") {
        throw new Error(t("folderPermissionMissing"));
      }
    }
    await persistWorkFolderHandle(handle);
    await loadWorkFolderStatus();
    setStatus(t("folderSaveSuccess"));
  } catch (error) {
    if (error?.name === "AbortError") {
      return;
    }
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
});

document.getElementById("clearFolderButton").addEventListener("click", async () => {
  try {
    if (!window.confirm(t("confirmClearFolder"))) {
      return;
    }
    await clearPersistedWorkFolderHandle();
    renderWorkFolderStatus(null);
    setStatus(t("folderClearSuccess"));
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
});

document.getElementById("workFolderPushButton").addEventListener("click", async () => {
  try {
    await saveConfig();
    const result = await sendMessage({ type: "work-folder:sync-push" });
    if (!result?.ok) {
      throw new Error(result?.error || t("folderSaveFailed"));
    }
    renderWorkFolderStatus(result.status);
    setStatus(t("workFolderPushSuccess", summarizeSyncPayload(result?.result?.payload)));
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
});

document.getElementById("workFolderPullButton").addEventListener("click", async () => {
  try {
    const result = await sendMessage({ type: "work-folder:sync-pull" });
    if (!result?.ok) {
      throw new Error(result?.error || t("folderSaveFailed"));
    }
    renderWorkFolderStatus(result.status);
    await loadConfig();
    setStatus(t("workFolderPullSuccess", summarizeSyncPayload(result?.result?.payload)));
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
});

document.getElementById("googleDriveConnectButton").addEventListener("click", async () => {
  try {
    document.getElementById("googleDriveSyncEnabled").checked = true;
    await saveConfig();
    if (!document.getElementById("googleDriveClientId").value.trim()) {
      throw new Error(t("googleDriveMissingClientId"));
    }
    const result = await sendMessage({ type: "google-drive:connect" });
    if (!result?.ok) {
      throw new Error(result?.error || t("saveFailed"));
    }
    renderGoogleDriveStatus(result.status);
    setStatus(t("googleDriveConnectSuccess"));
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
});

document.getElementById("googleDriveDisconnectButton").addEventListener("click", async () => {
  try {
    const result = await sendMessage({ type: "google-drive:disconnect" });
    if (!result?.ok) {
      throw new Error(result?.error || t("saveFailed"));
    }
    renderGoogleDriveStatus(result.status);
    setStatus(t("googleDriveDisconnectSuccess"));
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
});

document.getElementById("googleDrivePushButton").addEventListener("click", async () => {
  try {
    await saveConfig();
    const result = await sendMessage({ type: "google-drive:sync-push" });
    if (!result?.ok) {
      throw new Error(result?.error || t("saveFailed"));
    }
    renderGoogleDriveStatus(result.status);
    setStatus(t("googleDrivePushSuccess"));
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
});

document.getElementById("googleDrivePullButton").addEventListener("click", async () => {
  try {
    await saveConfig();
    const result = await sendMessage({ type: "google-drive:sync-pull" });
    if (!result?.ok) {
      throw new Error(result?.error || t("saveFailed"));
    }
    renderGoogleDriveStatus(result.status);
    await loadConfig();
    setStatus(t("googleDrivePullSuccess"));
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
});

document.querySelectorAll("[data-provider-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    setActiveProviderTab(button.dataset.providerTab || "ollama");
  });
});

document.querySelectorAll("[data-utility-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    setActiveUtilityTab(button.dataset.utilityTab || "experience");
  });
});

document.getElementById("defaultProvider").addEventListener("change", (event) => {
  const target = event.target;
  if (target instanceof HTMLSelectElement) {
    setActiveProviderTab(target.value || "ollama");
  }
});

async function initializeOptionsPage() {
  await loadConfig();
  try {
    await refreshModels();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), true);
  }
}

initializeOptionsPage();
