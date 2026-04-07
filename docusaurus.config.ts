import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Creovine Docs',
  tagline: 'Developer documentation for the Creovine platform',
  favicon: 'img/creovine-logo.png',
  url: 'https://docs.creovine.com',
  baseUrl: '/',
  organizationName: 'Creovine-Labs',
  projectName: 'creovine-docs',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  headTags: [
    {
      tagName: 'meta',
      attributes: { name: 'keywords', content: 'Creovine, CVault, Lira AI, EditCore, VPN, AI meetings, video editor SDK, API documentation' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
    },
  ],

  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
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
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/',
      },
    ],
  ],

  themeConfig: {
    image: 'img/creovine-logo.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Creovine Docs',
      logo: {
        alt: 'Creovine',
        src: 'img/creovine-logo.png',
      },
      items: [
        { type: 'docSidebar', sidebarId: 'platform', position: 'left', label: 'Platform' },
        {
          type: 'dropdown',
          label: 'Products',
          position: 'left',
          items: [
            { type: 'docSidebar', sidebarId: 'cvault', label: 'CVault VPN' },
            { type: 'docSidebar', sidebarId: 'lira', label: 'Lira AI' },
            { type: 'docSidebar', sidebarId: 'editcore', label: 'EditCore' },
          ],
        },
        { type: 'docSidebar', sidebarId: 'api', position: 'left', label: 'API Reference' },
        { href: 'https://creovine.com', label: 'Creovine.com', position: 'right' },
        { href: 'https://api.creovine.com/docs', label: 'Swagger', position: 'right' },
        { href: 'https://github.com/Creovine-Labs', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Products',
          items: [
            { label: 'CVault VPN', to: '/cvault/overview' },
            { label: 'Lira AI', to: '/lira/overview' },
            { label: 'EditCore', to: '/editcore/overview' },
          ],
        },
        {
          title: 'API Reference',
          items: [
            { label: 'Platform API', to: '/api/platform/auth' },
            { label: 'CVault API', to: '/api/cvault/auth' },
            { label: 'Lira AI API', to: '/api/lira/bot' },
          ],
        },
        {
          title: 'Resources',
          items: [
            { label: 'Getting Started', to: '/getting-started/overview' },
            { label: 'Architecture', to: '/platform/architecture' },
            { label: 'Changelog', to: '/changelog/releases' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Creovine.com', href: 'https://creovine.com' },
            { label: 'GitHub', href: 'https://github.com/Creovine-Labs' },
            { label: 'Support', href: 'mailto:support@creovine.com' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Creovine Labs. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'dart', 'ini', 'yaml', 'swift', 'kotlin'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
