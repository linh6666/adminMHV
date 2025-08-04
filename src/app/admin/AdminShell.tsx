'use client';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AdminHeader from '../../../components/AdminHeader';
import AdminNavbar from '../../../components/AdminNavbar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure(true);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login'; // dùng location.href để hard redirect
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AdminHeader opened={opened} toggle={toggle} />
      <AdminNavbar onLogout={handleLogout} />
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
