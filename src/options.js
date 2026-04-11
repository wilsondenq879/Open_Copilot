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
    providerSectionTitle: "AI 提供者",
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
    localWorkFolderLabel: "本機工作資料夾",
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
    defaultProviderLabel: "預設提供者",
    defaultProviderHint: "選擇未來啟用多路由時，預設要使用的 AI 提供者。",
    replyLanguageLabel: "回覆語言",
    settingsThemeLabel: "設定頁主題",
    settingsThemeHint: "只影響這個 settings 頁面；預設會跟隨系統外觀。",
    settingsThemeSystem: "跟隨系統",
    settingsThemeDark: "深色",
    settingsThemeLight: "淺色",
    taskExtractionWindowDaysLabel: "待辦自動抓取區間",
    taskExtractionWindowDaysHint: "待辦抓取會根據目前可見的聊天內容整理，預設優先近 3 天，最多可調到 7 天。",
    starterHoverTipsEnabledLabel: "顯示 Starter 懸停提示",
    starterHoverTipsEnabledHint: "滑過聊天面板中的 starter 時，顯示這個 starter 會做什麼的簡短說明。",
    systemPromptLabel: "系統提示詞",
    multiPerspectiveProfilesLabel: "多視角角色",
    utilityTabExperience: "體驗",
    utilityTabStarterSkills: "Starter 技能",
    customStartersLabel: "自訂 Starters",
    customStartersInputLabel: "貼上 Starter JSON",
    starterLibraryKicker: "Starter 技能",
    starterLibraryTitle: "Starter 技能庫",
    starterLibraryDescription: "把可重複使用的 custom starter 集中管理在這裡。貼上新的 JSON、依照 ID 更新既有 skill，讓頁面內聊天面板隨時可用。",
    starterLibraryStoredLabel: "已儲存",
    starterLibraryCapacityLabel: "容量",
    starterLibraryLimitHint: "最多可儲存 20 組 Starter 技能",
    starterLibraryGridTitle: "Starter 技能集合",
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
    editStarterWithAi: "用 AI 修改",
    starterAiEditorKicker: "AI 技能編修",
    starterAiEditorTitle: "和 AI 一起修改技能",
    starterAiEditorHint: "用白話文描述你想怎麼改這個 skill，AI 會先提出修改方案，再幫你覆寫原本版本。",
    starterAiEditorClose: "關閉",
    starterAiEditorCurrentLabel: "目前技能",
    starterAiEditorInputLabel: "你想怎麼修改這個 skill？",
    starterAiEditorInputPlaceholder: "例如：改得更像資深 reviewer，明確要求直接使用目前 GitHub 頁面與可見 diff 當 context，並補上 regression 與測試缺口檢查。",
    starterAiEditorDiscuss: "和 AI 討論",
    starterAiEditorApply: "套用更新",
    starterAiEditorNoDiscussion: "還沒有討論內容。",
    starterAiEditorThinking: "AI 正在整理修改方案...",
    starterAiEditorApplying: "AI 正在套用 skill 更新...",
    starterAiEditorNeedInput: "請先描述你想怎麼修改這個 skill。",
    starterAiEditorNeedDiscussion: "先和 AI 討論一下，再決定要不要套用更新。",
    starterAiEditorEmptyReply: "我先整理到這裡，但剛剛沒有成功產出完整回覆。你可以再按一次「和 AI 討論」，或換個方式描述你想怎麼修改。",
    starterAiEditorApplyFailedPrefix: "套用更新失敗：",
    starterAiEditorUpdated: "已更新技能：{name}",
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
    editStarterWithAi: "Edit With AI",
    starterAiEditorKicker: "AI Skill Editor",
    starterAiEditorTitle: "Refine Skill With AI",
    starterAiEditorHint: "Describe how you want to improve this skill in plain language. AI will propose an updated version before replacing the current one.",
    starterAiEditorClose: "Close",
    starterAiEditorCurrentLabel: "Current Skill",
    starterAiEditorInputLabel: "What should AI improve?",
    starterAiEditorInputPlaceholder: "For example: make it behave more like a senior reviewer, explicitly use the current GitHub page and visible diff as context, and add regression plus missing-test checks.",
    starterAiEditorDiscuss: "Discuss With AI",
    starterAiEditorApply: "Apply Update",
    starterAiEditorNoDiscussion: "No discussion yet.",
    starterAiEditorThinking: "AI is shaping the update...",
    starterAiEditorApplying: "AI is applying the skill update...",
    starterAiEditorNeedInput: "Please describe how you want to improve this skill.",
    starterAiEditorNeedDiscussion: "Discuss it with AI first, then apply the updated skill.",
    starterAiEditorEmptyReply: "I started shaping the update, but the model did not return a usable reply. Try discussing again or rephrase the change you want.",
    starterAiEditorApplyFailedPrefix: "Failed to apply update:",
    starterAiEditorUpdated: "Updated skill: {name}",
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

Object.assign(OPTION_I18N.ja, {
  githubApiKeyLabel: "GitHub API キー",
  githubApiKeyHint: "可能であれば fine-grained かつ read-only の GitHub Personal Access Token を使ってください。設定すると、アクセス権のある private repository を含む GitHub ファイル内容を拡張機能が取得できます。",
  localWorkFolderLabel: "ローカル作業フォルダー",
  localWorkFolderHint: "Download MD の保存先として使うローカルフォルダーを選択し、ローカル文書を追加する元フォルダーとしても利用できます。",
  pickFolder: "フォルダーを選択",
  clearFolder: "フォルダーをクリア",
  workFolderPull: "フォルダーから取得",
  workFolderPush: "フォルダーへ保存",
  folderNotSelected: "フォルダーが選択されていません。",
  folderReady: "ローカルフォルダーを接続しました: {name}",
  folderPermissionMissing: "フォルダー情報は残っていますが、書き込み権限が失われています。もう一度選択してください。",
  folderPathLabel: "設定済みフォルダー",
  folderPathUnavailable: "ここではブラウザーがフォルダー名のみを公開し、完全なシステムパスは取得できません。",
  folderChooseUnsupported: "このブラウザーページではローカルフォルダー選択に対応していません。",
  folderSaveSuccess: "ローカル作業フォルダーを保存しました。",
  folderSaveFailed: "ローカル作業フォルダーの保存に失敗しました。",
  folderClearSuccess: "ローカル作業フォルダーをクリアしました。",
  workFolderPullSuccess: "作業フォルダーから取得して統合しました: starters {starters} 件、tasks {tasks} 件、chat {chat} 件、documents {documents} 件。",
  workFolderPushSuccess: "作業フォルダーへ保存しました: starters {starters} 件、tasks {tasks} 件、chat {chat} 件、documents {documents} 件。",
  googleDriveSyncLabel: "Google Drive 同期",
  googleDriveClientIdLabel: "OAuth クライアント ID",
  googleDriveSyncEnabledLabel: "Drive 同期を有効化",
  googleDriveAutoSyncLabel: "保存後に自動同期",
  googleDriveConnect: "Google Drive に接続",
  googleDrivePull: "Drive から取得",
  googleDrivePush: "Drive へ保存",
  googleDriveDisconnect: "切断",
  googleDriveSyncHint: "生成したチャット文書、Starter Skill Collection、タスクリマインダーを Google Drive app data 経由で同期します。",
  googleDriveRedirectLabel: "リダイレクト URL",
  googleDriveNotConnected: "Google Drive は未接続です。",
  googleDriveConnected: "Google Drive に接続済みです。",
  googleDriveLastSync: "前回同期: {time}",
  googleDriveLastError: "Drive 同期エラー: {error}",
  googleDriveConnectSuccess: "Google Drive に接続しました。",
  googleDriveDisconnectSuccess: "Google Drive との接続を解除しました。",
  googleDrivePushSuccess: "Google Drive へ保存しました。",
  googleDrivePullSuccess: "Google Drive から取得して統合しました。",
  googleDriveMissingClientId: "先に Google OAuth Client ID を入力して設定を保存してください。",
  settingsThemeLabel: "設定テーマ",
  settingsThemeHint: "この設定ページにのみ適用されます。System は OS の外観に従います。",
  settingsThemeSystem: "システムに従う",
  settingsThemeDark: "ダーク",
  settingsThemeLight: "ライト",
  taskExtractionWindowDaysLabel: "タスク自動抽出期間",
  taskExtractionWindowDaysHint: "タスク抽出は表示中のチャット内容を使い、既定では直近 3 日を優先します。最大 7 日まで広げられます。",
  starterHoverTipsEnabledLabel: "Starter のホバー説明を表示",
  starterHoverTipsEnabledHint: "チャットパネルで starter にカーソルを合わせたとき、その starter が何をするかを短く表示します。",
  multiPerspectiveProfilesLabel: "マルチ視点プロフィール",
  utilityTabExperience: "体験",
  utilityTabStarterSkills: "スタータースキル",
  customStartersLabel: "カスタム Starters",
  customStartersInputLabel: "Starter JSON を貼り付け",
  starterLibraryKicker: "スタータースキル",
  starterLibraryTitle: "スタータースキルライブラリ",
  starterLibraryDescription: "再利用できる custom starter skills をここで一元管理します。新しい JSON を取り込み、ID で既存 skill を更新し、ページ内チャットで使えるライブラリを育てられます。",
  starterLibraryStoredLabel: "保存済み",
  starterLibraryCapacityLabel: "容量",
  starterLibraryLimitHint: "最大 20 件の starter skills を保存できます",
  starterLibraryGridTitle: "スタータースキルコレクション",
  starterLibraryGridDescription: "各 skill カードはページ内チャットパネルで利用でき、ここで更新や削除ができます。",
  multiPerspectiveProfilesHint: "1 行に 1 視点、形式は `タイトル|指示` です。空欄にするとページ種別ごとの組み込み既定値を使います。",
  customStartersHint: "starter JSON をここに貼り付けてライブラリに追加します。同じ `id` は更新され、新しい `id` は追加されます。各項目には最低でも `label` と `prompt` が必要で、`scopes` と `mode` は任意です。",
  customStartersInputPlaceholder: '[{"label":"メール要約","prompt":"このメールを要約してください"}]',
  createStarters: "ライブラリに追加",
  clearStarters: "ライブラリをクリア",
  noCustomStarters: "まだ custom starters は取り込まれていません。",
  customStarterImported: "{count} 件の starter を追加または更新しました。現在は {total} / {limit} 件です。",
  customStarterCleared: "custom starters をクリアしました。",
  customStarterImportFailed: "starter JSON の取り込みに失敗しました。",
  customStarterLimitReached: "保存できる custom starters は最大 {limit} 件です。",
  deleteStarter: "削除",
  customStarterDeleted: "starter を削除しました: {name}",
  confirmClearFolder: "ローカル作業フォルダー設定をクリアしますか？",
  confirmClearStarters: "取り込んだ starters をすべてクリアしますか？",
  confirmDeleteStarter: "starter「{name}」を削除しますか？",
  starterPreviewScopeAll: "すべてのページ",
  starterPreviewModeChat: "チャット",
  starterPreviewModePerspective: "多視点",
});

Object.assign(OPTION_I18N.ko, {
  githubApiKeyLabel: "GitHub API 키",
  githubApiKeyHint: "가능하면 fine-grained, read-only GitHub personal access token을 사용하세요. 설정하면 접근 권한이 있는 private repository를 포함해 GitHub 파일 내용을 확장 프로그램이 가져올 수 있습니다.",
  localWorkFolderLabel: "로컬 작업 폴더",
  localWorkFolderHint: "Download MD 저장 위치로 사용할 로컬 폴더를 선택하고, 로컬 문서를 추가할 때의 원본 폴더로도 활용할 수 있습니다.",
  pickFolder: "폴더 선택",
  clearFolder: "폴더 지우기",
  workFolderPull: "폴더에서 가져오기",
  workFolderPush: "폴더로 내보내기",
  folderNotSelected: "선택된 폴더가 없습니다.",
  folderReady: "로컬 폴더 연결됨: {name}",
  folderPermissionMissing: "폴더 정보는 남아 있지만 쓰기 권한이 사라졌습니다. 다시 선택해 주세요.",
  folderPathLabel: "설정된 폴더",
  folderPathUnavailable: "여기서는 브라우저가 폴더 이름만 제공하고 전체 시스템 경로는 제공하지 않습니다.",
  folderChooseUnsupported: "이 브라우저 페이지에서는 로컬 폴더 선택을 지원하지 않습니다.",
  folderSaveSuccess: "로컬 작업 폴더를 저장했습니다.",
  folderSaveFailed: "로컬 작업 폴더 저장에 실패했습니다.",
  folderClearSuccess: "로컬 작업 폴더를 지웠습니다.",
  workFolderPullSuccess: "작업 폴더에서 가져와 병합했습니다: starters {starters}개, tasks {tasks}개, chat {chat}개, documents {documents}개.",
  workFolderPushSuccess: "작업 폴더로 내보냈습니다: starters {starters}개, tasks {tasks}개, chat {chat}개, documents {documents}개.",
  googleDriveSyncLabel: "Google Drive 동기화",
  googleDriveClientIdLabel: "OAuth 클라이언트 ID",
  googleDriveSyncEnabledLabel: "Drive 동기화 사용",
  googleDriveAutoSyncLabel: "저장 후 자동 동기화",
  googleDriveConnect: "Google Drive 연결",
  googleDrivePull: "Drive에서 가져오기",
  googleDrivePush: "Drive로 내보내기",
  googleDriveDisconnect: "연결 해제",
  googleDriveSyncHint: "생성된 채팅 문서, Starter Skill Collection, 작업 알림을 Google Drive app data를 통해 동기화합니다.",
  googleDriveRedirectLabel: "리디렉션 URL",
  googleDriveNotConnected: "Google Drive가 연결되지 않았습니다.",
  googleDriveConnected: "Google Drive가 연결되었습니다.",
  googleDriveLastSync: "마지막 동기화: {time}",
  googleDriveLastError: "Drive 동기화 오류: {error}",
  googleDriveConnectSuccess: "Google Drive가 연결되었습니다.",
  googleDriveDisconnectSuccess: "Google Drive 연결이 해제되었습니다.",
  googleDrivePushSuccess: "Google Drive로 내보냈습니다.",
  googleDrivePullSuccess: "Google Drive에서 가져와 병합했습니다.",
  googleDriveMissingClientId: "먼저 Google OAuth Client ID를 입력하고 설정을 저장하세요.",
  settingsThemeLabel: "설정 테마",
  settingsThemeHint: "이 설정 페이지에만 적용됩니다. 시스템은 OS 모양을 따릅니다.",
  settingsThemeSystem: "시스템 따르기",
  settingsThemeDark: "다크",
  settingsThemeLight: "라이트",
  taskExtractionWindowDaysLabel: "작업 자동 추출 기간",
  taskExtractionWindowDaysHint: "작업 추출은 현재 보이는 채팅 내용을 기준으로 하며 기본적으로 최근 3일을 우선합니다. 최대 7일까지 늘릴 수 있습니다.",
  starterHoverTipsEnabledLabel: "Starter hover 팁 표시",
  starterHoverTipsEnabledHint: "채팅 패널에서 starter 위에 마우스를 올리면 해당 starter가 무엇을 하는지 짧게 보여줍니다.",
  multiPerspectiveProfilesLabel: "다중 시점 프로필",
  utilityTabExperience: "경험",
  utilityTabStarterSkills: "스타터 스킬",
  customStartersLabel: "사용자 정의 Starters",
  customStartersInputLabel: "Starter JSON 붙여넣기",
  starterLibraryKicker: "스타터 스킬",
  starterLibraryTitle: "스타터 스킬 라이브러리",
  starterLibraryDescription: "재사용 가능한 custom starter skills를 여기에서 관리하세요. 새 JSON을 가져오고, ID로 기존 skill을 갱신하며, 페이지 내 채팅 패널에서 바로 쓸 수 있는 라이브러리를 유지할 수 있습니다.",
  starterLibraryStoredLabel: "저장됨",
  starterLibraryCapacityLabel: "용량",
  starterLibraryLimitHint: "최대 20개의 starter skills 저장 가능",
  starterLibraryGridTitle: "스타터 스킬 컬렉션",
  starterLibraryGridDescription: "각 skill 카드는 페이지 내 채팅 패널에서 바로 사용 가능하며 여기에서 수정하거나 삭제할 수 있습니다.",
  multiPerspectiveProfilesHint: "한 줄에 한 시점씩 `제목|지시문` 형식으로 입력하세요. 비워 두면 페이지 유형별 내장 기본값을 사용합니다.",
  customStartersHint: "starter JSON을 여기에 붙여 라이브러리에 추가하세요. 같은 `id`는 기존 skill을 업데이트하고, 새로운 `id`는 추가됩니다. 각 항목에는 최소 `label`과 `prompt`가 필요하며 `scopes`와 `mode`는 선택 사항입니다.",
  customStartersInputPlaceholder: '[{"label":"이메일 요약","prompt":"이 이메일을 요약해 주세요"}]',
  createStarters: "라이브러리에 추가",
  clearStarters: "라이브러리 비우기",
  noCustomStarters: "아직 가져온 custom starters가 없습니다.",
  customStarterImported: "{count}개의 starter를 추가하거나 업데이트했습니다. 현재 {total} / {limit}개입니다.",
  customStarterCleared: "custom starters를 지웠습니다.",
  customStarterImportFailed: "starter JSON 가져오기에 실패했습니다.",
  customStarterLimitReached: "최대 {limit}개의 custom starters만 저장할 수 있습니다.",
  deleteStarter: "삭제",
  customStarterDeleted: "starter 삭제됨: {name}",
  confirmClearFolder: "로컬 작업 폴더 설정을 지울까요?",
  confirmClearStarters: "가져온 starters를 모두 지울까요?",
  confirmDeleteStarter: "starter \"{name}\"을(를) 삭제할까요?",
  starterPreviewScopeAll: "모든 페이지",
  starterPreviewModeChat: "채팅",
  starterPreviewModePerspective: "다중 시점",
});

Object.assign(OPTION_I18N["zh-CN"], {
  providerSectionTitle: "AI 提供方",
  lmStudioApiKeyLabel: "API 密钥",
  geminiApiKeyLabel: "API 密钥",
  azureEndpointLabel: "终结点",
  azureDeploymentLabel: "部署名称",
  azureApiVersionLabel: "API 版本",
  azureApiKeyLabel: "API 密钥",
  githubApiKeyLabel: "GitHub API 密钥",
  githubApiKeyHint: "建议尽量使用细粒度、只读的 GitHub personal access token。设置后，扩展即可读取 GitHub 文件内容，也能访问你有权限的 private repository。",
  localWorkFolderLabel: "本地工作文件夹",
  localWorkFolderHint: "选择一个本地文件夹，作为“下载 MD”的保存位置，也可用来加入本地文档。",
  pickFolder: "选择文件夹",
  clearFolder: "清除文件夹",
  workFolderPull: "从文件夹拉回",
  workFolderPush: "推送到文件夹",
  folderNotSelected: "尚未选择文件夹。",
  folderReady: "已连接本地文件夹：{name}",
  folderPermissionMissing: "文件夹记录仍在，但写入权限已失效。请重新选择一次。",
  folderPathLabel: "当前设置文件夹",
  folderPathUnavailable: "浏览器目前只能提供文件夹名称，无法读取完整系统路径。",
  folderChooseUnsupported: "当前浏览器页面暂不支持选择本地文件夹。",
  folderSaveSuccess: "已保存本地工作文件夹设置。",
  folderSaveFailed: "保存本地工作文件夹失败。",
  folderClearSuccess: "已清除本地工作文件夹设置。",
  workFolderPullSuccess: "已从工作文件夹拉回并合并：starters {starters}、tasks {tasks}、chat {chat}、documents {documents}。",
  workFolderPushSuccess: "已推送到工作文件夹：starters {starters}、tasks {tasks}、chat {chat}、documents {documents}。",
  googleDriveSyncLabel: "Google Drive 同步",
  googleDriveClientIdLabel: "OAuth 客户端 ID",
  googleDriveSyncEnabledLabel: "启用 Drive 同步",
  googleDriveAutoSyncLabel: "保存后自动同步",
  googleDriveConnect: "连接 Google Drive",
  googleDrivePull: "从 Drive 拉回",
  googleDrivePush: "推送到 Drive",
  googleDriveDisconnect: "断开连接",
  googleDriveSyncHint: "通过 Google Drive app data 同步生成的聊天文档、Starter Skill Collection 与待办提醒。",
  googleDriveRedirectLabel: "重定向 URL",
  googleDriveNotConnected: "尚未连接 Google Drive。",
  googleDriveConnected: "Google Drive 已连接。",
  googleDriveLastSync: "上次同步：{time}",
  googleDriveLastError: "Drive 同步错误：{error}",
  googleDriveConnectSuccess: "Google Drive 已连接。",
  googleDriveDisconnectSuccess: "Google Drive 已断开连接。",
  googleDrivePushSuccess: "已推送到 Google Drive。",
  googleDrivePullSuccess: "已从 Google Drive 拉回并合并。",
  googleDriveMissingClientId: "请先填写 Google OAuth Client ID 并保存设置。",
  defaultProviderLabel: "默认提供方",
  defaultProviderHint: "选择未来启用多路由时默认使用的 AI 提供方。",
  settingsThemeLabel: "设置页主题",
  settingsThemeHint: "只影响这个设置页面；系统模式会跟随操作系统外观。",
  settingsThemeSystem: "跟随系统",
  settingsThemeDark: "深色",
  settingsThemeLight: "浅色",
  taskExtractionWindowDaysLabel: "Task 自动抓取区间",
  taskExtractionWindowDaysHint: "待办抓取会根据当前可见的聊天内容整理，默认优先最近 3 天，最多可调到 7 天。",
  starterHoverTipsEnabledLabel: "显示 Starter 悬停提示",
  starterHoverTipsEnabledHint: "鼠标悬停在聊天面板中的 starter 上时，显示该 starter 会做什么的简短说明。",
  multiPerspectiveProfilesLabel: "多视角角色",
  utilityTabExperience: "体验",
  utilityTabStarterSkills: "Starter 技能",
  customStartersLabel: "自定义 Starters",
  customStartersInputLabel: "粘贴 Starter JSON",
  starterLibraryKicker: "Starter 技能",
  starterLibraryTitle: "Starter 技能库",
  starterLibraryDescription: "将可重复使用的 custom starter skills 集中管理在这里。导入新的 JSON、按 ID 更新已有 skill，让页面内聊天面板随时可用。",
  starterLibraryStoredLabel: "已存储",
  starterLibraryCapacityLabel: "容量",
  starterLibraryLimitHint: "最多可存储 20 组 starter skills",
  starterLibraryGridTitle: "Starter 技能集合",
  starterLibraryGridDescription: "每张 skill 卡都会同步提供给页面内聊天面板，可在这里持续更新或删除。",
  multiPerspectiveProfilesHint: "每行一个视角，格式为 `标题|指令`。留空时会使用内建的页面类型默认值。",
  customStartersHint: "将 starter JSON 粘贴到这里后加入技能库。相同 `id` 会更新，新的 `id` 会新增。每个项目至少要有 `label` 和 `prompt`，可选 `scopes` 与 `mode`。",
  customStartersInputPlaceholder: '[{"label":"邮件摘要","prompt":"请整理这封邮件的重点"}]',
  createStarters: "加入技能库",
  clearStarters: "清空技能库",
  noCustomStarters: "目前还没有导入自定义 starters。",
  customStarterImported: "已加入或更新 {count} 个 starters，目前共 {total} / {limit} 组。",
  customStarterCleared: "已清除自定义 starters。",
  customStarterImportFailed: "Starter JSON 导入失败。",
  customStarterLimitReached: "最多只能存储 {limit} 组 custom starters。",
  deleteStarter: "删除",
  customStarterDeleted: "已删除 starter：{name}",
  confirmClearFolder: "确定要清除本地工作文件夹设置吗？",
  confirmClearStarters: "确定要清除所有导入的 starters 吗？",
  confirmDeleteStarter: "确定要删除 starter“{name}”吗？",
  starterPreviewScopeAll: "所有页面",
  starterPreviewModeChat: "聊天",
  starterPreviewModePerspective: "多视角",
});

Object.assign(OPTION_I18N.es, {
  githubApiKeyLabel: "Clave API de GitHub",
  githubApiKeyHint: "Usa, si es posible, un token personal de acceso de GitHub fine-grained y de solo lectura. Así la extensión podrá leer contenidos de archivos de GitHub, incluidos repositorios privados a los que tengas acceso.",
  localWorkFolderLabel: "Carpeta de trabajo local",
  localWorkFolderHint: "Elige una carpeta local para usarla como ubicación de guardado de Download MD y como origen para añadir documentos locales.",
  pickFolder: "Elegir carpeta",
  clearFolder: "Borrar carpeta",
  workFolderPull: "Traer desde carpeta",
  workFolderPush: "Enviar a carpeta",
  folderNotSelected: "No se ha seleccionado ninguna carpeta.",
  folderReady: "Carpeta local conectada: {name}",
  folderPermissionMissing: "La carpeta sigue registrada, pero ya no hay permiso de escritura. Vuelve a seleccionarla.",
  folderPathLabel: "Carpeta configurada",
  folderPathUnavailable: "Aquí el navegador solo expone el nombre de la carpeta, no la ruta completa del sistema.",
  folderChooseUnsupported: "Esta página del navegador no admite elegir una carpeta local aquí.",
  folderSaveSuccess: "Carpeta de trabajo local guardada.",
  folderSaveFailed: "No se pudo guardar la carpeta de trabajo local.",
  folderClearSuccess: "Carpeta de trabajo local borrada.",
  workFolderPullSuccess: "Se importó y fusionó desde la carpeta de trabajo: {starters} starter(s), {tasks} tarea(s), {chat} chat(s), {documents} documento(s).",
  workFolderPushSuccess: "Se exportó a la carpeta de trabajo: {starters} starter(s), {tasks} tarea(s), {chat} chat(s), {documents} documento(s).",
  googleDriveSyncLabel: "Sincronización con Google Drive",
  googleDriveClientIdLabel: "ID de cliente OAuth",
  googleDriveSyncEnabledLabel: "Activar sincronización con Drive",
  googleDriveAutoSyncLabel: "Sincronizar automáticamente al guardar",
  googleDriveConnect: "Conectar Google Drive",
  googleDrivePull: "Traer desde Drive",
  googleDrivePush: "Enviar a Drive",
  googleDriveDisconnect: "Desconectar",
  googleDriveSyncHint: "Sincroniza documentos de chat generados, Starter Skill Collection y recordatorios de tareas mediante Google Drive app data.",
  googleDriveRedirectLabel: "URL de redirección",
  googleDriveNotConnected: "Google Drive no está conectado.",
  googleDriveConnected: "Google Drive está conectado.",
  googleDriveLastSync: "Última sincronización: {time}",
  googleDriveLastError: "Error de sincronización de Drive: {error}",
  googleDriveConnectSuccess: "Google Drive conectado.",
  googleDriveDisconnectSuccess: "Google Drive desconectado.",
  googleDrivePushSuccess: "Enviado a Google Drive.",
  googleDrivePullSuccess: "Importado desde Google Drive y fusionado.",
  googleDriveMissingClientId: "Primero introduce y guarda un Google OAuth Client ID.",
  settingsThemeLabel: "Tema de ajustes",
  settingsThemeHint: "Solo cambia esta página de configuración. El modo sistema sigue la apariencia del SO.",
  settingsThemeSystem: "Seguir sistema",
  settingsThemeDark: "Oscuro",
  settingsThemeLight: "Claro",
  taskExtractionWindowDaysLabel: "Ventana de extracción automática de tareas",
  taskExtractionWindowDaysHint: "La extracción de tareas usa el contenido visible del chat y prioriza por defecto los últimos 3 días. Puedes ampliar la ventana hasta 7 días.",
  starterHoverTipsEnabledLabel: "Mostrar consejos al pasar sobre starters",
  starterHoverTipsEnabledHint: "Muestra una breve descripción de lo que hace el starter al pasar el cursor sobre él en el panel de chat.",
  multiPerspectiveProfilesLabel: "Perfiles de múltiples perspectivas",
  utilityTabExperience: "Experiencia",
  utilityTabStarterSkills: "Habilidades Starter",
  customStartersLabel: "Starters personalizados",
  customStartersInputLabel: "Pegar Starter JSON",
  starterLibraryKicker: "Habilidades Starter",
  starterLibraryTitle: "Biblioteca de habilidades Starter",
  starterLibraryDescription: "Guarda aquí custom starter skills reutilizables. Importa nuevo JSON, actualiza skills existentes por ID y mantén una biblioteca lista para el panel de chat en la página.",
  starterLibraryStoredLabel: "Guardados",
  starterLibraryCapacityLabel: "Capacidad",
  starterLibraryLimitHint: "Guarda hasta 20 starter skills",
  starterLibraryGridTitle: "Colección de habilidades Starter",
  starterLibraryGridDescription: "Cada skill card queda disponible en el panel de chat de la página y puede actualizarse o eliminarse aquí.",
  multiPerspectiveProfilesHint: "Una perspectiva por línea con el formato `Título|Instrucción`. Déjalo vacío para usar los valores predeterminados integrados para cada tipo de página.",
  customStartersHint: "Pega aquí el starter JSON para añadirlo a la biblioteca. Los `id` existentes se actualizan y los nuevos se agregan. Cada elemento necesita al menos `label` y `prompt`, con `scopes` y `mode` opcionales.",
  customStartersInputPlaceholder: '[{"label":"Resumen de correo","prompt":"Resume este correo"}]',
  createStarters: "Añadir a la biblioteca",
  clearStarters: "Vaciar biblioteca",
  noCustomStarters: "Todavía no se han importado starters personalizados.",
  customStarterImported: "Se añadieron o actualizaron {count} starter(s). La biblioteca ahora tiene {total} / {limit}.",
  customStarterCleared: "Starters personalizados borrados.",
  customStarterImportFailed: "No se pudo importar el starter JSON.",
  customStarterLimitReached: "Puedes guardar hasta {limit} custom starters.",
  deleteStarter: "Eliminar",
  customStarterDeleted: "Starter eliminado: {name}",
  confirmClearFolder: "¿Borrar la configuración de la carpeta de trabajo local?",
  confirmClearStarters: "¿Borrar todos los starters importados?",
  confirmDeleteStarter: "¿Eliminar el starter \"{name}\"?",
  starterPreviewScopeAll: "Todas las páginas",
  starterPreviewModeChat: "Chat",
  starterPreviewModePerspective: "Perspectiva",
});

Object.assign(OPTION_I18N.fr, {
  githubApiKeyLabel: "Clé API GitHub",
  githubApiKeyHint: "Utilisez si possible un personal access token GitHub fine-grained et en lecture seule. L’extension pourra alors lire le contenu des fichiers GitHub, y compris dans les dépôts privés auxquels vous avez accès.",
  localWorkFolderLabel: "Dossier de travail local",
  localWorkFolderHint: "Choisissez un dossier local comme emplacement d’enregistrement pour Download MD, et comme source pour ajouter des documents locaux.",
  pickFolder: "Choisir un dossier",
  clearFolder: "Effacer le dossier",
  workFolderPull: "Récupérer depuis le dossier",
  workFolderPush: "Envoyer vers le dossier",
  folderNotSelected: "Aucun dossier sélectionné.",
  folderReady: "Dossier local connecté : {name}",
  folderPermissionMissing: "Le dossier est mémorisé, mais l’autorisation d’écriture n’est plus disponible. Merci de le sélectionner à nouveau.",
  folderPathLabel: "Dossier configuré",
  folderPathUnavailable: "Ici, le navigateur n’expose que le nom du dossier, pas le chemin système complet.",
  folderChooseUnsupported: "Cette page du navigateur ne permet pas de choisir un dossier local ici.",
  folderSaveSuccess: "Dossier de travail local enregistré.",
  folderSaveFailed: "Échec de l’enregistrement du dossier de travail local.",
  folderClearSuccess: "Dossier de travail local effacé.",
  workFolderPullSuccess: "Récupéré et fusionné depuis le dossier de travail : {starters} starter(s), {tasks} tâche(s), {chat} session(s) de chat, {documents} document(s).",
  workFolderPushSuccess: "Envoyé vers le dossier de travail : {starters} starter(s), {tasks} tâche(s), {chat} session(s) de chat, {documents} document(s).",
  googleDriveSyncLabel: "Synchronisation Google Drive",
  googleDriveClientIdLabel: "ID client OAuth",
  googleDriveSyncEnabledLabel: "Activer la synchronisation Drive",
  googleDriveAutoSyncLabel: "Synchroniser automatiquement après enregistrement",
  googleDriveConnect: "Connecter Google Drive",
  googleDrivePull: "Récupérer depuis Drive",
  googleDrivePush: "Envoyer vers Drive",
  googleDriveDisconnect: "Déconnecter",
  googleDriveSyncHint: "Synchronisez les documents de chat générés, la Starter Skill Collection et les rappels de tâches via Google Drive app data.",
  googleDriveRedirectLabel: "URL de redirection",
  googleDriveNotConnected: "Google Drive n’est pas connecté.",
  googleDriveConnected: "Google Drive est connecté.",
  googleDriveLastSync: "Dernière synchronisation : {time}",
  googleDriveLastError: "Erreur de synchronisation Drive : {error}",
  googleDriveConnectSuccess: "Google Drive connecté.",
  googleDriveDisconnectSuccess: "Google Drive déconnecté.",
  googleDrivePushSuccess: "Envoyé vers Google Drive.",
  googleDrivePullSuccess: "Récupéré depuis Google Drive et fusionné.",
  googleDriveMissingClientId: "Saisissez puis enregistrez d’abord un Google OAuth Client ID.",
  settingsThemeLabel: "Thème des paramètres",
  settingsThemeHint: "Ne change que cette page de paramètres. Le mode système suit l’apparence de l’OS.",
  settingsThemeSystem: "Suivre le système",
  settingsThemeDark: "Sombre",
  settingsThemeLight: "Clair",
  taskExtractionWindowDaysLabel: "Fenêtre d’extraction automatique des tâches",
  taskExtractionWindowDaysHint: "L’extraction de tâches utilise le contenu visible du chat et privilégie par défaut les 3 derniers jours. Vous pouvez étendre la fenêtre jusqu’à 7 jours.",
  starterHoverTipsEnabledLabel: "Afficher les info-bulles des starters",
  starterHoverTipsEnabledHint: "Affiche une courte description de ce que fait le starter lorsque vous le survolez dans le panneau de chat.",
  multiPerspectiveProfilesLabel: "Profils multi-perspectives",
  utilityTabExperience: "Expérience",
  utilityTabStarterSkills: "Compétences Starter",
  customStartersLabel: "Starters personnalisés",
  customStartersInputLabel: "Coller le JSON du starter",
  starterLibraryKicker: "Compétences Starter",
  starterLibraryTitle: "Bibliothèque de compétences Starter",
  starterLibraryDescription: "Stockez ici des custom starter skills réutilisables. Importez un nouveau JSON, mettez à jour un skill existant par ID et gardez une bibliothèque prête pour le panneau de chat intégré.",
  starterLibraryStoredLabel: "Enregistrés",
  starterLibraryCapacityLabel: "Capacité",
  starterLibraryLimitHint: "Jusqu’à 20 starter skills",
  starterLibraryGridTitle: "Collection de compétences Starter",
  starterLibraryGridDescription: "Chaque skill card reste disponible dans le panneau de chat intégré et peut être modifiée ou supprimée ici.",
  multiPerspectiveProfilesHint: "Une perspective par ligne au format `Titre|Instruction`. Laissez vide pour utiliser les valeurs intégrées selon le type de page.",
  customStartersHint: "Collez ici le JSON du starter pour l’ajouter à la bibliothèque. Les `id` existants sont mis à jour, les nouveaux sont ajoutés. Chaque élément doit au minimum contenir `label` et `prompt`, avec `scopes` et `mode` en option.",
  customStartersInputPlaceholder: '[{"label":"Résumé d’email","prompt":"Résume cet email"}]',
  createStarters: "Ajouter à la bibliothèque",
  clearStarters: "Vider la bibliothèque",
  noCustomStarters: "Aucun starter personnalisé importé pour le moment.",
  customStarterImported: "{count} starter(s) ajouté(s) ou mis à jour. La bibliothèque contient maintenant {total} / {limit}.",
  customStarterCleared: "Starters personnalisés effacés.",
  customStarterImportFailed: "Échec de l’import du JSON du starter.",
  customStarterLimitReached: "Vous pouvez enregistrer jusqu’à {limit} custom starters.",
  deleteStarter: "Supprimer",
  customStarterDeleted: "Starter supprimé : {name}",
  confirmClearFolder: "Effacer le réglage du dossier de travail local ?",
  confirmClearStarters: "Effacer tous les starters importés ?",
  confirmDeleteStarter: "Supprimer le starter \"{name}\" ?",
  starterPreviewScopeAll: "Toutes les pages",
  starterPreviewModeChat: "Chat",
  starterPreviewModePerspective: "Multi-angle",
});

Object.assign(OPTION_I18N.de, {
  githubApiKeyLabel: "GitHub-API-Schlüssel",
  githubApiKeyHint: "Nutze nach Möglichkeit ein fein abgestuftes, schreibgeschütztes GitHub Personal Access Token. Dann kann die Erweiterung GitHub-Dateiinhalte abrufen, auch aus privaten Repositories, auf die du Zugriff hast.",
  localWorkFolderLabel: "Lokaler Arbeitsordner",
  localWorkFolderHint: "Wähle einen lokalen Ordner als Speicherort für Download MD und als Quelle zum Hinzufügen lokaler Dokumente.",
  pickFolder: "Ordner wählen",
  clearFolder: "Ordner leeren",
  workFolderPull: "Aus Ordner laden",
  workFolderPush: "In Ordner speichern",
  folderNotSelected: "Kein Ordner ausgewählt.",
  folderReady: "Lokaler Ordner verbunden: {name}",
  folderPermissionMissing: "Der Ordner ist gespeichert, aber die Schreibberechtigung ist nicht mehr verfügbar. Bitte wähle ihn erneut aus.",
  folderPathLabel: "Konfigurierter Ordner",
  folderPathUnavailable: "Der Browser stellt hier nur den Ordnernamen bereit, nicht den vollständigen Systempfad.",
  folderChooseUnsupported: "Diese Browserseite unterstützt hier keine Auswahl eines lokalen Ordners.",
  folderSaveSuccess: "Lokaler Arbeitsordner gespeichert.",
  folderSaveFailed: "Lokaler Arbeitsordner konnte nicht gespeichert werden.",
  folderClearSuccess: "Lokaler Arbeitsordner gelöscht.",
  workFolderPullSuccess: "Aus dem Arbeitsordner geladen und zusammengeführt: {starters} Starter, {tasks} Aufgaben, {chat} Chat-Sitzungen, {documents} Dokumente.",
  workFolderPushSuccess: "In den Arbeitsordner gespeichert: {starters} Starter, {tasks} Aufgaben, {chat} Chat-Sitzungen, {documents} Dokumente.",
  googleDriveSyncLabel: "Google-Drive-Sync",
  googleDriveClientIdLabel: "OAuth-Client-ID",
  googleDriveSyncEnabledLabel: "Drive-Sync aktivieren",
  googleDriveAutoSyncLabel: "Nach dem Speichern automatisch synchronisieren",
  googleDriveConnect: "Google Drive verbinden",
  googleDrivePull: "Aus Drive laden",
  googleDrivePush: "In Drive speichern",
  googleDriveDisconnect: "Trennen",
  googleDriveSyncHint: "Synchronisiere erzeugte Chat-Dokumente, die Starter Skill Collection und Aufgaben-Erinnerungen über Google Drive app data.",
  googleDriveRedirectLabel: "Redirect-URL",
  googleDriveNotConnected: "Google Drive ist nicht verbunden.",
  googleDriveConnected: "Google Drive ist verbunden.",
  googleDriveLastSync: "Letzte Synchronisierung: {time}",
  googleDriveLastError: "Drive-Sync-Fehler: {error}",
  googleDriveConnectSuccess: "Google Drive verbunden.",
  googleDriveDisconnectSuccess: "Google Drive getrennt.",
  googleDrivePushSuccess: "Nach Google Drive gespeichert.",
  googleDrivePullSuccess: "Von Google Drive geladen und zusammengeführt.",
  googleDriveMissingClientId: "Gib zuerst eine Google OAuth Client ID ein und speichere die Einstellungen.",
  settingsThemeLabel: "Einstellungs-Theme",
  settingsThemeHint: "Ändert nur diese Einstellungsseite. System folgt dem Erscheinungsbild des Betriebssystems.",
  settingsThemeSystem: "System folgen",
  settingsThemeDark: "Dunkel",
  settingsThemeLight: "Hell",
  taskExtractionWindowDaysLabel: "Fenster für automatische Aufgabenextraktion",
  taskExtractionWindowDaysHint: "Die Aufgabenextraktion nutzt sichtbare Chat-Inhalte und priorisiert standardmäßig die letzten 3 Tage. Das Fenster kann auf bis zu 7 Tage erweitert werden.",
  starterHoverTipsEnabledLabel: "Starter-Hovertipps anzeigen",
  starterHoverTipsEnabledHint: "Zeigt eine kurze Erklärung an, was der Starter macht, wenn du im Chat-Panel darüber fährst.",
  multiPerspectiveProfilesLabel: "Mehrperspektiven-Profile",
  utilityTabExperience: "Erlebnis",
  utilityTabStarterSkills: "Starter-Skills",
  customStartersLabel: "Benutzerdefinierte Starters",
  customStartersInputLabel: "Starter-JSON einfügen",
  starterLibraryKicker: "Starter-Skills",
  starterLibraryTitle: "Starter-Skill-Bibliothek",
  starterLibraryDescription: "Verwalte hier wiederverwendbare custom starter skills. Importiere neues JSON, aktualisiere bestehende skills per ID und halte eine starke Bibliothek für das Chat-Panel auf der Seite bereit.",
  starterLibraryStoredLabel: "Gespeichert",
  starterLibraryCapacityLabel: "Kapazität",
  starterLibraryLimitHint: "Bis zu 20 starter skills speichern",
  starterLibraryGridTitle: "Starter-Skill-Sammlung",
  starterLibraryGridDescription: "Jede Skill-Karte bleibt im Chat-Panel auf der Seite verfügbar und kann hier aktualisiert oder entfernt werden.",
  multiPerspectiveProfilesHint: "Eine Perspektive pro Zeile im Format `Titel|Anweisung`. Leer lassen, um die integrierten Standardwerte pro Seitentyp zu verwenden.",
  customStartersHint: "Füge hier Starter-JSON ein, um es zur Bibliothek hinzuzufügen. Vorhandene `id`-Werte aktualisieren bestehende Skills, neue `id`-Werte werden hinzugefügt. Jedes Element benötigt mindestens `label` und `prompt`, optional `scopes` und `mode`.",
  customStartersInputPlaceholder: '[{"label":"E-Mail-Zusammenfassung","prompt":"Fasse diese E-Mail zusammen"}]',
  createStarters: "Zur Bibliothek hinzufügen",
  clearStarters: "Bibliothek leeren",
  noCustomStarters: "Noch keine benutzerdefinierten Starters importiert.",
  customStarterImported: "{count} Starter hinzugefügt oder aktualisiert. Die Bibliothek enthält jetzt {total} / {limit}.",
  customStarterCleared: "Benutzerdefinierte Starters gelöscht.",
  customStarterImportFailed: "Starter-JSON konnte nicht importiert werden.",
  customStarterLimitReached: "Du kannst bis zu {limit} custom starters speichern.",
  deleteStarter: "Löschen",
  customStarterDeleted: "Starter gelöscht: {name}",
  confirmClearFolder: "Einstellung für den lokalen Arbeitsordner löschen?",
  confirmClearStarters: "Alle importierten Starters löschen?",
  confirmDeleteStarter: "Starter \"{name}\" löschen?",
  starterPreviewScopeAll: "Alle Seiten",
  starterPreviewModeChat: "Chat",
  starterPreviewModePerspective: "Perspektive",
});

Object.assign(OPTION_I18N["pt-BR"], {
  githubApiKeyLabel: "Chave da API do GitHub",
  githubApiKeyHint: "Use, se possível, um GitHub personal access token fine-grained e somente leitura. Assim, a extensão poderá buscar conteúdos de arquivos do GitHub, inclusive em repositórios privados aos quais você tenha acesso.",
  localWorkFolderLabel: "Pasta de trabalho local",
  localWorkFolderHint: "Escolha uma pasta local para usar como local de salvamento do Download MD e como origem para adicionar documentos locais.",
  pickFolder: "Escolher pasta",
  clearFolder: "Limpar pasta",
  workFolderPull: "Puxar da pasta",
  workFolderPush: "Enviar para a pasta",
  folderNotSelected: "Nenhuma pasta selecionada.",
  folderReady: "Pasta local conectada: {name}",
  folderPermissionMissing: "A pasta está salva, mas a permissão de escrita não está mais disponível. Selecione-a novamente.",
  folderPathLabel: "Pasta configurada",
  folderPathUnavailable: "Aqui o navegador só expõe o nome da pasta, não o caminho completo do sistema.",
  folderChooseUnsupported: "Esta página do navegador não oferece suporte à escolha de uma pasta local aqui.",
  folderSaveSuccess: "Pasta de trabalho local salva.",
  folderSaveFailed: "Falha ao salvar a pasta de trabalho local.",
  folderClearSuccess: "Pasta de trabalho local limpa.",
  workFolderPullSuccess: "Puxado e mesclado da pasta de trabalho: {starters} starter(s), {tasks} tarefa(s), {chat} sessão(ões) de chat, {documents} documento(s).",
  workFolderPushSuccess: "Enviado para a pasta de trabalho: {starters} starter(s), {tasks} tarefa(s), {chat} sessão(ões) de chat, {documents} documento(s).",
  googleDriveSyncLabel: "Sincronização com Google Drive",
  googleDriveClientIdLabel: "ID do cliente OAuth",
  googleDriveSyncEnabledLabel: "Ativar sincronização com Drive",
  googleDriveAutoSyncLabel: "Sincronizar automaticamente após salvar",
  googleDriveConnect: "Conectar Google Drive",
  googleDrivePull: "Puxar do Drive",
  googleDrivePush: "Enviar para o Drive",
  googleDriveDisconnect: "Desconectar",
  googleDriveSyncHint: "Sincronize documentos de chat gerados, Starter Skill Collection e lembretes de tarefas por meio do Google Drive app data.",
  googleDriveRedirectLabel: "URL de redirecionamento",
  googleDriveNotConnected: "Google Drive não está conectado.",
  googleDriveConnected: "Google Drive está conectado.",
  googleDriveLastSync: "Última sincronização: {time}",
  googleDriveLastError: "Erro de sincronização do Drive: {error}",
  googleDriveConnectSuccess: "Google Drive conectado.",
  googleDriveDisconnectSuccess: "Google Drive desconectado.",
  googleDrivePushSuccess: "Enviado para o Google Drive.",
  googleDrivePullSuccess: "Puxado do Google Drive e mesclado.",
  googleDriveMissingClientId: "Insira e salve primeiro um Google OAuth Client ID.",
  settingsThemeLabel: "Tema das configurações",
  settingsThemeHint: "Altera apenas esta página de configurações. O modo sistema segue a aparência do SO.",
  settingsThemeSystem: "Seguir sistema",
  settingsThemeDark: "Escuro",
  settingsThemeLight: "Claro",
  taskExtractionWindowDaysLabel: "Janela de extração automática de tarefas",
  taskExtractionWindowDaysHint: "A extração de tarefas usa o conteúdo visível do chat e prioriza por padrão os últimos 3 dias. Você pode ampliar a janela para até 7 dias.",
  starterHoverTipsEnabledLabel: "Mostrar dicas ao passar o mouse nos starters",
  starterHoverTipsEnabledHint: "Mostra uma breve descrição do que o starter faz quando você passa o mouse sobre ele no painel de chat.",
  multiPerspectiveProfilesLabel: "Perfis de múltiplas perspectivas",
  utilityTabExperience: "Experiência",
  utilityTabStarterSkills: "Skills iniciais",
  customStartersLabel: "Starters personalizados",
  customStartersInputLabel: "Cole o JSON do starter",
  starterLibraryKicker: "Skills iniciais",
  starterLibraryTitle: "Biblioteca de skills iniciais",
  starterLibraryDescription: "Armazene aqui custom starter skills reutilizáveis. Importe novo JSON, atualize um skill existente por ID e mantenha uma biblioteca pronta para o painel de chat na página.",
  starterLibraryStoredLabel: "Armazenados",
  starterLibraryCapacityLabel: "Capacidade",
  starterLibraryLimitHint: "Armazene até 20 starter skills",
  starterLibraryGridTitle: "Coleção de skills iniciais",
  starterLibraryGridDescription: "Cada skill card fica disponível no painel de chat da página e pode ser atualizada ou removida aqui.",
  multiPerspectiveProfilesHint: "Uma perspectiva por linha no formato `Título|Instrução`. Deixe em branco para usar os padrões integrados para cada tipo de página.",
  customStartersHint: "Cole aqui o JSON do starter para adicioná-lo à biblioteca. `id` iguais atualizam skills existentes, enquanto `id` novos são adicionados. Cada item precisa de pelo menos `label` e `prompt`, com `scopes` e `mode` opcionais.",
  customStartersInputPlaceholder: '[{"label":"Resumo de email","prompt":"Resuma este email"}]',
  createStarters: "Adicionar à biblioteca",
  clearStarters: "Limpar biblioteca",
  noCustomStarters: "Nenhum starter personalizado importado ainda.",
  customStarterImported: "{count} starter(s) adicionados ou atualizados. A biblioteca agora tem {total} / {limit}.",
  customStarterCleared: "Starters personalizados removidos.",
  customStarterImportFailed: "Falha ao importar o JSON do starter.",
  customStarterLimitReached: "Você pode armazenar até {limit} custom starters.",
  deleteStarter: "Excluir",
  customStarterDeleted: "Starter excluído: {name}",
  confirmClearFolder: "Limpar a configuração da pasta de trabalho local?",
  confirmClearStarters: "Limpar todos os starters importados?",
  confirmDeleteStarter: "Excluir o starter \"{name}\"?",
  starterPreviewScopeAll: "Todas as páginas",
  starterPreviewModeChat: "Chat",
  starterPreviewModePerspective: "Perspectiva",
});

Object.assign(OPTION_I18N.hi, {
  githubApiKeyLabel: "GitHub API कुंजी",
  githubApiKeyHint: "संभव हो तो fine-grained, read-only GitHub personal access token का उपयोग करें। ऐसा करने पर एक्सटेंशन GitHub फ़ाइल सामग्री, यहाँ तक कि आपकी पहुँच वाले private repository भी, पढ़ सकेगा।",
  localWorkFolderLabel: "लोकल कार्य फ़ोल्डर",
  localWorkFolderHint: "एक लोकल फ़ोल्डर चुनें जिसे Download MD के सेव स्थान और लोकल दस्तावेज़ जोड़ने के स्रोत के रूप में उपयोग किया जाए।",
  pickFolder: "फ़ोल्डर चुनें",
  clearFolder: "फ़ोल्डर साफ़ करें",
  workFolderPull: "फ़ोल्डर से खींचें",
  workFolderPush: "फ़ोल्डर में भेजें",
  folderNotSelected: "कोई फ़ोल्डर चयनित नहीं है।",
  folderReady: "लोकल फ़ोल्डर जुड़ गया: {name}",
  folderPermissionMissing: "फ़ोल्डर याद है, लेकिन लिखने की अनुमति अब उपलब्ध नहीं है। कृपया इसे फिर से चुनें।",
  folderPathLabel: "कॉन्फ़िगर किया गया फ़ोल्डर",
  folderPathUnavailable: "यहाँ ब्राउज़र केवल फ़ोल्डर का नाम देता है, पूरा सिस्टम पथ नहीं।",
  folderChooseUnsupported: "यह ब्राउज़र पेज यहाँ लोकल फ़ोल्डर चुनने का समर्थन नहीं करता।",
  folderSaveSuccess: "लोकल कार्य फ़ोल्डर सहेजा गया।",
  folderSaveFailed: "लोकल कार्य फ़ोल्डर सहेजने में विफल।",
  folderClearSuccess: "लोकल कार्य फ़ोल्डर साफ़ किया गया।",
  workFolderPullSuccess: "कार्य फ़ोल्डर से खींचकर मर्ज किया गया: starters {starters}, tasks {tasks}, chat {chat}, documents {documents}।",
  workFolderPushSuccess: "कार्य फ़ोल्डर में भेजा गया: starters {starters}, tasks {tasks}, chat {chat}, documents {documents}।",
  googleDriveSyncLabel: "Google Drive सिंक",
  googleDriveClientIdLabel: "OAuth क्लाइंट ID",
  googleDriveSyncEnabledLabel: "Drive सिंक सक्षम करें",
  googleDriveAutoSyncLabel: "सेव के बाद ऑटो-सिंक",
  googleDriveConnect: "Google Drive कनेक्ट करें",
  googleDrivePull: "Drive से खींचें",
  googleDrivePush: "Drive में भेजें",
  googleDriveDisconnect: "डिस्कनेक्ट करें",
  googleDriveSyncHint: "Google Drive app data के माध्यम से बने हुए chat documents, Starter Skill Collection और task reminders को सिंक करें।",
  googleDriveRedirectLabel: "रिडायरेक्ट URL",
  googleDriveNotConnected: "Google Drive कनेक्ट नहीं है।",
  googleDriveConnected: "Google Drive कनेक्ट है।",
  googleDriveLastSync: "पिछला सिंक: {time}",
  googleDriveLastError: "Drive सिंक त्रुटि: {error}",
  googleDriveConnectSuccess: "Google Drive कनेक्ट हो गया।",
  googleDriveDisconnectSuccess: "Google Drive डिस्कनेक्ट हो गया।",
  googleDrivePushSuccess: "Google Drive में भेजा गया।",
  googleDrivePullSuccess: "Google Drive से खींचकर मर्ज किया गया।",
  googleDriveMissingClientId: "पहले Google OAuth Client ID दर्ज करें और सेटिंग्स सेव करें।",
  settingsThemeLabel: "सेटिंग्स थीम",
  settingsThemeHint: "यह केवल इस सेटिंग्स पेज को बदलता है। सिस्टम मोड आपके OS की रूप-रंग का पालन करता है।",
  settingsThemeSystem: "सिस्टम का पालन करें",
  settingsThemeDark: "डार्क",
  settingsThemeLight: "लाइट",
  taskExtractionWindowDaysLabel: "कार्य स्वतः निष्कर्षण विंडो",
  taskExtractionWindowDaysHint: "कार्य निष्कर्षण दिख रहे चैट कंटेंट का उपयोग करता है और डिफ़ॉल्ट रूप से पिछले 3 दिनों को प्राथमिकता देता है। आप विंडो को अधिकतम 7 दिनों तक बढ़ा सकते हैं।",
  starterHoverTipsEnabledLabel: "Starter hover tips दिखाएँ",
  starterHoverTipsEnabledHint: "चैट पैनल में starter पर होवर करने पर वह क्या करता है इसका छोटा विवरण दिखाएँ।",
  multiPerspectiveProfilesLabel: "मल्टी-पर्सपेक्टिव प्रोफ़ाइल",
  utilityTabExperience: "अनुभव",
  utilityTabStarterSkills: "स्टार्टर स्किल्स",
  customStartersLabel: "कस्टम Starters",
  customStartersInputLabel: "Starter JSON पेस्ट करें",
  starterLibraryKicker: "स्टार्टर स्किल्स",
  starterLibraryTitle: "स्टार्टर स्किल लाइब्रेरी",
  starterLibraryDescription: "यहाँ पुन: प्रयोज्य custom starter skills संग्रहित करें। नया JSON आयात करें, ID से मौजूदा skill अपडेट करें, और इन-पेज चैट पैनल के लिए एक मजबूत लाइब्रेरी तैयार रखें।",
  starterLibraryStoredLabel: "संग्रहीत",
  starterLibraryCapacityLabel: "क्षमता",
  starterLibraryLimitHint: "अधिकतम 20 starter skills संग्रहित करें",
  starterLibraryGridTitle: "स्टार्टर स्किल कलेक्शन",
  starterLibraryGridDescription: "हर skill card इन-पेज चैट पैनल में उपलब्ध रहती है और यहाँ से अपडेट या हटाई जा सकती है।",
  multiPerspectiveProfilesHint: "प्रति पंक्ति एक perspective, प्रारूप `शीर्षक|निर्देश`। खाली छोड़ने पर हर पेज प्रकार के लिए बिल्ट-इन डिफ़ॉल्ट उपयोग होंगे।",
  customStartersHint: "लाइब्रेरी में जोड़ने के लिए starter JSON यहाँ पेस्ट करें। समान `id` मौजूदा skills को अपडेट करेंगे और नए `id` जोड़े जाएँगे। हर आइटम में कम से कम `label` और `prompt` होना चाहिए, `scopes` और `mode` वैकल्पिक हैं।",
  customStartersInputPlaceholder: '[{"label":"ईमेल सारांश","prompt":"इस ईमेल का सारांश दें"}]',
  createStarters: "लाइब्रेरी में जोड़ें",
  clearStarters: "लाइब्रेरी साफ़ करें",
  noCustomStarters: "अभी तक कोई custom starters आयात नहीं किए गए हैं।",
  customStarterImported: "{count} starter जोड़े या अपडेट किए गए। लाइब्रेरी में अब {total} / {limit} हैं।",
  customStarterCleared: "Custom starters साफ़ किए गए।",
  customStarterImportFailed: "Starter JSON आयात करने में विफल।",
  customStarterLimitReached: "आप अधिकतम {limit} custom starters संग्रहित कर सकते हैं।",
  deleteStarter: "हटाएँ",
  customStarterDeleted: "Starter हटाया गया: {name}",
  confirmClearFolder: "लोकल कार्य फ़ोल्डर सेटिंग साफ़ करें?",
  confirmClearStarters: "सभी आयातित starters साफ़ करें?",
  confirmDeleteStarter: "Starter \"{name}\" हटाएँ?",
  starterPreviewScopeAll: "सभी पेज",
  starterPreviewModeChat: "चैट",
  starterPreviewModePerspective: "दृष्टिकोण",
});

Object.assign(OPTION_I18N["zh-TW"], {
  customStartersLabel: "教 AI 一個新技能",
  customStartersInputLabel: "貼上技能 JSON",
  starterLibraryTitle: "AI 技能庫",
  starterLibraryDescription: "把你教給 AI 的可重複使用技能集中管理在這裡。貼上新的 JSON、依照 ID 更新既有技能，讓頁面內聊天面板隨時可用。",
  starterLibraryGridTitle: "AI 技能集合",
  starterLibraryGridDescription: "每張技能卡都會同步提供給頁面內聊天面板，可在這裡持續更新或刪除。",
  customStartersHint: "把技能 JSON 貼到這裡後加入技能庫。相同 `id` 會更新，新的 `id` 會新增。每個項目至少要有 `label` 和 `prompt`，可選 `scopes` 與 `mode`。",
  createStarters: "加入 AI 技能庫",
  clearStarters: "清空 AI 技能庫",
  noCustomStarters: "目前還沒有匯入 AI 技能。",
  customStarterImported: "已加入或更新 {count} 個 AI 技能，目前共 {total} / {limit} 組。",
  customStarterCleared: "已清除 AI 技能。",
  customStarterImportFailed: "AI 技能 JSON 匯入失敗。",
  customStarterLimitReached: "最多只能儲存 {limit} 組 AI 技能。",
  deleteStarter: "移除",
  customStarterDeleted: "已移除 AI 技能：{name}",
  confirmClearStarters: "確定要清除所有匯入的 AI 技能嗎？",
  confirmDeleteStarter: "確定要移除 AI 技能「{name}」嗎？",
});

Object.assign(OPTION_I18N.en, {
  customStartersLabel: "Teach Your AI a New Skill",
  customStartersInputLabel: "Paste Skill JSON",
  starterLibraryTitle: "AI Skills Library",
  starterLibraryDescription: "Manage the reusable skills you teach your AI here. Import new JSON, update an existing skill by ID, and keep a strong library ready for the in-page chat panel.",
  starterLibraryGridTitle: "AI Skills Collection",
  starterLibraryGridDescription: "Every skill card is available to the in-page chat panel and can be updated or removed here.",
  customStartersHint: "Paste skill JSON here to add it to the library. Matching `id` values update existing skills, while new `id` values are added. Each item needs at least `label` and `prompt`, with optional `scopes` and `mode`.",
  createStarters: "Add to AI Skills Library",
  clearStarters: "Clear AI Skills Library",
  noCustomStarters: "No AI skills imported yet.",
  customStarterImported: "Added or updated {count} AI skill(s). Library now has {total} / {limit}.",
  customStarterCleared: "AI skills cleared.",
  customStarterImportFailed: "Failed to import AI skill JSON.",
  customStarterLimitReached: "You can store up to {limit} AI skills.",
  deleteStarter: "Remove",
  customStarterDeleted: "Removed AI skill: {name}",
  confirmClearStarters: "Clear all imported AI skills?",
  confirmDeleteStarter: "Remove AI skill \"{name}\"?",
});

Object.assign(OPTION_I18N.ja, {
  customStartersLabel: "AI に新しいスキルを教える",
  customStartersInputLabel: "スキル JSON を貼り付け",
  starterLibraryTitle: "AI スキルライブラリ",
  starterLibraryDescription: "AI に教えた再利用可能なスキルをここで管理します。新しい JSON を取り込み、ID で既存スキルを更新し、ページ内チャットですぐ使えるライブラリを整えられます。",
  starterLibraryGridTitle: "AI スキルコレクション",
  starterLibraryGridDescription: "各スキルカードはページ内チャットパネルで利用でき、ここで更新や削除ができます。",
  customStartersHint: "スキル JSON をここに貼り付けてライブラリに追加します。同じ `id` は更新され、新しい `id` は追加されます。各項目には最低でも `label` と `prompt` が必要で、`scopes` と `mode` は任意です。",
  createStarters: "AI スキルライブラリに追加",
  clearStarters: "AI スキルライブラリをクリア",
  noCustomStarters: "まだ AI スキルは取り込まれていません。",
  customStarterImported: "{count} 件の AI スキルを追加または更新しました。現在は {total} / {limit} 件です。",
  customStarterCleared: "AI スキルをクリアしました。",
  customStarterImportFailed: "AI スキル JSON の取り込みに失敗しました。",
  customStarterLimitReached: "保存できる AI スキルは最大 {limit} 件です。",
  deleteStarter: "削除",
  customStarterDeleted: "AI スキルを削除しました: {name}",
  confirmClearStarters: "取り込んだ AI スキルをすべてクリアしますか？",
  confirmDeleteStarter: "AI スキル「{name}」を削除しますか？",
});

Object.assign(OPTION_I18N.ko, {
  customStartersLabel: "AI에게 새 스킬 가르치기",
  customStartersInputLabel: "스킬 JSON 붙여넣기",
  starterLibraryTitle: "AI 스킬 라이브러리",
  starterLibraryDescription: "AI에게 가르친 재사용 가능한 스킬을 여기에서 관리하세요. 새 JSON을 가져오고, ID로 기존 스킬을 갱신하며, 페이지 내 채팅 패널에서 바로 쓸 수 있는 라이브러리를 유지할 수 있습니다.",
  starterLibraryGridTitle: "AI 스킬 컬렉션",
  starterLibraryGridDescription: "각 스킬 카드는 페이지 내 채팅 패널에서 바로 사용 가능하며 여기에서 수정하거나 삭제할 수 있습니다.",
  customStartersHint: "스킬 JSON을 여기에 붙여 라이브러리에 추가하세요. 같은 `id`는 기존 스킬을 업데이트하고, 새로운 `id`는 추가됩니다. 각 항목에는 최소 `label`과 `prompt`가 필요하며 `scopes`와 `mode`는 선택 사항입니다.",
  createStarters: "AI 스킬 라이브러리에 추가",
  clearStarters: "AI 스킬 라이브러리 비우기",
  noCustomStarters: "아직 AI 스킬이 없습니다.",
  customStarterImported: "{count}개의 AI 스킬을 추가하거나 업데이트했습니다. 현재 {total} / {limit}개입니다.",
  customStarterCleared: "AI 스킬을 지웠습니다.",
  customStarterImportFailed: "AI 스킬 JSON 가져오기에 실패했습니다.",
  customStarterLimitReached: "최대 {limit}개의 AI 스킬만 저장할 수 있습니다.",
  deleteStarter: "삭제",
  customStarterDeleted: "AI 스킬 삭제됨: {name}",
  confirmClearStarters: "가져온 AI 스킬을 모두 지울까요?",
  confirmDeleteStarter: "AI 스킬 \"{name}\"을(를) 삭제할까요?",
});

Object.assign(OPTION_I18N["zh-CN"], {
  customStartersLabel: "教 AI 一个新技能",
  customStartersInputLabel: "粘贴技能 JSON",
  starterLibraryTitle: "AI 技能库",
  starterLibraryDescription: "将你教给 AI 的可重复使用技能集中管理在这里。导入新的 JSON、按 ID 更新已有技能，让页面内聊天面板随时可用。",
  starterLibraryGridTitle: "AI 技能集合",
  starterLibraryGridDescription: "每张技能卡都会同步提供给页面内聊天面板，可在这里持续更新或删除。",
  customStartersHint: "将技能 JSON 粘贴到这里后加入技能库。相同 `id` 会更新，新的 `id` 会新增。每个项目至少要有 `label` 和 `prompt`，可选 `scopes` 与 `mode`。",
  createStarters: "加入 AI 技能库",
  clearStarters: "清空 AI 技能库",
  noCustomStarters: "目前还没有导入 AI 技能。",
  customStarterImported: "已加入或更新 {count} 个 AI 技能，目前共 {total} / {limit} 组。",
  customStarterCleared: "已清除 AI 技能。",
  customStarterImportFailed: "AI 技能 JSON 导入失败。",
  customStarterLimitReached: "最多只能存储 {limit} 组 AI 技能。",
  deleteStarter: "移除",
  customStarterDeleted: "已移除 AI 技能：{name}",
  confirmClearStarters: "确定要清除所有导入的 AI 技能吗？",
  confirmDeleteStarter: "确定要移除 AI 技能“{name}”吗？",
});

const LOCAL_DB_NAME = "edge-ai-chat-local-db";
const LOCAL_DB_VERSION = 1;
const LOCAL_DB_STORE = "kv";
const WORK_FOLDER_HANDLE_KEY = "work-folder-handle";
const LOCAL_META_KEY = "localWorkFolderMeta";
const MAX_CUSTOM_STARTERS = 20;
const DEFAULT_SYSTEM_PROMPT_EN = [
  "You are an Ollama quick assistant inside the user's browser.",
  "Answer using the current page as context when it is relevant.",
  "If the page context is insufficient, say what is missing.",
  "When you mention a URL or file path, format it as a Markdown link.",
  "For external URLs, use [label](https://example.com). For repo or site-relative file paths, use [path](relative/or/absolute/path).",
].join("\n");
const DEFAULT_MULTI_PERSPECTIVE_PROFILES_EN = [
  "Summarizer|Extract the key facts, context, and conclusion.",
  "Skeptic|Challenge assumptions, missing evidence, and weak points.",
  "Action Advisor|Recommend practical next steps and decisions.",
].join("\n");
const LOCALIZED_DEFAULT_SYSTEM_PROMPTS = {
  "zh-TW": [
    "你是使用者瀏覽器中的 Ollama 快速助理。",
    "當前頁面內容有幫助時，請優先把它當成上下文來回答。",
    "如果頁面上下文不足，請明確指出還缺少什麼。",
    "當你提到 URL 或檔案路徑時，請使用 Markdown 連結格式。",
    "外部 URL 請使用 [label](https://example.com)；repo 或網站相對/絕對路徑請使用 [path](relative/or/absolute/path)。",
  ].join("\n"),
  ja: [
    "あなたはユーザーのブラウザー内で動く Ollama クイックアシスタントです。",
    "現在のページ内容が関連する場合は、それをコンテキストとして使って回答してください。",
    "ページのコンテキストが不十分な場合は、何が不足しているかを明確に伝えてください。",
    "URL やファイルパスに言及するときは、Markdown リンク形式で記述してください。",
    "外部 URL には [label](https://example.com) を使い、repo やサイト相対/絶対パスには [path](relative/or/absolute/path) を使ってください。",
  ].join("\n"),
};
const LOCALIZED_DEFAULT_MULTI_PERSPECTIVE_PROFILES = {
  "zh-TW": [
    "摘要者|整理關鍵事實、脈絡與結論。",
    "懷疑者|挑戰假設、找出證據不足與薄弱處。",
    "行動建議者|提出實際的下一步與判斷建議。",
  ].join("\n"),
  ja: [
    "要約者|重要な事実、文脈、結論を整理してください。",
    "懐疑者|前提、証拠不足、弱い点を指摘してください。",
    "行動アドバイザー|現実的な次の一手と判断案を提案してください。",
  ].join("\n"),
};

let currentLocale = OPTION_I18N["zh-TW"];
let activeProviderTab = "ollama";
let activeUtilityTab = "experience";
let currentCustomStarters = [];
let currentReplyLanguage = "zh-TW";
let currentSelectedModel = "";
let latestWorkFolderStatus = null;
let latestGoogleDriveStatus = null;
let starterAiEditorState = {
  open: false,
  starterId: "",
  conversation: [],
  pendingStarter: null,
  isGenerating: false,
  isApplying: false,
};
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

function getLocalizedDefaultSystemPrompt(locale) {
  return LOCALIZED_DEFAULT_SYSTEM_PROMPTS[locale] || DEFAULT_SYSTEM_PROMPT_EN;
}

function getLocalizedDefaultMultiPerspectiveProfiles(locale) {
  return LOCALIZED_DEFAULT_MULTI_PERSPECTIVE_PROFILES[locale] || DEFAULT_MULTI_PERSPECTIVE_PROFILES_EN;
}

function matchesKnownDefault(value, getter, englishDefault) {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return true;
  }
  const candidates = new Set([
    englishDefault,
    getter("zh-TW"),
    getter("ja"),
    getter("ko"),
    getter("zh-CN"),
    getter("es"),
    getter("fr"),
    getter("de"),
    getter("pt-BR"),
    getter("hi"),
  ].map((item) => String(item || "").trim()).filter(Boolean));
  return candidates.has(normalized);
}

function localizeDefaultText(value, locale, getter, englishDefault) {
  const normalized = String(value || "").trim();
  if (!normalized || normalized === englishDefault || matchesKnownDefault(normalized, getter, englishDefault)) {
    return getter(locale);
  }
  return normalized;
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
  const starterAiEditorKicker = document.getElementById("starterAiEditorKicker");
  if (starterAiEditorKicker) starterAiEditorKicker.textContent = t("starterAiEditorKicker");
  const starterAiEditorTitle = document.getElementById("starterAiEditorTitle");
  if (starterAiEditorTitle) starterAiEditorTitle.textContent = t("starterAiEditorTitle");
  const starterAiEditorHint = document.getElementById("starterAiEditorHint");
  if (starterAiEditorHint) starterAiEditorHint.textContent = t("starterAiEditorHint");
  const starterAiEditorClose = document.getElementById("starterAiEditorClose");
  if (starterAiEditorClose) starterAiEditorClose.textContent = t("starterAiEditorClose");
  const starterAiEditorCurrentLabel = document.getElementById("starterAiEditorCurrentLabel");
  if (starterAiEditorCurrentLabel) starterAiEditorCurrentLabel.textContent = t("starterAiEditorCurrentLabel");
  const starterAiEditorInputLabel = document.getElementById("starterAiEditorInputLabel");
  if (starterAiEditorInputLabel) starterAiEditorInputLabel.textContent = t("starterAiEditorInputLabel");
  const starterAiEditorInput = document.getElementById("starterAiEditorInput");
  if (starterAiEditorInput instanceof HTMLTextAreaElement) starterAiEditorInput.placeholder = t("starterAiEditorInputPlaceholder");
  const starterAiEditorDiscuss = document.getElementById("starterAiEditorDiscuss");
  if (starterAiEditorDiscuss) starterAiEditorDiscuss.textContent = t("starterAiEditorDiscuss");
  const starterAiEditorApply = document.getElementById("starterAiEditorApply");
  if (starterAiEditorApply) starterAiEditorApply.textContent = t("starterAiEditorApply");
  document.getElementById("saveButton").textContent = t("saveSettings");
  document.getElementById("testButton").textContent = t("testConnection");
  document.getElementById("installedModelsTitle").textContent = t("installedModels");
  document.getElementById("refreshButton").textContent = t("refresh");
  setActiveUtilityTab(activeUtilityTab);
  renderCustomStartersPreview(currentCustomStarters);
  renderStarterAiEditorModal();
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

function parseSingleStarter(rawText, fallbackIndex = 0) {
  const parsed = parseStarterJsonLikeText(rawText);
  const candidate = Array.isArray(parsed) ? parsed[0] : Array.isArray(parsed?.starters) ? parsed.starters[0] : parsed;
  if (!candidate || typeof candidate !== "object") {
    throw new Error(t("customStarterImportFailed"));
  }
  return normalizeImportedStarter(candidate, fallbackIndex);
}

function renderStarterCardMarkup(starter, { includeEditButton = false, includeDeleteButton = true } = {}) {
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
          ${includeEditButton ? `<button class="secondary-button starter-preview-edit" type="button" data-action="edit-custom-starter" data-starter-id="${escapeHtml(starter.id)}">${escapeHtml(t("editStarterWithAi"))}</button>` : ""}
          ${includeDeleteButton ? `<button class="secondary-button danger-button starter-preview-delete" type="button" data-action="delete-custom-starter" data-starter-id="${escapeHtml(starter.id)}">${escapeHtml(t("deleteStarter"))}</button>` : ""}
        </div>
      </div>
      <div class="starter-preview-scopes">
        ${orderedScopes.map((scope) => `<span class="starter-preview-scope">${escapeHtml(getScopeLabel(scope))}</span>`).join("")}
      </div>
      <div class="starter-preview-prompt">${escapeHtml(starter.prompt)}</div>
    </article>
  `;
}

function getStarterAiEditorStarter() {
  return currentCustomStarters.find((item) => item.id === starterAiEditorState.starterId) || null;
}

function hasStarterAiEditorDiscussion() {
  return starterAiEditorState.conversation.some((message) => message.role === "assistant" && String(message.content || "").trim());
}

function renderStarterAiEditorConversation() {
  const node = document.getElementById("starterAiEditorConversation");
  if (!node) {
    return;
  }

  if (!starterAiEditorState.conversation.length && !starterAiEditorState.isGenerating && !starterAiEditorState.isApplying) {
    node.className = "starter-ai-editor-conversation empty-state";
    node.textContent = t("starterAiEditorNoDiscussion");
    return;
  }

  node.className = "starter-ai-editor-conversation";
  const messages = starterAiEditorState.conversation.map((message) => `
    <article class="starter-ai-editor-message ${message.role === "user" ? "is-user" : ""}">
      <div class="starter-ai-editor-message-role">${escapeHtml(message.role === "user" ? "User" : "AI")}</div>
      <div class="starter-ai-editor-message-body">${escapeHtml(message.content)}</div>
    </article>
  `);

  if (starterAiEditorState.isGenerating || starterAiEditorState.isApplying) {
    messages.push(`
      <article class="starter-ai-editor-message">
        <div class="starter-ai-editor-message-role">ASSISTANT</div>
        <div class="starter-ai-editor-message-body">
          <span class="starter-ai-editor-thinking">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span>${escapeHtml(starterAiEditorState.isApplying ? t("starterAiEditorApplying") : t("starterAiEditorThinking"))}</span>
        </div>
      </article>
    `);
  }

  node.innerHTML = messages.join("");
  node.scrollTop = node.scrollHeight;
}

function renderStarterAiEditorModal() {
  const backdrop = document.getElementById("starterAiEditorModal");
  const currentCard = document.getElementById("starterAiEditorCurrentCard");
  const applyButton = document.getElementById("starterAiEditorApply");
  const discussButton = document.getElementById("starterAiEditorDiscuss");
  if (!(backdrop instanceof HTMLElement) || !(currentCard instanceof HTMLElement) || !(applyButton instanceof HTMLButtonElement) || !(discussButton instanceof HTMLButtonElement)) {
    return;
  }

  const starter = getStarterAiEditorStarter();
  backdrop.hidden = !starterAiEditorState.open;
  if (!starterAiEditorState.open || !starter) {
    return;
  }

  currentCard.innerHTML = renderStarterCardMarkup(starter, { includeDeleteButton: false });
  renderStarterAiEditorConversation();
  discussButton.disabled = starterAiEditorState.isGenerating || starterAiEditorState.isApplying;
  discussButton.textContent = starterAiEditorState.isGenerating ? t("starterAiEditorThinking") : t("starterAiEditorDiscuss");
  applyButton.disabled = !hasStarterAiEditorDiscussion() || starterAiEditorState.isGenerating || starterAiEditorState.isApplying;
  applyButton.textContent = starterAiEditorState.isApplying ? t("starterAiEditorApplying") : t("starterAiEditorApply");
}

function openStarterAiEditor(starterId) {
  starterAiEditorState = {
    open: true,
    starterId,
    conversation: [],
    pendingStarter: null,
    isGenerating: false,
    isApplying: false,
  };
  const input = document.getElementById("starterAiEditorInput");
  if (input instanceof HTMLTextAreaElement) {
    input.value = "";
  }
  renderStarterAiEditorModal();
}

function closeStarterAiEditor() {
  starterAiEditorState = {
    open: false,
    starterId: "",
    conversation: [],
    pendingStarter: null,
    isGenerating: false,
    isApplying: false,
  };
  renderStarterAiEditorModal();
}

async function runAiSkillEditorGenerate(prompt) {
  if (!currentSelectedModel) {
    throw new Error("Select a model first.");
  }

  const result = await sendMessage({
    type: "ollama:generate",
    prompt,
    model: currentSelectedModel,
  });

  if (!result?.ok) {
    throw new Error(result?.error || t("fetchModelsFailed"));
  }

  return String(result.response || "").trim();
}

function buildStarterAiDiscussionPrompt(starter, userInstruction) {
  const transcript = starterAiEditorState.conversation
    .map((message) => `${message.role === "user" ? "USER" : "ASSISTANT"}:\n${message.content}`)
    .join("\n\n");

  return [
    `Reply language: ${currentReplyLanguage}.`,
    "You are helping improve an existing reusable browser starter skill.",
    "DISCUSSION MODE",
    "Do not output JSON.",
    "Reply in plain language for a non-technical user.",
    "Be proactive: strengthen the skill from a more professional angle, not just literal rewriting.",
    "Consider missing dimensions such as context use, scope, output quality, edge cases, risk checks, and better naming.",
    "Explain what you would improve and why.",
    "If the request is clear enough, end by saying the updated skill is ready to apply.",
    `CURRENT SKILL ID: ${starter.id}`,
    `CURRENT SKILL LABEL: ${starter.label}`,
    `CURRENT SKILL MODE: ${starter.mode}`,
    `CURRENT SKILL SCOPES: ${starter.scopes.join(", ")}`,
    `CURRENT SKILL PROMPT:\n${starter.prompt}`,
    starter.description ? `CURRENT SKILL DESCRIPTION:\n${starter.description}` : "",
    transcript ? `DISCUSSION SO FAR\n${transcript}` : "",
    `LATEST USER REQUEST\n${userInstruction}`,
  ].filter(Boolean).join("\n\n");
}

function buildStarterAiApplyPrompt(starter) {
  const transcript = starterAiEditorState.conversation
    .map((message) => `${message.role === "user" ? "USER" : "ASSISTANT"}:\n${message.content}`)
    .join("\n\n");

  return [
    `Reply language: ${currentReplyLanguage}.`,
    "Generate one updated starter JSON object.",
    "Reply with JSON only.",
    "Do not wrap the response in Markdown code fences.",
    "Preserve the same id unless the user explicitly asked to rename the skill id.",
    "Schema:",
    "{\"id\":\"existing-id\",\"label\":\"Visible name\",\"prompt\":\"Prompt text\",\"description\":\"Short user-facing summary\",\"scopes\":[\"github\"],\"mode\":\"chat\"}",
    "The prompt must assume the current page is already passed as context by the extension.",
    "Do not ask the user to manually provide content that should already be available from the current page.",
    "Use the discussion to improve the skill professionally and proactively.",
    `CURRENT SKILL JSON\n${JSON.stringify(starter, null, 2)}`,
    transcript ? `DISCUSSION TRANSCRIPT\n${transcript}` : "",
  ].filter(Boolean).join("\n\n");
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
    .map((starter) => renderStarterCardMarkup(starter, { includeEditButton: true }))
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
  currentSelectedModel = String(model || "").trim();
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
  latestWorkFolderStatus = status || null;
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
  latestGoogleDriveStatus = status || null;
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
    document.getElementById("systemPrompt").value = localizeDefaultText(
      result.config.systemPrompt,
      replyLanguage,
      getLocalizedDefaultSystemPrompt,
      DEFAULT_SYSTEM_PROMPT_EN,
    );
    document.getElementById("multiPerspectiveProfiles").value = localizeDefaultText(
      result.config.multiPerspectiveProfiles,
      replyLanguage,
      getLocalizedDefaultMultiPerspectiveProfiles,
      DEFAULT_MULTI_PERSPECTIVE_PROFILES_EN,
    );
    currentReplyLanguage = replyLanguage;
    currentSelectedModel = String(result.config.selectedModel || "").trim();
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

  const actionNode = target.closest("[data-action]");
  if (!(actionNode instanceof HTMLElement)) {
    return;
  }

  const starterId = actionNode.dataset.starterId || "";
  if (!starterId) {
    return;
  }

  if (actionNode.dataset.action === "edit-custom-starter") {
    openStarterAiEditor(starterId);
    return;
  }

  if (actionNode.dataset.action !== "delete-custom-starter") {
    return;
  }

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

document.getElementById("starterAiEditorClose").addEventListener("click", () => {
  closeStarterAiEditor();
});

document.getElementById("starterAiEditorModal").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) {
    closeStarterAiEditor();
  }
});

document.getElementById("starterAiEditorDiscuss").addEventListener("click", async () => {
  const starter = getStarterAiEditorStarter();
  const input = document.getElementById("starterAiEditorInput");
  if (!starter || !(input instanceof HTMLTextAreaElement)) {
    return;
  }

  const userInstruction = input.value.trim();
  if (!userInstruction) {
    setStatus(t("starterAiEditorNeedInput"), true);
    return;
  }

  starterAiEditorState.isGenerating = true;
  starterAiEditorState.conversation = [
    ...starterAiEditorState.conversation,
    { role: "user", content: userInstruction },
  ];
  input.value = "";
  renderStarterAiEditorModal();
  setStatus(t("starterAiEditorThinking"));

  try {
    const response = await runAiSkillEditorGenerate(buildStarterAiDiscussionPrompt(starter, userInstruction));
    const assistantMessage = response || t("starterAiEditorEmptyReply");
    starterAiEditorState.conversation = [
      ...starterAiEditorState.conversation,
      { role: "assistant", content: assistantMessage },
    ];
    renderStarterAiEditorModal();
    setStatus(t("waiting"));
  } catch (error) {
    starterAiEditorState.conversation = starterAiEditorState.conversation.slice(0, -1);
    input.value = userInstruction;
    setStatus(error instanceof Error ? error.message : String(error), true);
  } finally {
    starterAiEditorState.isGenerating = false;
    renderStarterAiEditorModal();
  }
});

document.getElementById("starterAiEditorApply").addEventListener("click", async () => {
  const starter = getStarterAiEditorStarter();
  if (!starter) {
    return;
  }

  if (!hasStarterAiEditorDiscussion()) {
    setStatus(t("starterAiEditorNeedDiscussion"), true);
    return;
  }

  starterAiEditorState.isApplying = true;
  renderStarterAiEditorModal();
  setStatus(t("starterAiEditorApplying"));

  try {
    const response = await runAiSkillEditorGenerate(buildStarterAiApplyPrompt(starter));
    if (!response) {
      throw new Error(t("starterAiEditorEmptyReply"));
    }
    const updatedStarter = parseSingleStarter(response, currentCustomStarters.findIndex((item) => item.id === starter.id));
    starterAiEditorState.pendingStarter = updatedStarter;
    currentCustomStarters = currentCustomStarters.map((item) => item.id === starter.id ? updatedStarter : item);
    renderCustomStartersPreview(currentCustomStarters);
    await persistCustomStarters(currentCustomStarters);
    closeStarterAiEditor();
    setStatus(t("starterAiEditorUpdated", { name: updatedStarter.label }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    starterAiEditorState.conversation = [
      ...starterAiEditorState.conversation,
      { role: "assistant", content: `${t("starterAiEditorApplyFailedPrefix")} ${message}` },
    ];
    renderStarterAiEditorModal();
    setStatus(message, true);
  } finally {
    starterAiEditorState.isApplying = false;
    renderStarterAiEditorModal();
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

document.getElementById("replyLanguage").addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) {
    return;
  }

  const nextLanguage = target.value || "zh-TW";
  const systemPromptNode = document.getElementById("systemPrompt");
  const profilesNode = document.getElementById("multiPerspectiveProfiles");
  const currentSystemPrompt = systemPromptNode.value;
  const currentProfiles = profilesNode.value;

  currentLocale = OPTION_I18N[nextLanguage] || OPTION_I18N.en;
  currentReplyLanguage = nextLanguage;
  applyTranslations();
  renderWorkFolderStatus(latestWorkFolderStatus);
  renderGoogleDriveStatus(latestGoogleDriveStatus);

  if (matchesKnownDefault(currentSystemPrompt, getLocalizedDefaultSystemPrompt, DEFAULT_SYSTEM_PROMPT_EN)) {
    systemPromptNode.value = getLocalizedDefaultSystemPrompt(nextLanguage);
  }
  if (matchesKnownDefault(currentProfiles, getLocalizedDefaultMultiPerspectiveProfiles, DEFAULT_MULTI_PERSPECTIVE_PROFILES_EN)) {
    profilesNode.value = getLocalizedDefaultMultiPerspectiveProfiles(nextLanguage);
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
