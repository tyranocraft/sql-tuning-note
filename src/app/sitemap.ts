import { MetadataRoute } from "next";
import { getAllContent } from "@/lib/content";
import { locales, databases } from "@/lib/i18n";
import { BASE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });

    for (const database of databases) {
      entries.push({
        url: `${BASE_URL}/${locale}/notes/${database}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });

      const contents = getAllContent(database, locale);
      for (const content of contents) {
        entries.push({
          url: `${BASE_URL}/${locale}/notes/${database}/${content.slug}`,
          lastModified: new Date(content.updatedAt),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
