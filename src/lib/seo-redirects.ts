
const CANONICAL_ORIGIN = (
  process.env.NEXT_PUBLIC_APP_URL || "https://manikantaketha.in"
).replace(/\/$/, "");

const canonicalHost = CANONICAL_ORIGIN.replace(/^https?:\/\//, "");
const nonCanonicalHost = canonicalHost.startsWith("www.")
  ? canonicalHost.slice(4)
  : `www.${canonicalHost}`;

export const GONE_NOTELOG_SLUGS = [
  "getting-started-with-version-control-an-intro-to-g-mg2ksyv86opp",
  "introduction-to-javascript-the-backbone-of-interac-mfqjhz9i7jx9",
  "what-is-responsive-web-design-and-why-is-it-import-mg2l5jliebm9",
  "introduction-to-react-building-dynamic-uis-made-ea-mfqjlq5o0gcz",
  "the-secret-coding-ritual-every-developer-must-perf-mfqk8lln1o7t",
  "the-3am-code-that-every-developer-writes-but-never-mfqkcqmhycem",
  "the-todo-app-every-developer-s-hello-world-on-ster-mfqk52ump53u",
  "how-to-structure-a-simple-web-page-using-html5-mg2kyfxjl9p9",
  "the-role-of-apis-in-modern-web-development-mg2l88k0i0sb",
  "what-is-web-security-https-vs-http-mg2kpcwhr4we",
  "introduction-to-next-js-building-scalable-react-ap-mfqjnhwwrvbc",
] as const;

type RedirectRule = {
  source: string;
  destination: string;
  permanent: boolean;
  has?: { type: "host"; value: string }[];
};


export function seoRedirects(): RedirectRule[] {
  const goneRedirects: RedirectRule[] = GONE_NOTELOG_SLUGS.map((slug) => ({
    source: `/notelogs/${slug}`,
    destination: `${CANONICAL_ORIGIN}/notelogs`,
    permanent: true,
  }));

  return [
    { source: "/blog", destination: `${CANONICAL_ORIGIN}/notelogs`, permanent: true },
    { source: "/blogs", destination: `${CANONICAL_ORIGIN}/notelogs`, permanent: true },
    { source: "/blog/:slug*", destination: `${CANONICAL_ORIGIN}/notelogs/:slug*`, permanent: true },
    { source: "/blogs/:slug*", destination: `${CANONICAL_ORIGIN}/notelogs/:slug*`, permanent: true },

    { source: "/login", destination: `${CANONICAL_ORIGIN}/sign-in`, permanent: true },
    { source: "/signup", destination: `${CANONICAL_ORIGIN}/sign-in`, permanent: true },

    { source: "/site.webmanifest", destination: `${CANONICAL_ORIGIN}/manifest.json`, permanent: true },
    { source: "/useUsers", destination: `${CANONICAL_ORIGIN}/`, permanent: true },

    ...goneRedirects,
    {
      source: "/:path*",
      has: [{ type: "host", value: nonCanonicalHost }],
      destination: `${CANONICAL_ORIGIN}/:path*`,
      permanent: true,
    },
  ];
}
