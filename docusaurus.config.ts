import * as fs from 'fs';
import * as path from 'path';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config, LoadContext, Plugin} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

/**
 * Mirrors every `docs/**` Markdown file into `static/md/**` so the docs UI can
 * offer "Copy page" / "Download .md" (see src/components/DocMarkdownActions).
 *
 * Docusaurus compiles MDX to React at build time, so the original Markdown
 * isn't otherwise reachable at runtime. A doc at `docs/platform/.../widget.md`
 * is served verbatim at `/md/platform/.../widget.md`. `loadContent` runs for
 * both `start` and `build` (and on hot reload), so the mirror is regenerated
 * before the static dir is served/copied — output is derived, never committed.
 */
function docsRawMarkdownPlugin(context: LoadContext): Plugin {
  const docsDir = path.join(context.siteDir, 'docs');
  const outDir = path.join(context.siteDir, 'static', 'md');

  const mirror = (src: string, dest: string): void => {
    for (const entry of fs.readdirSync(src, {withFileTypes: true})) {
      const from = path.join(src, entry.name);
      const to = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        mirror(from, to);
      } else if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
        fs.mkdirSync(path.dirname(to), {recursive: true});
        fs.copyFileSync(from, to);
      }
    }
  };

  return {
    name: 'docs-raw-markdown',
    async loadContent() {
      fs.rmSync(outDir, {recursive: true, force: true});
      if (fs.existsSync(docsDir)) {
        mirror(docsDir, outDir);
      }
    },
  };
}

const config: Config = {
  title: 'Lira Docs',
  tagline: 'An AI customer support platform that learns your product, replies in your voice, and escalates only when it should.',
  favicon: 'img/lira_black_with_white_backgound.png',

  future: {
    v4: true,
  },

  url: 'https://docs.liraintelligence.com',
  baseUrl: '/',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content: 'Lira AI, AI customer support, autonomous support agent, AI chat widget, support portal, ticket automation, proactive support, knowledge base AI, documentation',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'author',
        content: 'Creovine Labs',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      // Plus Jakarta Sans is the canonical UI font used across the Lira app
      // (lira-ai/src/index.css) and the marketing site (lira-ai/index.html).
      // We load the same weights here so the docs match the rest of the
      // product visually. JetBrains Mono for inline + block code matches the
      // app's monospace token.
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap',
      },
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [docsRawMarkdownPlugin],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/lira_logo.png',
    metadata: [
      { name: 'og:title', content: 'Lira Docs — AI Customer Support' },
      { name: 'og:description', content: 'Documentation for Lira — an autonomous AI customer support platform that learns your product, replies in your voice, runs in-product actions, and escalates only when it should.' },
      { name: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Lira Docs' },
      { name: 'twitter:description', content: 'AI customer support that learns your product, replies in your voice, runs actions, and escalates only when it should.' },
    ],
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Lira',
      logo: {
        alt: 'Lira',
        src: 'img/lira_black.png',
        srcDark: 'img/lira_white.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'doc',
          docId: 'changelog',
          position: 'left',
          label: 'Changelog',
        },
        {
          href: 'https://liraintelligence.com',
          label: 'Platform',
          position: 'right',
        },
        {
          href: 'https://github.com/Creovine-Labs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Getting Started', to: '/' },
            { label: 'Quickstart', to: '/getting-started/quickstart' },
            { label: 'Get an Account', to: '/getting-started/get-an-account' },
            { label: 'Customer Support', to: '/platform/customer-support' },
          ],
        },
        {
          title: 'Build',
          items: [
            { label: 'Chat widget', to: '/platform/customer-support/widget' },
            { label: 'Support SDK', to: '/platform/customer-support/web-sdk' },
            { label: 'Install guides', to: '/platform/customer-support/integration-guides' },
            { label: 'Knowledge base', to: '/knowledge-base/overview' },
          ],
        },
        {
          title: 'Developer',
          items: [
            { label: 'WhatsApp', to: '/platform/customer-support/whatsapp' },
            { label: 'MCP', to: '/platform/customer-support/mcp' },
            { label: 'Developer API', to: '/platform/customer-support/developer-api' },
            { label: 'Google Drive source', to: '/knowledge-base/google-drive' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Lira Platform', href: 'https://liraintelligence.com' },
            { label: 'Creovine Labs', href: 'https://creovine.com' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Creovine Labs. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
