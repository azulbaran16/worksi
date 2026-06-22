import rateLimit from "express-rate-limit";

// Per-IP limiter for public form submissions (applications, contact).
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions from this device. Please try again in a few minutes." },
});

// Stricter limiter for login attempts (brute-force protection).
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please wait a few minutes and try again." },
});

// Honeypot: bots fill hidden fields humans never see. If filled, it's spam.
// We pretend success so bots don't learn they were blocked.
export function honeypotBlocked(req) {
  return Boolean(req.body && (req.body.hp || req.body.company_website));
}
