import type { Route } from "./+types/sitemap.xml";
import { getAllPosts } from "../utils/markdown.server";

export async function loader({ request }: Route.LoaderArgs) {
  const posts = await getAllPosts();
  const baseUrl = "https://jakeberg.xyz";

  // Static routes with priority and change frequency
  const staticRoutes = [
    { url: "/", priority: 1.0, changefreq: "weekly" },
    { url: "/resume", priority: 0.8, changefreq: "monthly" },
    { url: "/blog", priority: 0.9, changefreq: "weekly" },
  ];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
${posts
  .map(
    (post) => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  // Return XML response with proper headers
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}
