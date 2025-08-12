// 'use client';

// import React, { useEffect, useState } from 'react';
// import {
//   EuiBasicTable,
//   EuiBasicTableColumn,
//   EuiHealth,
//   EuiFlexGroup,
//   EuiFlexItem,
//   EuiButtonIcon,
//   Criteria,
// } from '@elastic/eui';
// import { Divider } from '@mantine/core';
// import { modals } from '@mantine/modals';

// import { getListRoles } from '../../../../api/getlistrole';
// import CreateView from './CreateView';
// import DeleteView from './DeleteView';
// import EditView from './EditView';
// import AppAction from '../../common/AppAction';
// import AppSearch from '@/app/common/AppSearch';
// import { NotificationExtension } from '../../extension/NotificationExtension';
// import { paginationBase, PaginationOptions } from '../../_base/model/BaseTable'; // ✅ import từ file pagination bạn đã có

// type Role = {
//   id: string;
//   name: string;
//   description?: string;
//   rank:number;
// };

// const RoleTable = () => {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedItems, setSelectedItems] = useState<Role[]>([]);

//   // ✅ Pagination state
//   const [pagination, setPagination] = useState<PaginationOptions>(paginationBase);

//   const fetchRoles = async () => {
//     setLoading(true);
//     setError(null);

//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       setError('⚠️ Không tìm thấy token. Vui lòng đăng nhập.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const data = await getListRoles(token);
//       console.log('📦 Dữ liệu vai trò trả về:', data);
//       setRoles(data || []);
//       setPagination((prev) => ({
//         ...prev,
//         totalItemCount: data?.length || 0,
//       }));
//     } catch (err: any) {
//       console.error('❌ Lỗi gọi API:', err);
//       setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const columns: Array<EuiBasicTableColumn<Role>> = [
//     {
//       field: 'id',
//       name: 'ID',
//       truncateText: true,
//       width: '40%',
//     },
//      {
//       field: 'name',
//       name: 'Tên quyền',
//       truncateText: true,
//       width: '30%',
//     },
//         {
//           field: 'rank',
//           name: 'Cấp bậc',
//           width: '20%',
//           render: (rank: number) => <EuiHealth color="success">{rank}</EuiHealth>,
//           truncateText: true,
//         },
//          {
//       field: 'description',
//       name: 'Mô tả',
//       truncateText: true,
//       width: '30%',
//     },
 
//     {
//       name: 'Actions',
//       width: '25%',
//       render: (role: Role) => {
//         return (
//           <EuiFlexGroup wrap={false} gutterSize="s" alignItems="center">
//             <EuiFlexItem grow={false}>
//               <EuiButtonIcon
//                 iconType="documentEdit"
//                 aria-label="Edit"
//                 color="success"
//                 onClick={() => openEditUserModal(role)}
//               />
//             </EuiFlexItem>
//             <EuiFlexItem grow={false}>
//               <EuiButtonIcon
//                 iconType="trash"
//                 aria-label="Delete"
//                 color="danger"
//                 onClick={() => openDeleteUserModal(role)}
//               />
//             </EuiFlexItem>
//           </EuiFlexGroup>
//         );
//       },
//     },
//   ];

//   const openModal = () => {
//     modals.openConfirmModal({
//       title: <div style={{ fontWeight: 600, fontSize: 18 }}>Thêm mới tài khoản</div>,
//       children: <CreateView onSearch={fetchRoles} />,
//       size: 'lg',
//       radius: 'md',
//       confirmProps: { display: 'none' },
//       cancelProps: { display: 'none' },
//     });
//   };

//   const openModalEdit = () => {
//     if (selectedItems.length !== 1) {
//       NotificationExtension.Warn('Vui lòng chọn 1 người dùng để chỉnh sửa');
//       return;
//     }
//     openEditUserModal(selectedItems[0]);
//   };

//   const openModalDelete = () => {
//     if (selectedItems.length < 1) {
//       NotificationExtension.Warn('Vui lòng chọn ít nhất 1 người dùng để xóa');
//       return;
//     }

//     const ids = selectedItems.map((u) => u.id);
//     modals.openConfirmModal({
//       title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa người dùng</div>,
//       children: <DeleteView idItem={ids} onSearch={fetchRoles} />,
//       confirmProps: { display: 'none' },
//       cancelProps: { display: 'none' },
//     });
//   };

//   const openEditUserModal = (user: Role) => {
//     modals.openConfirmModal({
//       title: (
//         <div style={{ fontWeight: 600, fontSize: 18 }}>
//           Chỉnh sửa tài khoản: {user.description}
//         </div>
//       ),
//       children: <EditView id={user.id} onSearch={fetchRoles} />,
//       confirmProps: { display: 'none' },
//       cancelProps: { display: 'none' },
//     });
//   };

//   const openDeleteUserModal = (user: Role) => {
//     modals.openConfirmModal({
//       title: <div style={{ fontWeight: 600, fontSize: 18 }}>Xóa người dùng</div>,
//       children: <DeleteView idItem={[user.id]} onSearch={fetchRoles} />,
//       confirmProps: { display: 'none' },
//       cancelProps: { display: 'none' },
//     });
//   };

//   const selection = {
//     selectable: (role: Role) => true,
//     onSelectionChange: (items: Role[]) => {
//       setSelectedItems(items);
//     },
//   };

//   // ✅ Xử lý phân trang thay đổi
//   const onTableChange = ({ page }: Criteria<Role>) => {
//     setPagination({
//       ...pagination,
//       pageIndex: page?.index ?? 0,
//       pageSize: page?.size ?? 50,
//     });
//   };

//   return (
//     <>
//       <AppAction
//         openModal={openModal}
//         openModalDelete={openModalDelete}
//         openModalEdit={openModalEdit}
//       />
//       <Divider my="sm" label="Danh sách người dùng" labelPosition="center" />
//        <AppSearch />
//       <Divider my="sm" />
//       <EuiBasicTable
//         tableCaption="Danh sách vai trò hệ thống"
//         responsiveBreakpoint={false}
//         items={roles.slice(
//           pagination.pageIndex * pagination.pageSize,
//           (pagination.pageIndex + 1) * pagination.pageSize
//         )} // ✅ Cắt dữ liệu theo trang
//         columns={columns}
//         loading={loading}
//         itemId="id"
//         selection={selection}
//         rowHeader="description"
//         noItemsMessage={
//           error
//             ? error
//             : loading
//             ? 'Đang tải dữ liệu...'
//             : 'Không có vai trò nào.'
//         }
//         pagination={{
//           pageIndex: pagination.pageIndex,
//           pageSize: pagination.pageSize,
//           totalItemCount: pagination.totalItemCount ?? 0,
//           pageSizeOptions: pagination.pageSizeOptions ?? [20, 50, 100],
//         }}
//         onChange={onTableChange}
//       />
//     </>
//   );
// };

// export default RoleTable;



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

import { getListRoles } from '../../../../api/getlistrole';
import CreateView from './CreateView';
import DeleteView from './DeleteView';
import EditView from './EditView';
import AppAction from '../../common/AppAction';
import AppSearch from '@/app/common/AppSearch';
import { NotificationExtension } from '../../extension/NotificationExtension';
import { paginationBase, PaginationOptions } from '../../_base/model/BaseTable';

type Role = {
  id: string;
  name: string;
  description?: string;
  rank: number;
};

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('❌ Lỗi gọi API:', err);
        setError(err.message);
      } else {
        console.error('❌ Lỗi không xác định:', err);
        setError('Đã xảy ra lỗi khi tải dữ liệu.');
      }
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const columns: Array<EuiBasicTableColumn<Role>> = [
    {
      field: 'id',
      name: 'ID',
      truncateText: true,
      width: '40%',
    },
    {
      field: 'name',
      name: 'Tên quyền',
      truncateText: true,
      width: '30%',
    },
    {
      field: 'rank',
      name: 'Cấp bậc',
      width: '20%',
      render: (rank: number) => <EuiHealth color="success">{rank}</EuiHealth>,
      truncateText: true,
    },
    {
      field: 'description',
      name: 'Mô tả',
      truncateText: true,
      width: '30%',
    },
    {
      name: 'Actions',
      width: '25%',
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
      title: (
        <div style={{ fontWeight: 600, fontSize: 18 }}>
          Chỉnh sửa vai trò: {role.description}
        </div>
      ),
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
