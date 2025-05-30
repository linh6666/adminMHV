import { Button, Checkbox, Flex, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import React, { useState } from "react";
// import {
//   ActivatedUserManagement,
//   AdminsUserManagement,
// } from "../../api/ApiUserManagement";

export const ActiveToken = ({ idItem, onSearch, ActiveToken }: ActiveToken) => {
  const handelAdmins = async () => {
    // await ActivatedUserManagement(idItem, ActiveToken);
    modals.closeAll();
    onSearch();
  };

  return (
    <div>
      <Text mt={10} size="24px">
        Bạn có chắc chắn muốn kích hoạt những mục đã chọn ?
      </Text>

      <Flex gap={20} justify="flex-end" mt="lg">
        <Button
          variant="outline"
          type="button"
          color="#3598dc"
          onClick={() => modals.closeAll()}
          leftSection={<IconX size={18} />}
        >
          Hủy
        </Button>
        <Button
          type="button"
          color="#3598dc"
          leftSection={<IconCheck size={18} />}
          onClick={handelAdmins}
        >
          Lưu
        </Button>
      </Flex>
    </div>
  );
};

type ActiveToken = {
  idItem: number[];
  onSearch: () => void;
  ActiveToken: boolean;
};