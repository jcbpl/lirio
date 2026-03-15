import { handleConfigure } from "./handlers/configure.js"
import { handleAlbums } from "./handlers/albums.js"
import { handleAlbum } from "./handlers/album.js"
import { handleCoverArt } from "./handlers/cover-art.js"

export function route(req, res, state) {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const path = url.pathname

  if (req.method === "GET" && path === "/health") {
    return json(res, 200, { status: "ok" })
  }

  if (req.method === "POST" && path === "/configure") {
    return handleBody(req, res, (body) => handleConfigure(body, res, state))
  }

  if (req.method === "POST" && path === "/albums") {
    return handleBody(req, res, (body) => handleAlbums(body, res, state))
  }

  if (req.method === "POST" && path === "/album") {
    return handleBody(req, res, (body) => handleAlbum(body, res, state))
  }

  const coverArtMatch = path.match(/^\/cover-art\/(.+)$/)
  if (req.method === "GET" && coverArtMatch) {
    return handleCoverArt(coverArtMatch[1], url.searchParams, res, state)
  }

  sendError(res, errors.notFound("Not found"))
}

export const errors = {
  badRequest: (message) => ({ status: 400, body: { error: { code: "bad_request", message } } }),
  unauthorized: (message) => ({ status: 401, body: { error: { code: "unauthorized", message } } }),
  notFound: (message) => ({ status: 404, body: { error: { code: "not_found", message } } }),
  internalServerError: (message) => ({ status: 500, body: { error: { code: "internal_server_error", message } } }),
  badGateway: (message) => ({ status: 502, body: { error: { code: "bad_gateway", message } } }),
}

export function sendError(res, err) {
  json(res, err.status, err.body)
}

function handleBody(req, res, handler) {
  let chunks = []
  req.on("data", (chunk) => chunks.push(chunk))
  req.on("end", async () => {
    try {
      const body = JSON.parse(Buffer.concat(chunks).toString())
      await handler(body)
    } catch (err) {
      if (err instanceof SyntaxError) {
        sendError(res, errors.badRequest("Invalid JSON"))
      } else {
        console.error("Handler error:", err)
        sendError(res, errors.internalServerError(err.message))
      }
    }
  })
}

export function json(res, status, data) {
  const body = JSON.stringify(data)
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  })
  res.end(body)
}
