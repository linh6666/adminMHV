'use client';

import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  NumberInput,
  TextInput,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useDisclosure } from '@mantine/hooks';
import { createUser } from '../../../../api/apicreaterole';

interface CreateViewProps {
  onSearch: () => Promise<void>;
}

const CreateView = ({ onSearch }: CreateViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: '',
      rank: 0,
      description: '',
    },
    validate: {
      name: isNotEmpty('Tên không được để trống'),
      rank: (value) =>
        value === undefined || value === null ? 'Cấp bậc không được để trống' : null,
      description: isNotEmpty('Mô tả không được để trống'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    open();
    try {
      await createUser(values); // values: { name, rank, description }
      await onSearch();
      modals.closeAll();
    } catch (error) {
      console.error('Lỗi khi tạo user:', error);
      alert('Đã xảy ra lỗi khi tạo người dùng.');
    } finally {
      close();
    }
  };

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
        overlayProps={{ radius: 'sm', blur: 2 }}
      />

      <TextInput
        label="Tên quyền "
        placeholder="Nhập tên quyền"
        withAsterisk
        mt="md"
        {...form.getInputProps('name')}
      />

      <NumberInput
        label="Cấp bậc"
        placeholder="Nhập cấp bậc"
        withAsterisk
        mt="md"
        {...form.getInputProps('rank')}
      />

      <TextInput
        label="Mô tả"
        placeholder="Nhập mô tả"
        withAsterisk
        mt="md"
        {...form.getInputProps('description')}
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




