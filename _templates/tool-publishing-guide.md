# Tool pages

Tools live in `src/content/tools/*.mdx`. The filename becomes `/tools/your-tool/`.
Copy an existing tool page to keep the explorer-first layout, guide typography and page navigation.

```yaml
---
title: "Your Tool"
description: "A short, specific invitation to explore what the tool does."
category: "Fluid mechanics"
image: "../../assets/tools/your-tool.svg"
order: 4
draft: true
---
```

Import the Astro explorer from `../../components/`, then render it above a `ToolGuide` wrapper.
Put the usage instructions, equations, numerical method and assumptions inside `ToolGuide`.
Use second-level Markdown headings (`##`) to populate the page's jump links automatically.
Keep explorer styles separate from guide styles to preserve the tool's display.

Write inline mathematics between single dollar signs and displayed equations between
double dollar signs on their own lines. The MDX pipeline typesets LaTeX with KaTeX at
build time; `ToolGuide` loads the local math fonts and styles. Use `\frac{a}{b}` for
fractions, `\mathrm{e}^{-r^2/a^2}` for exponentials, and `\begin{aligned} … \end{aligned}`
for multiline derivations. Mathematical markup also includes MathML for accessibility.

`image` supplies the tile thumbnail. The initial SVG diagrams are original placeholders; replace
them or update the path when final artwork is available. An optional `socialImage` can reference
a JPG or PNG for social previews; otherwise the site-wide social card is used.
`order` controls tile order, with title as a tie-breaker.

## Preview and publish

- `draft: true` shows the tile and page only in `npm.cmd run dev`, with draft labels.
- `draft: false` includes both in the production build.
- Omitting `draft` defaults a new tool to a draft.
- `npm.cmd run build` excludes draft routes entirely, including direct URL access.
- `npm.cmd run preview` serves that production build, so it does not show drafts.

The three initial tools are drafts, matching the original test article. Set each to `draft: false`
when ready. Check the index, individual pages and menu on desktop and mobile before publishing.
The old `web-tools-test.mdx` article has been replaced by these dedicated pages.
