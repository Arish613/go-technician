import { getBlogs } from "@/lib/action/blog";
import { getServices } from "@/lib/action/service";
import { NextResponse } from "next/server";
import type { BlogListItem } from "@/types/blog";
import type { ServiceType } from "@/types/service";

const BASE_URL = "https://www.gotechnicians.com";

export async function GET() {
  // Fetch all published blog slugs
  const blogsRes = await getBlogs(true);
  const blogUrls =
    blogsRes.success && blogsRes.data
      ? (blogsRes.data as BlogListItem[]).map(
          (b) =>
            `<url><loc>${BASE_URL}/blog/${b.slug}</loc><lastmod>${
              b.updatedAt
                ? new Date(b.updatedAt).toISOString().split("T")[0]
                : b.createdAt
                  ? new Date(b.createdAt).toISOString().split("T")[0]
                  : ""
            }</lastmod></url>`,
        )
      : [];

  // Fetch all published service slugs
  const servicesRes = await getServices(undefined, true);
  const serviceUrls =
    servicesRes.success && servicesRes.data
      ? (servicesRes.data as ServiceType[]).map(
          (s) =>
            `<url><loc>${BASE_URL}/service/${s.slug}</loc><lastmod>${
              (s as { updatedAt?: Date; createdAt?: Date }).updatedAt
                ? (s as { updatedAt: Date }).updatedAt
                    .toISOString()
                    .split("T")[0]
                : (s as { createdAt?: Date }).createdAt
                  ? (s as { createdAt: Date }).createdAt
                      .toISOString()
                      .split("T")[0]
                  : ""
            }</lastmod></url>`,
        )
      : [];

  // Static routes
  const staticLastMod = "2026-02-07";
  const staticUrls = [
    "",
    "about",
    "contact",
    "service",
    "raise-a-complaint",
    "disclaimer",
    "terms-and-conditions",
    "blog",
  ].map(
    (path) =>
      `<url><loc>${BASE_URL}/${path}</loc><lastmod>${staticLastMod}</lastmod></url>`,
  );

  // Build XML
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${staticUrls.join("\n")}` +
    `${blogUrls.join("\n")}` +
    `${serviceUrls.join("\n")}` +
    `\n</urlset>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
