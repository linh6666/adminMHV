'use client';

import { useEffect } from 'react';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import AdminHeader from '../components/AdminHeader';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure(true);
  const router = useRouter();

  // Kiểm tra token khi component mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.replace('/login');  // chuyển hướng không cho back lại
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Xoá token localStorage khi logout
    router.push('/login'); // Chuyển hướng về login
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


