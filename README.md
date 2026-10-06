# Md Nasim - 3D Freelance Portfolio

React + Tailwind CSS + Three.js (3D scene).

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173).

## Build and deploy

```bash
npm run build     # output goes to /dist
npm run preview   # test the production build
```

Deploy the folder to Vercel or Netlify: import the project, build command `npm run build`, output directory `dist`.

## Switch the 3D theme

Use the pill at the bottom of the page: Nebula, Galaxy, Synthwave and Data city. The choice is remembered in the browser.

## Edit your content

Open `src/Portfolio3D.jsx`. At the top of the file you will find:

- `ME` - your email, WhatsApp and LinkedIn links
- `PROJECTS` - the cards in the 3D project ring
- `PACKAGES` - package names, prices (USD and INR), timelines and features
- `STEPS` and `STACK` - process steps and tech chips

Prices are starting points. Change them to match your market.
