'use client';

import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { loginUser } from "../../../../api/apilogin";
import { useRouter } from "next/navigation";
import axios from "axios";

export function Login() {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (val) => (/^\S+@\S+$/.test(val) ? null : 'Email không hợp lệ'),
      password: (val) => (val.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const response = await loginUser(values.username, values.password);

      if (response?.access_token) {
        localStorage.setItem("access_token", response.access_token);

        // ✅ Chuyển hướng đến trang admin sau khi đăng nhập thành công
        router.push("/admin");
      } else {
        console.error("Đăng nhập không có access_token");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Login failed:",
          error.response?.data?.detail || "Unknown error"
        );
      } else {
        console.error("Login failed:", (error as Error).message || "Unknown error");
      }
    }
  };

  return (
    <Paper
      radius="md"
      p="lg"
      withBorder
      style={{
        width: '400px',
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Text size="lg" fw={500} color="#294b61">
        Chào mừng bạn đến với Mô Hình Việt!
      </Text>

      <Divider label="Đăng Nhập" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="hello@gmail.com"
            value={form.values.username}
            onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
            error={form.errors.username}
            radius="md"
          />

          <PasswordInput
            required
            label="Mật khẩu"
            placeholder="********"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password}
            radius="md"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" size="xs">
            Quên mật khẩu?
          </Anchor>
          <Button type="submit" radius="sl">
            Đăng Nhập
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
