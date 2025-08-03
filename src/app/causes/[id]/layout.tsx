import { Metadata } from "next";
import { Database } from "@/lib/database";
import { notFound } from "next/navigation";

interface CauseLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

async function getCauseMetadata(id: string) {
  try {
    const causeQuery = `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.short_description,
        c.image,
        c.location,
        c.created_at,
        c.status,
        u.name as user_name,
        cat.name as category_name,
        cat.display_name as category_display_name
      FROM causes c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.id = ? AND c.status = 'active'
    `;

    const [cause] = (await Database.query(causeQuery, [id])) as any[];
    return cause;
  } catch (error) {
    console.error("Error fetching cause metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cause = await getCauseMetadata(id);

  if (!cause) {
    return {
      title: "Cause Not Found | Hands2gether",
      description: "The requested cause could not be found.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const causeUrl = `${baseUrl}/causes/${id}`;
  const imageUrl = cause.image
    ? cause.image.startsWith("http")
      ? cause.image
      : `${baseUrl}${cause.image}`
    : `${baseUrl}/images/logo2.png`; // Fallback to H2G logo

  const title = `${cause.title} | Hands2gether`;
  const description =
    cause.short_description ||
    cause.description?.substring(0, 160) + "..." ||
    `Help support ${cause.title} in ${cause.location}. Join the Hands2gether community.`;

  const extendedDescription = `${description} | ${cause.supporter_count} supporters • ${cause.location}`;

  return {
    title,
    description: extendedDescription,
    keywords: [
      "charity",
      "donation",
      "help",
      "community",
      "support",
      cause.category_display_name || cause.category_name,
      cause.location,
      "hands2gether",
      "social impact",
    ],
    authors: [{ name: cause.user_name }],
    creator: cause.user_name,
    publisher: "Hands2gether",
    category: cause.category_display_name || cause.category_name,

    // Open Graph (Facebook, WhatsApp, LinkedIn)
    openGraph: {
      type: "website",
      url: causeUrl,
      title,
      description: extendedDescription,
      siteName: "Hands2gether",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${cause.title} - Hands2gether`,
          type: "image/jpeg",
        },
        {
          url: `${baseUrl}/images/logo2.png`,
          width: 400,
          height: 400,
          alt: "Hands2gether Logo",
          type: "image/png",
        },
      ],
      locale: "en_US",
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      site: "@hands2gether",
      creator: `@${cause.user_name?.replace(/\s+/g, "").toLowerCase()}`,
      title,
      description: extendedDescription,
      images: [imageUrl],
    },

    // Additional meta tags
    other: {
      // WhatsApp specific (uses Open Graph)
      "og:image:width": "1200",
      "og:image:height": "630",

      // Telegram
      "telegram:channel": "@hands2gether",

      // Pinterest
      "pinterest-rich-pin": "true",

      // LinkedIn
      "linkedin:owner": "hands2gether",

      // Additional structured data
      "article:author": cause.user_name,
      "article:published_time": cause.created_at,
      "article:section": cause.category_display_name || cause.category_name,
      "article:tag": `charity,donation,${cause.category_name},${cause.location}`,

      // App-specific
      "al:web:url": causeUrl,
      "al:ios:url": `hands2gether://causes/${id}`,
      "al:android:url": `hands2gether://causes/${id}`,
      "al:ios:app_name": "Hands2gether",
      "al:android:app_name": "Hands2gether",

      // Rich snippets
      "og:rich_attachment": "true",
      "og:see_also": `${baseUrl}/causes`,

      // Additional social media optimization
      "fb:app_id": process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
      "twitter:app:name:iphone": "Hands2gether",
      "twitter:app:name:ipad": "Hands2gether",
      "twitter:app:name:googleplay": "Hands2gether",

      // Custom meta for sharing stats
      "cause:id": id,
      "cause:category": cause.category_name,
      "cause:location": cause.location,
      "cause:supporters": cause.supporter_count?.toString() || "0",
    },

    // Robots
    robots: {
      index: cause.status === "active",
      follow: true,
      googleBot: {
        index: cause.status === "active",
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Verification
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      other: {
        "facebook-domain-verification":
          process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION || "",
      },
    },
  };
}

export default async function CauseLayout({
  children,
  params,
}: CauseLayoutProps) {
  const { id } = await params;
  const cause = await getCauseMetadata(id);

  if (!cause) {
    notFound();
  }

  return (
    <>
      {/* JSON-LD Structured Data for Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DonateAction",
            object: {
              "@type": "Cause",
              name: cause.title,
              description: cause.description,
              image: cause.image,
              url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/causes/${id}`,
              location: {
                "@type": "Place",
                name: cause.location,
              },
              organizer: {
                "@type": "Person",
                name: cause.user_name,
              },
              category: cause.category_display_name || cause.category_name,
              dateCreated: cause.created_at,
              status: cause.status,
            },
            participant: {
              "@type": "Organization",
              name: "Hands2gether",
              url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
              logo: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/images/logo2.png`,
            },
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/causes/${id}`,
            },
          }),
        }}
      />
      {children}
    </>
  );
}
