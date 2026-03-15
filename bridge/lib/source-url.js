export function normalizeSourceUrl(sourceUrl) {
  let url

  try {
    url = new URL(sourceUrl)
  } catch {
    throw new Error("sourceUrl must be a valid URL")
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("sourceUrl must use http or https")
  }

  if (url.search || url.hash) {
    throw new Error("sourceUrl must not include a query string or fragment")
  }

  const pathname = url.pathname.replace(/\/+$/, "")
  url.pathname = pathname === "" ? "/" : pathname

  return `${url.origin}${url.pathname === "/" ? "" : url.pathname}`
}
