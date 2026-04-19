// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    receiverEmail: process.env.RECEIVER_EMAIL,
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
            "Portfolio of Taha Ayari, Software Engineer focused on Cloud & Platform systems, CI/CD delivery, observability, and production web applications.",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "keywords",
          content:
            "Software Engineer, Cloud Engineer, Platform Engineer, DevOps, Kubernetes, Docker, Jenkins, Angular, Spring Boot, GCP",
        },
        { property: "og:title", content: "Taha Ayari | Software Engineer | Cloud & Platform" },
        {
          property: "og:description",
          content:
            "Software Engineer building scalable web platforms, cloud-native deployments, and reliable CI/CD systems.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://tahaayari.dev" },
      ],
    },
  },
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      Poppins: [400, 500, 600, 700],
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
