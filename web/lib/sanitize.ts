/**
 * Input sanitization and validation utilities.
 * Protects against XSS, injection, and prompt injection attacks.
 */

/**
 * Strip HTML tags and dangerous characters from user input.
 */
export function sanitizeInput(input: string): string {
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove script-related patterns
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    // Remove null bytes
    .replace(/\0/g, "")
    // Trim whitespace
    .trim();
}

/**
 * Validate chat message — enforce length, character, and content rules.
 */
export function validateChatMessage(message: string): {
  valid: boolean;
  error?: string;
  sanitized: string;
} {
  const sanitized = sanitizeInput(message);

  if (!sanitized || sanitized.length === 0) {
    return { valid: false, error: "Message cannot be empty", sanitized: "" };
  }

  if (sanitized.length > 2000) {
    return {
      valid: false,
      error: "Message is too long (max 2000 characters)",
      sanitized,
    };
  }

  // Block potential prompt injection attempts
  const injectionPatterns = [
    /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|prompts)/i,
    /you\s+are\s+now\s+(a|an|the)/i,
    /system\s*:\s*/i,
    /\[INST\]/i,
    /<<SYS>>/i,
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(sanitized)) {
      return {
        valid: false,
        error:
          "Your message appears to contain an instruction override. Please ask a genuine election-related question.",
        sanitized,
      };
    }
  }

  return { valid: true, sanitized };
}

/**
 * Validate that a URL parameter is a safe, expected value.
 */
export function validateCategory(category: string): string {
  const allowed = [
    "politics",
    "technology",
    "business",
    "world",
    "entertainment",
    "sports",
  ];
  const lower = category.toLowerCase().trim();
  return allowed.includes(lower) ? lower : "politics";
}
