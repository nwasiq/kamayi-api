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

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const navItems: NavData[] = [
  {
    name: 'Home',
    url: '/dashboard',
    icon: 'fa fa-home'
  },
  {
    name: 'Users',
    url: '/admin-users-list/users',
    icon: 'fa fa-users'
  },
  {
    name: 'Bulk Data',
    url: '/admin-bulk-upload',
    icon: 'fa fa-database',
    children: [
      {
        name: 'Bulk - Candidates',
        url: '/admin-bulk-upload/bulkcandidates',
        icon: 'icon-list'
      },
      {
        name: 'Bulk - Employers',
        url: '/admin-bulk-upload/bulkemployers',
        icon: 'icon-list'
      }
    ]
  },
  {
    name: 'Employers',
    url: '/admin-employers-list',
    icon: 'fa fa-handshake-o',
    children: [
      {
        name: 'Assignments',
        url: '/admin-employers-list/assignment',
        icon: 'cui-user-follow'
      },
      {
        name: 'Payment',
        url: '/admin-employers-list/payment',
        icon: 'cui-credit-card'
      },
      {
        name: 'Deletion',
        url: '/admin-employers-list/jobdeletion',
        icon: 'cui-trash'
      }
    ]
  },
  {
    name: 'Candidates',
    url: '/admin-candidate-list/candidate',
    icon: 'icon-people'
  },
  {
    name: 'Occupations',
    url: '/admin-create-occupation/createoccupation',
    icon: 'fa fa-address-card'
  }
];
