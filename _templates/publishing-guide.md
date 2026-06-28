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
date:
topic:
topicSlug:
image:
draft:

Use:

draft: true

while writing.

Use:

draft: false

when ready to publish.

## 3. Add the article image

Place the image in:

public/images/articles/

Then reference it like:

image: "/images/articles/example-image.jpg"

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