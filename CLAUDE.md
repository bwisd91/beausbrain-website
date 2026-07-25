# beausbrain-website

Personal portfolio and thoughts site for Beau Wisdom — behavioral health professional and educator.

## Project structure

- `app/` — Next.js 15 app (primary codebase)
  - `components/` — Page sections: Header, Hero, About, Services, Thoughts, Credentials, Contact, Footer
  - `styles/` — globals.css, thoughts.css
  - `plastic-soldiers/` — Mini-game page
- `index.html` — Static fallback (legacy, not the main site)
- `plastic-soldiers.html` / `plastic-soldiers-game.js` — RTS mini-game

## Dev commands

```bash
npm install   # first time
npm run dev   # http://localhost:3000
npm run build # production build check
```

## Agent skills

Use `/dev` to start the dev server.
Use `/add-article` to publish a new Thoughts post.
Use `/update-bio` to update bio, services, credentials, or hero text.

## Content notes

- Articles live in `app/components/Thoughts.jsx` (array of objects with title, date, excerpt, slug)
- No CMS — content is edited directly in source files
- Site is deployed on Netlify via GitHub push to main
