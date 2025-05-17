import {
  IconGauge,
  IconNotes,
  IconCalendarStats,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
} from '@tabler/icons-react';

// Kiểu cho link con
export type SubLink = {
  label: string;
  link: string;
};

// Kiểu cho mỗi mục trong sidebar
export type NavItem = {
  label: string;
  icon: any; // không kiểm tra kiểu icon
  link?: string;
  initiallyOpened?: boolean;
  links?: SubLink[];
};

// Dữ liệu sidebar
export const mockdata: NavItem[] = [
  { label: 'Dashboard', icon: IconGauge, link: '/dashboard' },
  {
    label: 'Market news',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Overview', link: '/market/overview' },
      { label: 'Forecasts', link: '/market/forecasts' },
      { label: 'Outlook', link: '/market/outlook' },
      { label: 'Real time', link: '/market/realtime' },
    ],
  },
  {
    label: 'Releases',
    icon: IconCalendarStats,
    links: [
      { label: 'Upcoming releases', link: '/releases/upcoming' },
      { label: 'Previous releases', link: '/releases/previous' },
      { label: 'Releases schedule', link: '/releases/schedule' },
    ],
  },
  { label: 'Analytics', icon: IconPresentationAnalytics, link: '/analytics' },
  { label: 'Contracts', icon: IconFileAnalytics, link: '/contracts' },
  { label: 'Settings', icon: IconAdjustments, link: '/settings' },
  {
    label: 'Security',
    icon: IconLock,
    links: [
      { label: 'Enable 2FA', link: '/security/2fa' },
      { label: 'Change password', link: '/security/change-password' },
      { label: 'Recovery codes', link: '/security/recovery' },
    ],
  },
];

