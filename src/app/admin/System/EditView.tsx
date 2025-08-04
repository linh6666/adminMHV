"use client";

import {
  Box,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { API_ROUTE } from "../../../../const/apiRouter";
import { api } from "../../../../library/axios";
import { CreateUserPayload } from "../../../../api/apicreateuser";

interface EditViewProps {
  onSearch: () => Promise<void>;
  id: string;
}

const EditView = ({ onSearch, id }: EditViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  const form = useForm<CreateUserPayload>({
    initialValues: {
      email: "",
      full_name: "",
      phone: "",
      password: "",
      confirm_password: "",
      is_active: false,
      is_superuser: false,
    },
    validate: {
      email: (value) => (value ? null : "Email không được để trống"),
      full_name: (value) => (value ? null : "Họ và tên không được để trống"),
      phone: (value) => (value ? null : "Số điện thoại không được để trống"),
     
    },
  });

  const handleSubmit = async (values: CreateUserPayload) => {
    open();
    try {
      const url = API_ROUTE.EDIT_USERNAME.replace("{user_id}", id);
      await api.
patch(url, values);
      await onSearch();
      modals.closeAll();
    } catch (error) {
      console.error("Lỗi khi cập nhật user:", error);
      alert("Đã xảy ra lỗi khi cập nhật người dùng.");
    } finally {
      close();
    }
  };

  const fetchUserDetail = async () => {
    open();
    try {
      const url = API_ROUTE.EDIT_USERNAME.replace("{user_id}", id);
      const response = await api.get(url);
      const userData = response.data;

      form.setValues({
        email: userData.email || "",
        full_name: userData.full_name || "",
        phone: userData.phone || "",
        password: "",
        confirm_password: "",
        is_active: userData.is_active ?? false,
        is_superuser: userData.is_superuser ?? false,
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu user:", error);
      alert("Không thể tải thông tin người dùng.");
      modals.closeAll();
    } finally {
      close();
    }
  };

  useEffect(() => {
    if (id) fetchUserDetail();
  }, [id]);

  return (
    <Box
      component="form"
      miw={320}
      mx="auto"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <TextInput
        label="Email"
        placeholder="Nhập email"
        withAsterisk
        mt="md"
        {...form.getInputProps("email")}
      />

      <TextInput
        label="Họ và tên"
        placeholder="Nhập họ và tên"
        withAsterisk
        mt="md"
        {...form.getInputProps("full_name")}
      />

      <TextInput
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        withAsterisk
        mt="md"
        {...form.getInputProps("phone")}
      />

      <PasswordInput
        label="Mật khẩu"
        placeholder="Nhập mật khẩu"
        withAsterisk
        mt="md"
        {...form.getInputProps("password")}
      />

      <PasswordInput
        label="Xác nhận mật khẩu"
        placeholder="Nhập lại mật khẩu"
        withAsterisk
        mt="md"
        {...form.getInputProps("confirm_password")}
      />

      <Checkbox
        label="Hoạt động"
        mt="md"
        {...form.getInputProps("is_active", { type: "checkbox" })}
      />

      <Checkbox
        label="Là quản trị viên"
        mt="xs"
        {...form.getInputProps("is_superuser", { type: "checkbox" })}
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

export default EditView;
