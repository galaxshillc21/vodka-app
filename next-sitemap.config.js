module.exports = {
  siteUrl: "https://blatvodka.com", // Updated to new domain
  generateRobotsTxt: false, // We manage robots.txt manually
  exclude: ["/*/admin", "/*/admin/*", "/*/admin-setup", "/*/auth", "/en/admin", "/es/admin", "/en/admin/*", "/es/admin/*", "/en/admin-setup", "/es/admin-setup", "/en/auth", "/es/auth", "/api/*"],
  transform: async (config, path) => {
    // Exclude admin paths with wildcards
    if (path.includes("/admin") || path.includes("/auth") || path.includes("/api/")) {
      return null;
    }

    return {
      loc: path, // Path without trailing slash
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  // Add more options if needed
};
