export const ADMIN_SITE = {
  name: 'DOHaD India Regional Society',
  shortName: 'DOHaD India',
  tagline: 'Website Manager',
  homeHeading: 'What would you like to update?',
  homeSubtext: 'Choose a section below to manage content on your website.',
} as const;

export const ADMIN_SECTIONS = [
  {
    label: 'Events',
    description: 'Add or edit conferences, meetings, and workshops',
    href: '/admin/events',
  },
  {
    label: 'Email Subscribers',
    description: 'View people who signed up for your newsletter',
    href: '/admin/newsletter',
  },
  {
    label: 'Who We Are',
    description: 'Manage Executive Council, Advisory Group, and page content',
    href: '/admin/advisory',
  },
  {
    label: 'Policies & Documents',
    description: 'Edit governance and equity page content',
    href: '/admin/documents',
  },
  {
    label: 'Website Settings',
    description: 'Contact details, social links, and site information',
    href: '/admin/settings',
  },
  {
    label: 'FAQs',
    description: 'Add, edit, or reorder homepage frequently asked questions',
    href: '/admin/faqs',
  },
  {
    label: 'Membership',
    description: 'Manage membership tiers, fees, notes, and registration links',
    href: '/admin/membership',
  },
  {
    label: 'Research Pillars',
    description: 'Manage homepage research focus areas and bento cards',
    href: '/admin/research-pillars',
  },
  {
    label: 'Special Narratives',
    description: 'Edit Capacity Building, Advocacy, and Outreach sections',
    href: '/admin/narratives',
  },
  {
    label: 'Legal Pages',
    description: 'Edit Privacy Policy and Terms & Conditions',
    href: '/admin/legal',
  },
  {
    label: 'Navigation & Menus',
    description: 'Customize Header and Footer navigation links, buttons, and notices',
    href: '/admin/navigation',
  },
] as const;
