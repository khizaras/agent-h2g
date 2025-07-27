/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  exclude: [
    "/api/*",
    "/auth/*",
    "/admin/*",
    "/profile/*",
    "/causes/create",
    "/server-sitemap.xml",
  ],
  additionalPaths: async (config) => [
    await config.transform(config, "/causes"),
    await config.transform(config, "/education"),
    await config.transform(config, "/impact"),
    await config.transform(config, "/about"),
    await config.transform(config, "/contact"),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/admin/",
          "/profile/",
          "/causes/create",
          "/_next/",
          "/static/",
        ],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/server-sitemap.xml`,
    ],
  },
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: false,
  // Transform function to customize URLs
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
