"use client";

import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useCallback, useRef } from "react";
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
      name: (value) => (value ? null : "Tên quyền không được để trống"),
      rank: (value) => (value !== null && value !== undefined ? null : "Cấp bậc không được để trống"),
      description: (value) => (value ? null : "Mô tả không được để trống"),
    },
  });

  const formRef = useRef(form); // Sử dụng useRef để giữ form

  /** Submit cập nhật role */
  const handleSubmit = async (values: CreateUserPayload) => {
    open();
    try {
      const url = API_ROUTE.EDIT_ROLES.replace("{user_id}", id);
      await api.put(url, values);
      await onSearch();
      modals.closeAll();
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
      alert("Đã xảy ra lỗi khi cập nhật quyền.");
    } finally {
      close();
    }
  };

  /** Lấy dữ liệu chi tiết role */
  const fetchUserDetail = useCallback(async () => {
    if (!id) return;
    open();
    try {
      const url = API_ROUTE.EDIT_ROLES.replace("{user_id}", id);
      const response = await api.get(url);
      const userData = response.data;

      formRef.current.setValues({
        name: userData.name || "",
        rank: userData.rank ?? 0,
        description: userData.description || "",
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu quyền:", error);
      alert("Không thể tải thông tin quyền.");
      modals.closeAll();
    } finally {
      close();
    }
  }, [id, open, close]); // Không thêm form vào dependency

  /** Chỉ gọi khi id thay đổi */
  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

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
        placeholder="Nhập tên quyền"
        withAsterisk
        mt="md"
        {...form.getInputProps("name")}
      />

      <NumberInput
        label="Cấp bậc"
        placeholder="Nhập cấp bậc"
        withAsterisk
        mt="md"
        {...form.getInputProps("rank")}
      />

      <TextInput
        label="Mô tả"
        placeholder="Nhập mô tả"
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
