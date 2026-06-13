/** Escape a string for safe interpolation into HTML (e.g. email bodies). */
export function escapeHtml(input: unknown): string {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escape a string for safe interpolation into XML text (RSS/sitemap). */
export function escapeXml(input: unknown): string {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Neutralize a `]]>` sequence so it can't break out of a CDATA section. */
export function safeCdata(input: unknown): string {
  return String(input ?? "").replace(/]]>/g, "]]&gt;");
}

/**
 * Escape JSON before embedding in a <script type="application/ld+json"> block,
 * preventing a `</script>` (or HTML-comment) breakout.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
