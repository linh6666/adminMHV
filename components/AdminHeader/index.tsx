"use client";

import { AppShell, Burger, Button, Group, Image } from "@mantine/core";
import Link from "next/link";
import { IconUser } from "@tabler/icons-react";
import useAuth  from "../../hook/useAuth"; // Đường dẫn thực tế đến hook useAuth

export default function AdminHeader({ opened, toggle }: { opened: boolean; toggle: () => void }) {
  const { user } = useAuth();

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Link href="/admin">
            <Image
              src="/MHV_VN_Logo_bLUE.gif"
              alt="Logo"
              style={{ width: "160px", height: "50px", objectFit: "contain" }}
            />
          </Link>
        </Group>

    <IconUser/>
{user?.full_name && (
  <Button
    leftSection={<IconUser size={18} />}
    radius="md"
    size="sm"
    style={{ backgroundColor: "#406c88", color: "white" }}
  >
    {user.full_name}
  </Button>
)}

      </Group>
    </AppShell.Header>
  );
}
