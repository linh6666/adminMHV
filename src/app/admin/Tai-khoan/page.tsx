'use client';

import { useEffect, useState } from 'react';
import { Table, Checkbox, Divider, Loader, Center } from '@mantine/core';
import { modals } from '@mantine/modals';
import { api } from '../../../../library/axios'; // axios instance đã cấu hình
import AppAction from '../../common/AppAction';
import { NotificationExtension } from '../../extension/NotificationExtension';
import CreateView from './CreateView';
import DeleteView from './DeleteView';
import EditView from './EditView';
import { ActiveUser } from './ActiveUser';
import { ActiveToken } from './ActivesToken';
import AppSearch from '@/app/common/AppSearch';
import { EuiSpacer } from '@elastic/eui';

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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse>('/api/v1/users/', {
        params: { skip: 0, limit: 100 },
      });

      if (Array.isArray(res.data.data)) {
        setUsers(res.data.data);
        setSelectedIds([]); // reset chọn khi load lại
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
  }, []);

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

    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Chỉnh sửa tài khoản</div>,
      children: <EditView id={user.id} name={user.full_name} onSearch={fetchUsers} />,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const openModalDelete = () => {
    if (selectedIds.length < 1) {
      NotificationExtension.Warn('Vui lòng chọn ít nhất một người dùng để xóa');
      return;
    }

    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa người dùng</div>,
      children: <DeleteView idItem={selectedIds.map(id => Number(id))} onSearch={fetchUsers} />
,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const openModalActivated = () => {
    if (selectedIds.length < 1) {
      NotificationExtension.Warn('Vui lòng chọn người dùng để kích hoạt');
      return;
    }

    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Kích hoạt trạng thái</div>,
      children: (
        <ActiveToken
  idItem={selectedIds.map(id => Number(id))}
  ActiveToken={true}
  onSearch={fetchUsers}
/>

      ),
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const openModalActiveAdmins = () => {
    if (selectedIds.length < 1) {
      NotificationExtension.Warn('Vui lòng chọn người dùng để cấp quyền Admin');
      return;
    }

    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Cấp quyền Admin</div>,
      children: (
       <ActiveUser
  idItem={selectedIds.map(id => Number(id))}
  ActiveTokenAdmin={true}
  onSearch={fetchUsers}
/>

      ),
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
        openActivated={openModalActivated}
        openActiveAdmins={openModalActiveAdmins}
      />
      <Divider my="sm" />
<AppSearch/>
 <EuiSpacer size="l" />

      {loading ? (
        <Center my="xl">
          <Loader />
        </Center>
      ) : (
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  aria-label="Select all users"
                />
              </th>
             <th style={{ fontSize: "12px" }}>Họ tên</th>
<th style={{ fontSize: "12px" }}>Email</th>
<th style={{ fontSize: "12px" }}>Số điện thoại</th>
<th style={{ fontSize: "12px" }}>Ngày tạo</th>
<th style={{ fontSize: "12px" }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{
                  backgroundColor: selectedIds.includes(user.id)
                    ? 'var(--mantine-color-blue-light)'
                    : undefined,
                }}
              >
                <td>
                  <Checkbox
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                    aria-label={`Select user ${user.full_name}`}
                  />
                </td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{new Date(user.creation_time).toLocaleString()}</td>
                <td>{user.is_active ? 'Đang hoạt động' : 'Không hoạt động'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

