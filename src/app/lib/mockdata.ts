import {
  IconNotes,
  IconUser,
} from "@tabler/icons-react";
import { ComponentType } from "react";

// Kiểu cho link con
export type SubLink = {
  label: string;
  link: string;
};

// Kiểu cho mỗi mục trong sidebar
export type NavItem = {
  label: string;
  icon: ComponentType<{ size?: number | string; stroke?: number | string }>; // an toàn hơn any
  link?: string;
  initiallyOpened?: boolean;
  links?: SubLink[];
};

// Dữ liệu sidebar
export const mockdata: NavItem[] = [
  {
    label: "Quản lý tài khoản",
    icon: IconUser,
    initiallyOpened: true,
    links: [
      { label: "Quản lý người dùng và phân quyền ", link: "/admin/Tai-khoan" },
    ],
  },
  {
    label: "Quản lý khách hàng",
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: "Danh sách khách hàng role", link: "/admin/users" },
      { label: "Danh sách nhóm khách hàng system", link: "/admin/System" },
  
    ],
  },
    {
    label: "Quản lý Dự án",
    icon: IconNotes,
    initiallyOpened: true,
    links: [
     
      { label: "Danh sách dự án", link: "/admin/Du-an" },
         { label: "Danh sách Người dùng dự án ", link: "/admin/UserProject" }, 
  

    ],
  },
];
