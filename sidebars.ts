import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  platform: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/overview',
        'getting-started/quickstart',
        'getting-started/authentication',
        'getting-started/concepts',
      ],
    },
    {
      type: 'category',
      label: 'Platform',
      items: [
        'platform/architecture',
        'platform/products',
        'platform/console',
        'platform/admin',
        'platform/cms',
      ],
    },
    {
      type: 'category',
      label: 'Infrastructure',
      items: [
        'infrastructure/overview',
        'infrastructure/aws-services',
        'infrastructure/secrets',
        'infrastructure/deployment',
      ],
    },
    'changelog/releases',
  ],
  cvault: [
    {
      type: 'category',
      label: 'CVault VPN',
      collapsed: false,
      items: [
        'cvault/overview',
        'cvault/quickstart',
        'cvault/how-it-works',
        'cvault/devices',
        'cvault/vpn-sessions',
        'cvault/licenses',
        'cvault/sdk',
        'cvault/desktop-app',
        'cvault/troubleshooting',
      ],
    },
  ],
  lira: [
    {
      type: 'category',
      label: 'Lira AI',
      collapsed: false,
      items: [
        'lira/overview',
        'lira/quickstart',
        'lira/meetings',
        'lira/interviews',
        'lira/sales-coaching',
        'lira/customer-support',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'lira/architecture/audio-pipeline',
        'lira/architecture/nova-sonic',
        'lira/architecture/wake-word',
        'lira/architecture/speaker-diarization',
        'lira/architecture/organization-context',
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      items: [
        'lira/integrations/overview',
        'lira/integrations/linear',
        'lira/integrations/slack',
        'lira/integrations/microsoft-teams',
        'lira/integrations/google',
        'lira/integrations/github',
        'lira/integrations/greenhouse',
        'lira/integrations/hubspot',
        'lira/integrations/salesforce',
      ],
    },
  ],
  editcore: [
    {
      type: 'category',
      label: 'EditCore SDK',
      collapsed: false,
      items: [
        'editcore/overview',
        'editcore/quickstart',
        'editcore/features',
        'editcore/configuration',
        'editcore/architecture',
        'editcore/licensing',
      ],
    },
  ],
  api: [
    {
      type: 'category',
      label: 'Platform API',
      collapsed: false,
      items: [
        'api/platform/auth',
        'api/platform/admin',
        'api/platform/products',
        'api/platform/cms',
      ],
    },
    {
      type: 'category',
      label: 'CVault API',
      items: [
        'api/cvault/auth',
        'api/cvault/devices',
        'api/cvault/vpn',
        'api/cvault/licenses',
      ],
    },
    {
      type: 'category',
      label: 'Lira AI API',
      items: [
        'api/lira/bot',
        'api/lira/meetings',
        'api/lira/organizations',
        'api/lira/interviews',
        'api/lira/integrations',
        'api/lira/email',
        'api/lira/tasks',
        'api/lira/usage',
        'api/lira/webhooks',
        'api/lira/websocket',
      ],
    },
  ],
};

export default sidebars;
