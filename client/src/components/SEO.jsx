import { Helmet } from "react-helmet-async";

const BASE_URL = "https://aktunotes.site";

export default function SEO({
  title = "AKTU Notes – Free Notes & PYQs for B.Tech Students",
  description = "AKTU Notes provides semester-wise B.Tech notes, previous year question papers (PYQs), and exam resources for Dr. A.P.J. Abdul Kalam Technical University students.",
  keywords = "AKTU notes, AKTU PYQ, AKTU previous year question papers, BTech notes AKTU, AKTU semester notes",
  path = "",
  type = "website",
  image = "/og-image.png",
}) {
  const url = `${BASE_URL}${path}`;
  const fullImage = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="AKTU Notes" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
    </Helmet>
  );
}
