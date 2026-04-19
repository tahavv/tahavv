// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    receiverEmail: process.env.RECEIVER_EMAIL,
    smtpSecure: process.env.SMTP_SECURE,
    smtpRequireTls: process.env.SMTP_REQUIRE_TLS,
    smtpConnectionTimeout: process.env.SMTP_CONNECTION_TIMEOUT,
    smtpGreetingTimeout: process.env.SMTP_GREETING_TIMEOUT,
    smtpSocketTimeout: process.env.SMTP_SOCKET_TIMEOUT,
    smtpSendTimeout: process.env.SMTP_SEND_TIMEOUT,
    mailtrapToken: process.env.MAILTRAP_TOKEN,
    mailtrapSandbox: process.env.MAILTRAP_SANDBOX,
    mailtrapTestInboxId: process.env.MAILTRAP_TEST_INBOX_ID,
    public: {},
  },
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "nuxt-icon",
    "@nuxtjs/google-fonts",
    "nuxt-headlessui",
    "@nuxtjs/color-mode",
  ],
  app: {
    baseURL: "/",
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      title: "Taha Ayari | Software Engineer | Cloud & Platform",
      meta: [
        {
          name: "description",
          content:
            "Portfolio of Taha Ayari, Software Engineer focused on Cloud & Platform systems. Discover my projects, experience in Kubernetes, Docker, and full-stack development.",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#0f172a" },
        {
          name: "keywords",
          content:
            "Software Engineer, Cloud Engineer, Platform Engineer, DevOps, Kubernetes, Docker, Jenkins, Angular, Spring Boot, GCP, Nuxt",
        },
        { property: "og:title", content: "Taha Ayari | Software Engineer | Cloud & Platform" },
        {
          property: "og:description",
          content:
            "Software Engineer building scalable web platforms, cloud-native deployments, and reliable CI/CD systems.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://tahaayari.dev" },
        { property: "og:image", content: "https://tahaayari.dev/images/taha.jpeg" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Taha Ayari | Software Engineer" },
        { name: "twitter:description", content: "Portfolio and projects of Taha Ayari." }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
  },
  googleFonts: {
    families: {
      Outfit: [300, 400, 500, 600, 700],
      'Plus+Jakarta+Sans': [400, 500, 600, 700],
    },
    display: "swap",
  },
  colorMode: {
    classSuffix: "",
    preference: "dark",
    fallback: "light",
  },
  css: ["~/assets/css/main.css"],
  tailwindcss: {
    cssPath: "~/assets/css/main.css",
    configPath: "tailwind.config.js",
  },
});
