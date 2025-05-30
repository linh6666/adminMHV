"use client";

import {
  Box,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";

interface UserManagementInterface {
  userName: string;
  fullName: string;
  inActive: boolean;
  phone: string;
}

interface CreateViewProps {
  onSearch: () => Promise<void>;
}

const entity: UserManagementInterface = {
  userName: "",
  fullName: "",
  inActive: false,
  phone: "",
};

const CreateView = ({ onSearch }: CreateViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  // Khai báo form với giá trị mặc định và validate
  const form = useForm<UserManagementInterface>({
    initialValues: {
      ...entity,
    },
    validate: {
      userName: isNotEmpty("Tài khoản chưa nhập"),
      fullName: isNotEmpty("Họ và tên chưa nhập"),
      phone: isNotEmpty("Số điện thoại chưa nhập"),
    },
  });

  // Xử lý submit form
  const handleSubmit = async (values: UserManagementInterface) => {
    open(); // hiện loading overlay
    try {
      // Giả lập gọi API tạo user (bạn thay bằng API thật)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Gọi lại hàm load danh sách ngoài component cha
      await onSearch();

      modals.closeAll();
    } catch (error) {
      console.error("Lỗi khi lưu user:", error);
    } finally {
      close(); // tắt loading overlay
    }
  };

  return (
    <Box
      className="flex-none"
      component="form"
      miw={300}
      maw={300}
      mx="auto"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <TextInput
        label="Tài khoản"
        placeholder="Nhập tên tài khoản"
        withAsterisk
        mt="md"
        type="text"
        {...form.getInputProps("userName")}
      />

      <TextInput
        label="Họ và tên"
        placeholder="Nhập họ và tên"
        withAsterisk
        mt="md"
        type="text"
        {...form.getInputProps("fullName")}
      />

      <Checkbox
        label="Trạng thái"
        mt="md"
        {...form.getInputProps("inActive", { type: "checkbox" })}
      />

      <TextInput
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        withAsterisk
        mt="md"
        type="text"
        {...form.getInputProps("phone")}
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

