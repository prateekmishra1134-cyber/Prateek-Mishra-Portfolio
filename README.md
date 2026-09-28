# Prateek Mishra — Portfolio

A responsive portfolio for Marketing & Data Analytics. The site uses React and Vite, with a procedural Three.js hero visual and CSS fallbacks for reduced motion and devices without WebGL.

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The deployable files are written to `dist/`.

## Deploy

### GitHub Pages

The included `.github/workflows/deploy-pages.yml` workflow builds and deploys the site whenever changes are pushed to `main`. It configures GitHub Pages to use Actions, sets the repository base path, and publishes `dist/`. The repository path is configured through `VITE_BASE_PATH` in the workflow.

To run a Pages-compatible build locally, set `VITE_BASE_PATH=/Prateek-Mishra-Portfolio/` before running `npm run build`.

### Vercel

Import the repository into Vercel. Use `npm run build` as the build command and `dist` as the output directory. Vercel detects Vite automatically in most setups.

## Update portfolio information

Edit `src/data/portfolio.js` to update the profile, experience, education, skills, certifications, achievements, languages, and interests. Add real profile URLs to `LINKEDIN_URL` and `GITHUB_URL` at the top of that file; both are blank by default.

The UI components are in `src/App.jsx`, the procedural 3D visuals are in `src/components/Scene.jsx`, and global styles are in `src/styles.css`.

