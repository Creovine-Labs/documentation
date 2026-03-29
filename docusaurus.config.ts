import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Lira AI Docs',
  tagline: 'Your AI workforce — meetings, interviews, sales coaching, and customer support.',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url: 'https://docs.liraintelligence.com',
  baseUrl: '/',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

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

  themeConfig: {
    image: 'img/lira_logo.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Lira AI',
      logo: {
        alt: 'Lira AI',
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
          type: 'docSidebar',
          sidebarId: 'api',
          position: 'left',
          label: 'API Reference',
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
            { label: 'Getting Started', to: '/getting-started/overview' },
            { label: 'Platform', to: '/platform/meetings' },
            { label: 'API Reference', to: '/api/overview' },
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
