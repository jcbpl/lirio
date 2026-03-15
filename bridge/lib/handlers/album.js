import { json, errors, sendError } from "../router.js"
import { getAlbum } from "../navidrome/client.js"

export async function handleAlbum(body, res, state) {
  const { sourceId, id } = body

  if (!sourceId || !id) {
    return sendError(res, errors.badRequest("sourceId and id are required"))
  }

  const source = state.getSource(sourceId)
  const credentials = source && { username: source.username, password: source.password }
  if (!credentials) {
    return sendError(res, errors.unauthorized("No credentials configured for this source"))
  }

  try {
    const { album, tracks } = await getAlbum(credentials, source.url, id)
    json(res, 200, { album, tracks })
  } catch (err) {
    sendError(res, errors.badGateway(err.message))
  }
}
