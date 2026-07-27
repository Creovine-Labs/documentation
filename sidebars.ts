import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/overview',
        'getting-started/get-an-account',
        'getting-started/plans-and-billing',
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
        {
          type: 'category',
          label: 'Customer Support',
          link: { type: 'doc', id: 'platform/customer-support' },
          items: [
            'platform/customer-support/onboarding',
            'platform/customer-support/activation',
            'platform/customer-support/sandbox-and-going-live',
            'platform/customer-support/sdks',
            'platform/customer-support/tickets',
            'platform/customer-support/web-sdk',
            'platform/customer-support/native-mobile',
            'platform/customer-support/whatsapp',
            'platform/customer-support/mcp',
            'platform/customer-support/security',
            'platform/customer-support/developer-api',
            {
              type: 'category',
              label: 'Install guides',
              link: { type: 'doc', id: 'platform/customer-support/integration-guides/index' },
              items: [
                'platform/customer-support/integration-guides/nextjs',
                'platform/customer-support/integration-guides/vite',
                'platform/customer-support/integration-guides/remix',
                'platform/customer-support/integration-guides/rails',
                'platform/customer-support/integration-guides/django',
                'platform/customer-support/integration-guides/express',
                'platform/customer-support/integration-guides/html',
                'platform/customer-support/integration-guides/claude-code-skill',
                'platform/customer-support/integration-guides/troubleshooting',
              ],
            },
            'platform/customer-support/widget',
            'platform/customer-support/portal',
            'platform/customer-support/voice',
            {
              type: 'category',
              label: 'Agent Runtime',
              link: { type: 'doc', id: 'platform/customer-support/agent-runtime' },
              items: [
                'platform/customer-support/capabilities',
                'platform/customer-support/actions',
                'platform/customer-support/audit',
              ],
            },
            'platform/customer-support/proactive',
            'platform/customer-support/analytics',
            'platform/customer-support/inbox',
            'platform/customer-support/settings',
          ],
        },
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
        'knowledge-base/google-drive',
        'knowledge-base/web-sources',
        'knowledge-base/query',
      ],
    },
    'changelog',
  ],
};

export default sidebars;
