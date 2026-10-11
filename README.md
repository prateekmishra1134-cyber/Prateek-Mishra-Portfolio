# Prateek Mishra — Portfolio

The React portfolio is the published website. It uses Vite, React Three Fiber, Three.js and Framer Motion. The supplied portrait is stored at `assets/prateek-mishra.jpeg`.

## Local development

Install dependencies with pnpm, then run `pnpm dev`. Vite opens `/app.html`, the clean React source entry. Create a production build with `pnpm build`; `pnpm preview` serves the generated production site.

## GitHub Pages

The project base path is `/Prateek-Mishra-Portfolio/`. The GitHub Actions workflow builds the React app using the clean `app.html` entry template. It publishes the Vite output to the branch root as well as the Actions Pages artifact. Publishing the generated output at the root keeps the site correct if Pages is configured for branch-based publishing; the generated root `index.html` is not the application source.

The portfolio contact email is `prateekmishra139@gmail.com`; it is defined once in `src/data/portfolio.js` and used by the contact and footer links.
