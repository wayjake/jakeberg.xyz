import type { Route } from "./+types/blog._index";
import { Link } from "react-router";
import { getAllPosts } from "../utils/markdown.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blog - Jake Berg | Technical Insights & Tutorials" },
    {
      name: "description",
      content:
        "Technical articles, tutorials, and insights on modern web development, React, serverless architecture, and software engineering best practices.",
    },
    { property: "og:title", content: "Blog - Jake Berg" },
    {
      property: "og:description",
      content:
        "Technical articles and insights on modern web development and software engineering.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://jakeberg.xyz/blog" },
    { name: "robots", content: "index, follow" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const posts = await getAllPosts();
  return { posts };
}

export default function BlogIndex({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <div className="flex min-h-dvh flex-col bg-linen text-stone-600 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-stone-900/10 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="font-display text-2xl leading-none font-semibold text-stone-900 transition-colors hover:text-wine"
          >
            JB<span className="text-wine">.</span>
          </Link>
          <Link
            to="/"
            className="rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-stone-50 transition-colors hover:bg-wine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
          >
            Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-14">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="font-display text-6xl font-medium text-stone-900 md:text-7xl">Blog</h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-pretty text-stone-600">
            Technical insights, tutorials, and thoughts on modern web
            development, architecture, and engineering best practices.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="flex-grow px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          {posts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-stone-600">
                No blog posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const postDate = new Date(post.date);
                const formattedDate = postDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                // Check if date is valid
                const isValidDate = !isNaN(postDate.getTime());

                // Skip posts with invalid dates
                if (!isValidDate) return null;

                return (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="group rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
                  >
                    <article className="flex h-full flex-col rounded-xl bg-paper p-8 ring-1 ring-stone-900/10 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_24px_48px_-28px_rgb(68_64_60/0.4)]">
                      {/* Date */}
                      <time
                        dateTime={post.date}
                        className="mb-3 text-[0.6875rem] font-medium tracking-[0.14em] text-wine uppercase"
                      >
                        {formattedDate}
                      </time>

                      {/* Title */}
                      <h2 className="mb-3 font-display text-[1.75rem] leading-tight font-semibold text-stone-900 transition-colors group-hover:text-wine">
                        {post.title}
                      </h2>

                      {/* Description */}
                      {/* The wrapper takes the spare height so the clamp stays at three lines */}
                      <div className="mb-6 flex-grow">
                        <p className="line-clamp-3 text-stone-600">
                          {post.description}
                        </p>
                      </div>

                      {/* Read more link */}
                      <div className="flex items-center gap-1 text-sm font-medium text-stone-900 transition-all group-hover:gap-2 group-hover:text-wine">
                        Read article
                        <span aria-hidden="true">→</span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-900/10 bg-paper/60 px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-stone-500">
          <p>© {new Date().getFullYear()} Jake Berg. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
