import { Link } from "react-router";
import { cn } from "../utils";
import type { PostMetadata } from "../utils/markdown.server";

// A post's cover, date, title, and description, linking to the post. The blog
// index lists every post this way, and the home page shows the latest few.
// `heading` is h3 where the cards sit under a section heading, as on the home page.
export function PostCard({
  post,
  className,
  heading: Heading = "h2",
}: {
  post: PostMetadata;
  className?: string;
  heading?: "h2" | "h3";
}) {
  const postDate = new Date(post.date);
  // Frontmatter dates are midnight UTC, so format them in UTC or a browser west
  // of Greenwich shows the day before (and disagrees with the server render).
  const formattedDate = postDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={cn(
        "group rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine",
        className
      )}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-xl bg-paper ring-1 ring-stone-900/10 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_24px_48px_-28px_rgb(68_64_60/0.4)]">
        {/* Cover, which is also the og:image */}
        {post.image && (
          <img
            src={post.image}
            alt=""
            loading="lazy"
            decoding="async"
            width={1200}
            height={630}
            className="aspect-[1200/630] w-full border-b border-stone-900/10 object-cover"
          />
        )}

        <div className="flex flex-grow flex-col p-8">
          {/* Date */}
          <time
            dateTime={postDate.toISOString().slice(0, 10)}
            className="mb-3 text-[0.6875rem] font-medium tracking-[0.14em] text-wine uppercase"
          >
            {formattedDate}
          </time>

          {/* Title */}
          <Heading className="mb-3 font-display text-[1.75rem] leading-tight font-semibold text-stone-900 transition-colors group-hover:text-wine">
            {post.title}
          </Heading>

          {/* Description */}
          {/* The wrapper takes the spare height so the clamp stays at three lines */}
          <div className="mb-6 flex-grow">
            <p className="line-clamp-3 text-stone-600">{post.description}</p>
          </div>

          {/* Read more link */}
          <div className="flex items-center gap-1 text-sm font-medium text-stone-900 transition-all group-hover:gap-2 group-hover:text-wine">
            Read article
            <span aria-hidden="true">→</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Frontmatter dates that don't parse leave a post off every list.
export function hasValidDate(post: PostMetadata) {
  return !isNaN(new Date(post.date).getTime());
}
