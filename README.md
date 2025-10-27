<<<<<<< HEAD
# Content Crafter AI

AI-powered content generation for blogs, product descriptions, and social media captions.

## Features

- 🎨 **Multiple Content Types**: Generate blog posts, product descriptions, and social captions
- 🎭 **Different Tones**: Choose from Professional, Funny, Persuasive, or Chill tones
- ⚡ **Lightning Fast**: Powered by Llama 3.1 8B (Instant) via Groq - ~560 tokens/sec!
- 📋 **One-Click Copy**: Instantly copy generated content to clipboard
- 🔄 **Regenerate**: Generate new variations with a single click
- 💅 **Beautiful UI**: Modern, responsive design with Tailwind CSS & gradient backgrounds
- 🆓 **Completely Free**: No credits needed! Uses Groq's free tier with generous limits

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **UI Components**: Custom components with shadcn/ui styling
- **Icons**: Lucide React
- **Backend**: Next.js API Routes
- **AI**: Groq (Llama 3.1 8B Instant) - Default, fastest free option
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and add ONE of the following:

**Recommended: Groq (Fast & Free!)**

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your API key from [Groq Console](https://console.groq.com/) - **Free tier, 560 tokens/sec, no credit card required!**

**Alternative Options:**

Together AI:

```env
TOGETHER_API_KEY=your_together_api_key_here
```

[Get API key](https://api.together.xyz/) - $25 free credits/month

OpenRouter:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

[Get API key](https://openrouter.ai/keys) - Requires account credits

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variable `GROQ_API_KEY` in Vercel dashboard (Settings → Environment Variables)
4. Deploy! Your app will be live at `https://your-project.vercel.app`

**Note**: If no API key is configured, the app will use mock data mode for testing.

## Project Structure

```
content-crafter-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── route.ts      # API endpoint for content generation
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page component
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   └── ui/                    # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       └── textarea.tsx
│   └── lib/
│       └── utils.ts               # Utility functions
├── .env.example                   # Environment variables template
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Phase 1 Features - ✅ COMPLETE

✅ **Text generation with AI** - Powered by Groq Llama 3.1 8B Instant  
✅ **Content type selection** - Blog/Product/Social Caption  
✅ **Tone selection** - Professional/Funny/Persuasive/Chill  
✅ **Topic/keyword input** - Flexible prompt system  
✅ **Generate button** - With loading animations  
✅ **Copy functionality** - One-click clipboard copy  
✅ **Regenerate button** - Generate variations instantly  
✅ **Loading states** - Beautiful spinner animations  
✅ **Responsive UI** - Works on desktop, tablet, and mobile  
✅ **Error handling** - Graceful error messages  
✅ **Mock mode** - Works without API key for testing

## Roadmap - Future Phases

### Phase 2 - UX Polish (Planned)

- Dark/light mode toggle
- Generation history with localStorage
- Toast notifications for better UX
- Animations and transitions

### Phase 3 - AI Expansion (Planned)

- Image generation support
- Content rewriting/improvement
- SEO optimization tools
- Multilingual support

### Phase 4 - User Accounts (Planned)

- Authentication (Supabase/Clerk)
- User dashboard
- Generation history database
- Usage analytics

### Phase 5 - Monetization (Planned)

- Free tier limits
- Premium subscription (Stripe)
- Admin panel
- Revenue tracking

### Phase 6 - Social Integration (Planned)

- Auto-post to social media
- Browser extension
- Mobile companion app

## License

MIT
=======
# content-crafter-ai
>>>>>>> 95655411aafb4c45918e3cc608d572ea9991c877
