import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
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
        'platform/meetings',
        'platform/interviews',
        'platform/sales-coaching',
        'platform/customer-support',
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      items: [
        'integrations/overview',
        'integrations/slack',
        'integrations/microsoft-teams',
        'integrations/google-calendar',
        'integrations/google-drive',
        'integrations/linear',
        'integrations/github',
        'integrations/hubspot',
        'integrations/salesforce',
        'integrations/greenhouse',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/audio-pipeline',
        'architecture/nova-sonic',
        'architecture/wake-word',
        'architecture/speaker-diarization',
        'architecture/organization-context',
      ],
    },
    {
      type: 'category',
      label: 'Infrastructure',
      items: [
        'infrastructure/overview',
        'infrastructure/deployment',
        'infrastructure/aws-resources',
      ],
    },
  ],
  api: [
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'api/overview',
        'api/authentication',
        'api/bot',
        'api/meetings',
        'api/organizations',
        'api/interviews',
        'api/integrations',
        'api/tasks',
        'api/websocket',
        'api/webhooks',
      ],
    },
  ],
};

export default sidebars;
