'use client';

import { useState } from 'react';
import { AppShell, Divider, NavLink, ScrollArea } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconLogout } from '@tabler/icons-react';
import { mockdata } from '../../lib/mockdata';

export default function AdminNavbar({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogoutClick = () => {
    if (loading) return; // tránh bấm nhiều lần
    setLoading(true);
    onLogout();
  };

  return (
    <AppShell.Navbar p="md" style={{ borderRight: '1px solid #eee' }}>
      <AppShell.Section grow component={ScrollArea}>
        {mockdata.map((item) =>
          item.links ? (
            <NavLink
              key={item.label}
              label={item.label}
              leftSection={<item.icon size={18} />}
              defaultOpened={item.initiallyOpened ?? false}
            >
              {item.links.map((link) => (
                <NavLink
                  key={link.label}
                  label={link.label}
                  onClick={() => router.push(link.link)}
                />
              ))}
            </NavLink>
          ) : (
            <NavLink
              key={item.label}
              label={item.label}
              leftSection={<item.icon size={18} />}
              onClick={() => router.push(item.link!)}
            />
          )
        )}
      </AppShell.Section>

      <AppShell.Section>
        <Divider my="sm" />
        <NavLink
          label={loading ? 'Logging out...' : 'Logout'}
          leftSection={<IconLogout size={18} />}
          onClick={handleLogoutClick}
          disabled={loading}
        />
      </AppShell.Section>
    </AppShell.Navbar>
  );
}
