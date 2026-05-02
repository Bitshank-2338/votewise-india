import { rateLimit, getClientIP } from "../lib/rate-limit";
import { sanitizeInput, validateChatMessage } from "../lib/sanitize";

describe("Security and Validation Tests", () => {
  it("should sanitize malicious HTML from strings", () => {
    const malicious = "<script>alert('xss')</script>Hello";
    const safe = sanitizeInput(malicious);
    if (safe.includes("<script>")) {
      throw new Error("Sanitization failed!");
    }
  });

  it("should enforce rate limiting to prevent abuse", () => {
    const ip = "127.0.0.1";
    // First request
    const req1 = rateLimit(ip, 2, 60000);
    if (req1.limited) throw new Error("First request should pass");
    
    // Second request
    const req2 = rateLimit(ip, 2, 60000);
    if (req2.limited) throw new Error("Second request should pass");
    
    // Third request (should fail)
    const req3 = rateLimit(ip, 2, 60000);
    if (!req3.limited) throw new Error("Rate limit should block third request");
  });
});
