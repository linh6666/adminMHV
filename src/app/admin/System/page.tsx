'use client';
import React, { useEffect, useState } from 'react';
import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiTableFieldDataColumnType,
  EuiHealth,
} from '@elastic/eui';
import { getListRoles } from '../../../../api/apigetlistsystym';
import { Divider } from '@mantine/core';
import CreateView from './CreateView';
import DeleteView from './DeleteView';
import EditView from './EditView';
import AppAction from '../../common/AppAction';
import { modals } from '@mantine/modals';
import { NotificationExtension } from '../../extension/NotificationExtension';

type Role = {
  id: string;
  description: string;
  rank_total: number;
};

const RoleTable = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('⚠️ Không tìm thấy token. Vui lòng đăng nhập.');
      setLoading(false);
      return;
    }

    try {
      const data = await getListRoles(token);
      console.log('📦 Dữ liệu vai trò trả về:', data);
      setRoles(data || []);
    } catch (err: any) {
      console.error('❌ Lỗi gọi API:', err);
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const columns: Array<EuiBasicTableColumn<Role>> = [
    {
      field: 'id',
      name: 'ID',
      truncateText: true,
      width: '30%',
    },
    {
      field: 'description',
      name: 'Tên vai trò',
      width: '20%',
      'data-test-subj': 'descriptionCell',
      mobileOptions: {
        show: true,
        header: true,
        enlarge: true,
      },
    },
    {
      field: 'rank_total',
      name: 'Cấp bậc',
      render: (rank: number) => (
        <EuiHealth color="success">{rank}</EuiHealth>
      ),
      truncateText: true,
    },
  ];

  const openModal = () => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Thêm mới tài khoản</div>,
      children: <CreateView onSearch={fetchRoles} />,
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

    const user = roles.find((u) => u.id === selectedIds[0]);
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
      children: <DeleteView idItem={selectedIds} onSearch={fetchRoles} />,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const openEditUserModal = (user: Role) => {
    modals.openConfirmModal({
      title: (
        <div style={{ fontWeight: 600, fontSize: 18 }}>
          Chỉnh sửa tài khoản: {user.description}
        </div>
      ),
      children: <EditView id={user.id} onSearch={fetchRoles} />,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const openDeleteUserModal = (user: Role) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa người dùng</div>,
      children: <DeleteView idItem={[user.id]} onSearch={fetchRoles} />,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  return (
    <>
      <AppAction
        openModal={openModal}
        openModalDelete={openModalDelete}
        openModalEdit={openModalEdit}
      />
      <Divider my="sm" label="Danh sách người dùng" labelPosition="center" />
      <EuiBasicTable
        tableCaption="Danh sách vai trò hệ thống"
        responsiveBreakpoint={false}
        items={roles}
        rowHeader="description"
        columns={columns}
        loading={loading}
        noItemsMessage={
          error
            ? error
            : loading
            ? 'Đang tải dữ liệu...'
            : 'Không có vai trò nào.'
        }
      />
    </>
  );
};

export default RoleTable;

