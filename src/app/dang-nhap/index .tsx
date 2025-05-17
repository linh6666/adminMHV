'use client';
import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';

export function Login(props: PaperProps) {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  return (
    <Paper
      radius="md"
      p="lg"
      withBorder
      style={{
        width: '400px',            
        margin: 0,                  
        position: 'absolute',        
        top: '40%',                 
        left: '50%',                 
        transform: 'translate(-50%, -50%)',  
      }}
      {...props}
    >
      <Text size="lg" fw={500} color="#294b61">
  Chào Mừng Bạn đến với Mô Hình Việt!
</Text>


      <Group grow mb="md" mt="md">
      </Group>

      <Divider label="Đăng Nhập" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(() => {})}>
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="hello@gmail.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" size="xs">
            {/* Forgot your password? */}
          </Anchor>
          <Button type="submit" radius="xl">
            Đăng Nhập
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
