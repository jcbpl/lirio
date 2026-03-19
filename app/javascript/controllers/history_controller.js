import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  back(event) {
    if (!this.hasTurboHistory()) return

    event.preventDefault()
    window.history.back()
  }

  hasTurboHistory() {
    return (window.history.state?.turbo?.restorationIndex ?? 0) > 0
  }
}
