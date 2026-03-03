export const sendOtp = async (phone: string) => {
  // later: POST /auth/send-otp
  return true;
};

export const verifyOtp = async (phone: string, otp: string) => {
  // later: POST /auth/verify
  return {
    token: "dummy-jwt-token",
  };
};
