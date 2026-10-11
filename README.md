# Prateek Mishra — Portfolio

A responsive portfolio for Marketing & Data Analytics, published at [prateekmishra1134-cyber.github.io/Prateek-Mishra-Portfolio](https://prateekmishra1134-cyber.github.io/Prateek-Mishra-Portfolio/).

## Published website

GitHub Pages branch publishing serves the self-contained root `index.html`. Its styles and interaction scripts are embedded; the primary portrait is stored in `assets/prateek-mishra.jpeg` and referenced with a repository-relative URL. The page also builds as a Vite production site, and the existing GitHub Actions workflow deploys `dist/` when Pages is configured for Actions.

The original React and Three.js implementation remains in `src/` for future development. The published entry point is `index.html` so both current branch publishing and Actions output can serve a complete page.

## Run and build locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
npm run build
npm run preview
```

Vite's production base is configured for `/Prateek-Mishra-Portfolio/`. Keep public image references repository-relative in the root page so they work in both GitHub Pages publishing modes.
