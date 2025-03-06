// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      RECEIVER_EMAIL: process.env.RECEIVER_EMAIL,
    },
    private: {
      SMTP_PASS: process.env.SMTP_PASS,
    },
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
      title: "Taha Ayari | Full Stack Developer",
      meta: [
        {
          name: "description",
          content:
            "Portfolio of Taha Ayari, a results-driven Full Stack Developer with expertise in Java, Angular, and Python",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "og:title", content: "Taha Ayari | Full Stack Developer" },
        {
          name: "og:description",
          content:
            "Portfolio of Taha Ayari, a results-driven Full Stack Developer with expertise in Java, Angular, and Python",
        },
        { name: "og:type", content: "website" },
        { name: "og:url", content: "https://tahaayari.dev" },
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
    preference: "dark", // default value of $colorMode.preference
    fallback: "light", // fallback value if not system preference found
  },
  css: ["~/assets/css/main.css"],
  tailwindcss: {
    cssPath: "~/assets/css/main.css",
    configPath: "tailwind.config.js",
  },
});
