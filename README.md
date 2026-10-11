# Prateek Mishra — Portfolio

This repository contains the portfolio website published at the GitHub Pages project URL. The Vite production build uses `/Prateek-Mishra-Portfolio/` as its base path and is deployed from `dist` by `.github/workflows/deploy-pages.yml`.

The root `index.html` also preserves a progressively enhanced static fallback for branch-based Pages publishing. It loads the source React app only when built through Vite; on branch publishing the static document remains available, with an optional deferred Three.js enhancement. The photograph is the supplied portrait in `assets/prateek-mishra.jpeg`.

## Local development

Install dependencies with pnpm, then run `pnpm dev`. Create a production build with `pnpm build`.

## Deployment

GitHub Actions installs the locked dependencies, builds the Vite project, and publishes `dist` to Pages. For a local production preview, run `pnpm preview` after building.
