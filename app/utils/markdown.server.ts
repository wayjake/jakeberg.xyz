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
 * Convert markdown content to HTML with syntax highlighting and Mermaid support
 */
async function markdownToHtml(markdown: string): Promise<string> {
  // Remove the first H1 from markdown (it's displayed in the article header)
  const contentWithoutH1 = markdown.replace(/^#\s+.+$/m, '');

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

  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
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
