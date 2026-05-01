import nodemailer from 'nodemailer'
import { MailtrapTransport } from 'mailtrap'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function toEmailOrFallback(value, fallback = '') {
  if (typeof value !== 'string') {
    return fallback
  }

  const trimmed = value.trim()
  if (isValidEmail(trimmed)) {
    return trimmed
  }

  const matched = trimmed.match(/<([^>]+)>/)
  if (matched?.[1] && isValidEmail(matched[1].trim())) {
    return matched[1].trim()
  }

  return fallback
}

function toNumberOrFallback(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function toBooleanOrFallback(value, fallback) {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (['true', '1', 'yes', 'on'].includes(normalized)) {
      return true
    }

    if (['false', '0', 'no', 'off'].includes(normalized)) {
      return false
    }
  }

  return fallback
}

function normalizeMailtrapToken(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim().replace(/^Bearer\s+/i, '')
}

async function sendContactMail({ transportOptions, sendTimeout, payload }) {
  const transporter = nodemailer.createTransport(transportOptions)

  return Promise.race([
    transporter.sendMail(payload),
    new Promise((_, reject) =>
      setTimeout(() => reject(Object.assign(new Error('SMTP send timeout'), { code: 'ESENDTIMEOUT' })), sendTimeout)
    )
  ])
}

async function sendContactMailWithMailtrap({ token, sandbox, testInboxId, sendTimeout, payload }) {
  const transporter = nodemailer.createTransport(
    MailtrapTransport({
      token,
      sandbox,
      ...(sandbox ? { testInboxId } : {})
    })
  )

  return Promise.race([
    transporter.sendMail(payload),
    new Promise((_, reject) =>
      setTimeout(() => reject(Object.assign(new Error('Mailtrap send timeout'), { code: 'EMAILTRAPTIMEOUT' })), sendTimeout)
    )
  ])
}

async function sendContactMailWithMailtrapHost({ token, host, sandbox, testInboxId, sendTimeout, payload }) {
  const normalizedHost = typeof host === 'string' ? host.trim().replace(/\/+$/, '') : ''
  const endpoint = sandbox && testInboxId > 0
    ? `${normalizedHost}/api/send/${testInboxId}`
    : `${normalizedHost}/api/send`

  const mailtrapPayload = {
    from: { email: payload.from },
    to: Array.isArray(payload.to) ? payload.to.map((address) => ({ email: address })) : [{ email: payload.to }],
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
    ...(payload.replyTo ? { reply_to: { email: payload.replyTo } } : {})
  }

  return Promise.race([
    $fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: mailtrapPayload
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(Object.assign(new Error('Mailtrap send timeout'), { code: 'EMAILTRAPTIMEOUT' })), sendTimeout)
    )
  ])
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
  const secure = toBooleanOrFallback(config.smtpSecure, port === 465)
  const requireTLS = toBooleanOrFallback(config.smtpRequireTls, !secure)
  const isGmailHost = /(^|\.)gmail\.com$/i.test(host || '')
  const mailtrapToken = normalizeMailtrapToken(config.mailtrapToken)
  const mailtrapHost = typeof config.mailtrapHost === 'string' ? config.mailtrapHost.trim() : ''
  const mailtrapSandbox = toBooleanOrFallback(config.mailtrapSandbox, true)
  const mailtrapTestInboxId = toNumberOrFallback(config.mailtrapTestInboxId, 0)

  // Temporary diagnostics to verify env wiring in production without leaking secrets.
  console.info('Contact API SMTP env presence', {
    smtpHost: Boolean(host),
    smtpPort: config.smtpPort ?? null,
    smtpUser: Boolean(user),
    smtpPass: Boolean(pass),
    receiverEmail: Boolean(receiverEmail),
    smtpSecure: config.smtpSecure ?? null,
    smtpRequireTls: config.smtpRequireTls ?? null,
    smtpConnectionTimeout: config.smtpConnectionTimeout ?? null,
    smtpGreetingTimeout: config.smtpGreetingTimeout ?? null,
    smtpSocketTimeout: config.smtpSocketTimeout ?? null,
    smtpSendTimeout: config.smtpSendTimeout ?? null,
    mailtrapToken: Boolean(mailtrapToken),
    mailtrapHost: config.mailtrapHost ?? null,
    mailtrapSandbox: config.mailtrapSandbox ?? null,
    mailtrapTestInboxId: config.mailtrapTestInboxId ?? null
  })

  if (!receiverEmail) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Email service is not configured. Please set RECEIVER_EMAIL.'
    })
  }

  const isSmtpConfigured = Boolean(host && port && user && pass)
  const isMailtrapConfigured = Boolean(mailtrapToken && (!mailtrapSandbox || mailtrapTestInboxId > 0))
  const mailtrapFromAddress = toEmailOrFallback(user, toEmailOrFallback(receiverEmail))

  if (!isSmtpConfigured && !isMailtrapConfigured) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Email service is not configured. Set SMTP variables or MAILTRAP_* fallback.'
    })
  }

  if (isMailtrapConfigured && !mailtrapFromAddress) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Mailtrap fallback is missing a valid sender email (set SMTP_USER or RECEIVER_EMAIL).'
    })
  }

  const baseTransportOptions = {
    host,
    port,
    secure,
    requireTLS,
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
  }

  const mailPayload = {
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
  }

  try {
    if (isSmtpConfigured) {
      await sendContactMail({
        transportOptions: baseTransportOptions,
        sendTimeout,
        payload: mailPayload
      })

      return { success: true, message: 'Email sent successfully.' }
    }
  } catch (error) {
    const shouldRetryWithImplicitTls =
      (error?.code === 'ETIMEDOUT' || error?.code === 'ESENDTIMEOUT' || error?.command === 'CONN') &&
      isGmailHost &&
      port === 587 &&
      !secure

    if (shouldRetryWithImplicitTls) {
      try {
        await sendContactMail({
          transportOptions: {
            ...baseTransportOptions,
            port: 465,
            secure: true,
            requireTLS: false
          },
          sendTimeout,
          payload: mailPayload
        })

        return {
          success: true,
          message: 'Email sent successfully using Gmail TLS fallback (port 465).'
        }
      } catch (retryError) {
        console.error('Contact API sendMail retry error:', retryError)
        error = retryError
      }
    }

    if (isMailtrapConfigured) {
      const mailtrapOptions = {
        token: mailtrapToken,
        sandbox: mailtrapSandbox,
        testInboxId: mailtrapTestInboxId,
        sendTimeout,
        payload: {
          ...mailPayload,
          from: mailtrapFromAddress,
          to: [receiverEmail]
        }
      }

      try {
        if (mailtrapHost) {
          await sendContactMailWithMailtrapHost({ ...mailtrapOptions, host: mailtrapHost })
        } else {
          await sendContactMailWithMailtrap(mailtrapOptions)
        }

        return {
          success: true,
          message: 'Email sent successfully using Mailtrap API fallback.'
        }
      } catch (mailtrapError) {
        console.error('Contact API Mailtrap fallback error:', mailtrapError)
        error = mailtrapError
      }
    }

    console.error('Contact API sendMail error:', error)
    const isConnectionTimeout =
      error?.code === 'ETIMEDOUT' ||
      error?.code === 'ESENDTIMEOUT' ||
      error?.code === 'EMAILTRAPTIMEOUT' ||
      error?.command === 'CONN'

    throw createError({
      statusCode: isConnectionTimeout ? 504 : 500,
      statusMessage: isConnectionTimeout
        ? 'Email provider connection timed out. Verify SMTP/Mailtrap settings and outbound network access.'
        : 'Failed to send email.'
    })
  }

  try {
    const mailtrapOptions = {
      token: mailtrapToken,
      sandbox: mailtrapSandbox,
      testInboxId: mailtrapTestInboxId,
      sendTimeout,
      payload: {
        ...mailPayload,
        from: mailtrapFromAddress,
        to: [receiverEmail]
      }
    }

    if (mailtrapHost) {
      await sendContactMailWithMailtrapHost({
        ...mailtrapOptions,
        host: mailtrapHost
      })
    } else {
      await sendContactMailWithMailtrap(mailtrapOptions)
    }

    return {
      success: true,
      message: 'Email sent successfully using Mailtrap API.'
    }
  } catch (error) {
    console.error('Contact API Mailtrap API error:', error)
    const isConnectionTimeout = error?.code === 'EMAILTRAPTIMEOUT'

    throw createError({
      statusCode: isConnectionTimeout ? 504 : 500,
      statusMessage: isConnectionTimeout
        ? 'Mailtrap request timed out. Verify MAILTRAP_* settings and outbound network access.'
        : 'Failed to send email.'
    })
  }
})
