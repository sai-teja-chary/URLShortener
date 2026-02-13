import { eq, and } from "drizzle-orm";
import { db } from "../config/db.js";
import { links } from "../drizzle/schema.js";

export const loadLinks = async (userId) => {
    return await db.select().from(links).where(eq(links.userId, userId));
};

export const saveLinks = async ({ url, shortCode, userId }) => {
    const [newLink] = await db
        .insert(links)
        .values({ shortCode, url, userId })

    return newLink;
};

export const getLinkByShortCode = async (shortCode) => {
    const [link] = await db
        .select()
        .from(links)
        .where(eq(links.shortCode, shortCode))
        .limit(1);

    return link || null;
};

export const findShortLinkById = async (id) => {
    const [link] = await db.select().from(links).where(eq(links.id, id)).limit(1);
    return link || null;
};

export const updateShortCode = async ({ id, url, shortCode, userId }) => {
    const [updated] = await db
        .update(links)
        .set({ url, shortCode })
        .where(and(eq(links.id, id), eq(links.userId, userId)))
        .returning();

    return updated || null;
};

export const deleteShortLinkById = async (id, userId) => {
    const deleted = await db
        .delete(links)
        .where(and(eq(links.id, id), eq(links.userId, userId)))
        .returning();

    return deleted.length > 0;
};
