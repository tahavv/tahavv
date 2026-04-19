import nodemailer from 'nodemailer'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function toNumberOrFallback(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed.' })
  }

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
  const port = toNumberOrFallback(config.smtpPort, 587)
  const user = config.smtpUser
  const pass = config.smtpPass
  const receiverEmail = config.receiverEmail
  const connectionTimeout = toNumberOrFallback(config.smtpConnectionTimeout, 5000)
  const greetingTimeout = toNumberOrFallback(config.smtpGreetingTimeout, 5000)
  const socketTimeout = toNumberOrFallback(config.smtpSocketTimeout, 10000)
  const sendTimeout = toNumberOrFallback(config.smtpSendTimeout, 12000)
  const secure = port === 465

  // Temporary diagnostics to verify env wiring in production without leaking secrets.
  console.info('Contact API SMTP env presence', {
    smtpHost: Boolean(host),
    smtpPort: config.smtpPort ?? null,
    smtpUser: Boolean(user),
    smtpPass: Boolean(pass),
    receiverEmail: Boolean(receiverEmail),
    smtpConnectionTimeout: config.smtpConnectionTimeout ?? null,
    smtpGreetingTimeout: config.smtpGreetingTimeout ?? null,
    smtpSocketTimeout: config.smtpSocketTimeout ?? null,
    smtpSendTimeout: config.smtpSendTimeout ?? null
  })

  if (!host || !port || !user || !pass || !receiverEmail) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Email service is not configured. Please set SMTP environment variables.'
    })
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure,
    auth: {
      user,
      pass
    },
    tls: {
      servername: host
    },
    connectionTimeout,
    greetingTimeout,
    socketTimeout
  })

  try {
    await Promise.race([
      transporter.sendMail({
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
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(Object.assign(new Error('SMTP send timeout'), { code: 'ESENDTIMEOUT' })), sendTimeout)
      )
    ])

    return { success: true, message: 'Email sent successfully.' }
  } catch (error) {
    console.error('Contact API sendMail error:', error)
    const isConnectionTimeout =
      error?.code === 'ETIMEDOUT' || error?.code === 'ESENDTIMEOUT' || error?.command === 'CONN'

    throw createError({
      statusCode: isConnectionTimeout ? 504 : 500,
      statusMessage: isConnectionTimeout
        ? 'Email provider connection timed out. Verify SMTP host/port and outbound network access.'
        : 'Failed to send email.'
    })
  }
})
