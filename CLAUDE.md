# Project: jakeberg.xyz

Personal website and portfolio for Jake Berg - Fractional CTO services.

## Stack

- **Framework**: React Router v7 (file-based routing)
- **React**: v19
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Blog**: Markdown with gray-matter frontmatter, Shiki syntax highlighting

## Project Structure

```
app/
  routes/           # Page routes
    home.tsx        # Landing page with contact form
    blog._index.tsx # Blog listing
    blog.$slug.tsx  # Individual blog posts
    resume.tsx      # PDF resume page
    sitemap.xml.ts  # Sitemap generator
  components/       # Shared components
  utils/            # Utility functions
blog/               # Markdown blog posts
public/             # Static assets
```

## Commands

```bash
npm run dev        # Start dev server (localhost:5173)
npm run build      # Production build
npm run start      # Serve production build
npm run typecheck  # TypeScript type checking
```

## Key Features

- **Contact Form**: Sends messages to Telegram via bot API
  - HMAC-signed captcha tokens
  - Honeypot field for bot detection
  - Time-based validation (rejects submissions < 3 seconds)
  - Requires `TELEGRAM_TOKEN` and optionally `CAPTCHA_SECRET` env vars

- **Cookie Popup**: Only displays on `/blog` routes

- **Blog**: Markdown files in `blog/` directory with frontmatter:
  ```yaml
  ---
  title: "Post Title"
  date: "2025-01-01"
  description: "Post description"
  featured_image: "/image.jpg"
  ---
  ```

## Environment Variables

- `TELEGRAM_TOKEN` - Telegram bot token for contact form
- `CAPTCHA_SECRET` - Secret for signing captcha tokens (optional, has fallback)
