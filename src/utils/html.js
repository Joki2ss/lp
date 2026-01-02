export function stripHtml(html) {
  if (!html) return '';
  // Remove tags and decode the most common entities.
  const text = String(html)
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\s*\/p\s*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'");
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

export function wrapHtmlDocument({ title, bodyHtml }) {
  const safeTitle = escapeHtml(title || '');
  return `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charset="utf-8" />
      <title>${safeTitle}</title>
      <style>
        body { font-family: -apple-system, Segoe UI, Roboto, Arial; padding: 24px; color: #111; }
        h1,h2,h3 { margin: 0 0 12px; }
        p { margin: 0 0 10px; line-height: 1.45; }
        ul,ol { margin: 0 0 10px 22px; }
        a { color: #1a56db; }
      </style>
    </head>
    <body>
      <h1>${safeTitle}</h1>
      ${bodyHtml || '<p></p>'}
    </body>
  </html>
  `.trim();
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
