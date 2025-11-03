import { db } from "../config/db.js";
import { sessions, users, emailVerificationTable } from "../drizzle/schema.js";
import { and, eq, gt, gte, lt, sql } from "drizzle-orm";
import * as argon from "argon2";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { ACCESS_TOKEN_EXPIRY, MILLISECONDS_PER_SECOND, REFRESH_TOKEN_EXPIRY } from "../config/constants.js";
import { randomInt } from "crypto";
import dotenv from "dotenv";
import { sendMail } from "../lib/mail.resend.js";
import { convertMjmlToHtml } from "../lib/convert-mjml-to-html.js";

dotenv.config();

export const loadUser = async (email) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user || null;
};

export const saveUser = async ({ username, email, password }) => {
  await db.insert(users).values({ username, email, password });
};

export const hashPassword = async (password) => {
  return await argon.hash(password);
};

export const verifyPassword = async (hash, password) => {
  return await argon.verify(hash, password);
};

export const generateAccessToken = ({ id, name, email, isEmailVerified, sessionId }) => {
  return jwt.sign(
    { id, name, email, isEmailVerified, sessionId },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND }
  );
};

export const generateRefreshToken = (sessionId) => {
  return jwt.sign(
    { sessionId },
    process.env.JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND }
  );
};

export const verifyJWTToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const createSession = async ({ userId, ip, userAgent }) => {
  const [session] = await db.insert(sessions)
    .values({ userId, ip, userAgent })
    .$returningId();
  return session;
};

export const deleteUserSessions = async (id) => {
  await db.delete(sessions).where(eq(sessions.userId, id));
};

export const findSessionById = async (sessionId) => {
  const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
  return session;
};

export const findUserById = async (userId) => {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  return user;
};

export const refreshTokens = async (refreshToken) => {
  try {
    const decodedToken = verifyJWTToken(refreshToken);
    const currentSession = await findSessionById(decodedToken.sessionId);

    if (!currentSession || !currentSession.valid) {
      throw new Error("Invalid Session");
    }

    const user = await findUserById(currentSession.userId);
    if (!user) {
      throw new Error("Invalid User");
    }

    const userInfo = {
      id: user.id,
      name: user.username,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      sessionId: currentSession.id
    };

    const newAccessToken = generateAccessToken(userInfo);
    const newRefreshToken = generateRefreshToken(currentSession.id);

    return { newAccessToken, newRefreshToken, user: userInfo };
  } catch (error) {
    throw error;
  }
};

export const insertEmailVerificationToken = async ({ userId, token }) => {
  return db.transaction(async (tx) => {
    try {
      await tx.delete(emailVerificationTable)
        .where(lt(emailVerificationTable.expiresAt, sql`NOW()`));
      await tx.delete(emailVerificationTable)
        .where(eq(emailVerificationTable.userId, userId));
      await tx.insert(emailVerificationTable)
        .values({ userId, token });
    } catch (error) {
      console.error("Failed to insert verification token:", error);
      throw new Error("Unable to create verification token");
    }
  });
};

export const generateRandomToken = (digit = 8) => {
  const min = 10 ** (digit - 1);
  const max = 10 ** digit;
  return randomInt(min, max);
};

export const createVerifyEmailLink = async ({ token, email }) => {
  if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL is not defined in environment variables");
  }

  const url = new URL(`${process.env.FRONTEND_URL}/verify-email-token`);
  url.searchParams.append("token", token);
  url.searchParams.append("email", email);

  return url.toString();
};

export const sendNewVerificationLink = async ({ email, userId }) => {
  const randomToken = generateRandomToken();
  await insertEmailVerificationToken({ userId, token: randomToken });

  const verifyEmailLink = await createVerifyEmailLink({ token: randomToken, email });
  const html = await convertMjmlToHtml("verify-email", { code: randomToken, link: verifyEmailLink });

  sendMail({ to: email, subject: "Verify Email", html }).catch(console.error);
};

export const findEmailToken = async (token) => {
  return db.select({
    userId: users.id,
    userEmail: users.email,
    token: emailVerificationTable.token,
    expiresAt: emailVerificationTable.expiresAt
  })
    .from(emailVerificationTable)
    .where(and(
      eq(emailVerificationTable.token, token),
      gte(emailVerificationTable.expiresAt, sql`NOW()`)
    ))
    .innerJoin(users, eq(emailVerificationTable.userId, users.id));
};

export const updateUserEmailVerified = async (email, userId) => {
  await db.transaction(async (tx) => {
    await tx.update(users).set({ isEmailVerified: true }).where(eq(users.email, email));
    await tx.delete(emailVerificationTable).where(eq(emailVerificationTable.userId, userId));
  });
};

export const updateUserName = async (name, id) => {
  await db.update(users).set({username: name}).where(eq(users.id, id))
}

export const updateUserPassword = async(id, newPassword) => {
  await db.update(users).set({password: newPassword}).where(eq(users.id, id))
}