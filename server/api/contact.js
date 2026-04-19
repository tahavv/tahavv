import nodemailer from 'nodemailer'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const name = body?.name?.trim()
  const email = body?.email?.trim()
  const message = body?.message?.trim()

  if (!name || !email || !message) {
    throw createError({ statusCode: 400, statusMessage: 'Name, email, and message are required.' })
  }

  const subject = body?.subject?.trim() || `Portfolio message from ${name}`

  if (!isValidEmail(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Please provide a valid email address.' })
  }

  const config = useRuntimeConfig(event)
  const host = config.smtpHost
  const port = Number(config.smtpPort)
  const user = config.smtpUser
  const pass = config.smtpPass
  const receiverEmail = config.receiverEmail
  const connectionTimeout = Number(config.smtpConnectionTimeout || 10000)
  const greetingTimeout = Number(config.smtpGreetingTimeout || 10000)
  const socketTimeout = Number(config.smtpSocketTimeout || 20000)

  if (!host || !port || !user || !pass || !receiverEmail) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Email service is not configured. Please set SMTP environment variables.'
    })
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    },
    connectionTimeout,
    greetingTimeout,
    socketTimeout
  })

  try {
    await transporter.sendMail({
      from: `Portfolio Contact <${user}>`,
      to: receiverEmail,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New portfolio contact message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `
    })

    return { success: true, message: 'Email sent successfully.' }
  } catch (error) {
    console.error('Contact API sendMail error:', error)
    const isConnectionTimeout = error?.code === 'ETIMEDOUT' || error?.command === 'CONN'

    throw createError({
      statusCode: isConnectionTimeout ? 504 : 500,
      statusMessage: isConnectionTimeout
        ? 'Email provider connection timed out. Verify SMTP host/port and outbound network access.'
        : 'Failed to send email.'
    })
  }
})
