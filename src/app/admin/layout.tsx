'use client';

import {
  AppShell,
  Burger,
  Button,
  Divider,
  Group,
  Image,
  NavLink,
  ScrollArea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { mockdata } from '../lib/mockdata';
import { IconLogout, IconUser } from '@tabler/icons-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      {/* Header */}
     <AppShell.Header>
  <Group h="100%" px="md" justify="space-between">
    {/* Logo + Burger */}
    <Group>
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Link href="/">
        <Image
          src="/MHV_VN_Logo_bLUE.gif"
          alt="Logo"
          style={{ width: '160px', height: '50px', objectFit: 'contain' }}
        />
      </Link>
    </Group>

    {/* User Info */}
    <Button
      leftSection={<IconUser size={18} />}
    //   color="teal.7"
      variant="filled"
      radius="md"
      size="sm"
        style={{
    backgroundColor: '#406c88',
    color: 'white',
  }}
    >
      Quang Linh
    </Button>
  </Group>
</AppShell.Header>



      {/* Navbar layout */}
      <AppShell.Navbar p="md">
        {/* Phần menu bên trên, có thể scroll */}
       <AppShell.Section grow component={ScrollArea}>
  {mockdata.map((item) =>
    item.links ? (
      <NavLink
        key={item.label}
        label={item.label}
        leftSection={<item.icon size={18} />}
        defaultOpened={item.initiallyOpened}
        style={{  fontSize: '14px' }}
      >
        {item.links.map((link) => (
          <NavLink
            key={link.label}
            label={link.label}
            onClick={() => router.push(link.link)}
            style={{  fontSize: '14px' }}
          />
        ))}
      </NavLink>
    ) : (
      <NavLink
        key={item.label}
        label={item.label}
        leftSection={<item.icon size={18} />}
        onClick={() => router.push(item.link!)}
        style={{  fontSize: '14px' }}
      />
    )
  )}
</AppShell.Section>


        {/* Phần logout nằm dưới cùng */}
        <AppShell.Section>
          <Divider my="sm" />
          <NavLink
            label="Logout"
            leftSection={<IconLogout size={18} />}
            onClick={handleLogout}
          />
        </AppShell.Section>
      </AppShell.Navbar>

      {/* Nội dung chính */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

