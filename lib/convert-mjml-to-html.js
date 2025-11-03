import fs from "fs/promises"
import path from "path"
import mjml2html from "mjml"
import ejs from "ejs"

export const convertMjmlToHtml = async (template, data) => {
    const mjmlTemplate = await fs.readFile(path.join(import.meta.dirname, "..","emails",`${template}.mjml`), "utf-8")

    const filledTemplate = ejs.render(mjmlTemplate, data)

    const html = mjml2html(filledTemplate).html

    return html
}