# Astro Starter Kit: Minimal

## Aerosect particle cursor

The shared layout includes `src/components/ParticleCursor.astro`. Its small native SVG
cursor stays responsive independently of JavaScript; the blue canvas trail fades after
200 ms and stops rendering when idle. Links and buttons retain their hand cursor.
Simulation canvases, input fields, selection/drag gestures and resize handles retain
their normal interactions. Add `data-native-cursor` to opt a region out of the effect.

The effect activates only for a mouse on a fine-pointer, hover-capable device with
forced colours off. Reduced motion disables only the trail, keeping the particle cursor.
It uses no external service or library.
The canvas is fixed at 512 CSS pixels square, capped at 1.5× resolution; it never grows
with the viewport. History is capped at 40 points and 220 pixels from the pointer.
Timing and history limits live in `src/scripts/cursor-trail.ts`.

Run the cursor tests with Node 24 (or a Node release supporting TypeScript stripping):

```sh
node --test tests/cursor-trail.test.mjs tests/particle-cursor.test.mjs
```

Check the effect with the system's reduced-motion preference off. With reduced motion
on, the intended result is the particle cursor and no trail. Device-specific frame rates
should be profiled in a regular browser alongside the interactive tools.

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
