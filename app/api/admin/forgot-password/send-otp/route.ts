import dbConnect from '@/lib/mongodb';
import AdminUser from '@/lib/models/AdminUser';
import { jsonOk, jsonError, jsonInternalError, logServerError } from '@/lib/api/route-helpers';
import { sendEmail } from '@/lib/email';
import {
  clientIp,
  consumeIpSendSlot,
  generateOtp,
  hashOtp,
  isSendCooldownActive,
  otpExpiryDate,
} from '@/lib/otp';

const GENERIC_OTP_MESSAGE =
  'If the account exists, a password reset code has been sent.';

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError('Invalid request', 400);
    }

    const email = typeof body === 'object' && body && 'email' in body
      ? (body as { email?: unknown }).email
      : undefined;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return jsonError('Please provide a valid email address', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail.length > 254) {
      return jsonError('Please provide a valid email address', 400);
    }

    const ipLimit = consumeIpSendSlot(clientIp(request));
    if (!ipLimit.allowed) {
      return jsonError('Please wait before requesting another code.', 429);
    }

    await dbConnect();
    const admin = await AdminUser.findOne({ email: normalizedEmail });

    if (!admin) {
      return jsonOk({ message: GENERIC_OTP_MESSAGE });
    }

    if (isSendCooldownActive(admin.resetOtpSentAt)) {
      return jsonOk({ message: GENERIC_OTP_MESSAGE });
    }

    const otp = generateOtp();
    admin.resetOtp = hashOtp(otp);
    admin.resetOtpExpires = otpExpiryDate();
    admin.resetOtpAttempts = 0;
    admin.resetOtpSentAt = new Date();
    await admin.save();

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #0ea5e9; text-align: center; font-family: Outfit, sans-serif;">DOHaD India CMS</h2>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p>Hello,</p>
        <p>We received a request to reset your administrator password. Use the following One-Time Password (OTP) to complete the verification process. This OTP is valid for 10 minutes:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; background-color: #f3f4f6; padding: 12px 24px; border-radius: 8px; border: 1px solid #e5e7eb; display: inline-block;">${otp}</span>
        </div>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p style="margin-top: 40px; font-size: 12px; color: #6b7280; text-align: center;">This is an automated message from DOHaD India.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: admin.email,
        subject: 'Your DOHaD India CMS password reset code',
        html: htmlContent,
      });
    } catch (error) {
      logServerError('Failed to send admin OTP email', error);
      admin.resetOtp = undefined;
      admin.resetOtpExpires = undefined;
      admin.resetOtpAttempts = 0;
      admin.resetOtpSentAt = undefined;
      await admin.save();
      return jsonInternalError();
    }

    return jsonOk({ message: GENERIC_OTP_MESSAGE });
  } catch (error) {
    logServerError('Error sending OTP', error);
    return jsonInternalError();
  }
}
