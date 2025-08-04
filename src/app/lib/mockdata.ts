import {

  IconNotes,
  IconCalendarStats,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
  IconUser,
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
 
  { // { label: 'Quản lý tài khoản',
  //    icon: IconUser, 
  //      initiallyOpened: true,
  //        links: [
  //     { label: 'Quản lý người dùng và phân quyền ', link: '/admin/Tai-khoan' },
      
  //   ],
  
  //   },
    label: 'Quản lý khách hàng',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Danh sách khách hàng role', link: '/admin/users' },
      { label: 'Danh sách nhóm khách hàng system', link: '/admin/System' },
      { label: 'Tổng hợp trao đổi của người dùng', link: '/market/outlook' },
      { label: 'Tổng hợp đánh giá của người dùng', link: '/market/realtime' },
    ],
  },
  // {
  //   label: 'Đơn hàng - Đơn sửa chữa',
  //   icon: IconCalendarStats,
  //   links: [
  //     { label: 'Danh sách đơn hàng', link: '/releases/upcoming' },
  //     { label: 'Đặt lịch sửa chữa', link: '/releases/previous' },
  //     { label: 'Đặt lịch mua hàng', link: '/releases/schedule' },
  //   ],
  // },
  // { label: 'Quản lý sản phẩm', icon: IconPresentationAnalytics,
  //     initiallyOpened: true,
  //      links: [
  //     { label: 'Danh sách sản phẩm', link: '/market/overview' },
  //     { label: 'Danh mục sản phẩm', link: '/market/forecasts' },
  //     { label: 'Quản lý thuộc tính', link: '/market/outlook' },
  //     { label: 'Danh sách thương hiệu', link: '/market/realtime' },
  //   ],
  //  },
  
  // { label: 'Quản lý bài viết ', icon: IconFileAnalytics,
  //    initiallyOpened: true,
  //     links: [
  //     { label: 'Danh mục bải viết', link: '/market/overview' },
  //     { label: 'Bài viết ', link: '/market/forecasts' },
     
  //   ],
  //  },
 
  // {
  //   label: 'Quản lý Marketing',
  //   icon: IconLock,
  //   links: [
  //     { label: 'Danh sách banner', link: '/security/2fa' },
  //     { label: 'Danh sách vị trí baner', link: '/security/change-password' },
  
  //   ],
  // },
];

