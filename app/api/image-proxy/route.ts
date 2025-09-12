import { NextRequest } from "next/server";

// Whitelist to prevent SSRF. Add more hosts if you proxy from elsewhere.
const ALLOWED_HOSTS = new Set<string>(["logo.clearbit.com"]);

export async function GET(req: NextRequest) {
  // Accept either base64-free (url param) or URL-encoded (u param)
  const u = req.nextUrl.searchParams.get("u") || req.nextUrl.searchParams.get("url");
  if (!u) return new Response("Missing url", { status: 400 });

  let decoded = "";
  try {
    decoded = decodeURIComponent(u);
  } catch {
    decoded = u;
  }

  let target: URL;
  try {
    target = new URL(decoded);
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }

  if (!(target.protocol === "http:" || target.protocol === "https:")) {
    return new Response("Unsupported protocol", { status: 400 });
  }

  if (ALLOWED_HOSTS.size && !ALLOWED_HOSTS.has(target.hostname)) {
    return new Response("Host not allowed", { status: 403 });
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MintLuxe/1.0)",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      cache: "no-store",
    });

    if (!upstream.ok || !upstream.body) {
      return new Response("Upstream error", { status: 502 });
    }

    const headers = new Headers();
    headers.set("Content-Type", upstream.headers.get("content-type") || "image/png");
    const len = upstream.headers.get("content-length");
    if (len) headers.set("Content-Length", len);
    headers.set("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate=60");

    return new Response(upstream.body, { status: 200, headers });
  } catch {
    return new Response("Proxy failure", { status: 500 });
  }
}
