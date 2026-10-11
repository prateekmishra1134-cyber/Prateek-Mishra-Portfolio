# Prateek Mishra — Portfolio

A responsive portfolio for Marketing & Data Analytics.

## Published website

The live portfolio is the self-contained root `index.html`. Its layout, styles, scripts, favicon, and CSS-based 3D hero are embedded in that file, so the site works when GitHub Pages publishes the repository root through its legacy/Jekyll source. It does not request Vite development modules or root-relative app assets.

The same `index.html` is included in Vite's production output. The GitHub Actions workflow builds and deploys `dist/`, so either GitHub Pages source mode serves the standalone site. No repository-specific asset prefix is needed by the self-contained page.

## Run and build locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Create and preview a production build:

```bash
npm run build
npm run preview
```

The production output is written to `dist/`. The existing React and Three.js implementation remains under `src/` for reference and future development; the deployed standalone page is maintained in the root `index.html`.

## Deploy

The `.github/workflows/deploy-pages.yml` workflow runs on pushes to `main`, builds the project, and deploys `dist/` through GitHub Actions. The Vite base path is configured as `/Prateek-Mishra-Portfolio/`.

The root page also remains compatible with GitHub Pages branch publishing. Keep all styles and scripts self-contained in `index.html`, or verify any new files use repository-relative paths before adding them.

## Update portfolio information

Edit the published content in `index.html`. The original structured portfolio data is preserved in `src/data/portfolio.js`; the React UI and procedural Three.js scene are preserved in `src/App.jsx` and `src/components/Scene.jsx`. If moving the deployed site back to the React implementation, ensure GitHub Pages uses the Actions source so it serves the Vite build from `dist/`.

