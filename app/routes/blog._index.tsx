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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-cyan-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold text-gray-900">
              JB<span className="text-blue-600">.</span>
            </span>
          </Link>
          <Link
            to="/"
            className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all"
          >
            Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
            Blog <span className="text-4xl">📝</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Technical insights, tutorials, and thoughts on modern web
            development, architecture, and engineering best practices.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20 px-6 flex-grow">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No blog posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    className="group"
                  >
                    <article className="h-full p-8 rounded-2xl bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all relative overflow-hidden">
                      {/* Decorative gradient corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-bl-full opacity-50" />

                      <div className="relative h-full flex flex-col">
                        {/* Date */}
                        <time
                          dateTime={post.date}
                          className="text-sm text-blue-600 font-medium mb-3"
                        >
                          {formattedDate}
                        </time>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                          {post.description}
                        </p>

                        {/* Read more link */}
                        <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                          Read article
                          <span className="inline-block transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </div>
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
      <footer className="border-t border-gray-200 py-8 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>© {new Date().getFullYear()} Jake Berg. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
