# AGENTS.md

## Purpose

See `README.md` for the product context. This file covers architectural and implementation guidance.

## Product direction

Lirio is meant to feel like a mobile-first music app, with the clarity and polish people expect from strong iOS music apps. The interface should be fast, tactile, and visually calm, with artwork-forward browsing, player-oriented layouts, restrained typography, and warm, ambient surfaces that feel closer to a premium listening client than an admin tool.

When new UI is added, it should feel like part of a music app, not like a default Rails admin surface.

Transitions and motion should be web-native rather than imitations of iOS navigation. Avoid full-page pseudo-native slides. Prefer the browser's default View Transition behavior with minimal customization, and only add explicit transition styling when it solves a specific problem or supports focused shared-element continuity such as album artwork.

## Target architecture

- Rails is the coordination plane
  - persists library data
  - renders browse/detail pages
  - accepts sync payloads
  - works in tight integration with Stimulus for interaction-heavy flows
- the bridge sidecar is the transport boundary
  - Navidrome auth and proxying
  - future LAN/native transport adaptation
- Caddy sits in front of the app to provide one-origin routing

Do not casually collapse this into a server-only Rails app. That would move the project away from the intended architecture.

## Editing guidance

### App

- Keep the Rails and Stimulus layers tightly integrated around persistence, rendering, and interactive behavior.
- Prefer plain Rails models, controllers, and small mediator objects over over-engineered abstractions.
- Use Stimulus for page behavior rather than treating the frontend as a separate SPA.

### Bridge

- Keep the bridge thin and dependency-light.
- Treat it as the stable app-facing boundary for upstream and future LAN/native communication.
- Avoid designs that force browser clients to own sensitive upstream credentials long-term.

## Style

When an HTML tag has multiple attributes, put each attribute on its own line indented two spaces. Order attributes as follows:

1. Structural — id, type, name, href, src, for, action, method
2. Stimulus/data — data-controller, data-action, data-`*`-target, data-`*`-value
3. Content — alt, title, placeholder, value
4. Behavioral — loading, autocomplete, required, disabled
5. class — always last
