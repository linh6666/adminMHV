import { Button, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { deleteUserManagement } from "../../../../api/apideteleproject";

type DeleteProductProps = {
  idItem: string[]; // UUID dưới dạng chuỗi
  onSearch: () => void;
  language?: 'vi' | 'en';  // thêm prop language
};

const DeleteView = ({ idItem, onSearch, language = 'vi' }: DeleteProductProps) => {
  const handleDeleteUsers = async () => {
    try {
      for (const userId of idItem) {
        await deleteUserManagement(userId); // Gọi API xóa từng người dùng
      }

      // Hiển thị thông báo thành công
      notifications.show({
        title: language === 'vi' ? "Thành công" : "Success",
        message:
          language === 'vi'
            ? `${idItem.length} người dùng đã được xoá`
            : `${idItem.length} user(s) have been deleted`,
        color: "green",
        icon: <IconCheck size={20} />,
      });

      // Xoá thành công, đóng modal và gọi lại onSearch
      modals.closeAll();
      onSearch();
    } catch (error) {
      console.error("Lỗi xoá người dùng:", error);

      notifications.show({
        title: language === 'vi' ? "Lỗi" : "Error",
        message:
          language === 'vi'
            ? "Đã xảy ra lỗi khi xoá người dùng."
            : "An error occurred while deleting user(s).",
        color: "red",
        icon: <IconX size={20} />,
      });
    }
  };

  return (
    <div>
      <Text size="lg" fw={500} mb="md">
        {language === 'vi'
          ? `Bạn có chắc chắn muốn xóa ${idItem.length} người dùng đã chọn?`
          : `Are you sure you want to delete ${idItem.length} selected user(s)?`}
      </Text>

      <Group justify="center" mt="lg">
        <Button
          color="red"
          onClick={handleDeleteUsers}
          leftSection={<IconCheck size={18} />}
        >
          {language === 'vi' ? "Xác nhận xoá" : "Confirm Delete"}
        </Button>

        <Button
          variant="outline"
          onClick={() => modals.closeAll()}
          leftSection={<IconX size={18} />}
        >
          {language === 'vi' ? "Hủy" : "Cancel"}
        </Button>
      </Group>
    </div>
  );
};

export default DeleteView;

