import { createHash, randomBytes } from "node:crypto"

const CLIENT_INFO = { v: "1.16.1", c: "lirio", f: "json" }

function md5(input) {
  return createHash("md5").update(String(input)).digest("hex")
}

function createAuthParams(credentials, params = {}) {
  const salt = randomBytes(6).toString("hex")
  const token = md5(`${credentials.password}${salt}`)
  const searchParams = new URLSearchParams({
    u: credentials.username,
    t: token,
    s: salt,
    ...CLIENT_INFO,
  })
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value))
    }
  }
  return searchParams
}

function getResponsePayload(json) {
  const payload = json?.["subsonic-response"]
  if (!payload) throw new Error("Invalid OpenSubsonic response")
  if (payload.status !== "ok") {
    throw new Error(payload.error?.message || "Navidrome request failed")
  }
  return payload
}

export async function subsonicRequest(credentials, navidromeUrl, endpoint, params = {}) {
  const searchParams = createAuthParams(credentials, params)
  const url = `${navidromeUrl}/rest/${endpoint}.view?${searchParams}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Navidrome request failed: ${response.status}`)
  }
  return getResponsePayload(await response.json())
}

export async function getCoverArtResponse(credentials, navidromeUrl, coverArtId, size) {
  const searchParams = createAuthParams(credentials, { id: coverArtId, size })
  const url = `${navidromeUrl}/rest/getCoverArt.view?${searchParams}`
  return fetch(url)
}

export async function getAlbumList2(credentials, navidromeUrl, { type = "alphabeticalByName", size = 500, offset = 0 } = {}) {
  const payload = await subsonicRequest(credentials, navidromeUrl, "getAlbumList2", { type, size, offset })
  const albums = payload.albumList2.album
  return albums.map(({ id, name, artist, year, coverArt, songCount, duration }) => ({
    external_id: id,
    title: name,
    sort_title: name.toLocaleLowerCase(),
    artist,
    year,
    cover_art_id: coverArt,
    song_count: songCount,
    duration_seconds: duration,
  }))
}

export async function getAlbum(credentials, navidromeUrl, id) {
  const payload = await subsonicRequest(credentials, navidromeUrl, "getAlbum", { id })
  const album = payload.album
  const tracks = album.song
    .sort((a, b) => a.track - b.track)
    .map(({ id, title, artist, track, duration }) => ({
      external_id: id,
      title,
      artist,
      track_number: track,
      duration_seconds: duration,
    }))
  return { album: { external_id: album.id }, tracks }
}
