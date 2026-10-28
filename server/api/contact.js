const requestLog = new Map()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const maxLength = { name: 120, email: 254, subject: 180, message: 5000 }

function plain(value, limit) {
    return typeof value === 'string' ? value.trim().slice(0, limit) : ''
}

function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[character]))
}

function isRateLimited(ip) {
    const now = Date.now()
    const previous = requestLog.get(ip) || 0
    if (now - previous < 60_000) return true
    requestLog.set(ip, now)
    return false
}

export default defineEventHandler(async (event) => {
    if (event.method !== 'POST') {
        throw createError({ statusCode: 405, statusMessage: 'Method not allowed.' })
    }

    const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
    if (isRateLimited(ip)) {
        throw createError({ statusCode: 429, statusMessage: 'Please wait a minute before sending another message.' })
    }

    const body = await readBody(event)
    if (body?.website) return { success: true, message: 'Message sent. I will reply soon.' }

    const name = plain(body?.name, maxLength.name)
    const email = plain(body?.email, maxLength.email)
    const subject = plain(body?.subject, maxLength.subject)
    const message = plain(body?.message, maxLength.message)

    if (!name || !email || !subject || !message) {
        throw createError({ statusCode: 400, statusMessage: 'Name, email, subject and message are all required.' })
    }
    if (!emailPattern.test(email)) {
        throw createError({ statusCode: 400, statusMessage: 'That email address looks incomplete. Write it as name@example.com.' })
    }

    const config = useRuntimeConfig(event)
    if (!config.senderApiToken || !config.contactFromEmail || !config.contactToEmail) {
        throw createError({ statusCode: 503, statusMessage: 'The contact service is not configured yet. Please email me directly.' })
    }

    const text = `New portfolio message\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`
    const html = `<h1>New portfolio message</h1><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`

    try {
        await $fetch('https://api.sender.net/v2/message/send', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${config.senderApiToken}`,
                Accept: 'application/json'
            },
            body: {
                from: { email: config.contactFromEmail, name: config.contactFromName || 'Portfolio contact form' },
                to: { email: config.contactToEmail },
                subject: `Portfolio: ${subject}`,
                text,
                html,
                headers: { 'Reply-To': `${name} <${email}>` }
            },
            timeout: 10_000
        })
    } catch (error) {
        console.error('Sender contact failure', error?.status || error?.name)
        throw createError({ statusCode: 502, statusMessage: 'The message did not go through. Try again in a minute, or email me directly.' })
    }

    return { success: true, message: 'Message sent. I will reply soon.' }
})
