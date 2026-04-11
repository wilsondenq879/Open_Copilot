# Design System and UI Language

## 目標

這份文件定義整個產品的共同視覺與互動語氣。若沒有先遵守這份文件，單看功能 spec 很容易做成「功能對了、味道不對」。

## 品牌感與產品氣質

- 類型：local-first AI cockpit
- 氣質：技術感、未來感、偏冷色、但不是賽博龐克噪音風
- 關鍵詞：glassmorphism, teal glow, floating console, dark translucent workspace
- 避免：白底企業後台、Material 預設感、過度圓潤玩具感、紫色 AI 模板風

## 色彩規則

### Settings / Popup 主題

- 背景基底：極深藍黑漸層
- 高光色：青藍 `#7fdcff`、亮青 `rgba(62, 194, 255, ...)`
- 次高光：綠青 `rgba(0, 255, 170, ...)`
- 文字主色：接近白藍 `#e8f4ff`
- 深色卡片背景：`rgba(6, 14, 26, 0.86)` 等級
- 邊框：低對比藍色半透明邊框

### In-page 面板主題

- 背景：半透明深藍灰玻璃卡
- launcher：球體發光核心 + 外圈柔光 + 微金屬邊框
- 按鈕：玻璃感次要按鈕 + 強對比主按鈕

## 字體與字級

### Settings / Popup

- 字體：`"Avenir Next", "Segoe UI", "Helvetica Neue", sans-serif`
- `h1`：大標，約 32px，緊湊 line-height
- kicker / eyebrow：11-12px，全大寫，高字重，高 letter-spacing

### In-page Panel

- 字體：`"Segoe UI", "Helvetica Neue", Arial, sans-serif`
- 預設文字：16px base
- 標題：20px 左右
- 標籤和 meta：10-12px

## 圓角、陰影、材質

- 大卡片圓角：20px 到 28px
- 小元件圓角：12px
- pill / chip：999px
- 陰影不可過硬，要有柔和外擴暈光
- 卡片要像「透明深色壓克力」而不是實心 panel
- backdrop blur 是核心視覺之一

## 佈局規則

### Popup

- 寬度約 380px
- 結構簡單：header、endpoint row、models section

### Settings

- 中央大 panel，最大寬約 1180px
- 有 backdrop grid
- 上方 hero header + toolbar
- 主內容使用卡片與 tab 分區

### In-page Panel

- 固定於視窗右側
- launcher 在關閉時可單獨存在
- 面板預設寬度約 420px
- 最大化後變成 workspace，保留聊天主區與右側工具區

## 元件語言

### Button

- 次要按鈕：半透明底、細邊框、低亮度高可讀文字
- 主按鈕：更高亮度或更明顯填色
- 危險按鈕：橘紅色系，不要純血紅

### Model Card / Starter Card / Task Card

- 都是卡片式，不是單純 list item
- 必須包含標題、meta、狀態標記
- hover / selected / detected 有視覺區別

### Pills / Chips

- 用於 page type、adapter、scope、status
- 必須短、小、膠囊型

## 互動語氣

- 面板像正在陪使用者工作的副駕，不像獨立 app
- 訊息與控制要偏緊湊，因為它是嵌入網頁內的工具
- 最大化時轉為 workspace，但不是完全切離頁面

## 動畫與回饋

- transition 短、輕、透明度與位移為主
- 面板切換、starter 區展開、hover 都要有微動畫
- 避免過度彈跳或厚重 motion

## 響應式規則

- 小面板狀態優先保持單欄可操作
- maximized 且視窗夠寬時才出現 detached task rail
- 超窄畫面時 panel 寬度以 `calc(100vw - 32px)` 類型方式收斂

## 不可偏離的視覺特徵

- launcher 一定要是發光 orb，不可改成普通 chat bubble icon
- 浮動面板一定要有玻璃感和深色透明背景
- starter 區要保留橫向工具列感，不可改成大段下拉表單
- settings page 一定要保留深色大卡片儀表板風格

## Style Tokens

### Shared radii

- panel radius: `24px` 到 `28px`
- popup radius: `20px`
- field radius: `12px` 到 `14px`
- pill radius: `999px`

### Shared spacing

- shell edge padding: `16px`
- card inner padding: `10px` 到 `20px`
- compact chip gap: `6px`
- section gap: `8px` 到 `16px`

### Key colors

- accent cyan: `#7fdcff`
- text bright: `#f5f9ff`
- text soft: `#d8e7ff`
- border soft: `rgba(154, 176, 255, 0.18)`
- panel glass dark: `rgba(6, 11, 20, 0.22)` 到 `rgba(6, 14, 26, 0.86)`
- recommended starter blue: `rgba(51, 132, 255, 0.14)`
- custom builder pink/orange: `rgba(255, 120, 214, 0.2)` + `rgba(255, 173, 87, 0.16)`
- flow green: `rgba(66, 205, 102, 0.22)`

### Key dimensions

- orb launcher: `38px` visual shell, rounded square body
- small panel width: `min(420px, calc(100vw - 32px))`
- maximized panel width: `min(920px, calc(100vw - 32px))`
- fullscreen-maximized width under host-max mode: `min(1080px, calc(100vw - 32px))`

## Content Density Rules

- Popup: tight and compact
- Settings: spacious but still dense enough for power-user control
- In-page panel: compact by default, richer in maximized mode
