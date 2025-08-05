"use client";

import {
  Box,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  NumberInput,
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
import { CreateUserPayload } from "../../../../api/apicreaterole";

interface EditViewProps {
  onSearch: () => Promise<void>;
  id: string;
}

const EditView = ({ onSearch, id }: EditViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  const form = useForm<CreateUserPayload>({
    initialValues: {
      name: "",
      rank: 0,
      description: "",
     
    },
    validate: {
      name: (value) => (value ? null : "Email không được để trống"),
      rank: (value) => (value ? null : "Họ và tên không được để trống"),
      description: (value) => (value ? null : "Số điện thoại không được để trống"),
     
    },
  });

  const handleSubmit = async (values: CreateUserPayload) => {
    open();
    try {
      const url = API_ROUTE.EDIT_ROLES.replace("{user_id}", id);
      await api.
put(url, values);
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
      const url = API_ROUTE.EDIT_ROLES.replace("{user_id}", id);
      const response = await api.get(url);
      const userData = response.data;

      form.setValues({
        name: userData.name || "",
        rank: userData.rank|| "",
        description: userData.description || "",
      
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
        label="Tên quyền"
        placeholder="Nhập tên quyên"
        withAsterisk
        mt="md"
        {...form.getInputProps("name")}
      />

      <NumberInput
        label="Cấp bậc "
        placeholder="Nhập cấp bậc "
        withAsterisk
        mt="md"
        {...form.getInputProps("rank")}
      />

      <TextInput
        label="Mô tả"
        placeholder="Nhập mmo tả"
        withAsterisk
        mt="md"
        {...form.getInputProps("description")}
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
