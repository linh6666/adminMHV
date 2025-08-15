'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiHealth,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonIcon,
  Criteria,
} from '@elastic/eui';
import { Divider } from '@mantine/core';
import { modals } from '@mantine/modals';

import { getListRoles } from '../../../../api/apiUserProjectRole';
import CreateView from './CreateView';
import DeleteView from './DeleteView';
import EditView from './EditView';
import AppAction from '../../common/AppAction';
import AppSearch from '@/app/common/AppSearch';
import { NotificationExtension } from '../../extension/NotificationExtension';
import { paginationBase, PaginationOptions } from '../../_base/model/BaseTable';

/* ==== Type cho API ==== */
export type Role = {
  id: string;
  user_id: string;
  user_email: string;
  project_id: string;
  project_name: string;
  role_id: string;
  role_name: string;
  role_rank: number;
  user_project_role_id: string;
};

export interface RoleApiResponse {
  assignments: Role[];
  total: number;
}

const RoleTable = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Role[]>([]);
  const [pagination, setPagination] = useState<PaginationOptions>(paginationBase);

  const fetchRoles = useCallback(async () => {
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

      const res: RoleApiResponse = await getListRoles({ token, skip, limit });

      // Map lại user_project_role_id nếu API trả về id khác
      const rolesWithId = res.assignments.map((r) => ({
        ...r,
        user_project_role_id: r.user_project_role_id || r.id,
      }));

      setRoles(rolesWithId);
      setPagination((prev) => ({
        ...prev,
        totalItemCount: res.total ?? res.assignments.length ?? 0,
      }));
    } catch (err: unknown) {
      console.error('❌ Lỗi gọi API:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  /* ==== Hàm modal ==== */
  const openModal = () => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Thêm dự án cho người dùng</div>,
      children: <CreateView onSearch={fetchRoles} />,
      size: 'lg',
      radius: 'md',
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  const openEditUserModal = (role: Role) => {
    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Sửa người dùng dự án</div>,
      children: (
        <EditView
          user_id={role.user_id}
          project_id={role.project_id}
          old_role_id={role.role_id}
          user_project_role_id={role.user_project_role_id}
          onSearch={fetchRoles}
        />
      ),
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  // Xóa 1 vai trò
  const openDeleteUserModal = (role: Role) => {
    if (!role.user_project_role_id) {
      NotificationExtension.Warn('ID vai trò không hợp lệ.');
      return;
    }

    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa người dùng dự án</div>,
      children: (
        <DeleteView
          idItem={[role.user_project_role_id]}
          onSearch={fetchRoles}
        />
      ),
      confirmProps: { display: 'none' },
      cancelProps: { display: 'none' },
    });
  };

  // Xóa nhiều vai trò
  const openModalDelete = () => {
    const ids = selectedItems
      .map((role) => role.user_project_role_id)
      .filter(Boolean); // loại bỏ undefined

    if (ids.length < 1) {
      NotificationExtension.Warn('Vui lòng chọn ít nhất 1 vai trò hợp lệ để xóa');
      return;
    }

    modals.openConfirmModal({
      title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa người dùng dự án</div>,
      children: <DeleteView idItem={ids} onSearch={fetchRoles} />,
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

  /* ==== Bảng dữ liệu ==== */
  const columns: Array<EuiBasicTableColumn<Role>> = [
    { field: 'user_id', name: 'ID Người Dùng', truncateText: true, width: '20%' },
    { field: 'user_email', name: 'Email', truncateText: true, width: '25%' },
    { field: 'project_id', name: 'ID Dự Án', truncateText: true, width: '22%' },
    { field: 'project_name', name: 'Tên Dự Án', truncateText: true, width: '25%' },
    { field: 'role_id', name: 'ID Vai Trò', truncateText: true, width: '20%' },
    { field: 'role_name', name: 'Tên Vai Trò', truncateText: true, width: '20%' },
    {
      field: 'role_rank',
      name: 'Cấp bậc vai trò',
      width: '10%',
      render: (rank: number) => <EuiHealth color="success">{rank}</EuiHealth>,
      truncateText: true,
    },
    {
      name: 'Thao Tác',
      width: '15%',
      render: (role: Role) => (
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
      ),
    },
  ];

  /* ==== Selection & Pagination ==== */
  const selection = {
    selectable: () => true,
    onSelectionChange: (items: Role[]) => setSelectedItems(items),
  };

  const onTableChange = ({ page }: Criteria<Role>) => {
    if (page) {
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

      <Divider my="sm" label="Danh sách người dùng dự án" labelPosition="center" />
      <AppSearch />
      <Divider my="sm" />

      <EuiBasicTable
        tableCaption="Danh sách vai trò hệ thống"
        responsiveBreakpoint={false}
        items={roles}
        columns={columns}
        loading={loading}
        itemId="role_id"
        selection={selection}
        rowHeader="role_name"
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

