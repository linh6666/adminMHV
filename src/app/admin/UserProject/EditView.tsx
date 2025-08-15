"use client";

import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  NativeSelect,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { api } from "../../../../library/axios";
import { API_ROUTE } from "../../../../const/apiRouter";
import { CreateProjectPayload } from "../../../../api/apiEditUserProject";

// API
import { getListRoles as getProjects } from "../../../../api/apigetlistprojects"; // projects
import { getListRoles as getRoles } from "../../../../api/getlistrole"; // roles
import { getListRoles as getUsers } from "../../../../api/apigetlistuse"; // users

interface EditViewProps {
  onSearch: () => Promise<void>;
  user_id: string;
  project_id: string;
  old_role_id: string;
  user_project_role_id: string;
}

interface Option {
  value: string;
  label: string;
}

interface UserProjectRole {
  project_id: string;
  role_id: string;
  user_id: string;
}

const EditView = ({
  onSearch,
  user_id,
  project_id,
  old_role_id,
  user_project_role_id,
}: EditViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);
  const hasFetched = useRef(false);

  const [projectNameOptions, setProjectNameOptions] = useState<Option[]>([]);
  const [roleOptions, setRoleOptions] = useState<Option[]>([]);
  const [userOptions, setUserOptions] = useState<Option[]>([]);

  const form = useForm<CreateProjectPayload>({
    initialValues: {
      project_id: "",
      role_id: "",
      user_id: "",
    },
    validate: {
      project_id: isNotEmpty("không được để trống"),
      role_id: isNotEmpty("không được để trống"),
      user_id: isNotEmpty("Cấp bậc không được để trống"),
    },
  });

  /** Gọi API lấy thông tin user để fill form */
  const fetchUserDetail = useCallback(async () => {
    if (!user_project_role_id) return;
    open();
    try {
      const url = API_ROUTE.GET_DETAIL_PROJECT_USERS.replace(
        "{user_project_role_id}",
        user_project_role_id
      );
      const { data: userData } = await api.get<UserProjectRole>(url);
      form.setValues({
        project_id: userData.project_id || "",
        role_id: userData.role_id || "",
        user_id: userData.user_id || "",
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu user:", error);
      alert("Không thể tải thông tin người dùng.");
      modals.closeAll();
    } finally {
      close();
    }
  }, [user_project_role_id, open, close, form]);

  /** Gọi API lấy list project, role, user */
  const fetchSelectOptions = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token") || "";
      if (!token) {
        console.error("Token không tồn tại");
        return;
      }

      // Projects
      const resProjects = await getProjects({ token }) as { data: { id: string }[] };
      setProjectNameOptions(
        resProjects.data.map((item) => ({
          value: String(item.id),
          label: item.id,
        }))
      );

      // Roles
      const resRoles = await getRoles({ token }) as { data: { id: string }[] };
      setRoleOptions(
        resRoles.data.map((item) => ({
          value: String(item.id),
          label: item.id,
        }))
      );

      // Users
      const resUsers = await getUsers({ token }) as { data: { id: string }[] };
      setUserOptions(
        resUsers.data.map((item) => ({
          value: String(item.id),
          label: item.id,
        }))
      );
    } catch (error) {
      console.error("Lỗi khi load danh sách select:", error);
    }
  }, []); // Không có phụ thuộc

  /** Chỉ gọi 1 lần khi mở modal */
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchSelectOptions();
      fetchUserDetail();
    }
  }, [fetchSelectOptions, fetchUserDetail]);

  /** Submit form */
  const handleSubmit = async (values: CreateProjectPayload) => {
    open();
    try {
      const url = API_ROUTE.EDIT_PROJECT_USERS
        .replace("{user_id}", user_id)
        .replace("{project_id}", project_id)
        .replace("{old_role_id}", old_role_id);

      await api.put(url, values);
      await onSearch();
      modals.closeAll();
    } catch (error) {
      console.error("Lỗi khi cập nhật user:", error);
      alert("Đã xảy ra lỗi khi cập nhật người dùng.");
    } finally {
      close();
    }
  };

  return (
    <Box component="form" miw={320} mx="auto" onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      {/* Select dự án theo tên */}
      <NativeSelect
        rightSection={<IconChevronDown size={16} />}
        label="ID dự án"
        data={projectNameOptions.length ? projectNameOptions : [{ value: "", label: "Đang tải..." }]}
        mt="md"
        {...form.getInputProps("project_id")}
      />

      {/* Select vai trò */}
      <NativeSelect
        rightSection={<IconChevronDown size={16} />}
        label="ID Vai trò"
        data={roleOptions.length ? roleOptions : [{ value: "", label: "Đang tải..." }]}
        mt="md"
        {...form.getInputProps("role_id")}
      />

      {/* Select người dùng */}
      <NativeSelect
        rightSection={<IconChevronDown size={16} />}
        label="ID Người dùng"
        data={userOptions.length ? userOptions : [{ value: "", label: "Đang tải..." }]}
        mt="md"
        {...form.getInputProps("user_id")}
      />

      <Group justify="flex-end" mt="lg">
        <Button type="submit" color="#3598dc" loading={visible} leftSection={<IconCheck size={18} />}>
          Lưu
        </Button>
        <Button
          variant="outline"
          color="black"
          type="button"
          loading={visible}
          onClick={() => modals.closeAll()}
          leftSection={<IconX size={18} />}
        >
          Đóng
        </Button>
      </Group>
    </Box>
  );
};

export default EditView;




