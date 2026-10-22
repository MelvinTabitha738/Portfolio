# Melvin Tabitha — Portfolio

Personal portfolio of **Melvin Tabitha**, a software developer based in Kenya. Built as a static site with vanilla HTML, CSS and JavaScript. No frameworks, no build step. The site opens the same way whether you serve it over HTTP or just double-click `index.html`.

Live site: https://melvintabitha.vercel.app/

## What's inside

- A landing page with the usual sections: hero, projects, skills, services, about, CV and contact.
- Case-study pages for selected projects (Anga Weather, StudyBuddy).
- A `/projects` index page.
- A custom 404 page.
- A `cv/` folder with a downloadable CV and a one-page resume (both PDF).
- SEO basics: canonical URL, sitemap, robots, structured data, Open Graph tags.

## Features

- **Light and dark themes.** Dark by default. The chosen theme is applied before paint (so no flash) and stored in `localStorage`.
- **Responsive layout.** Mobile nav drawer at narrow widths. Grids reflow down to 320px without horizontal overflow.
- **Software-themed background.** A subtle code-rain effect in the hero that fades out behind the content and hides on small screens.
- **Procedural keyboard-click sound.** Generated with the Web Audio API after the first user interaction (click, keypress or touch). No audio files loaded.
- **Accessible defaults.** Skip-link, semantic landmarks, visible focus states, ARIA on interactive controls, `prefers-reduced-motion` respected for animations.

## Tech stack

- HTML5
- CSS3 (custom properties, grid, container queries where useful, no preprocessors)
- Vanilla JavaScript (ES2020, no bundler)
- Deployed on Vercel

## Project structure

```
.
├── index.html              # Home
├── 404.html                # Not-found page
├── assets/                 # Favicon, fonts, images, OG image
├── css/
│   └── main.css            # Single stylesheet
├── js/
│   ├── main.js             # Theme toggle, nav, code-rain, sound engine
│   └── terminal.js         # Terminal panel behaviour
├── projects/
│   ├── index.html          # Projects index
│   ├── anga-weather/       # Case study: Anga Weather
│   └── studybuddy/         # Case study: StudyBuddy
├── cv/
│   ├── Melvin-Tabitha-CV.pdf
│   └── Melvin-Tabitha-Resume.pdf
├── robots.txt
├── sitemap.xml
└── vercel.json             # Headers, cache rules, routing
```

## Running locally

The site is fully static, so there is nothing to install.

**Option 1: open the file directly.** Double-click `index.html`. Works offline.

**Option 2: a tiny local server (recommended for testing routes).**

```bash
# Python 3
python -m http.server 8000

# Node (if you have it)
npx serve .
```

Then visit `http://localhost:8000`.

## Deployment

The repository is wired for Vercel. The `vercel.json` file sets:

- Clean URLs and trailing slashes
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`)
- A one-year immutable cache on `/assets/*`

Any static host (GitHub Pages, Netlify, Cloudflare Pages) will work equally well.

## Browser support

Tested on current Chrome, Firefox, Safari and Edge. Degrades gracefully on older browsers: themes, layout and content work without JavaScript; the code-rain and sound engine are progressive enhancements.

## Contact

- Site: https://melvintabitha.vercel.app/
- GitHub: https://github.com/MelvinTabitha738
- LinkedIn: https://www.linkedin.com/in/melvin-tabitha-5abb782a2/

## License

Code in this repository is released under the MIT License. The written content, CV, resume and personal branding (name, photographs, logos) are not covered by that license and remain the property of Melvin Tabitha.
