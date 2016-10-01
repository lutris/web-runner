Web runner for [Lutris](https://lutris.net/)
===

Launch web pages as standalone apps. Can be used outside of Lutris. Uses [Electron](http://electron.atom.io/).

This is a work in progress
---

Build
---
For building you need to install [Node.JS](https://nodejs.org/), GNU Make and curl.

```
npm install
make # builds for current architecture
```
This will download electron and flash player and build to `build/web-ARCH/`. You can pass architecture to make or run `make all` to build for all supported architectures.

Usage
---
During development you can start the app with `npm run electron -- <url> [flags]`. You need to install electron either system wide or locally with `npm install electron`.

Example: `npm run electron -- https://lutris.net --name Lutris --maximize-window --open-links`

You can also do this to run a built app:

```
build/web-ARCH/launch.sh <url> [flags]
ENABLE_FLASH_PLAYER=1 build/web-ARCH/electron/electron build/web-ARCH/runner.asar <url> [flags]
```
