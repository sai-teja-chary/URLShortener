import z from "zod";

export const urlShortCodeScheme = z.object({
    url: z.string().trim().url("Check the URL"),
    shortCode: z.string().trim().min(2, "Short code must have atleast 2 characters")
})