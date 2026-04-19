# Deploying This Portfolio on Railway

This project is configured for Nuxt 3 SSR deployment on Railway.

## 1) Prerequisites
- A Railway account
- This repository pushed to GitHub/GitLab/Bitbucket
- SMTP credentials if you want the contact form API to send emails

## 2) Create a New Railway Project
1. Open Railway dashboard.
2. Click **New Project**.
3. Choose **Deploy from GitHub repo** (or your connected provider).
4. Select this repository and target branch.

## 3) Confirm Build & Start Commands
Railway uses `railway.json` in this repo:
- Build command: `npm run build`
- Start command: `npm run start`

## 4) Configure Environment Variables
Set these in Railway project variables:

### Required for contact form email delivery
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `RECEIVER_EMAIL`

> **Important Railway plan limitation (SMTP):**
> Railway blocks outbound SMTP traffic on **Free**, **Trial**, and **Hobby** plans. This causes connection timeout errors with SMTP-based senders (for example Nodemailer using Gmail SMTP).
>
> Outbound SMTP is available only on **Pro** (and above). After upgrading, **re-deploy** your service so the networking policy is applied to your running instance.

### Optional SMTP timeout tuning (milliseconds)
- `SMTP_CONNECTION_TIMEOUT` (default: `5000`)
- `SMTP_GREETING_TIMEOUT` (default: `5000`)
- `SMTP_SOCKET_TIMEOUT` (default: `10000`)
- `SMTP_SEND_TIMEOUT` (default: `12000`, caps full send operation)

### Optional SMTP TLS behavior
- `SMTP_SECURE` (`true`/`false`, default inferred from port: `465 => true`, otherwise `false`)
- `SMTP_REQUIRE_TLS` (`true`/`false`, default: opposite of `SMTP_SECURE`)

If contact form requests fail with connection timeout errors:
- Verify `SMTP_HOST` and `SMTP_PORT` are correct for your provider.
- Use port `465` for implicit TLS or `587` for STARTTLS (secure is inferred automatically by port).
- For Gmail, if `587` is blocked by the runtime network, the API now retries once with implicit TLS on `465`.
- Confirm your runtime/network allows outbound TCP connections to your SMTP provider.

If you are on Free/Trial/Hobby (or still seeing SMTP timeouts on Pro), use a transactional email provider with an HTTPS API instead of SMTP. Recommended options:
- Resend
- SendGrid
- Mailgun
- Postmark

These API-based providers bypass SMTP egress restrictions and work across Railway plans.

If you are on Pro and SMTP still fails, SSH into your Railway service and test reachability to your SMTP host on ports:
- `25`
- `465`
- `587`
- `2525`

If ports are reachable from Railway but email still fails, your email provider may be blocking Railway IP ranges.

### Runtime defaults
- `NITRO_PORT` is provided by Railway automatically.
- `NODE_ENV=production` is recommended.

## 5) Deploy
1. Trigger deployment from Railway (or push to the configured branch).
2. Wait for build to complete.
3. Open the generated Railway domain and validate the site.

## 6) Post-Deploy Validation Checklist
- Homepage sections load: About, Experience, Projects, Certifications, Contact.
- Project detail pages load correctly.
- Dark mode toggle works.
- Contact form API works (if SMTP variables are configured).

## 7) Optional Custom Domain
1. Go to **Settings → Domains** in Railway.
2. Add custom domain (e.g., `portfolio.yourdomain.com`).
3. Configure DNS records as instructed by Railway.
