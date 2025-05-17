// src/app/layout.tsx
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; // đảm bảo đã import global styles
import { Metadata } from "next"; // Chỉ import từ "next", không gắn "use client"
import AppContainer from "../../common/AppContainer/AppContainer"; // Đường dẫn tùy theo cấu trúc dự án của bạn
import AdminLayout from '../app/admin/layout';

export const metadata: Metadata = {
  title: "Quản Trị MHV",
  description: "Chào mừng bạn đến với MHV.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AppContainer>
            <AdminLayout>{children}</AdminLayout>
          </AppContainer>
        </MantineProvider>
      </body>
    </html>
  );
}
