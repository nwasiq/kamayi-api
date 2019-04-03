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

export interface PunavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: PunavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const punavItems: PunavData[] = [
  {
    name: 'Home',
    url: '/pudashboard',
    icon: 'fa fa-home'
  },
  {
      name: 'Vacancies',
      url: '/pu-open-vacancy/openvacancy',
      icon: 'fa fa-users'
  },
  {
    name: 'Employers',
    url: '/pu-assigned-employers/employers',
    icon: 'fa fa-handshake-o'
  }
];
