import { errors, sendError } from "../router.js"
import { getCoverArtResponse } from "../navidrome/client.js"

export async function handleCoverArt(coverArtId, searchParams, res, state) {
  const sourceId = searchParams.get("source_id")
  const size = searchParams.get("size") || "640"

  if (!sourceId) {
    return sendError(res, errors.badRequest("source_id query parameter is required"))
  }

  const source = state.getSource(sourceId)
  const credentials = source && { username: source.username, password: source.password }
  if (!credentials) {
    return sendError(res, errors.unauthorized("No credentials configured for this source"))
  }

  try {
    const upstream = await getCoverArtResponse(credentials, source.url, coverArtId, size)

    if (!upstream.ok) {
      res.writeHead(upstream.status)
      res.end()
      return
    }

    const headers = {
      "Cache-Control": "public, max-age=86400, immutable",
    }

    const contentType = upstream.headers.get("content-type")
    if (contentType) headers["Content-Type"] = contentType

    const contentLength = upstream.headers.get("content-length")
    if (contentLength) headers["Content-Length"] = contentLength

    res.writeHead(200, headers)

    const reader = upstream.body.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(value)
    }
    res.end()
  } catch (err) {
    sendError(res, errors.badGateway(err.message))
  }
}
