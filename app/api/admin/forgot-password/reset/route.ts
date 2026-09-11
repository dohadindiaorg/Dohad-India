import dbConnect from '@/lib/mongodb';
import AdminUser from '@/lib/models/AdminUser';
import bcrypt from 'bcryptjs';
import { jsonOk, jsonError, jsonInternalError, logServerError } from '@/lib/api/route-helpers';
import { isOtpExpired, MAX_OTP_ATTEMPTS, verifyOtpHash } from '@/lib/otp';

const INVALID_OTP_MESSAGE = 'Invalid or expired verification code.';

async function clearOtpState(admin: {
  resetOtp?: string;
  resetOtpExpires?: Date;
  resetOtpAttempts?: number;
  resetOtpSentAt?: Date;
}) {
  admin.resetOtp = undefined;
  admin.resetOtpExpires = undefined;
  admin.resetOtpAttempts = 0;
  admin.resetOtpSentAt = undefined;
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError('Invalid request', 400);
    }

    const payload = body as { email?: unknown; otp?: unknown; password?: unknown };
    const { email, otp, password } = payload;

    if (!email || typeof email !== 'string') {
      return jsonError('Email is required', 400);
    }
    if (!otp || typeof otp !== 'string') {
      return jsonError('OTP is required', 400);
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return jsonError('Password must be at least 6 characters long', 400);
    }
    if (password.length > 200) {
      return jsonError('Password is too long', 400);
    }

    await dbConnect();
    const normalizedEmail = email.toLowerCase().trim();
    const admin = await AdminUser.findOne({ email: normalizedEmail });

    if (!admin || !admin.resetOtp) {
      return jsonError(INVALID_OTP_MESSAGE, 400);
    }

    if (isOtpExpired(admin.resetOtpExpires)) {
      await clearOtpState(admin);
      await admin.save();
      return jsonError('The verification code has expired. Please request a new one.', 400);
    }

    if ((admin.resetOtpAttempts || 0) >= MAX_OTP_ATTEMPTS) {
      await clearOtpState(admin);
      await admin.save();
      return jsonError(INVALID_OTP_MESSAGE, 400);
    }

    if (!verifyOtpHash(otp, admin.resetOtp)) {
      admin.resetOtpAttempts = (admin.resetOtpAttempts || 0) + 1;
      if (admin.resetOtpAttempts >= MAX_OTP_ATTEMPTS) {
        await clearOtpState(admin);
      }
      await admin.save();
      return jsonError(INVALID_OTP_MESSAGE, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    admin.password = hashedPassword;
    admin.sessionVersion = (admin.sessionVersion || 0) + 1;
    await clearOtpState(admin);
    await admin.save();

    return jsonOk({ message: 'Password has been reset successfully' });
  } catch (error) {
    logServerError('Error resetting password', error);
    return jsonInternalError();
  }
}
