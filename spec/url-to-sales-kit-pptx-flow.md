# URL(s) to Sales Kit PPTX Flow

## Purpose

This starter flow turns one or more product / solution webpage URLs into a reusable sales kit PowerPoint workflow.

The flow is intentionally chained instead of one large prompt:

1. URL Content Collector
2. Webpage Asset Extractor
3. Marketing Message Strategist
4. Slide Storyboard Planner
5. PPTX Content Generator
6. PPTX Builder / Exporter

## Implementation Notes

- The in-page entry point is the built-in starter `urlToSalesKitPptxFlow`.
- The user can enter URLs, audience, language, tone, slide count, and brand style.
- URL page reading reuses the existing hidden-tab page context collector.
- Image assets reuse page `imageCandidates`, are deduplicated, classified, and assigned stable `asset_###` ids.
- PPTX generation reuses the existing browser-side OpenXML PowerPoint builder rather than adding a new npm dependency.
- When Local Work Folder is configured, output is written to `exports/sales-kit-YYYYMMDD-HHMMSS/`.

## Developer Test Path

With the extension loaded on any normal webpage, a developer can send this message to the content script instead of clicking through the form:

```js
chrome.tabs.sendMessage(tabId, {
  type: "edge-ai-chat:run-sales-kit-fixture",
  input: {
    urls: ["https://www.asus.com/content/asus-router-app"],
    audience: "sales, channel partners, product marketing",
    language: "zh-TW",
    tone: "keynote",
    slideCount: 10,
    brandStyle: "premium product keynote, clean layout, image-led, high contrast"
  }
});
```

## Output Files

- `deck.pptx` equivalent filename generated from the deck title
- `deck-source.md`
- `deck-data.json`
- `asset-manifest.json`

If Local Work Folder is unavailable, the generated chat message still exposes the normal PPTX download action.
