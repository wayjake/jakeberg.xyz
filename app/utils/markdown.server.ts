import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { codeToHtml } from "shiki";
import mermaid from "mermaid";

// Type for blog post frontmatter
export interface PostMetadata {
  date: string;
  author: string;
  title: string;
  description: string;
  slug: string;
  image?: string; // Optional SEO/social media image
}

export interface Post {
  metadata: PostMetadata;
  content: string;
  readingTime: number; // in minutes
}

// Get the blog directory path
const BLOG_DIR = path.join(process.cwd(), "blog");

/**
 * Calculate estimated reading time based on word count
 * Average reading speed: 200 words per minute
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

/**
 * Custom renderer for marked to handle code blocks with syntax highlighting and Mermaid
 */
function createMarkedRenderer() {
  const renderer = new marked.Renderer();
  const codeBlocks: Array<{ code: string; language: string | undefined }> = [];

  // Override code block rendering
  // In marked v13+, the code function receives a token object
  renderer.code = function (token: { text: string; lang?: string; escaped?: boolean }) {
    const index = codeBlocks.length;
    const code = token.text;
    const language = token.lang;

    codeBlocks.push({ code, language });

    // Use a simple placeholder that we'll replace later
    return `<!--CODE_BLOCK_${index}-->`;
  };

  return { renderer, codeBlocks };
}

/**
 * Process code blocks after initial markdown rendering
 */
async function processCodeBlocks(html: string, codeBlocks: Array<{ code: string; language: string | undefined }>): Promise<string> {
  let processedHtml = html;

  for (let i = 0; i < codeBlocks.length; i++) {
    const { code, language } = codeBlocks[i];
    const placeholder = `<!--CODE_BLOCK_${i}-->`;

    if (language === "mermaid") {
      // For Mermaid diagrams, create a div that client-side code will render
      const mermaidHtml = `<div class="mermaid-diagram">${code}</div>`;
      processedHtml = processedHtml.replace(placeholder, mermaidHtml);
    } else if (language === "timeline") {
      processedHtml = processedHtml.replace(placeholder, renderTimeline(code));
    } else if (language) {
      // Use Shiki for syntax highlighting
      try {
        const highlightedCode = await codeToHtml(code, {
          lang: language,
          theme: "github-light",
        });
        processedHtml = processedHtml.replace(placeholder, highlightedCode);
      } catch (error) {
        // If language is not supported, fall back to plain pre/code
        const fallbackHtml = `<pre><code class="language-${language}">${code}</code></pre>`;
        processedHtml = processedHtml.replace(placeholder, fallbackHtml);
      }
    } else {
      // No language specified, use plain pre/code
      const plainHtml = `<pre><code>${code}</code></pre>`;
      processedHtml = processedHtml.replace(placeholder, plainHtml);
    }
  }

  return processedHtml;
}

/**
 * Render a ```timeline block: days, the work sprints in each day, and what happened in each
 * sprint, with every sprint's duration and the total worked out from its time range.
 *
 *   # Tuesday, September 22            a day (add " | Event day" for a tag)
 *   ## 10:57am – 1:46pm                a sprint
 *   12:33pm | First commit             a commit (inline markdown is allowed)
 *   * 3:23pm | Team announcement       a milestone that isn't a commit
 */
function renderTimeline(source: string): string {
  type Item = { time: string; text: string; milestone: boolean };
  type Sprint = { start: string; end: string; minutes: number; items: Item[] };
  type Day = { title: string; tag?: string; sprints: Sprint[] };

  const days: Day[] = [];
  for (const raw of source.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const day = days[days.length - 1];
    const sprint = day?.sprints[day.sprints.length - 1];

    if (line.startsWith("## ")) {
      const [start, end] = line.slice(3).split(/\s*[–—-]\s*/);
      if (!day || !end) throw new Error(`Timeline: bad sprint line "${line}"`);
      day.sprints.push({ start, end, minutes: minutesBetween(start, end), items: [] });
    } else if (line.startsWith("# ")) {
      const [title, tag] = line.slice(2).split(/\s*\|\s*/);
      days.push({ title, tag, sprints: [] });
    } else {
      const milestone = line.startsWith("* ");
      const [time, ...rest] = (milestone ? line.slice(2) : line).split(/\s*\|\s*/);
      if (!sprint || !rest.length) throw new Error(`Timeline: bad item line "${line}"`);
      sprint.items.push({ time, text: rest.join(" | "), milestone });
    }
  }

  const sprints = days.flatMap((d) => d.sprints);
  const longest = Math.max(...sprints.map((s) => s.minutes));
  const total = sprints.reduce((sum, s) => sum + s.minutes, 0);
  const commits = sprints.flatMap((s) => s.items).filter((i) => !i.milestone).length;
  let sprintNumber = 0;

  const renderItem = (item: Item) => `
    <li class="relative pb-5 pl-7 last:pb-0">
      ${
        item.milestone
          ? `<span aria-hidden="true" class="absolute top-[0.5rem] -left-[5px] size-[9px] rotate-45 bg-wine"></span>`
          : `<span aria-hidden="true" class="absolute top-[0.45rem] -left-[5px] size-[9px] rounded-full border-2 border-wine bg-paper"></span>`
      }
      <div class="sm:grid sm:grid-cols-[4.75rem_1fr] sm:gap-4">
        <time class="block text-sm text-stone-500 tabular-nums sm:pt-0.5">${escapeHtml(item.time)}</time>
        <p class="${item.milestone ? "text-stone-600 italic" : "text-stone-700"} leading-relaxed [&_code]:rounded [&_code]:bg-stone-100 [&_code]:px-1 [&_code]:text-[0.9em] [&_code]:text-wine">${marked.parseInline(item.text) as string}</p>
      </div>
    </li>`;

  const renderSprint = (sprint: Sprint) => {
    sprintNumber++;
    const duration = formatDuration(sprint.minutes);
    const width = Math.max((sprint.minutes / longest) * 100, 1).toFixed(1);
    return `
    <div>
      <div class="flex items-baseline justify-between gap-4">
        <p class="text-[0.6875rem] font-medium tracking-[0.14em] text-stone-500 uppercase">
          <span class="text-wine">Sprint ${sprintNumber}</span>
          <span class="mx-1.5 text-stone-300">•</span>${escapeHtml(sprint.start)} – ${escapeHtml(sprint.end)}
        </p>
        <p class="text-lg font-semibold text-stone-900">${duration}</p>
      </div>
      <div class="mt-2 h-1.5 rounded-full bg-wine/10" role="img" aria-label="Sprint ${sprintNumber} lasted ${duration}" title="${duration}">
        <div class="h-full rounded-full bg-wine" style="width: ${width}%"></div>
      </div>
      <ol class="mt-5 ml-1 border-l border-stone-200">${sprint.items.map(renderItem).join("")}
      </ol>
    </div>`;
  };

  const renderDay = (day: Day) => `
  <section class="mt-12 first:mt-0">
    <div class="flex items-baseline justify-between gap-4 border-b border-stone-900/15 pb-3">
      <h3 class="font-display text-2xl leading-tight font-semibold text-stone-900 md:text-3xl">
        ${escapeHtml(day.title)}${day.tag ? `<span class="ml-3 align-middle font-sans text-[0.6875rem] font-medium tracking-[0.14em] text-wine uppercase">${escapeHtml(day.tag)}</span>` : ""}
      </h3>
      <p class="shrink-0 text-sm text-stone-500 tabular-nums">${formatDuration(day.sprints.reduce((sum, s) => sum + s.minutes, 0))}</p>
    </div>
    <div class="mt-6 space-y-9">${day.sprints.map(renderSprint).join("")}
    </div>
  </section>`;

  return `
<figure class="not-prose my-12">${days.map(renderDay).join("")}
  <footer class="mt-14 border-t-2 border-stone-900 pt-[3px]">
    <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-t border-stone-900 pt-5">
      <div>
        <p class="text-[0.6875rem] font-medium tracking-[0.14em] text-wine uppercase">Total sprint time</p>
        <p class="mt-1 text-sm text-stone-500">${sprints.length} sprints • ${commits} commits</p>
      </div>
      <p class="text-5xl font-semibold tracking-tight text-stone-900">${formatDuration(total)}</p>
    </div>
  </footer>
</figure>`;
}

/** Minutes from one "h:mmam/pm" time to the next, wrapping past midnight. */
function minutesBetween(start: string, end: string): number {
  const toMinutes = (time: string) => {
    const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
    if (!match) throw new Error(`Timeline: can't read the time "${time}"`);
    const [, hours, minutes, meridiem] = match;
    return ((Number(hours) % 12) + (meridiem.toLowerCase() === "pm" ? 12 : 0)) * 60 + Number(minutes);
  };
  return (toMinutes(end) - toMinutes(start) + 24 * 60) % (24 * 60);
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours}h ${String(rest).padStart(2, "0")}m` : `${rest}m`;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Convert markdown content to HTML with syntax highlighting and Mermaid support
 */
async function markdownToHtml(markdown: string): Promise<string> {
  // Remove a leading H1 from markdown (it's displayed in the article header). Only the
  // very first line counts, so a "# " line later on (e.g. in a code block) is kept.
  const contentWithoutH1 = markdown.replace(/^\s*#[ \t]+[^\n]*/, '');

  // Create renderer and collect code blocks
  const { renderer, codeBlocks } = createMarkedRenderer();

  // Configure marked
  marked.use({
    renderer,
    breaks: false,
    gfm: true,
  });

  // First pass: convert markdown to HTML with placeholders
  const rawHtml = await marked(contentWithoutH1);

  // Second pass: process code blocks with syntax highlighting and Mermaid
  const processedHtml = await processCodeBlocks(rawHtml, codeBlocks);

  return processedHtml;
}

/**
 * Get all blog posts
 */
export async function getAllPosts(): Promise<PostMetadata[]> {
  const files = fs.readdirSync(BLOG_DIR);
  const markdownFiles = files.filter((file) => file.endsWith(".md") && file !== "README.md");

  const posts = markdownFiles.map((filename) => {
    const filePath = path.join(BLOG_DIR, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    const slug = filename.replace(/\.md$/, "");

    return {
      slug,
      date: data.date,
      author: data.author,
      title: data.title,
      description: data.description,
      image: data.image,
    } as PostMetadata;
  });

  // Sort by date (newest first). Posts sharing a date, like the parts of a series,
  // fall back to slug order so part 1 lists before part 2.
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime() || a.slug.localeCompare(b.slug);
  });
}

/**
 * Get a single blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content: markdownContent } = matter(fileContents);

    const htmlContent = await markdownToHtml(markdownContent);
    const readingTime = calculateReadingTime(markdownContent);

    return {
      metadata: {
        slug,
        date: data.date,
        author: data.author,
        title: data.title,
        description: data.description,
        image: data.image,
      },
      content: htmlContent,
      readingTime,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}
