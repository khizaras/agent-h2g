import React from "react";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";

const SEO = ({
  title,
  description,
  keywords,
  author = "Hands2gether",
  type = "website",
  image = "https://hands2gether.org/og-image.jpg",
  url,
  schemaData,
}) => {
  const siteTitle = `${title} | Hands2gether`;
  const canonicalUrl = `https://hands2gether.org${url}`;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph meta tags */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured data */}
      {schemaData && (
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      )}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.string,
  author: PropTypes.string,
  type: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string.isRequired,
  schemaData: PropTypes.object,
};

export default SEO;
