import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default("Yash B"),
    date: z.coerce.date(),
    topics: z.array(
      z.object({
        name: z.string(),
        slug: z.string(),
      })
    ).min(1),
    image: image(),
    imageCredit: z.object({
      text: z.string(),
      url: z.string().url().optional(),
    }).optional(),
    socialImage: image().optional(),
    draft: z.boolean().default(false),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/tools" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    image: image(),
    socialImage: image().optional(),
    order: z.number().default(0),
    draft: z.boolean().default(true),
  }),
});

export const collections = { articles, tools };
