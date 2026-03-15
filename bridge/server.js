import { createServer } from "node:http"
import { resolve } from "node:path"
import { loadState } from "./lib/state.js"
import { route } from "./lib/router.js"

const PORT = parseInt(process.env.BRIDGE_PORT || "3100", 10)
const STATE_PATH = resolve(import.meta.dirname, "../storage/bridge-state.json")

const state = loadState(STATE_PATH)

const server = createServer((req, res) => {
  route(req, res, state)
})

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Bridge listening on :${PORT}`)
})
