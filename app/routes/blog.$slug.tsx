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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-cyan-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold text-gray-900">
              JB<span className="text-blue-600">.</span>
            </span>
          </Link>
          <div className="flex gap-4">
            <Link
              to="/blog"
              className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              ← Blog
            </Link>
            <Link
              to="/"
              className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="py-12 px-6 flex-grow">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12">
          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-6">
              <time
                dateTime={post.metadata.date}
                className="text-blue-600 font-medium"
              >
                {formattedDate}
              </time>
              <span className="text-gray-400 mx-2">•</span>
              <span className="text-gray-600">
                {post.readingTime} min read
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {post.metadata.title}
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              {post.metadata.description}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <div>
                <p className="text-gray-900 font-medium">
                  {post.metadata.author}
                </p>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
              prose-pre:bg-gray-50 prose-pre:text-gray-900 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:overflow-x-auto
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-gray-700 prose-li:my-2
              prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700
              prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:mx-auto prose-img:max-w-full
              [&_.mermaid]:my-8 [&_.mermaid]:flex [&_.mermaid]:justify-center [&_.mermaid]:bg-white [&_.mermaid]:p-6 [&_.mermaid]:rounded-xl [&_.mermaid]:shadow-lg
              [&_pre_code]:bg-transparent [&_pre_code]:text-gray-900 [&_pre_code]:p-0"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Back to Blog */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all"
            >
              <span>←</span>
              Back to all posts
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white/50 mt-12">
        <div className="max-w-4xl mx-auto text-center text-gray-600">
          <p>© {new Date().getFullYear()} Jake Berg. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
