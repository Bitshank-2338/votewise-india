import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers applied to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking — only allow same-origin framing
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Enable XSS filter in older browsers
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Control referrer info leakage
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Strict permissions policy
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(self), payment=()",
          },
          // Content Security Policy — whitelist safe sources
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://generativelanguage.googleapis.com https://newsdata.io https://www.google-analytics.com https://translation.googleapis.com https://www.googleapis.com",
              "frame-src https://www.google.com https://maps.google.com https://www.youtube-nocookie.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          // Strict Transport Security (HTTPS only in production)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },

  // Disable x-powered-by header (hides Next.js info from attackers)
  poweredByHeader: false,
};

export default nextConfig;
