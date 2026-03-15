# Lirio

Lirio is a music client for browsing a personal library and directing playback to local devices.

## Motivation

There is a lot of good software for hosting and listening to a personal music library, but few self-hosted options integrate as well as streaming services with local-network speakers and receivers. Hardware-specific apps may be able to access local music, but they're limited to a single ecosystem and often don't know about playlists or favorites in self-hosted libraries.

Lirio aims to fill that gap: it syncs your local music library and provides server-side coordination between your speakers and devices, without any vendor lock-in.

## Requirements

The first version of Lirio requires Navidrome or an equivalent Subsonic-compatible library, and connects to UPnP renderers, such as WiiM speakers, on your local network. Future versions may support other servers and renderers.

## Development

Run `bin/setup --skip-server` to install dependencies. `bin/dev` runs Rails, Tailwind builds, and a Node server to proxy the local network.

Docker is required to run Caddy, which provides same-origin routing for the Rails and Node servers in development.