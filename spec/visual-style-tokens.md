# Visual Style Tokens

## 目的

這份文件把目前專案最重要的視覺 token 明文化，讓另一個 AI 不需要從 CSS 自己猜尺寸、顏色與比例。

## 全域風格摘要

- 主體是深色玻璃感控制台
- 高光色以青藍和綠青為主
- 大量使用半透明深色背景 + 細亮邊框 + 柔和外陰影
- 小面板偏緊湊，settings 頁偏寬鬆，maximized workspace 則偏專業工作台

## Typography Tokens

| Token | 值 | 用途 |
| --- | --- | --- |
| `font.settings` | `"Avenir Next", "Segoe UI", "Helvetica Neue", sans-serif` | popup / settings |
| `font.inpage` | `"Segoe UI", "Helvetica Neue", Arial, sans-serif` | injected panel |
| `size.h1` | `32px` | settings / popup 大標 |
| `size.h2` | `18px` 到 `20px` | 區塊標題、聊天面板標題 |
| `size.body` | `14px` 到 `16px` | 一般內容 |
| `size.meta` | `10px` 到 `12px` | pills、chips、eyebrow、labels |
| `tracking.eyebrow` | `0.08em` | kicker / eyebrow |

## Radius Tokens

| Token | 值 |
| --- | --- |
| `radius.panel.large` | `28px` |
| `radius.panel.medium` | `24px` |
| `radius.popup` | `20px` |
| `radius.card` | `16px` 到 `22px` |
| `radius.field` | `12px` 到 `16px` |
| `radius.pill` | `999px` |

## Core Color Tokens

| Token | 值 | 用途 |
| --- | --- | --- |
| `color.text.primary` | `#f5f9ff` / `#e8f4ff` | 主要文字 |
| `color.text.secondary` | `#d8e7ff` | 次要文字 |
| `color.text.dim` | `rgba(214, 235, 255, 0.7)` | meta 文案 |
| `color.accent.cyan` | `#7fdcff` | eyebrow / accent |
| `color.accent.blueGlow` | `rgba(62, 194, 255, 0.28)` | 背景 glow |
| `color.accent.greenGlow` | `rgba(0, 255, 170, 0.14)` | 背景 glow |
| `color.border.soft` | `rgba(154, 176, 255, 0.18)` | 一般元件邊框 |
| `color.border.strong` | `rgba(105, 234, 255, 0.42)` | active / hover 邊框 |
| `color.bg.panel.dark` | `rgba(6, 14, 26, 0.86)` | settings 主 panel |
| `color.bg.card.dark` | `rgba(7, 19, 35, 0.74)` | settings card |
| `color.bg.glass.soft` | `rgba(255, 255, 255, 0.08)` | injected 小元件底 |

## Gradient Tokens

### Settings / Popup 背景

```text
radial-gradient(circle at top left, rgba(62, 194, 255, 0.28), transparent 28%)
radial-gradient(circle at 85% 20%, rgba(0, 255, 170, 0.14), transparent 24%)
linear-gradient(180deg, #07111f 0%, #030711 100%)
```

### Primary Button

```text
linear-gradient(135deg, #36cfff, #1ef2a5)
```

### In-page Primary Send Button

```text
linear-gradient(135deg, rgba(0, 201, 255, 0.54), rgba(74, 109, 255, 0.58))
```

### User Message Bubble

```text
linear-gradient(135deg, rgba(0, 184, 255, 0.16), rgba(96, 86, 255, 0.18))
```

## Shadow Tokens

| Token | 值 |
| --- | --- |
| `shadow.panel` | `0 24px 60px rgba(0, 0, 0, 0.32)` |
| `shadow.button.primary` | `0 16px 30px rgba(21, 205, 234, 0.22)` |
| `shadow.launcher` | `0 12px 30px rgba(16, 29, 69, 0.24)` |
| `shadow.panel.inpage` | `0 28px 90px rgba(5, 10, 22, 0.26)` |
| `shadow.send` | `0 10px 24px rgba(27, 119, 255, 0.18)` |

## Layout Tokens

| Token | 值 |
| --- | --- |
| `popup.width` | `380px` |
| `settings.maxWidth` | `1180px` |
| `launcher.size.raw` | `46px` |
| `launcher.size.active` | `38px` |
| `panel.width.default` | `min(420px, calc(100vw - 32px))` |
| `panel.maxHeight.default` | `min(78vh, 760px)` |
| `panel.width.maximized` | `min(920px, calc(100vw - 32px))` |
| `panel.width.maximized.large` | `min(1080px, calc(100vw - 40px))` |
| `compose.textarea.minHeight` | `54px` |
| `compose.textarea.maxHeight` | `96px` |
| `attachment.image` | `58px x 58px` |
| `attachment.doc` | `120px x 58px` |

## State Color Tokens

### Model / Starter / Task states

- selected model: 綠色邊框 + 深綠玻璃底
- recommended starter: 藍色強調
- custom starter builder: 粉橘漸層
- agent flow: 綠色漸層
- completed task chip: 淺綠色
- error text: 偏粉紅紅 `#ff808d` 或相近值

## Responsive Tokens

### Mobile threshold

- `640px` 以下：
  - host 改停靠底部右側
  - panel 從 launcher 上方打開
  - compose area 變單欄
  - perspective cards 單欄

### Task rail threshold

- 只有在夠寬的 maximized 畫面才分離 task rail

## Animation Tokens

| Token | 值 | 用途 |
| --- | --- | --- |
| `transition.fast` | `140ms ease` | hover / launcher |
| `transition.default` | `160ms ease` | buttons / starter / tabs |
| `anim.typing` | `1.2s infinite ease-in-out` | typing dots |
| `anim.statusPulse` | `1.1s infinite` | busy indicator |
| `anim.taskSpin` | `0.9s linear infinite` | task loading |
| `anim.flowPulse` | `1.5s ease-out infinite` | running flow step |

## Rebuild Guardrails

- 不可把這套 token 改成純黑白
- 不可把按鈕改成實心粗重 enterprise button
- 不可讓 settings / popup / in-page panel 三者風格斷裂
