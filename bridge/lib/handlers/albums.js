import { json, errors, sendError } from "../router.js"
import { getAlbumList2 } from "../navidrome/client.js"

export async function handleAlbums(body, res, state) {
  const { sourceId, type, size, offset } = body

  if (!sourceId) {
    return sendError(res, errors.badRequest("sourceId is required"))
  }

  const source = state.getSource(sourceId)
  const credentials = source && { username: source.username, password: source.password }
  if (!credentials) {
    return sendError(res, errors.unauthorized("No credentials configured for this source"))
  }

  try {
    const albums = await getAlbumList2(credentials, source.url, { type, size, offset })
    json(res, 200, { albums })
  } catch (err) {
    sendError(res, errors.badGateway(err.message))
  }
}
