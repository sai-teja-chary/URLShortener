import { Resend } from "resend"
import "dotenv/config"

const resend = new Resend(process.env.RESEND_API_KEY)


export const sendMail = async ({ to, subject, html }) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: to,
            subject: subject,
            html: html
        })

    } catch (error) {
        console.error(error)
    }

}