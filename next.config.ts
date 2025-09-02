import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withPWA from "next-pwa";

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./messages/en.json",
  },
});

// Compose plugins: first PWA, then NextIntl
const config: NextConfig = {};

export default withNextIntl(
  withPWA({
    ...config,
    pwa: {
      dest: "public",
      register: true,
      skipWaiting: true,
      // You can add more PWA options here if needed
    },
  })
);
