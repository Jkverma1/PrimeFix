import { supabase } from "../lib/supabase";

// ── Friendly error messages ──────────────────────────────────
function parseSendOtpError(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes("invalid") && msg.includes("phone"))
    return "This phone number is invalid. Please check and try again.";
  if (msg.includes("unsupported phone provider"))
    return "SMS service is not configured. Please contact support.";
  if (msg.includes("sms") && msg.includes("blocked"))
    return "SMS to this number is blocked. Try a different number.";
  if (msg.includes("rate limit") || msg.includes("too many"))
    return "Too many attempts. Please wait a few minutes and try again.";
  if (msg.includes("not a mobile") || msg.includes("landline"))
    return "This appears to be a landline number. Please use a mobile number.";
  if (msg.includes("twilio"))
    return "Could not send OTP. Please check your number and try again.";
  if (msg.includes("network") || msg.includes("fetch"))
    return "Network error. Please check your internet connection.";

  return "Could not send OTP. Please try again.";
}

function parseVerifyOtpError(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes("invalid") && msg.includes("otp"))
    return "Incorrect OTP. Please check and try again.";
  if (msg.includes("expired"))
    return "OTP has expired. Please request a new one.";
  if (msg.includes("token has expired") || msg.includes("otp expired"))
    return "OTP has expired. Please request a new one.";
  if (msg.includes("rate limit") || msg.includes("too many"))
    return "Too many attempts. Please wait and try again.";

  return "Verification failed. Please try again.";
}

// ── API functions ────────────────────────────────────────────
export const sendOtp = async (phone: string): Promise<boolean> => {
  const { error } = await supabase.auth.signInWithOtp({
    phone: `+91${phone}`,
  });

  if (error) {
    throw new Error(parseSendOtpError(error.message));
  }

  return true;
};

export const verifyOtp = async (
  phone: string,
  otp: string,
): Promise<{ token: string; userId: string }> => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: `+91${phone}`,
    token: otp,
    type: "sms",
  });

  if (error) {
    throw new Error(parseVerifyOtpError(error.message));
  }

  if (!data.session) {
    throw new Error("Login failed. Please try again.");
  }

  return {
    token: data.session.access_token,
    userId: data.session.user.id,
  };
};
