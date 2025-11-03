import z from "zod";
import {
    loadLinks,
    saveLinks,
    getLinkByShortCode,
    findShortLinkById,
    updateShortCode,
    deleteShortLinkById
} from "../services/urlShortener.services.js";
import { urlShortCodeScheme } from "../validators/urlshortener-validator.js";

// Create new short link
export const postURLShortener = async (req, res) => {
    try {
        if (!req.user) {
            req.flash("errors", "Login/Register to shorten your links");
            return res.redirect("/login");
        }

        const result = urlShortCodeScheme.safeParse(req.body);
        if (!result.success) {
            const errorMessage = result.error.issues[0].message;
            req.flash("errors", errorMessage);
            return res.redirect("/");
        }

        const { url, shortCode } = result.data;

        const links = await loadLinks(req.user.id);

        // ✅ Fixed: check if short code already exists for this user
        const shortCodeExists = links.some((link) => link.shortCode === shortCode);
        if (shortCodeExists) {
            req.flash("errors", "Short code already exists, try another short code");
            return res.redirect("/");
        }

        await saveLinks({ url, shortCode, userId: req.user.id });

        return res.redirect("/");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

// Render main shortener page
export const getShortenerPage = async (req, res) => {
    try {
        if (!req.user) {
            req.flash("errors", "Login/Register to shorten your links");
            return res.redirect("/login");
        }

        const links = await loadLinks(req.user.id);
        return res.render("index", {
            links,
            host: req.host,
            errors: req.flash("errors"),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

// Handle redirect for short code
export const redirectShortURL = async (req, res) => {
    try {
        const shortCode = req.params.shortCode;
        const link = await getLinkByShortCode(shortCode);

        if (!link) return res.status(404).send("Page not found");

        return res.redirect(link.url);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

// Render edit page
export const getEditShortCodePage = async (req, res) => {
    if (!req.user) return res.redirect("/login");

    const result = z.coerce.number().int().safeParse(req.params.id);
    if (!result.success) return res.redirect("/404");

    try {
        const id = result.data;
        const link = await findShortLinkById(id);

        // ✅ Added ownership check
        if (!link || link.userId !== req.user.id) {
            return res.redirect("/404");
        }

        return res.render("edit-shortLink", {
            id: link.id,
            url: link.url,
            shortCode: link.shortCode,
            errors: req.flash("errors"),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

// Handle edit submit
export const postEditShortCodePage = async (req, res) => {
    if (!req.user) return res.redirect("/login");

    const result = z.coerce.number().int().safeParse(req.params.id);
    if (!result.success) return res.redirect("/404");

    try {
        const id = result.data;
        const { url, shortCode } = req.body;

        const existing = await findShortLinkById(id);
        if (!existing || existing.userId !== req.user.id) {
            return res.redirect("/404");
        }

        await updateShortCode({ id, url, shortCode });
        return res.redirect("/");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

// Delete short link
export const deleteShortLink = async (req, res) => {
    if (!req.user) return res.redirect("/login");

    const result = z.coerce.number().int().safeParse(req.params.id);
    if (!result.success) return res.redirect("/404");

    try {
        const id = result.data;
        const existing = await findShortLinkById(id);

        // ✅ Ownership check
        if (!existing || existing.userId !== req.user.id) {
            return res.redirect("/404");
        }

        await deleteShortLinkById(id);
        return res.redirect("/");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};
