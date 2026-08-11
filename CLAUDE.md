# CLAUDE.md — EMUSKI Web · Project Intelligence

> Read by Claude Code automatically every session.
> Encodes principal-engineer decisions so Claude never has to guess.

---

## 1. Project identity

| Field | Value |
|---|---|
| Product | EMUSKI Manufacturing Solutions — marketing + lead-gen website |
| Framework | Next.js 16 · App Router · TypeScript strict |
| Styling | Tailwind CSS + shadcn/ui (Radix primitives) |
| Database | Supabase (Postgres + RLS) |
| Email | Resend |
| Cache / Rate-limit | ioredis |
| Validation | Zod — schema-first, always |
| Forms | React Hook Form + Zod resolvers |
| Toasts | Sonner |
| **AI — PRIMARY** | **Groq API (free tier — no credit card needed)** |
| AI — Fallback | @anthropic-ai/sdk (optional, paid, only if key is set) |
| Deployment | Vercel (primary) · Netlify (fallback) |

---

## 2. Absolute code rules (never violate)

### TypeScript
- `strict: true` always. No `any`. No `as unknown as X`. No `!` assertions.
- Export named types alongside every component: `export type { Props }`.
- Use `type` for data shapes, `interface` for extensible contracts only.

### File & folder conventions
```
components/
  [Feature]/
    index.tsx             ← barrel export only
    [Feature].tsx         ← JSX, no business logic
    [Feature].types.ts    ← all types for this feature
    useAISalesAgent.ts    ← state + async logic
    useVoice.ts           ← speech recognition/synthesis

app/
  api/
    [route]/
      route.ts      ← thin handler: validate → rate-limit → service → respond
      schema.ts     ← Zod request + response schemas
      service.ts    ← pure business logic, no Next.js imports
```

### React
- Server Components by default. `'use client'` only for browser APIs or hooks.
- No business logic in JSX files — all logic in custom hooks.
- No inline handlers longer than 3 lines — extract with `useCallback`.

### API routes
- Every public POST: Zod validate → rate-limit → call service → return typed JSON.
- Success: `NextResponse.json({ data: ... })`
- Error:   `NextResponse.json({ error: string }, { status: 4xx|5xx })`
- Never leak stack traces. Never return 200 for errors.

### Environment variables
- Validated at startup in `src/config/env.ts` (Zod). Throw if required vars missing.
- `process.env` accessed ONLY inside `src/config/env.ts`. Nowhere else.

### Error handling
- Service functions return `{ data: T } | { error: string }` — Result pattern.
- Every `catch` must log or propagate. Never swallow silently.
- User-facing: friendly string. Internal: structured log `{ context, error, timestamp }`.

### Supabase
- RLS always enabled. Server-side only: `createServerClient` from `@supabase/ssr`.
- Schema changes via migrations in `supabase/migrations/` only.

### Security
- Rate-limit all public POST endpoints via ioredis sliding window.
- Sanitize user input before storing. Never log PII in plaintext.

---

## 3. AI Sales Agent — architecture

### ★ Provider priority — NEVER reverse this

```
1st  Groq API          (GROQ_API_KEY — REQUIRED, free tier)
      ├─ voice calls:  llama-3.1-8b-instant     (14 400 req/day free)
      └─ chat calls:   llama-3.3-70b-versatile  (1 000 req/day free)

2nd  Anthropic Claude  (ANTHROPIC_API_KEY — optional, paid)
      └─ only used when Groq returns 429 AND the key is set
```

Groq is always the primary. Anthropic is a paid safety net — never the default.

### Component tree
```
components/AISalesAgent/
  index.tsx               ← barrel
  AISalesAgent.tsx        ← UI only, imports useAISalesAgent
  AISalesAgent.types.ts   ← shared types
  useAISalesAgent.ts      ← all widget state + API calls
  useVoice.ts             ← Web Speech API + SpeechSynthesis
```

### API route tree
```
app/api/
  sales-agent/
    route.ts    ← validate → rate-limit → callAI() → respond
    schema.ts   ← Zod schemas
    service.ts  ← callGroq(), callAnthropicFallback(), callAI()
  leads/
    route.ts    ← validate → rate-limit → Supabase insert → Resend email
```

### Request lifecycle
```
User speaks/types
  → useVoice (STT, browser-native, free)
  → useAISalesAgent.sendMessage()
  → POST /api/sales-agent
  → Zod validate → ioredis rate-limit check
  → service.callAI()
      → callGroq() [PRIMARY]
          on 429 + ANTHROPIC_API_KEY set → callAnthropicFallback()
  → { reply: string }
  → Widget renders reply
  → useVoice.speak() (TTS, browser-native, free)
  → after N messages → show lead form
  → POST /api/leads → Supabase + Resend
```

### Rate limits
| Route | Limit | Window |
|---|---|---|
| /api/sales-agent | 20 requests | 10 minutes per IP |
| /api/leads | 3 requests | 1 hour per IP |

If Redis is unavailable → fail open (log warning, allow request — never block users due to infra failure).

### Voice / TTS (both 100% free)
- STT: `window.SpeechRecognition || window.webkitSpeechRecognition` — no API call
- TTS: `window.speechSynthesis` — no API call
- Gracefully degrade: return `{ isSupported: false }` if browser lacks support
- Respect `prefers-reduced-motion` — skip `speak()` if user has it set

### Lead capture
- Supabase `leads` table (RLS: anon can INSERT, authenticated can SELECT)
- Resend: notify SALES_NOTIFICATION_EMAIL (only if configured)
- Never email the lead without explicit opt-in

### Accessibility requirements
- `aria-live="polite"` on transcript + message list
- `aria-label` on every icon-only button
- Focus trap when widget panel is open
- Full keyboard navigation: Tab, Enter, Escape closes panel
- `prefers-reduced-motion`: disable CSS animations if set

---

## 4. `src/config/ai.ts` — model constants (never hardcode elsewhere)

```ts
export const AI_MODELS = {
  voice:    'llama-3.1-8b-instant',       // Groq — fastest
  chat:     'llama-3.3-70b-versatile',    // Groq — smartest
  fallback: 'claude-haiku-4-5-20251001',  // Anthropic — paid fallback
} as const

export const MAX_TOKENS = {
  voice: 256,
  chat:  512,
} as const
```

---

## 5. Commit conventions

```
feat(sales-agent): add voice input with animated waveform
fix(api): handle Groq 429 with Anthropic fallback
refactor(widget): extract useVoice hook from AISalesAgent
chore(env): add GROQ_API_KEY validation to env.ts
```

---

## 6. What Claude Code must NEVER do

- Access `process.env` outside `src/config/env.ts`
- Use Anthropic as the primary AI — Groq is always first
- Hardcode model strings outside `src/config/ai.ts`
- Add `console.log` in production code
- Use `any` type
- Use `// @ts-ignore` without a comment explaining why
- Create components with >200 lines of JSX — split them
- Swallow errors silently in a catch block
- Return HTTP 200 for an error response
- Make `fetch` calls without a timeout / AbortController

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
