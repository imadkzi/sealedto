const ARABIC = /[\u0600-\u06FF]/;

function escapeText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/** Keep only paragraphs, breaks, italic, and bold. */
export function sanitizeIntroHtml(input: string): string {
  const raw = (input ?? "").trim();
  if (!raw) return "";

  if (!/<[a-z][\s\S]*>/i.test(raw)) {
    return raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${escapeText(line)}</p>`)
      .join("");
  }

  const tokens = raw
    .replace(/\u00a0/g, " ")
    .match(/<\/?(?:p|div|br|em|i|strong|b)\b[^>]*>|[^<]+/gi);
  if (!tokens) return "";

  const out: string[] = [];
  for (const token of tokens) {
    const tag = token
      .match(/^<\/?(p|div|br|em|i|strong|b)\b/i)?.[1]
      ?.toLowerCase();
    if (!tag) {
      out.push(escapeText(decodeEntities(token)));
      continue;
    }
    const closing = token.startsWith("</");
    if (tag === "br") out.push("<br>");
    else if (tag === "p" || tag === "div") out.push(closing ? "</p>" : "<p>");
    else if (tag === "em" || tag === "i") out.push(closing ? "</em>" : "<em>");
    else if (tag === "strong" || tag === "b") {
      out.push(closing ? "</strong>" : "<strong>");
    }
  }

  let html = out
    .join("")
    .replace(/<p>\s*<\/p>/g, "")
    .trim();
  if (html && !/<p[\s>]/i.test(html)) html = `<p>${html}</p>`;
  return html;
}

export function introToPlainText(html: string) {
  return decodeEntities(
    sanitizeIntroHtml(html)
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim(),
  );
}

/** Classic tracked eyebrow — only for a single Latin line with no emphasis. */
export function introUsesClassicEyebrow(html: string) {
  const text = introToPlainText(html);
  if (!text || ARABIC.test(text) || text.includes("\n")) return false;
  return !/<(em|i|strong|b|br)\b/i.test(sanitizeIntroHtml(html));
}
