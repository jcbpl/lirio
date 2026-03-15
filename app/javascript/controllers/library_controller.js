import { Controller } from "@hotwired/stimulus"
import { FetchRequest } from "@rails/request.js"
import { getAlbums, BridgeError } from "lib/bridge"

let synced = false

export default class extends Controller {
  static values = { synced: Boolean, recentIds: Array, sourceId: String }
  static targets = ["reconnectPrompt"]

  connect() {
    if (!this.sourceIdValue) {
      if (this.hasReconnectPromptTarget) {
        this.reconnectPromptTarget.classList.remove("hidden")
      }
      return
    }

    if (!synced) {
      synced = true
      this.runSync()
    }
  }

  refresh() {
    if (!this.sourceIdValue) return
    this.runSync()
  }

  async runSync() {
    try {
      const knownIds = new Set(this.recentIdsValue)

      // Page through Navidrome newest albums
      const batchSize = 50
      let offset = 0
      let foundOverlap = false

      while (!foundOverlap) {
        const albums = await getAlbums(this.sourceIdValue, {
          type: "newest",
          size: batchSize,
          offset,
        })

        if (albums.length === 0) break

        // Check for overlap
        const newAlbums = []
        for (const album of albums) {
          if (knownIds.has(album.external_id)) {
            foundOverlap = true
            break
          }
          newAlbums.push(album)
        }

        if (newAlbums.length > 0) {
          const request = new FetchRequest("post", "/albums", {
            body: JSON.stringify({ albums: newAlbums }),
            responseKind: "turbo-stream",
          })
          await request.perform()
        }

        if (foundOverlap || albums.length < batchSize) break
        offset += batchSize
      }

      // If this is the first sync (no albums known yet), do a full alphabetical sync
      if (!this.syncedValue && knownIds.size === 0) {
        const allAlbums = await getAlbums(this.sourceIdValue)
        if (allAlbums.length > 0) {
          const request = new FetchRequest("post", "/albums", {
            body: JSON.stringify({ albums: allAlbums }),
            responseKind: "turbo-stream",
          })
          await request.perform()
        }
      }
    } catch (error) {
      if (error instanceof BridgeError && ["unauthorized", "unavailable"].includes(error.code)) {
        if (this.hasReconnectPromptTarget) {
          this.reconnectPromptTarget.classList.remove("hidden")
        }
        return
      }
      console.error("Sync failed:", error)
    }
  }
}
