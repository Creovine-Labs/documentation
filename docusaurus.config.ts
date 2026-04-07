import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Lira Docs',
  tagline: 'Your AI workforce — meetings, interviews, sales coaching, and customer support.',
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
        content: 'Lira AI, AI meetings, AI interviews, sales coaching, customer support, API, documentation, Amazon Nova Sonic, real-time AI',
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
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
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
      { name: 'og:title', content: 'Lira Docs — Your AI Workforce' },
      { name: 'og:description', content: 'Documentation for Lira — autonomous AI agents for meetings, interviews, sales coaching, and customer support.' },
      { name: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Lira Docs' },
      { name: 'twitter:description', content: 'Build with autonomous AI agents that join meetings, conduct interviews, coach sales reps, and handle customer support.' },
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
            { label: 'Platform', to: '/platform/meetings' },
          ],
        },
        {
          title: 'Products',
          items: [
            { label: 'Meetings', to: '/platform/meetings' },
            { label: 'Interviews', to: '/platform/interviews' },
            { label: 'Sales Coaching', to: '/platform/sales-coaching' },
            { label: 'Customer Support', to: '/platform/customer-support' },
          ],
        },
        {
          title: 'Integrations',
          items: [
            { label: 'Slack', to: '/integrations/slack' },
            { label: 'Google Calendar', to: '/integrations/google-calendar' },
            { label: 'Linear', to: '/integrations/linear' },
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
