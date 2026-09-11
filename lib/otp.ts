import { createHmac, randomInt, timingSafeEqual } from 'crypto';

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_SEND_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const IP_WINDOW_MS = 15 * 60 * 1000;
const MAX_SENDS_PER_IP = 5;

type WindowState = { count: number; resetAt: number; lastAt: number };

const ipSendState = new Map<string, WindowState>();

function pruneMap(map: Map<string, WindowState>) {
  const now = Date.now();
  for (const [key, value] of map) {
    if (value.resetAt < now) map.delete(key);
  }
}

function getPepper() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return secret;
}

export function generateOtp() {
  return randomInt(0, 1_000_000).toString().padStart(6, '0');
}

export function hashOtp(otp: string) {
  return createHmac('sha256', getPepper()).update(otp.trim()).digest('hex');
}

export function verifyOtpHash(otp: string, storedHash: string) {
  if (!otp || !storedHash) return false;
  const computed = hashOtp(otp);
  const a = Buffer.from(computed, 'hex');
  const b = Buffer.from(storedHash, 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function otpExpiryDate() {
  return new Date(Date.now() + OTP_TTL_MS);
}

export function isOtpExpired(expires?: Date | null) {
  if (!expires) return true;
  return new Date() > new Date(expires);
}

export function isSendCooldownActive(sentAt?: Date | null) {
  if (!sentAt) return false;
  return Date.now() - new Date(sentAt).getTime() < OTP_SEND_COOLDOWN_MS;
}

export function consumeIpSendSlot(ip: string) {
  pruneMap(ipSendState);
  const now = Date.now();
  const current = ipSendState.get(ip);

  if (!current || current.resetAt < now) {
    ipSendState.set(ip, { count: 1, resetAt: now + IP_WINDOW_MS, lastAt: now });
    return { allowed: true as const };
  }

  if (now - current.lastAt < OTP_SEND_COOLDOWN_MS) {
    return { allowed: false as const, retryAfterMs: OTP_SEND_COOLDOWN_MS - (now - current.lastAt) };
  }

  if (current.count >= MAX_SENDS_PER_IP) {
    return { allowed: false as const, retryAfterMs: current.resetAt - now };
  }

  current.count += 1;
  current.lastAt = now;
  return { allowed: true as const };
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip') || 'unknown';
}

export { MAX_OTP_ATTEMPTS };
