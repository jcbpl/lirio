export class BridgeError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

const errors = {
  unavailable: () => new BridgeError("unavailable", "Bridge unavailable"),
  invalidResponse: (message) => new BridgeError("invalid_response", message),
}

async function bridgeRequest(path, body) {
  const options = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
  let response

  try {
    response = await fetch(`/bridge${path}`, options)
  } catch {
    throw errors.unavailable()
  }

  const contentType = response.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    throw errors.invalidResponse("Bridge returned a non-JSON response")
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw errors.invalidResponse("Bridge returned invalid JSON")
  }

  if (data.error) throw new BridgeError(data.error.code, data.error.message)
  if (!response.ok) throw errors.invalidResponse("Bridge returned an invalid error response")
  return data
}

export async function configure(sourceUrl, username, password) {
  return bridgeRequest("/configure", { sourceUrl, username, password })
}

export async function getAlbums(sourceId, params = {}) {
  const data = await bridgeRequest("/albums", { sourceId, ...params })
  return data.albums
}

export async function getAlbum(sourceId, id) {
  const data = await bridgeRequest("/album", { sourceId, id })
  return { album: data.album, tracks: data.tracks }
}

export function buildCoverArtUrl(sourceId, coverArtId, size = 640) {
  return `/bridge/cover-art/${encodeURIComponent(coverArtId)}?source_id=${encodeURIComponent(sourceId)}&size=${size}`
}
