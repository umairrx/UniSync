import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
  url?: string;
  image?: string;
  twitterHandle?: string;
}

export function SEO({
  title,
  description = "Smart Course Scheduling System for students. autoTIMETABLE helps you manage your university courses and create the perfect weekly schedule in seconds.",
  name = "TIME",
  type = "website",
  url = "https://unisync.umairrx.dev",
  image = "/og-image.png",
  twitterHandle = "@autimetable",
}: SEOProps) {
  const siteTitle = title ? `${title} | ${name}` : name;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: name,
    url: url,
    description: description,
    applicationCategory: "Productivity",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: "Course Scheduling, Timetable Management, Conflict Detection, Export to Image",
  };

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={name} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}
