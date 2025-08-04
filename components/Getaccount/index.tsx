'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Checkbox,
  Divider,
  Loader,
  Center,
  Text,
  Tooltip,
  Group,
  ActionIcon,
  Pagination,
  Select,
  Flex,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { api } from '../../library/axios';
import AppAction from '../../src/app/common/AppAction';
import { NotificationExtension } from '../../src/app/extension/NotificationExtension';
import CreateView from './CreateView';
import DeleteView from './DeleteView';
import EditView from './EditView';

import AppSearch from '@/app/common/AppSearch';
import { IconChevronDown, IconEdit, IconTrash } from '@tabler/icons-react';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  creation_time: string;
}

interface ApiResponse {
  data: User[];
  count: number;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [activePage, setActivePage] = useState(1); // Bắt đầu từ trang 1 (Mantine dùng 1-based index)
  const [rowSize, setRowSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const skip = (activePage - 1) * rowSize;

      const res = await api.get<ApiResponse>('/api/v1/users/', {
        params: { skip, limit: rowSize },
      });

      if (Array.isArray(res.data.data)) {
        setUsers(res.data.data);
        setTotalCount(res.data.count || 0);
        setSelectedIds([]);
      } else {
        NotificationExtension.Fails('Dữ liệu người dùng không hợp lệ');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      NotificationExtension.Fails('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activePage, rowSize]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((user) => user.id));
    }
  };

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
      NotificationExtension.Warn('Vui lòng chọn ít nhất một người dùng để xóa');
      return;
    }

    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa người dùng</div>,
      children: <DeleteView idItem={selectedIds} onSearch={fetchUsers} />,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const openEditUserModal = (user: User) => {
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

  const openDeleteUserModal = (user: User) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa người dùng</div>,
      children: <DeleteView idItem={[user.id]} onSearch={fetchUsers} />,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const allSelected = users.length > 0 && selectedIds.length === users.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < users.length;

  return (
    <>
      <AppAction
        openModal={openModal}
        openModalDelete={openModalDelete}
        openModalEdit={openModalEdit}
      />
      <Divider my="sm" />
      <AppSearch />
      <Divider my="sm" />

      {loading ? (
        <Center my="xl">
          <Loader />
        </Center>
      ) : (
        <>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 40 }}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                  />
                </Table.Th>
                <Table.Th>Họ tên</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Số điện thoại</Table.Th>
                <Table.Th>Ngày tạo</Table.Th>
                <Table.Th>Trạng thái</Table.Th>
                <Table.Th>Hoạt động</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user) => (
                <Table.Tr
                  key={user.id}
                  style={{
                    backgroundColor: selectedIds.includes(user.id)
                      ? 'var(--mantine-color-blue-light)'
                      : undefined,
                  }}
                >
                  <Table.Td>
                    <Checkbox
                      checked={selectedIds.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                    />
                  </Table.Td>
                  <Table.Td>{user.full_name}</Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>{user.phone}</Table.Td>
                  <Table.Td>{new Date(user.creation_time).toLocaleString()}</Table.Td>
                  <Table.Td>
                    <Text>
                      <span
                        style={{
                          color: user.is_active ? 'green' : 'red',
                          marginRight: 6,
                        }}
                      >
                        ●
                      </span>
                      {user.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group>
                      <Tooltip label="Chỉnh sửa" withArrow>
                        <ActionIcon
                          color="blue"
                          variant="light"
                          onClick={() => openEditUserModal(user)}
                        >
                          <IconEdit size={18} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Xóa" withArrow>
                        <ActionIcon
                          color="red"
                          variant="light"
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

          <Flex justify="space-between" align="center" mt="md">
            <div>

 {/* <Select
  data={['10', '20', '50']}
  value={rowSize.toString()}
  onChange={(val) => {
    if (val) {
      setRowSize(Number(val));
      setActivePage(1); // reset về trang đầu tiên
    }
  }}
  variant="unstyled"
  placeholder={`Rows per page: ${rowSize}`}
  style={{ width: 160 }}
  allowDeselect={false}
  rightSection={<IconChevronDown size={14} />}
  styles={{
    input: {
      fontSize: 14,
      fontWeight: 500,
      color: '#2E3A59',
      paddingLeft: 0,
    },
  }}
/> */}
              
            </div>
      {/* <Select
  data={['10', '20', '50']}
  value={rowSize.toString()}
  onChange={(val) => {
    if (val) {
      setRowSize(Number(val));
      setActivePage(1); // reset về trang đầu tiên
    }
  }}
  variant="unstyled"
  placeholder={`Rows per page: ${rowSize}`}
  style={{ width: 160 }}
  allowDeselect={false}
  rightSection={<IconChevronDown size={14} />}
  styles={{
    input: {
      fontSize: 14,
      fontWeight: 500,
      color: '#2E3A59',
      paddingLeft: 0,
    },
  }}
/> */}
            <Pagination
              value={activePage}
              onChange={setActivePage}
              total={Math.ceil(totalCount / rowSize)}
            />
          </Flex>
        </>
      )}
    </>
  );
}