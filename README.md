# Accent Marker

A web tool for automatic Japanese furigana and accent markings to plain text, to help Japanese learners to improve their speaking and reading skills.

<img src="docs/images/demo.png" alt="Accent Marker demo" />

## What It Does

- Analyzes Japanese text and renders furigana with pitch-accent markings automatically
- Lets you click the generated result to adjust furigana and accent output manually
- Supports plain-text copy, Markdown export, and image download for study notes

## How It Works

1. Paste or generate a Japanese sentence.
2. Let the app analyze and mark the text.
3. Tweak furigana or accent presentation directly in the result panel if needed.
4. Export the formatted output in the format you need.

## Quick Start (Internal Development)

Install dependencies with [bun](https://bun.com/):

```bash
bun i
```

Start the local dev server:

```bash
bun dev
```

## Local API Setup (Internal Development)

Local development and `vite preview` use a same-origin proxy for `/api/mark-accent` that calls the upstream API directly from the Vite server.

Add the API key to `.env` so local requests can be proxied server-side:

```bash
MARK_ACCENT_API_KEY=<your_api_key>
```

For local backward compatibility, `VITE_X_API_KEY` is also accepted, but `MARK_ACCENT_API_KEY` is the preferred variable name.
