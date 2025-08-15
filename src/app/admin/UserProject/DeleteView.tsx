import { Button, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { deleteUserManagement } from "../../../../api/apideteleUserProjectRole";

// Chỉ cần mảng id đơn giản
type DeleteProductProps = {
  idItem: string[]; // mỗi phần tử là user_project_role_id
  onSearch: () => void;
};

const DeleteView = ({ idItem, onSearch }: DeleteProductProps) => {
  const handleDeleteUsers = async () => {
    try {
      for (const id of idItem) {
        await deleteUserManagement(id);
      }

      notifications.show({
        title: "Thành công",
        message: `${idItem.length} vai trò đã được xoá`,
        color: "green",
        icon: <IconCheck size={20} />,
      });

      modals.closeAll();
      onSearch();
    } catch (error) {
      console.error("Lỗi xoá vai trò:", error);

      notifications.show({
        title: "Lỗi",
        message: "Đã xảy ra lỗi khi xoá vai trò.",
        color: "red",
        icon: <IconX size={20} />,
      });
    }
  };

  return (
    <div>
      <Text size="lg" fw={500} mb="md">
        Bạn có chắc chắn muốn xóa {idItem.length} vai trò đã chọn?
      </Text>

      <Group justify="center" mt="lg">
        <Button
          color="red"
          onClick={handleDeleteUsers}
          leftSection={<IconCheck size={18} />}
        >
          Xác nhận xoá
        </Button>

        <Button
          variant="outline"
          onClick={() => modals.closeAll()}
          leftSection={<IconX size={18} />}
        >
          Hủy
        </Button>
      </Group>
    </div>
  );
};

export default DeleteView;



