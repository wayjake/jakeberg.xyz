# Blog Posts

This directory contains all blog post markdown files for jakeberg.xyz.

## Adding a New Blog Post

1. **Create a new markdown file** in this directory with a URL-friendly filename:
   ```
   blog/my-new-post.md
   ```

2. **Add frontmatter** at the top of the file:
   ```markdown
   ---
   date: 2025-10-26
   author: Jake Berg
   title: "Your Post Title"
   description: "A brief description for SEO and the post list. Keep it under 160 characters for best results."
   ---
   ```

3. **Write your content** using standard Markdown:
   - Use `#` for H1 (reserved for title)
   - Use `##` for H2 section headings
   - Use `###` for H3 subsection headings
   - Code blocks with syntax highlighting: ` ```javascript `
   - Mermaid diagrams: ` ```mermaid `

4. **Add images** (optional):
   - Place images in `/public/blog/` directory
   - Reference in markdown: `![Alt text](/blog/image-name.jpg)`
   - Commit images to the repository

5. **Update routes.ts** to add the new post route:
   ```typescript
   // In app/routes.ts, add after the dynamic route:
   route("blog/my-new-post", "routes/blog.$slug.tsx"),
   ```
   **Note:** The dynamic route `blog/:slug` should handle all posts automatically, but you can add explicit routes if needed.

## Supported Features

### Code Syntax Highlighting
Powered by Shiki with GitHub Dark theme:

\`\`\`javascript
function hello() {
  console.log("Code blocks are automatically highlighted!");
}
\`\`\`

### Mermaid Diagrams
Create diagrams directly in markdown:

\`\`\`mermaid
graph TD
    A[Start] --> B[Process]
    B --> C[End]
\`\`\`

### Inline Code
Use backticks for inline code: \`const foo = "bar"\`

### Images
![Example](/blog/example.jpg)

Images are automatically:
- Centered with shadow
- Responsive (max-width)
- Optimized by Vercel

## Frontmatter Fields

- **date** (required): Publication date in YYYY-MM-DD format
- **author** (required): Author name
- **title** (required): Post title (used in SEO and display)
- **description** (required): Brief description for SEO and post cards

## File Naming Convention

- Use lowercase
- Use hyphens for spaces
- Keep URLs readable and meaningful
- Example: `building-scalable-apis.md` → `/blog/building-scalable-apis`

## Reading Time

Reading time is calculated automatically based on word count (200 words per minute average).
