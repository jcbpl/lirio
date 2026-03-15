import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { randomUUID } from "node:crypto"
import { dirname } from "node:path"

export function loadState(filePath) {
  let data = { sources: {} }

  try {
    data = JSON.parse(readFileSync(filePath, "utf-8"))
  } catch {
    // File doesn't exist or is invalid—start fresh
  }

  if (!data.sources || typeof data.sources !== "object") {
    data.sources = {}
  }

  function persist() {
    mkdirSync(dirname(filePath), { recursive: true })
    writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", { mode: 0o600 })
  }

  return {
    getSource(sourceId) {
      const entry = data.sources[sourceId]
      if (!entry || !entry.url || !entry.username || !entry.password) return null
      return { id: sourceId, url: entry.url, username: entry.username, password: entry.password }
    },

    findSourceByUrl(sourceUrl) {
      const entry = Object.entries(data.sources).find(([, source]) => source?.url === sourceUrl)
      if (!entry) return null
      const [id, source] = entry
      if (!source.username || !source.password) return null
      return { id, url: source.url, username: source.username, password: source.password }
    },

    configureSource(sourceUrl, username, password) {
      const existing = this.findSourceByUrl(sourceUrl)
      const sourceId = existing?.id || randomUUID()
      data.sources[sourceId] = { url: sourceUrl, username, password }
      persist()
      return { id: sourceId, url: sourceUrl }
    },

  }
}
