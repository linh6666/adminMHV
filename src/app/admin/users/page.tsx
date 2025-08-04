'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Loader,
  Center,
  Text,
  Divider,
  ActionIcon,
  Group,
  Tooltip,
  Paper,
  ScrollArea,
  Title,
} from '@mantine/core';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { getListRoles } from '../../../../api/getlistrole';

interface RoleType {
  id: string;
  name: string;
  description?: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Không tìm thấy token đăng nhập');
        setLoading(false);
        return;
      }

      try {
        const data = await getListRoles(token);
        setRoles(data);
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi khi tải danh sách quyền');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div>
      <Title order={4} mb="sm">Quản lý quyền</Title>
      <Divider my="sm" label="Danh sách quyền" labelPosition="center" />

      {loading ? (
        <Center mt="lg">
          <Loader size="md" />
        </Center>
      ) : error ? (
        <Center mt="lg">
          <Text color="red">{error}</Text>
        </Center>
      ) : roles.length === 0 ? (
        <Center mt="lg">
          <Text color="dimmed">Không có dữ liệu quyền nào.</Text>
        </Center>
      ) : (
        <ScrollArea>
          <Table  highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Tên quyền</Table.Th>
                <Table.Th>Mô tả</Table.Th>
                <Table.Th >Thao tác</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {roles.map((role) => (
                <Table.Tr key={role.id}>
                  <Table.Td>{role.id}</Table.Td>
                  <Table.Td>{role.name}</Table.Td>
                  <Table.Td>{role.description || 'Không có mô tả'}</Table.Td>
                  <Table.Td>
                     <Group gap="xs">
    <Tooltip label="Xem chi tiết">
      <ActionIcon variant="subtle" color="gray">
        <IconEye size={18} />
      </ActionIcon>
    </Tooltip>
    <Tooltip label="Sửa quyền">
      <ActionIcon variant="subtle" color="blue">
        <IconEdit size={18} />
      </ActionIcon>
    </Tooltip>
    <Tooltip label="Xoá quyền">
      <ActionIcon variant="subtle" color="red">
        <IconTrash size={18} />
      </ActionIcon>
    </Tooltip>
  </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
}



