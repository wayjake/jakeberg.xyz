import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("resume", "routes/resume.tsx"),
  route("blog", "routes/blog._index.tsx"),
  route("blog/:slug", "routes/blog.$slug.tsx"),
  route("sitemap.xml", "routes/sitemap.xml.ts"),
] satisfies RouteConfig;
