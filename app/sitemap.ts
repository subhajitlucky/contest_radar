import type { MetadataRoute } from "next";

const BASE_URL = "https://contestradar.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "", changeFrequency: "daily", priority: 1 },
    { path: "/contests", changeFrequency: "daily", priority: 0.9 },
    { path: "/practice", changeFrequency: "weekly", priority: 0.7 },
    { path: "/virtual", changeFrequency: "weekly", priority: 0.6 },
    { path: "/profile", changeFrequency: "weekly", priority: 0.6 },
    { path: "/leaderboard", changeFrequency: "daily", priority: 0.6 },
    { path: "/alerts", changeFrequency: "weekly", priority: 0.8 },
    { path: "/support", changeFrequency: "monthly", priority: 0.4 },
    { path: "/about", changeFrequency: "monthly", priority: 0.4 },
    { path: "/developers", changeFrequency: "monthly", priority: 0.4 },
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
