import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../config/constants.js";
import { refreshTokens, verifyJWTToken, findUserById, findSessionById } from "../services/auth.services.js";

export const verifyAuthentication = async (req, res, next) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  req.user = null;

  if (!accessToken && !refreshToken) {
    return next();
  }

  const baseConfig = { httpOnly: true, secure: true };

  try {
    // 🔹 1. Try verifying access token
    if (accessToken) {
      const decoded = verifyJWTToken(accessToken);

      // 🔸 Ensure user + session are still valid
      const user = await findUserById(decoded.id);
      const session = await findSessionById(decoded.sessionId);

      if (!user || !session || !session.valid) {
        console.log("Invalid user or session, clearing cookies...");
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return next();
      }

      req.user = user;
      return next();
    }

    // 🔹 2. If no valid access token, try refresh token
    if (refreshToken) {
      const { newAccessToken, newRefreshToken, user } = await refreshTokens(refreshToken);

      // Double-check user still exists (refreshTokens already does this, but extra safety)
      const userInDb = await findUserById(user.id);
      if (!userInDb) {
        console.log("User deleted, clearing cookies...");
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return next();
      }

      res.cookie("access_token", newAccessToken, {
        ...baseConfig,
        maxAge: ACCESS_TOKEN_EXPIRY,
      });

      res.cookie("refresh_token", newRefreshToken, {
        ...baseConfig,
        maxAge: REFRESH_TOKEN_EXPIRY,
      });

      req.user = user;
      return next();
    }
  } catch (error) {
    console.error("verifyAuthentication error:", error.message);
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    req.user = null;
    return next();
  }

  return next();
};
