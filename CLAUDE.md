# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal site and portfolio for Jake Berg (Fractional CTO), live at https://jakeberg.xyz. It has a landing page with a contact form, a markdown blog, and an HTML resume.

## Stack

- **React Router v7** in framework mode with SSR (`ssr: true`). This project is still on v7, so check before using v8-only APIs.
- React 19, Tailwind v4. The typography plugin is loaded in `app/app.css` with `@plugin "@tailwindcss/typography"`, and the `prose-*` classes in the blog depend on it.
- Blog toolchain: gray-matter (frontmatter), marked (markdown), Shiki (code highlighting), Mermaid (diagrams, rendered client-side).

## Commands

```bash
npm run typecheck  # react-router typegen && tsc (the only check; there are no tests and no lint script)
npm run build      # Production build to build/
npm run start      # Serve build/server/index.js
```

## Routing

Routes are config-based in `app/routes.ts`, not file-based. To add a top-level page:
1. Add an entry to `app/routes.ts`.
2. Add it to the hard-coded `staticRoutes` array in `app/routes/sitemap.xml.ts`.

There is no shared layout component. Each route renders its own header, nav, and footer inline.

## Blog

Posts are `blog/*.md` files. `app/utils/markdown.server.ts` reads and renders them at request time from `process.cwd()/blog`, so the `blog/` directory has to exist next to the running server.

- The slug is the filename without `.md`. `blog/README.md` is skipped. A new post needs no route change, because `blog/:slug` covers every post.
- Frontmatter matches `PostMetadata`:
  ```yaml
  ---
  date: 2025-10-26          # required; the index silently drops posts whose date doesn't parse
  author: Jake Berg         # required
  title: "Post Title"       # required
  description: "..."        # required; used for SEO and the post card
  image: /blog/cover.jpg    # optional; og:image / twitter:image
  ---
  ```
- A `# H1` on the body's first line is stripped, because the page header renders `title` from frontmatter. A `# ` line anywhere else is left alone.
- Rendering happens in two passes. A custom marked renderer swaps each fenced code block for a placeholder, then the placeholders are filled with Shiki output using the `github-light` theme. ` ```mermaid ` blocks become `<div class="mermaid-diagram">`, and a `useEffect` in `app/routes/blog.$slug.tsx` renders them in the browser.
- ` ```timeline ` blocks become a styled timeline of work sprints (`renderTimeline` in `markdown.server.ts`). `# Day` starts a day (`# Day | Tag` adds a tag), `## 10:57am – 1:46pm` starts a sprint, `12:33pm | text` is a commit, and `* 3:23pm | text` is a milestone. Durations, day subtotals, and the total at the bottom are calculated from the sprint times.
- Post images go in `public/blog/`.
- `blog/README.md` is out of date: its step 5 (adding a route per post) isn't needed, and the Shiki theme is `github-light`, not GitHub Dark.

## Contact form

All of it lives in `app/routes/home.tsx`.
- The `loader` generates a math captcha and a signed token: base64 of `answer|timestamp|hmac` (HMAC-SHA256 with `CAPTCHA_SECRET`, truncated to 16 hex chars).
- The `action` checks things in this order:
  1. A filled honeypot field (`website`) returns `{ success: true }` without sending anything.
  2. The token signature must be valid.
  3. The submission must arrive at least 3 seconds and at most 30 minutes after the token was issued.
  4. The captcha answer must be correct.
  5. The message is posted to the Telegram Bot API. The chat ID is hard-coded in the action.
- The page also has a testimonial card carousel that auto-rotates, with touch swipe support. Swiping resets the rotation timer.

## Other pieces

- `CookiePopup` is mounted in `app/root.tsx` but only shows on `/blog*`. Dismissing it is stored in `sessionStorage`.
- `app/routes/resume.tsx` is an HTML resume with a Print button (`window.print()`) and print-specific styles. The downloadable PDF is the static file `public/jake-berg-resume.pdf`.
- `app/utils.ts` (the `cn()` helper, clsx + tailwind-merge) and the `app/utils/` directory both exist. `import ... from "../utils"` resolves to `utils.ts`.
- `app/welcome/` is unused template code. `jspdf` and `html2canvas` are dependencies, but nothing in `app/` imports them.
- `Dockerfile` does a multi-stage Node 20 build. Its final stage copies only `package.json`, `node_modules`, and `build/`.

## Environment variables

- `TELEGRAM_TOKEN`: Telegram bot token. Required for the contact form to send.
- `CAPTCHA_SECRET`: captcha HMAC key. Optional; if it's unset, a hard-coded fallback is used.
