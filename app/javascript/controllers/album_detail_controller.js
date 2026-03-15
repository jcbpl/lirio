import { Controller } from "@hotwired/stimulus"
import { FetchRequest } from "@rails/request.js"
import { getAlbum } from "lib/bridge"

export default class extends Controller {
  static values = { externalId: String, tracksSynced: Boolean, sourceId: String }
  static targets = ["trackList", "loadingState"]

  connect() {
    if (!this.tracksSyncedValue) {
      this.syncTracks()
    }
  }

  async syncTracks() {
    if (!this.sourceIdValue) return

    try {
      const { tracks } = await getAlbum(this.sourceIdValue, this.externalIdValue)

      const request = new FetchRequest("put", `/albums/${this.externalIdValue}/tracks`, {
        body: JSON.stringify({ tracks }),
        responseKind: "turbo-stream",
      })
      await request.perform()
    } catch (error) {
      console.error("Track sync failed:", error)
      if (this.hasLoadingStateTarget) {
        this.loadingStateTarget.innerHTML =
          '<p class="text-text-secondary text-sm">Failed to sync tracks. Refresh to retry.</p>'
      }
    }
  }
}
