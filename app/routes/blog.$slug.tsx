import type { Route } from "./+types/blog.$slug";
import { Link } from "react-router";
import { getPostBySlug } from "../utils/markdown.server";
import { useEffect } from "react";

export function meta({ data }: Route.MetaArgs) {
  if (!data?.post) {
    return [{ title: "Post Not Found - Jake Berg" }];
  }

  const { post } = data;

  const metaTags = [
    { title: `${post.metadata.title} - Jake Berg` },
    { name: "description", content: post.metadata.description },
    { name: "author", content: post.metadata.author },
    { property: "og:title", content: post.metadata.title },
    { property: "og:description", content: post.metadata.description },
    { property: "og:type", content: "article" },
    {
      property: "og:url",
      content: `https://jakeberg.xyz/blog/${post.metadata.slug}`,
    },
    { property: "article:author", content: post.metadata.author },
    {
      property: "article:published_time",
      content: new Date(post.metadata.date).toISOString(),
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: post.metadata.title },
    { name: "twitter:description", content: post.metadata.description },
    { name: "robots", content: "index, follow" },
  ];

  // Add image tags if image is provided
  if (post.metadata.image) {
    metaTags.push(
      { property: "og:image", content: post.metadata.image },
      { name: "twitter:image", content: post.metadata.image }
    );
  }

  return metaTags;
}

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  return { post };
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;

  const postDate = new Date(post.metadata.date);
  const formattedDate = postDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Initialize Mermaid diagrams after component mounts
  useEffect(() => {
    // Dynamically import and initialize Mermaid
    import("mermaid").then((mermaid) => {
      mermaid.default.initialize({
        startOnLoad: true,
        theme: "default",
        securityLevel: "loose",
      });

      // Find all mermaid diagram divs and render them
      const diagrams = document.querySelectorAll(".mermaid-diagram");
      diagrams.forEach((diagram, index) => {
        const code = diagram.textContent || "";
        const id = `mermaid-${index}`;

        // Create a container for the rendered diagram
        const container = document.createElement("div");
        container.id = id;
        container.className = "mermaid";
        container.textContent = code;

        // Replace the placeholder with the Mermaid div
        diagram.replaceWith(container);
      });

      // Trigger Mermaid rendering with error handling
      mermaid.default.run().catch((error) => {
        console.error("Mermaid rendering error:", error);
      });
    });
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-linen text-stone-600 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-stone-900/10 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="font-display text-2xl leading-none font-semibold text-stone-900 transition-colors hover:text-wine"
          >
            JB<span className="text-wine">.</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/blog"
              className="px-3 py-2 text-sm text-stone-500 transition-colors hover:text-stone-900 sm:px-4"
            >
              ← Blog
            </Link>
            <Link
              to="/"
              className="rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-stone-50 transition-colors hover:bg-wine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="flex-grow px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl bg-paper p-7 shadow-[0_1px_2px_rgb(68_64_60/0.06),0_24px_48px_-24px_rgb(68_64_60/0.28)] ring-1 ring-stone-900/5 md:p-14">
          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-6 text-[0.6875rem] font-medium tracking-[0.14em] uppercase">
              <time dateTime={post.metadata.date} className="text-wine">
                {formattedDate}
              </time>
              <span className="mx-2 text-stone-300">•</span>
              <span className="text-stone-500">
                {post.readingTime} min read
              </span>
            </div>

            <h1 className="mb-6 font-display text-5xl leading-[1.05] font-medium text-balance text-stone-900 md:text-6xl">
              {post.metadata.title}
            </h1>

            <p className="font-display text-xl leading-snug text-pretty text-stone-600 italic md:text-2xl">
              {post.metadata.description}
            </p>

            <p className="mt-6 text-sm font-medium text-stone-900">
              {post.metadata.author}
            </p>

            {/* The same double rule that closes the resume header */}
            <div aria-hidden="true" className="mt-8 border-t-2 border-stone-900 pt-[3px]">
              <div className="border-t border-stone-900" />
            </div>
          </header>

          {/* Article Content */}
          <div
            className="prose prose-lg prose-stone max-w-none [--tw-prose-bullets:var(--color-wine)] [--tw-prose-counters:var(--color-wine)]
              prose-headings:text-stone-900
              prose-h2:font-display prose-h2:text-4xl prose-h2:font-semibold prose-h2:mt-14 prose-h2:mb-5
              prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-stone-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-wine prose-a:underline prose-a:decoration-wine/30 prose-a:underline-offset-2 hover:prose-a:decoration-wine
              prose-strong:text-stone-900 prose-strong:font-semibold
              prose-code:text-wine prose-code:bg-stone-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
              prose-pre:bg-stone-50 prose-pre:text-stone-900 prose-pre:border prose-pre:border-stone-200 prose-pre:rounded-lg prose-pre:overflow-x-auto
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-stone-700 prose-li:my-2
              prose-blockquote:border-l-2 prose-blockquote:border-wine prose-blockquote:pl-6 prose-blockquote:font-display prose-blockquote:text-2xl prose-blockquote:font-normal prose-blockquote:italic prose-blockquote:text-stone-700
              prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 prose-img:mx-auto prose-img:max-w-full
              [&_.mermaid]:my-8 [&_.mermaid]:flex [&_.mermaid]:justify-center [&_.mermaid]:bg-white [&_.mermaid]:p-6 [&_.mermaid]:rounded-lg [&_.mermaid]:ring-1 [&_.mermaid]:ring-stone-900/10
              [&_pre_code]:bg-transparent [&_pre_code]:text-stone-900 [&_pre_code]:p-0"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Back to Blog */}
          <div className="mt-16 border-t border-stone-200 pt-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-medium text-wine transition-all hover:gap-3"
            >
              <span>←</span>
              Back to all posts
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="mt-12 border-t border-stone-900/10 bg-paper/60 px-6 py-8">
        <div className="mx-auto max-w-4xl text-center text-sm text-stone-500">
          <p>© {new Date().getFullYear()} Jake Berg. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
