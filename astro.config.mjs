// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://aerosect.com',
  devToolbar: { enabled: false },
  integrations: [mdx({
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { strict: 'error', throwOnError: true }]],
    }),
  })]
});
