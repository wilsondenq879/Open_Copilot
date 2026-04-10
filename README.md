# Edge AI Chat

This project is a Microsoft Edge Manifest V3 extension. It injects a collapsible chat panel into webpages, collects the current page content, selected text, and attachments, then sends everything to your local Ollama or LM Studio instance.

It is not an official GitHub Copilot provider integration. Instead, it is a browser-side local AI chat bridge designed to let you summarize pages, translate content, explain code, and analyze images/text files directly with local models on any website.

## Screenshots

*Code helper*
![Code assistant example](./tutorial_code_assistant/screenshot_4.jpg)

![Web summarizer example](./tutorial_web_summarizer/screenshot_5.jpg)

*Page Summary/Translation*
![Extension screenshot 1](./images/1.png)

![Extension screenshot 2](./images/2.png)
*Flow chart to Mermaid*
![Extension screenshot 3](./images/3.png)

## Real-World Usage 

I personally use this on an `M4 Mac mini` with `16GB RAM`, paired with `gemma4:e2b`, and it runs smoothly for everyday browsing, page summarization, code explanation, and general chat workflows.

If you want a practical baseline before trying larger models, `M4 Mac mini + 16GB RAM + gemma4:e2b` is a configuration that already feels usable and responsive in daily use.

## Feature Overview

- Connects to local Ollama or LM Studio
- Reads installed models from Ollama `/api/tags` or LM Studio `/v1/models`
- Quickly switches the active model from the extension popup
- Injects an Edge AI Chat floating panel at the bottom-right of webpages
- Sends current page content as prompt context
- Includes current user-selected text
- Supports streaming responses
- Supports image and text-file attachments
- Renders assistant Mermaid code fences as diagrams
- Built-in starter prompts
- Configurable reply language

## Default Settings

- Ollama URL: `http://127.0.0.1:11434`
- LM Studio URL: `http://127.0.0.1:1234`
- Reply language: user-configurable in `Settings`

You can update the Ollama URL, LM Studio URL, and reply language in the extension Settings page.

## Prerequisites

Make sure either Ollama or LM Studio is running locally, and at least one model is available.

### Option 1: Ollama

```bash
ollama serve
```

In another terminal, check available models:

```bash
ollama list
```

If needed, pull a model first:

```bash
ollama pull llama3.2
```

### Option 2: LM Studio

1. Start the local server in LM Studio.
2. Make sure the OpenAI-compatible endpoint is enabled.
3. Confirm the default URL is:

```text
http://127.0.0.1:1234
```

4. Load at least one chat model. For image analysis, load a vision-capable model.

For image analysis on either backend, use a vision-capable model (for example models containing `vision`, `vl`, `llava`, or `qwen-vl`).

## Install in Edge

1. Clone this repository:

```bash
git clone https://github.com/<your-account>/Edge_Ai_Chat.git
cd Edge_Ai_Chat
node scripts/build-dist.mjs
```

2. Open `edge://extensions`
3. Enable `Developer mode`
4. Click `Load unpacked`
5. Select the generated `dist/` folder to complete installation

After loading, it is recommended to:

1. Click the extension icon and verify it can fetch models
2. Open `Settings` and confirm either the Ollama URL is `http://127.0.0.1:11434` or the LM Studio URL is `http://127.0.0.1:1234`

## UI Guide

### 1. Popup

Click the extension icon in the browser toolbar. You will see:

- Endpoint: current Ollama or LM Studio endpoint
- Settings: open settings page
- Models: detected models from the active backend
- Refresh: reload model list

Click any model card to set it as the active model.

### 2. Settings Page

Current settings include:

- Ollama URL
- LM Studio URL
- LM Studio default model ID
- LM Studio API key
- Reply language
- Test connection
- Installed models / Refresh

You can use either Ollama or LM Studio from the current UI settings.

### 3. Bottom-Right Chat Panel

When visiting regular webpages, a floating chat button appears at the bottom-right. Open it to use:

- Model dropdown: switch current model from the active backend
- `Context` toggle: include/exclude page context in prompts
- Starter buttons
- `✦`: insert currently highlighted text into input
- `Clear`: clear current conversation and attachments
- `⚙`: open settings page
- `-`: collapse panel
- `⊕`: upload image or text attachments
- `➤`: send message

## What Page Data Is Included

When `Context` is enabled, prompts automatically include:

- Page title
- Page URL
- Meta description
- `h1` / `h2` / `h3` content
- Current user selection
- Part of visible page text
- Recent conversation history

If `Context` is disabled, this page data is not attached.

## Starter Prompts

Built-in quick templates:

- `Summarize This Page`
- `Translate Page To <current reply language>`
- `Explain Code Clearly`
- `Analyze Image`
- `Analyze Image To md/mermaid`

These buttons prefill prompt text; you can still edit before sending.

## Keyboard Shortcuts

- `Ctrl + /` or `Cmd + /`: open/collapse chat panel
- `Ctrl + Enter` or `Cmd + Enter`: send message from input

Notes:

- `Ctrl/Cmd + /` works only when focus is not inside input, textarea, or editable elements
- Pressing `Enter` alone does not send (reserved for multi-line input)

## Attachment Support

### Images

You can attach images by:

- Clicking `⊕` and selecting files
- Dragging and dropping into the chat panel
- Pasting clipboard images directly into the input area

### Text Files

Supported formats:

- `.txt`
- `.md`
- `.json`
- `.csv`

Text file content is read into the prompt for analysis.

## Recommended Workflow

1. Confirm Ollama or LM Studio connection from popup or settings
2. Choose a model
3. Open the bottom-right panel on any webpage
4. Enable or disable `Context` as needed
5. Type your question, or start from starter prompts/selection/attachments
6. Send with `Ctrl/Cmd + Enter`

## Common Use Cases

### Summarize a Full Page

1. Open the panel
2. Keep `Context` enabled
3. Click `Summarize This Page`
4. Send

### Explain a Code Snippet on the Current Page

1. Highlight code text on the page
2. Click `✦`
3. Add your question
4. Send

### Analyze Screenshots or Design Drafts

1. Switch to a vision-capable model
2. Paste or drag/drop an image
3. Click `Analyze Image` or type your own prompt
4. Send

## Current Limitations

- This is not an official GitHub model provider integration
- It focuses on in-browser embedded chat rather than replacing GitHub backend AI infrastructure
- Image analysis depends on whether the selected Ollama or LM Studio model supports vision
- Mermaid rendering uses `https://mermaid.ink` to convert Mermaid code blocks into SVG, so it requires internet access and sends Mermaid diagram text to that service
- Text attachments currently support only `.txt`, `.md`, `.json`, `.csv`
- Page content is partially captured, not full-site indexing

## Key Project Files

- [manifest.json](manifest.json)
- [src/background.js](src/background.js)
- [src/content-script.js](src/content-script.js)
- [src/popup.js](src/popup.js)
- [src/options.js](src/options.js)

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

Author: `wilsondenq879`
