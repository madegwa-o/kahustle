import { NextResponse } from "next/server";

export async function GET() {
    const body = `
User-agent: *
Allow: /
Disallow: /account
Disallow: /my-ads
Disallow: /api/

Sitemap: https://kahustle.co.ke/sitemap.xml
`;

    return new NextResponse(body, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}