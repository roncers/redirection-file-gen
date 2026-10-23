export function createRedirectDocument(destination: string): string {
  let url: URL;

  try {
    url = new URL(destination.trim());
  } catch {
    throw new Error("Enter a valid destination address, like example.com/your-page.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Use a destination that starts with https:// or http://.");
  }

  const safeUrl = escapeAttribute(url.href);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0; url=${safeUrl}">
    <title>Redirecting…</title>
    <link rel="canonical" href="${safeUrl}">
  </head>
  <body>
    <p>Redirecting to <a href="${safeUrl}">${safeUrl}</a>…</p>
  </body>
</html>
`;
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
