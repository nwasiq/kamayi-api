interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
  variant: string;
}
interface NavLabel {
  class?: string;
  variant: string;
}

export interface CcnavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: CcnavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const ccnavItems: CcnavData[] = [
  {
    name: 'Home',
    url: '/ccdashboard',
    icon: 'fa fa-home'
  },
  {
    name: 'Candidates',
    url: '/cc-candidates-list/candidate',
    icon: 'icon-people'
  },
  {
    name: 'Employers',
    url: '/cc-employers-list/employers',
    icon: 'fa fa-handshake-o'
  },
  {
    name: 'Organic Signup',
    url: '/cc-bulk-candidates-list',
    icon: 'fa fa-database',
    children: [
      {
        name: 'Signup - Candidates',
        url: '/cc-bulk-candidates-list/createcandidate',
        icon: 'icon-list'
      },
      {
        name: 'Signup - Employers',
        url: '/cc-bulk-employers-list/createemployer',
        icon: 'icon-list'
      }
    ]
  },
  {
    name: 'Bulk - Candidates',
    url: '/cc-bulk-candidates-list/bulkcandidates',
    icon: 'icon-people'
  },
  {
    name: 'Bulk - Employers',
    url: '/cc-bulk-employers-list/bulkemployers',
    icon: 'fa fa-handshake-o'
  }
];
