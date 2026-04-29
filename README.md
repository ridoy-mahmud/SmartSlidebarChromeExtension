# Smart Sidebar (Chrome Extension)

Smart Sidebar is a sleek Chrome side panel that lets you organize **unlimited shortcuts** (web apps, tools, links) without the New Tab shortcut limit.

<img src="https://i.ibb.co/zh8K9P5w/Screenshot-2026-04-29-081750.png" alt="Smart Sidebar screenshot" width="226" />

## Features

- **Unlimited shortcuts** in a compact grid
- **Side panel UX** that feels native to Chrome
- **Floating edge widget** (click to open instantly)
- **Add / edit / delete** shortcuts with a quick context menu
- **Click-outside close** behavior via content script

## Install (Chrome)

This repo includes a small Next.js app that **packages the extension source as a zip**.

1. Install dependencies:
   - `npm install`
2. Start the packager UI:
   - `npm run dev`
3. Open the app in your browser (shown in the terminal), then click:
   - **Download Extension Source (.zip)**
4. Unzip the downloaded file.
5. In Chrome, open `chrome://extensions` and enable **Developer mode**.
6. Click **Load unpacked** and select the unzipped folder.

## Development

- Run the packager UI: `npm run dev`
- Production build: `npm run build` then `npm start`

## Customize

- Extension templates are generated from [lib/extension-files.ts](lib/extension-files.ts)
- Icon assets live at the repo root (`icon.svg`, `icon.png`, `icon48.png`)

## Notes

- The side panel UI persists shortcuts using Chrome storage.
- The floating widget is injected on all pages via a content script.
