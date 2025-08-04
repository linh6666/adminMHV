'use client';

import AdminShell from './AdminShell';
import '@mantine/core/styles.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}


