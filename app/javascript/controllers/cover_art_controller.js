import { Controller } from "@hotwired/stimulus"
import { buildCoverArtUrl } from "lib/bridge"

export default class extends Controller {
  static values = { sourceId: String }
  static targets = ["image", "fallback"]

  imageTargetConnected(img) {
    if (!this.sourceIdValue) return

    const coverArtId = img.dataset.coverArtId
    if (!coverArtId || img.src) return

    const size = img.dataset.size || "640"
    img.src = buildCoverArtUrl(this.sourceIdValue, coverArtId, parseInt(size, 10))
  }

  fadeIn({ target: img }) {
    img.classList.remove("opacity-0")
    const fallback = img.previousElementSibling
    if (fallback) fallback.classList.add("hidden")
  }
}
