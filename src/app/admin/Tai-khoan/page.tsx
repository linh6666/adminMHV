
'use client';

import React, { useEffect, useState } from 'react';
import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiHealth,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonIcon,
  Criteria,
} from '@elastic/eui';
import { Badge, Divider } from '@mantine/core';
import { modals } from '@mantine/modals';

import { getListRoles } from '../../../../api/apigetlistuse';
import CreateView from './CreateView';
import DeleteView from './DeleteView';
import EditView from './EditView';
import AppAction from '../../common/AppAction';
import AppSearch from '@/app/common/AppSearch';
import { NotificationExtension } from '../../extension/NotificationExtension';
import { paginationBase, PaginationOptions } from '../../_base/model/BaseTable';

type Role = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean;
  is_superuser: boolean;
  system_rank: number | null;
};

const RoleTable = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Role[]>([]);
  const [pagination, setPagination] = useState<PaginationOptions>(paginationBase);

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
      const skip = pagination.pageIndex * pagination.pageSize;
      const limit = pagination.pageSize;

      const res = await getListRoles({
        token,
        skip,
        limit,
      });

      const { data, total } = res;

      setRoles(data || []);
      setPagination((prev) => ({
        ...prev,
        totalItemCount: total ?? data.length ?? 0,
      }));
    } catch (err: any) {
      console.error('❌ Lỗi gọi API:', err);
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [pagination.pageIndex, pagination.pageSize]);

   const columns: Array<EuiBasicTableColumn<Role>> = [
    {
      field: 'id',
      name: 'ID',
      truncateText: true,
     width: '40%',
   },
      {
      field: 'full_name',
      name: 'Họ tên',
      truncateText: true,
      width: '25%',
    },
          {
      field: 'email',
      name: 'Email',
      truncateText: true,
      width: '30%',
    },
          {
      field: 'phone',
      name: 'SĐT',
      truncateText: true,
      width: '20%',
    },
        {
         field: 'system_rank',
          name: 'Cấp bậc',
          width: '20%',
          render: (rank: number) => <EuiHealth color="success">{rank}</EuiHealth>,
         truncateText: true,
        },
        {
  field: 'is_superuser',
  name: 'Quyền hệ thống ',
  width: '20%',
  render: (isSuperuser: boolean) => (
    isSuperuser ? (
      <Badge color="yellow">Quản trị</Badge>
    ) : (
      <Badge variant="outline">Người dùng</Badge>
    )
  ),
  truncateText: true,
},
   
 
    {
      name: 'Actions',
      width: '15%',
      render: (role: Role) => {
       return (
         <EuiFlexGroup wrap={false} gutterSize="s" alignItems="center">
            <EuiFlexItem grow={false}>
               <EuiButtonIcon
                 iconType="documentEdit"
                aria-label="Edit"
                color="success"
                 onClick={() => openEditUserModal(role)}
               />
            </EuiFlexItem>
             <EuiFlexItem grow={false}>
              <EuiButtonIcon
                 iconType="trash"
                 aria-label="Delete"
                 color="danger"
                onClick={() => openDeleteUserModal(role)}
              />
           </EuiFlexItem>
           </EuiFlexGroup>
        );
       },
  },
  ];

  const openModal = () => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Thêm vai trò mới</div>,
      children: <CreateView onSearch={fetchRoles} />,
      size: 'lg',
      radius: 'md',
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const openModalEdit = () => {
    if (selectedItems.length !== 1) {
      NotificationExtension.Warn('Vui lòng chọn 1 vai trò để chỉnh sửa');
      return;
    }
    openEditUserModal(selectedItems[0]);
  };

  const openModalDelete = () => {
    if (selectedItems.length < 1) {
      NotificationExtension.Warn('Vui lòng chọn ít nhất 1 vai trò để xóa');
      return;
    }

    const ids = selectedItems.map((role) => role.id);
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa vai trò</div>,
      children: <DeleteView idItem={ids} onSearch={fetchRoles} />,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const openEditUserModal = (role: Role) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Chỉnh sửa vai trò</div>,
      children: <EditView id={role.id} onSearch={fetchRoles} />,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const openDeleteUserModal = (role: Role) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa vai trò</div>,
      children: <DeleteView idItem={[role.id]} onSearch={fetchRoles} />,
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const selection = {
    selectable: () => true,
    onSelectionChange: (items: Role[]) => setSelectedItems(items),
  };

  const onTableChange = ({ page }: Criteria<Role>) => {
    if (page) { // Kiểm tra xem page có tồn tại không
      setPagination((prev) => ({
        ...prev,
        pageIndex: page.index ?? 0,
        pageSize: page.size ?? 50,
      }));
    }
  };

  return (
    <>
      <AppAction
        openModal={openModal}
        openModalDelete={openModalDelete}
        openModalEdit={openModalEdit}
      />

      <Divider my="sm" label="Danh sách vai trò" labelPosition="center" />
      <AppSearch />
      <Divider my="sm" />

      <EuiBasicTable
        tableCaption="Danh sách vai trò hệ thống"
        responsiveBreakpoint={false}
        items={roles}
        columns={columns}
        loading={loading}
        itemId="id"
        selection={selection}
        rowHeader="description"
        noItemsMessage={
          error
            ? error
            : loading
            ? 'Đang tải dữ liệu...'
            : 'Không có vai trò nào.'
        }
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          totalItemCount: pagination.totalItemCount ?? 0,
          pageSizeOptions: pagination.pageSizeOptions ?? [10, 20, 50, 150, 200],
        }}
        onChange={onTableChange}
      />
    </>
  );
};

export default RoleTable;