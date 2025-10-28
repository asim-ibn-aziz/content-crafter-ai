# Content Crafter AI

AI-powered content generation with a clean ChatGPT-style UI. Generate blogs, product descriptions, and social captions with selectable tones.

## What’s Inside

- 🎨 **Multiple Content Types**: Blog Post, Product Description, Social Caption
- 🎭 **Tones**: Professional, Funny, Persuasive, Chill
- ⚡ **Fast AI**: Groq Llama 3.1 8B Instant (OpenAI-compatible API)
- 💬 **Chat UI**: User and AI bubbles, fixed bottom input bar
- 🕶️ **Dark/Light/System Theme**: Toggle with persistence
- 🧷 **History**: Local, live-updating generation history (no refresh needed)
- 🔔 **Toasts**: Success/error/loading toasts (auto-dismiss in 1s)
- ⌨️ **Keyboard Shortcuts**: Ctrl+Enter to generate, Ctrl+C to copy
- 📱 **Responsive**: Looks great on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Next.js API Routes
- **AI Providers**: Groq (default), Together AI, OpenRouter (drop-in via env)
- **Deployment**: Vercel-ready

## Quick Start

1. Install deps

```bash
npm install
```

2. Configure environment (choose one provider)

Groq (recommended, fast & generous free tier):

```env
GROQ_API_KEY=your_groq_api_key_here
```

Together AI:

```env
TOGETHER_API_KEY=your_together_api_key_here
```

OpenRouter:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

3. Run dev server

```bash
npm run dev
```

Open http://localhost:3000

4. Build & start

```bash
npm run build
npm start
```

Notes:

- If no API key is set, the app falls back to a built-in mock response for testing.
- Theme preference persists to localStorage and supports system theme changes.
- History stores your last 50 generations locally and updates live.

## Project Structure

```
content-crafter-ai/
├── src/
│   ├── app/
│   │   ├── api/generate/route.ts   # AI generation endpoint
│   │   ├── layout.tsx               # Root layout (Theme + Toast providers)
│   │   ├── page.tsx                 # Chat-style UI
│   │   └── globals.css              # Global styles + theme variables
│   ├── components/
│   │   ├── generation-history.tsx   # Live-updating local history modal
│   │   ├── theme-toggle.tsx         # Theme switcher (light/dark/system)
│   │   ├── toast.tsx                # Toast system + hooks
│   │   └── ui/                      # Base UI components
│   └── lib/
│       └── theme-provider.tsx       # Theme context
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

# Status

### Phase 1 – Core (Complete)

- AI text generation (Groq default; OpenAI-compatible)
- Content type + tone selection
- Copy + Regenerate
- Loading + error states
- Responsive UI

### Phase 2 – UX Polish (Complete)

- Chat-style interface with user/assistant bubbles
- Dark/light/system theme with persistence
- Local history with live updates (no refresh)
- Toast notifications with 1s auto-dismiss
- Keyboard shortcuts (Ctrl+Enter, Ctrl+C)
- Smooth animations and modern visuals

### Next Up – Phase 3 Ideas

- Content improvement (shorter/longer, rewrite)
- SEO helpers (titles, meta, keywords)
- More content types (email, ads, press releases)
- Optional: image generation

## Deployment (Vercel)

1. Push this repo to GitHub
2. Import in Vercel
3. Add provider API key (e.g., `GROQ_API_KEY`) in Project Settings → Environment Variables
4. Deploy

## License

MIT
