# Aerosect Article Publishing Guide

## 1. Create a new article file

Copy:

_templates/article-template.md

Into:

src/content/articles/

Rename it using a clean slug, for example:

aerofoil-self-noise.md

## 2. Update the frontmatter

Required fields:

title:
description:
author:
date:
topic:
topicSlug:
image:
socialImage:
draft:

Use:

draft: true

while writing.

Use:

draft: false

when ready to publish.

## 3. Add the article image

Place the image in:

src/assets/articles/

Then reference it like:

image: "../../assets/articles/example-image.jpg"

For the social sharing card, place a 1200 x 630 image in:

src/assets/social/articles/

Then reference it like:

socialImage: "../../assets/social/articles/example-social-card.jpg"

## 4. Preview locally

Run:

npm.cmd run dev

Open:

http://localhost:4321/articles

## 5. Publish

Commit and push the changes.

The article appears only when:

draft: false

## 6. Using visual components

For simple articles, use `.md`.

For articles with custom visuals or interactive blocks, use `.mdx`.

The main article image in the frontmatter uses Astro's optimized image system.
Extra images inside article components can still use public paths for now.
Place those supporting images in:

public/images/articles/

Available reusable components:

- Figure
- VideoEmbed
- ImageGallery
- BeforeAfterSlider
- ChartBlock
- ArticleCallout
- ExpandableSection
- SectionBreak
- PullQuote
- KeyTakeaways

To use a component in an `.mdx` article, import it at the top after the frontmatter, for example:

import Figure from "../../components/Figure.astro";

Then insert it in the article body:

<Figure
  src="/images/articles/example-image.jpg"
  alt="Example image"
  caption="Example caption."
/>
