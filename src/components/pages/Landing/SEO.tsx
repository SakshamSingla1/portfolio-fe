import { Helmet } from 'react-helmet-async';

interface SEOProps {
  ogImageUrl?: string;
}

const SITE_NAME = 'Portfolios Builder';
const DEFAULT_TITLE = 'Portfolios Builder — Your portfolio, fully managed.';
const DEFAULT_DESCRIPTION =
  'A three-app platform — admin dashboard, REST API, and public portfolio — to manage your entire professional story without touching code. Self-hosted, JWT-secured, Cloudinary CDN.';
const DEFAULT_OG_IMAGE = '/pb-logo.png';

const SEO = ({ ogImageUrl }: SEOProps) => {
  const ogImage = ogImageUrl ?? DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{DEFAULT_TITLE}</title>
      <meta name="description" content={DEFAULT_DESCRIPTION} />
      <meta name="robots" content="index, follow" />
      <meta name="keywords" content="portfolio builder, developer portfolio, self-hosted portfolio, CMS portfolio, Spring Boot, React portfolio" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={DEFAULT_TITLE} />
      <meta property="og:description" content={DEFAULT_DESCRIPTION} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="Portfolios Builder — manage your professional story from one place" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={DEFAULT_TITLE} />
      <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Portfolios Builder" />

      {/* Theme */}
      <meta name="theme-color" content="#14B8A0" />

      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/pb-logo-icon.png" />
    </Helmet>
  );
};

export default SEO;
