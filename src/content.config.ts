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
    topic: z.string(),
    topicSlug: z.string(),
    image: image(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
