import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://learnearn360.com";

  const staticRoutes = ["", "/pricing", "/about", "/terms", "/privacy", "/login", "/register"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const courses = await db.course.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
    take: 500,
  });

  const courseRoutes = courses.map((c) => ({
    url: `${baseUrl}/library/course/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...courseRoutes];
}
