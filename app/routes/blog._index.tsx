import type { Route } from "./+types/blog._index";
import { Link } from "react-router";
import { getAllPosts } from "../utils/markdown.server";
import { PostCard, hasValidDate } from "../components/PostCard";

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
              {posts.filter(hasValidDate).map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
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
