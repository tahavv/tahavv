import nodemailer from 'nodemailer';
import 'dotenv/config';


export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (!body.name || !body.email || !body.subject || !body.message) {
        return { success: false, error: "All fields are required." };
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, 
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: `"${body.name}" <${body.email}>`,
            to: process.env.RECEIVER_EMAIL,
            subject: `Contact Form: ${body.subject}`,
            text: body.message,
            html: `<p><strong>Name:</strong> ${body.name}</p>
                   <p><strong>Email:</strong> ${body.email}</p>
                   <p><strong>Subject:</strong> ${body.subject}</p>
                   <p><strong>Message:</strong> ${body.message}</p>`
        });

        return { success: true, message: "Email sent successfully!" };
    } catch (error) {
        return { success: false, error: "Failed to send email." };
    }
});
