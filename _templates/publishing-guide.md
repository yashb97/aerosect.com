# Aerosect Article Publishing Guide

This guide is the repeatable process for writing, previewing, and publishing new Aerosect articles.

Aerosect articles live in `src/content/articles/`. Each article is a Markdown or MDX file with frontmatter at the top. The frontmatter controls the archive card, topic page, social sharing preview, publication date, author, and whether the article is public.

## 1. Start From The Template

Copy:

```text
_templates/article-template.md
```

Paste it into:

```text
src/content/articles/
```

Rename the copied file using a clean URL-style slug:

```text
future-of-airports.md
```

The filename becomes the public article URL:

```text
https://aerosect.com/articles/future-of-airports/
```

Use lowercase letters, numbers, and hyphens. Avoid spaces, underscores, punctuation, and very long filenames.

## 2. Choose Markdown Or MDX

Use `.md` for normal text articles.

Use `.mdx` when the article needs Astro components such as figures, galleries, pull quotes, callouts, sliders, charts, expandable sections, or other interactive blocks.

Simple article:

```text
future-of-airports.md
```

Component-rich article:

```text
future-of-airports.mdx
```

## 3. Fill In The Frontmatter

Every article starts with frontmatter:

```md
---
title: "Article Title"
description: "Short preview text for archive cards and social sharing."
author: "Yash B"
date: "2026-07-23"
topics:
  - name: "Aviation History"
    slug: "aviation-history"
  - name: "Ideas"
    slug: "ideas"
image: "../../assets/articles/article-image.jpg"
imageCredit:
  text: "Photographer or source name"
  url: "https://example.com/source-page"
socialImage: "../../assets/social/articles/article-social-card.jpg"
draft: true
---
```

Field meanings:

`title`: The article title shown on the article page, archive card, browser tab, and social preview.

`description`: A concise summary used on archive cards and social previews. Aim for one clear sentence.

`author`: The author name used in metadata. Most articles can use `Yash B`, but future contributors can have their own name.

`date`: Publication date in `YYYY-MM-DD` format.

`topics`: A list of one or more topics attached to the article. Each topic needs a human-readable `name` and a URL-friendly `slug`.

`name`: The topic label shown to readers, for example `Aviation History`.

`slug`: The URL-friendly topic identifier, for example `aviation-history`. Use lowercase letters and hyphens.

`image`: The main article image used on archive cards and inside the article page.

`imageCredit`: The credit shown under the main article image on the article page. Use this for externally sourced article photos. The `url` is optional, but recommended when the image came from a public source page.

`socialImage`: The image used when the article is shared on LinkedIn, WhatsApp, Teams, Slack, and similar platforms.

`draft`: Controls whether the article is public.

## 4. Keep Drafts Hidden

While writing, keep:

```md
draft: true
```

Draft articles are hidden from the public archive and topic pages.

When the article is ready to publish, change it to:

```md
draft: false
```

## 5. Add Article Images

The main article image goes here:

```text
src/assets/articles/
```

Reference it in frontmatter like this:

```md
image: "../../assets/articles/article-image.jpg"
```

This image is processed by Astro's image system, which can generate optimized versions for the live site.

If the image is externally sourced, add a credit below it in frontmatter:

```md
imageCredit:
  text: "Photo by Photographer Name / Source"
  url: "https://example.com/source-page"
```

If the image is your own render, diagram, or original Aerosect asset, you can either omit `imageCredit` or use:

```md
imageCredit:
  text: "Aerosect"
```

Do not invent a credit. If the source is uncertain, keep the article as a draft until the image source is confirmed or replace the image.

## 6. Add The Social Sharing Image

Each article can have its own social card image.

Place article-specific social cards here:

```text
src/assets/social/articles/
```

Reference one like this:

```md
socialImage: "../../assets/social/articles/article-social-card.jpg"
```

Recommended social card size:

```text
1200 x 630 px
```

Recommended format:

```text
JPG
```

If `socialImage` is missing, the site falls back to the main article `image`.

The site-wide default social card is:

```text
src/assets/social/aerosect-social-card.jpg
```

Replace that file with the same name when you design the final Aerosect-wide social card.

## 7. Write The Article Body

After the frontmatter, write the article using Markdown:

```md
# Article Title

Opening paragraph that hooks the reader and explains why the article matters.

## Section Heading

Main article text.

## Another Section

More detail, examples, context, or interpretation.
```

Use headings to make the article easy to scan. Prefer clear section titles over generic headings.

Good article structure:

```text
Opening hook
Core idea
Why it matters
Detailed explanation
Visuals or examples
What to remember
```

## 8. Use Visual Components In MDX Articles

Available reusable components:

```text
Figure
VideoEmbed
ImageGallery
BeforeAfterSlider
ChartBlock
ArticleCallout
ExpandableSection
SectionBreak
PullQuote
KeyTakeaways
```

For MDX articles, import a component after the frontmatter:

```mdx
import Figure from "../../components/Figure.astro";
```

Then use it in the article:

```mdx
<Figure
  src="/images/articles/example-image.jpg"
  alt="Example image"
  caption="Example caption."
  credit="Photo by Photographer Name / Source"
  creditUrl="https://example.com/source-page"
/>
```

Supporting images used inside article components can currently live here:

```text
public/images/articles/
```

Then they can be referenced with public paths:

```text
/images/articles/example-image.jpg
```

For galleries, add credits directly to each image object:

```mdx
<ImageGallery
  images={[
    {
      src: "/images/articles/example-one.jpg",
      alt: "Example image one",
      credit: "Photo by Photographer One",
      creditUrl: "https://example.com/source-one"
    },
    {
      src: "/images/articles/example-two.jpg",
      alt: "Example image two",
      credit: "Photo by Photographer Two",
      creditUrl: "https://example.com/source-two"
    }
  ]}
  caption="A short gallery caption."
/>
```

For before/after sliders, use:

```mdx
<BeforeAfterSlider
  before="/images/articles/before.jpg"
  after="/images/articles/after.jpg"
  beforeLabel="Before"
  afterLabel="After"
  beforeCredit="Before image source"
  beforeCreditUrl="https://example.com/before"
  afterCredit="After image source"
  afterCreditUrl="https://example.com/after"
  caption="A short comparison caption."
/>
```

Social card images and decorative site background images do not need article-page credits. Track those separately in `ASSET_CREDITS.md` when needed.

## 9. Preview Locally

Run:

```text
npm.cmd run dev
```

Open:

```text
http://localhost:4321
```

Useful pages to check:

```text
/
/articles/
/articles/your-article-slug/
/topics/
/topics/your-topic-slug/
```

Check desktop and mobile widths. On mobile, make sure the headline, article card, image crop, and hamburger menu all behave properly.

## 10. Run The Production Build

Before publishing, run:

```text
npm.cmd run build
```

If the build fails, fix the error before publishing. Common causes are:

- an image path is wrong;
- a required frontmatter field is missing;
- a date is not in the right format;
- an MDX component import path is wrong.

## 11. Publish The Article

When the article is ready:

1. Set `draft: false`.
2. Run `npm.cmd run build`.
3. Commit the changes.
4. Push to `astro-rebuild`.

Typical commands:

```text
git add .
git commit -m "Add article title"
git push origin astro-rebuild
```

GitHub Actions will deploy the site automatically after the push.

Check deployment here:

```text
GitHub -> yashb97/aerosect.com -> Actions
```

Wait for `Deploy to GitHub Pages` to finish successfully.

## 12. Check The Live Article

After deployment, open the live URL:

```text
https://aerosect.com/articles/your-article-slug/
```

If the old version appears, use a hard refresh:

```text
Ctrl + F5
```

## 13. Check Social Sharing

Use LinkedIn Post Inspector:

```text
https://www.linkedin.com/post-inspector/
```

Paste the live article URL and check that it shows:

- article title;
- description;
- author;
- article social image;
- correct URL.

LinkedIn and other platforms can cache previews. If a preview looks stale, wait a few minutes and inspect the URL again.

## 14. Topic Pages

Topic pages are generated automatically from article frontmatter.

If you create an article with:

```md
topics:
  - name: "Aviation History"
    slug: "aviation-history"
  - name: "Ideas"
    slug: "ideas"
```

the site will generate or update both:

```text
https://aerosect.com/topics/aviation-history/
https://aerosect.com/topics/ideas/
```

The article will appear on every topic page listed in its frontmatter.

Use the same topic `name` and `slug` consistently across articles that belong together. The first topic in the list is treated as the primary topic when space is limited, so place the most important topic first.

## 15. Quick Publishing Checklist

Before publishing, confirm:

- `draft` is set to `false`;
- title is polished;
- description is concise;
- author is correct;
- date is correct;
- topics have matching names and slugs;
- main article image exists;
- article photo credits are present where needed;
- socialImage exists, or fallback to main image is acceptable;
- article works on mobile;
- `npm.cmd run build` passes;
- GitHub Actions deployment succeeds;
- live article opens correctly;
- LinkedIn Post Inspector sees the expected preview.
