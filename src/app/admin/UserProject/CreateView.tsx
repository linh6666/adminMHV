"use client";

import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  NativeSelect,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { createUser, CreateUserPayload } from "../../../../api/apicreateUserproject";
import { getListRoles as getRoles } from "../../../../api/getlistrole"; // roles
import { getListRoles as getUsers } from "../../../../api/apigetlistuse"; // users
import { getListRoles as getProjects } from "../../../../api/apigetlistprojects"; // projects

interface CreateViewProps {
  onSearch: () => Promise<void>;
}

interface Option {
  value: string;
  label: string;
}

interface Project {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
}

const CreateView = ({ onSearch }: CreateViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  const [projectNameOptions, setProjectNameOptions] = useState<Option[]>([]);
  const [projectIdOptions, setProjectIdOptions] = useState<Option[]>([]);
  const [roleOptions, setRoleOptions] = useState<Option[]>([]);
  const [userOptions, setUserOptions] = useState<Option[]>([]);

  const form = useForm({
    initialValues: {
      project_name: "",
      project_id: "",
      user_id: "",
      role_id: "",
    },
    validate: {
      project_name: isNotEmpty("Vui lòng chọn dự án"),
      project_id: isNotEmpty("Vui lòng chọn ID dự án"),
      user_id: isNotEmpty("Vui lòng chọn người dùng"),
      role_id: isNotEmpty("Vui lòng chọn vai trò"),
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token") || "";

        const [resProjects, resRoles, resUsers] = await Promise.all([
          getProjects({ token }) as Promise<{ data: Project[] }>,
          getRoles({ token }) as Promise<{ data: Role[] }>,
          getUsers({ token }) as Promise<{ data: User[] }>,
        ]);

        setProjectNameOptions(
          resProjects.data.map((item) => ({
            value: String(item.id),
            label: item.name,
          }))
        );
        setProjectIdOptions(
          resProjects.data.map((item) => ({
            value: String(item.id),
            label: String(item.id),
          }))
        );

        setRoleOptions(
          resRoles.data.map((item) => ({
            value: String(item.id),
            label: item.name,
          }))
        );

        setUserOptions(
          resUsers.data.map((item) => ({
            value: String(item.id),
            label: item.email,
          }))
        );
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    open();
    try {
      console.log("Giá trị project_id:", values.project_id);

      const payload: CreateUserPayload = {
        project_name: values.project_name,
        project_id: values.project_id ? String(values.project_id) : "",
        user_id: values.user_id ? String(values.user_id) : undefined,
        role_id: values.role_id ? String(values.role_id) : undefined,
      };

      console.log("Payload gửi đi:", payload);

      await createUser(payload.project_id, payload);

      await onSearch();
      modals.closeAll();
    } catch (error) {
      console.error("Lỗi khi tạo user:", error);
      alert("Đã xảy ra lỗi khi tạo người dùng.");
    } finally {
      close();
    }
  };

  return (
    <Box component="form" miw={320} mx="auto" onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <NativeSelect
        rightSection={<IconChevronDown size={16} />}
        label="Danh sách dự án"
        data={projectNameOptions.length ? projectNameOptions : [{ value: "", label: "Đang tải..." }]}
        mt="md"
        {...form.getInputProps("project_name")}
      />

      <NativeSelect
        rightSection={<IconChevronDown size={16} />}
        label="Người dùng"
        data={userOptions.length ? userOptions : [{ value: "", label: "Đang tải..." }]}
        mt="md"
        {...form.getInputProps("user_id")}
      />

      <NativeSelect
        rightSection={<IconChevronDown size={16} />}
        label="ID dự án"
        data={projectIdOptions.length ? projectIdOptions : [{ value: "", label: "Đang tải..." }]}
        mt="md"
        {...form.getInputProps("project_id")}
      />

      <NativeSelect
        rightSection={<IconChevronDown size={16} />}
        label="Vai trò"
        data={roleOptions.length ? roleOptions : [{ value: "", label: "Đang tải..." }]}
        mt="md"
        {...form.getInputProps("role_id")}
      />

      <Group justify="flex-end" mt="lg">
        <Button
          type="submit"
          color="#3598dc"
          loading={visible}
          leftSection={<IconCheck size={18} />}
        >
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

export default CreateView;




