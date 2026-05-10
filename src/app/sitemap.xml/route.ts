import { NextResponse } from "next/server";

export async function GET() {
    const baseUrl = "https://kahustle.co.ke";

    const pages = [
        "",
        "/cars",
        "/properties",
        "/careers",
        "/careers/employer",
        "/careers/jobseeker",
        "/construction-freelancers",
        "/post-ad",
        "/my-ads",
        "/account",
        "/signin",
        "/contact",
        "/about",
        "/live-chat",
    ];

    const urls = pages
        .map(
            (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page === "" ? "hourly" : "weekly"}</changefreq>
    <priority>${page === "" ? "1.0" : page === "/post-ad" ? "0.9" : "0.7"}</priority>
  </url>`
        )
        .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urls}
</urlset>`;

    return new NextResponse(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}