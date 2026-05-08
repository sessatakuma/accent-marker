# Accent-Web

This is a tool that aims to provide Japanese learners a tool to add furigana and accent marks to articles.

## Features

- Adds furigana and accent marks automatically to Japanese plain text, which can also be edited manually
- The formatted text can be copied as html format to render on HackMD with our HackMD Japanese accent marking css snippet `@OrangeSagoCream/AccentMarker`, or be downloaded as .pdf or .png file

## Installation

Install all packages with [bun](https://bun.com/):

```bash
bun i
```

## Set up dev server

Add a `.env` file in the root directory with the server-side API key:

```
MARK_ACCENT_API_KEY=<our_api_key>
```

Then start the development server:

```bash
bun dev
```

## Deploy on Vercel

1. Import the repository into Vercel.
2. Add `MARK_ACCENT_API_KEY` as an environment variable in the Vercel project settings.
3. Deploy with the default Vite build settings.

The frontend calls `/api/mark-accent`, and Vercel forwards the request server-side so the API key is not exposed to the browser.
