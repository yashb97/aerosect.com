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