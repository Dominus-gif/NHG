import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Force the apex domain: www.nordharton.com/* -> nordharton.com/* (308).
// Done here rather than in next.config redirects() because the catch-all
// `:path*` param is not interpolated correctly on the Cloudflare/OpenNext
// runtime, which produced a literal `/:path*` Location header.
export function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  if (host === "www.nordharton.com") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = "nordharton.com";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
