import { Controller } from "@hotwired/stimulus"
import { FetchRequest } from "@rails/request.js"
import { configure, getAlbums } from "lib/bridge"

export default class extends Controller {
  static targets = ["sourceUrl", "username", "password", "error", "submitButton"]

  async submit(event) {
    event.preventDefault()

    const sourceUrl = this.sourceUrlTarget.value.trim()
    const username = this.usernameTarget.value.trim()
    const password = this.passwordTarget.value
    if (!sourceUrl || !username || !password) {
      this.showError("Navidrome URL, username, and password are required.")
      return
    }

    this.submitButtonTarget.disabled = true
    this.submitButtonTarget.textContent = "Connecting..."
    this.hideError()

    try {
      // Configure bridge with credentials (validates against Navidrome)
      const { sourceId, sourceUrl: normalizedSourceUrl } = await configure(sourceUrl, username, password)

      // Create the library server-side
      const form = this.element.querySelector("form") || this.element
      const formData = new FormData(form)

      const request = new FetchRequest("post", "/libraries", {
        body: JSON.stringify({
          library: {
            name: formData.get("library[name]") || "My Library",
            source_id: sourceId,
            source_url: normalizedSourceUrl,
          },
        }),
      })
      const response = await request.perform()

      if (!response.ok && !response.redirected) {
        throw new Error("Failed to create library")
      }

      // Run first sync
      const albums = await getAlbums(sourceId)
      if (albums.length > 0) {
        const albumRequest = new FetchRequest("post", "/albums", {
          body: JSON.stringify({ albums }),
          responseKind: "turbo-stream",
        })
        await albumRequest.perform()
      }

      window.Turbo.visit("/")
    } catch (error) {
      this.showError(error.message || "Connection failed. Check your credentials and try again.")
      this.submitButtonTarget.disabled = false
      this.submitButtonTarget.textContent = "Connect"
    }
  }

  showError(message) {
    this.errorTarget.textContent = message
    this.errorTarget.classList.remove("hidden")
  }

  hideError() {
    this.errorTarget.classList.add("hidden")
  }
}
