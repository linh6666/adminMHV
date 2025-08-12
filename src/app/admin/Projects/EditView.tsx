"use client";

import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  TextInput,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useCallback } from "react";
import { API_ROUTE } from "../../../../const/apiRouter";
import { api } from "../../../../library/axios";
import { CreateUserPayload } from "../../../../api/apicreatesystem";

interface EditViewProps {
  onSearch: () => Promise<void>;
  id: string;
}

const EditView = ({ onSearch, id }: EditViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  const form = useForm<CreateUserPayload>({
    initialValues: {
      rank_total: 0,
      description: "",
    },
    validate: {
      rank_total: isNotEmpty("Cấp bậc không được để trống"),
      description: isNotEmpty("Tên vai trò không được để trống"),
    },
  });

  /** Gọi API update user */
  const handleSubmit = async (values: CreateUserPayload) => {
    open();
    try {
      const url = API_ROUTE.EDIT_SYSTEM.replace("{user_id}", id);
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

  /** Gọi API lấy thông tin user — chỉ phụ thuộc id */
  const fetchUserDetail = useCallback(async () => {
    if (!id) return;
    open();
    try {
      const url = API_ROUTE.EDIT_SYSTEM.replace("{user_id}", id);
      const response = await api.get(url);
      const userData = response.data;

      form.setValues({
        rank_total: userData.rank_total ?? 0,
        description: userData.description || "",
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu user:", error);
      alert("Không thể tải thông tin người dùng.");
      modals.closeAll();
    } finally {
      close();
    }
  }, [id, open, close]); // KHÔNG đưa form vào dependency để tránh loop

  /** Chỉ gọi API khi id thay đổi */
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
        label="Cấp bậc"
        placeholder="Nhập cấp bậc"
        withAsterisk
        mt="md"
        type="number"
        {...form.getInputProps("rank_total")}
      />

      <TextInput
        label="Tên vai trò"
        placeholder="Nhập tên vai trò"
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


