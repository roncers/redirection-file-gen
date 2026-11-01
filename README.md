# redirection-file-gen

A lightweight web app that creates downloadable HTML files which redirect visitors
to a destination URL. The app is built with Vite, strict TypeScript, and native
Web Components; it has no runtime dependencies and keeps all input in your browser.

## Run locally

```sh
pnpm install
pnpm run dev
```

Enter a destination address, choose the `http://` or `https://` protocol, and
optionally rename the output file. The redirect page is generated as you type, so
there is no separate generate step. The download button stays available and is
enabled once the address is valid; the file is saved as `<name>.html` (default
`redirect.html`).

## Build

```sh
pnpm run build
pnpm run preview
```
