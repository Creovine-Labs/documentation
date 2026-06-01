import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

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
            { label: 'Integration guides', to: '/platform/customer-support/integration-guides' },
            { label: 'Knowledge base', to: '/knowledge-base/overview' },
          ],
        },
        {
          title: 'Integrations',
          items: [
            { label: 'Slack', to: '/integrations/slack' },
            { label: 'Linear', to: '/integrations/linear' },
            { label: 'GitHub', to: '/integrations/github' },
            { label: 'All Integrations', to: '/integrations/overview' },
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
