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
        'getting-started/navigation',
      ],
    },
    {
      type: 'category',
      label: 'Platform',
      items: [
        'platform/lira',
        'platform/meetings',
        'platform/interviews',
        'platform/sales-coaching',
        'platform/customer-support',
        'platform/email',
      ],
    },
    {
      type: 'category',
      label: 'Knowledge Base',
      items: [
        'knowledge-base/overview',
        'knowledge-base/documents',
        'knowledge-base/connected-sources',
        'knowledge-base/web-sources',
        'knowledge-base/query',
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
    'changelog',
  ],
};

export default sidebars;
