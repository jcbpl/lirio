import { json, errors, sendError } from "../router.js"
import { subsonicRequest } from "../navidrome/client.js"
import { normalizeSourceUrl } from "../source-url.js"

export async function handleConfigure(body, res, state) {
  const { sourceUrl, username, password } = body

  if (!sourceUrl || !username || !password) {
    return sendError(res, errors.badRequest("sourceUrl, username, and password are required"))
  }

  let normalizedSourceUrl
  try {
    normalizedSourceUrl = normalizeSourceUrl(sourceUrl)
  } catch (err) {
    return sendError(res, errors.badRequest(err.message))
  }

  try {
    // Validate credentials by pinging Navidrome
    await subsonicRequest({ username, password }, normalizedSourceUrl, "ping")
  } catch (err) {
    return sendError(res, errors.unauthorized(err.message))
  }

  const source = state.configureSource(normalizedSourceUrl, username, password)
  json(res, 200, { ok: true, sourceId: source.id, sourceUrl: source.url })
}
