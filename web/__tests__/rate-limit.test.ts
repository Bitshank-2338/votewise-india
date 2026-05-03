import { rateLimit, getClientIP } from "../lib/rate-limit";

describe("rateLimit", () => {
  it("allows the first request and counts down remaining", () => {
    const r = rateLimit("ip-a-1", 3, 60_000);
    expect(r.limited).toBe(false);
    expect(r.remaining).toBe(2);
    expect(r.resetIn).toBeGreaterThan(0);
  });

  it("blocks after exceeding the limit", () => {
    const id = "ip-b-1";
    rateLimit(id, 2, 60_000);
    rateLimit(id, 2, 60_000);
    const third = rateLimit(id, 2, 60_000);
    expect(third.limited).toBe(true);
    expect(third.remaining).toBe(0);
  });

  it("treats different identifiers independently", () => {
    const a = rateLimit("ip-c-1", 1, 60_000);
    const b = rateLimit("ip-c-2", 1, 60_000);
    expect(a.limited).toBe(false);
    expect(b.limited).toBe(false);
  });

  it("resets after the window expires", () => {
    const id = "ip-d-1";
    const first = rateLimit(id, 1, 1); // 1ms window
    expect(first.limited).toBe(false);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const after = rateLimit(id, 1, 1);
        expect(after.limited).toBe(false);
        resolve();
      }, 5);
    });
  });

  it("reports remaining correctly", () => {
    const id = "ip-e-1";
    const first = rateLimit(id, 5, 60_000);
    const second = rateLimit(id, 5, 60_000);
    expect(first.remaining).toBe(4);
    expect(second.remaining).toBe(3);
  });
});

describe("getClientIP", () => {
  it("prefers the first x-forwarded-for entry", () => {
    const h = new Headers({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" });
    expect(getClientIP(h)).toBe("1.1.1.1");
  });

  it("falls back to x-real-ip", () => {
    const h = new Headers({ "x-real-ip": "9.9.9.9" });
    expect(getClientIP(h)).toBe("9.9.9.9");
  });

  it("returns 'unknown' when no header is present", () => {
    expect(getClientIP(new Headers())).toBe("unknown");
  });

  it("trims whitespace", () => {
    const h = new Headers({ "x-forwarded-for": "   3.3.3.3   ,4.4.4.4" });
    expect(getClientIP(h)).toBe("3.3.3.3");
  });
});
