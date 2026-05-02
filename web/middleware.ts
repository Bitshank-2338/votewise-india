import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Security middleware — runs on every request.
 * Blocks suspicious patterns and adds security markers.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal Next.js routes entirely
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/manifest.json"
  ) {
    return NextResponse.next();
  }

  // Block access to sensitive file/path patterns
  const blockedPatterns = [
    /^\/?\.env/,           // .env files at root
    /^\/?\.git/,           // Git directory
    /\.sql$/i,             // SQL files
    /\/wp-admin/i,         // WordPress admin
    /\/wp-login/i,         // WordPress login
    /\/phpmyadmin/i,       // phpMyAdmin
    /\.php$/i,             // PHP files
    /\.asp$/i,             // ASP files
    /\/\.\.\//,            // Path traversal
    /\/admin\/config/i,    // Admin config
    /\/\.htaccess/i,       // Apache config
    /\/server-status/i,    // Apache status
    /\/cgi-bin/i,          // CGI scripts
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(pathname)) {
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  // Block excessively long URLs (potential buffer overflow attempt)
  if (request.url.length > 4096) {
    return new NextResponse("URI Too Long", { status: 414 });
  }

  // For API routes — verify Content-Type on POST/PUT/PATCH
  if (pathname.startsWith("/api/")) {
    const method = request.method.toUpperCase();
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const contentType = request.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        return NextResponse.json(
          { error: "Content-Type must be application/json" },
          { status: 415 }
        );
      }
    }
  }

  // Add security response headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");

  return response;
}

export const config = {
  // Only run on app routes, not Next.js internals or static assets
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)",
  ],
};
