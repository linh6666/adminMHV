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
  ScrollArea,
  Badge,
  Checkbox,
  Pagination,
  Flex,
} from '@mantine/core';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import AppAction from '../../common/AppAction';
import { modals } from '@mantine/modals';
import { getListRoles } from '../../../../api/apigetlistuse';
import { NotificationExtension } from '../../extension/NotificationExtension';
import CreateView from './CreateView';
import DeleteView from './DeleteView';
import EditView from './EditView';

interface UserType {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean;
  is_superuser: boolean;
  system_rank: number | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activePage, setActivePage] = useState(1); // ✅
  const rowSize = 10; // ✅

  const fetchUsers = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Không tìm thấy token đăng nhập');
      setLoading(false);
      return;
    }

    try {
      const res = await getListRoles(token);
      setUsers(res || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Đã xảy ra lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = () => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Thêm mới tài khoản</div>,
      children: <CreateView onSearch={fetchUsers} />,
      size: 'lg',
      radius: 'md',
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const openModalEdit = () => {
    if (selectedIds.length !== 1) {
      NotificationExtension.Warn('Vui lòng chọn 1 người dùng để chỉnh sửa');
      return;
    }

    const user = users.find((u) => u.id === selectedIds[0]);
    if (!user) return;

    openEditUserModal(user);
  };

  const openModalDelete = () => {
    if (selectedIds.length < 1) {
      NotificationExtension.Warn('Vui lòng chọn ít nhất 1 người dùng để xóa');
      return;
    }

    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa người dùng</div>,
      children: <DeleteView idItem={selectedIds} onSearch={fetchUsers} />,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const openEditUserModal = (user: UserType) => {
    modals.openConfirmModal({
      title: (
        <div style={{ fontWeight: 600, fontSize: 18 }}>
          Chỉnh sửa tài khoản: {user.full_name}
        </div>
      ),
      children: <EditView id={user.id} onSearch={fetchUsers} />,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const openDeleteUserModal = (user: UserType) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa người dùng</div>,
      children: <DeleteView idItem={[user.id]} onSearch={fetchUsers} />,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  // ✅ Tính dữ liệu trang hiện tại
  const totalCount = users.length;
  const paginatedUsers = users.slice((activePage - 1) * rowSize, activePage * rowSize);

  return (
    <div>
      <AppAction openModal={openModal} openModalDelete={openModalDelete} openModalEdit={openModalEdit} />
      <Divider my="sm" label="Danh sách người dùng" labelPosition="center" />

      {loading ? (
        <Center mt="lg">
          <Loader size="md" />
        </Center>
      ) : error ? (
        <Center mt="lg">
          <Text color="red">{error}</Text>
        </Center>
      ) : users.length === 0 ? (
        <Center mt="lg">
          <Text color="dimmed">Không có dữ liệu người dùng nào.</Text>
        </Center>
      ) : (
        <>
          <ScrollArea>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>
                    <Checkbox
                      checked={paginatedUsers.every((u) => selectedIds.includes(u.id))}
                      indeterminate={
                        paginatedUsers.some((u) => selectedIds.includes(u.id)) &&
                        !paginatedUsers.every((u) => selectedIds.includes(u.id))
                      }
                      onChange={(event) => {
                        const idsOnPage = paginatedUsers.map((u) => u.id);
                        if (event.currentTarget.checked) {
                          setSelectedIds((prev) => Array.from(new Set([...prev, ...idsOnPage])));
                        } else {
                          setSelectedIds((prev) => prev.filter((id) => !idsOnPage.includes(id)));
                        }
                      }}
                    />
                  </Table.Th>
                  <Table.Th>id</Table.Th>
                  <Table.Th>Họ tên</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>SĐT</Table.Th>
                  <Table.Th>Trạng thái</Table.Th>
                  <Table.Th>Quyền hệ thống</Table.Th>
                  <Table.Th>Thao tác</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedUsers.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td>
                      <Checkbox
                        checked={selectedIds.includes(user.id)}
                        onChange={(event) => {
                          if (event.currentTarget.checked) {
                            setSelectedIds((prev) => [...prev, user.id]);
                          } else {
                            setSelectedIds((prev) => prev.filter((id) => id !== user.id));
                          }
                        }}
                      />
                    </Table.Td>
                    <Table.Td>{user.id}</Table.Td>
                    <Table.Td>{user.full_name || '---'}</Table.Td>
                    <Table.Td>{user.email}</Table.Td>
                    <Table.Td>{user.phone || '---'}</Table.Td>
                    <Table.Td>
                      <Badge color={user.is_active ? 'green' : 'red'}>
                        {user.is_active ? 'Hoạt động' : 'Tạm khoá'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {user.is_superuser ? (
                        <Badge color="yellow">Quản trị</Badge>
                      ) : (
                        <Badge variant="outline">Người dùng</Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Sửa thông tin">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => openEditUserModal(user)}
                          >
                            <IconEdit size={18} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Xoá người dùng">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => openDeleteUserModal(user)}
                          >
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

          {/* ✅ Pagination */}
         <Flex justify="flex-end" mt="md">
            <Pagination
              value={activePage}
              onChange={setActivePage}
              total={Math.ceil(totalCount / rowSize)}
            />
          </Flex>
        </>
      )}
    </div>
  );
}


