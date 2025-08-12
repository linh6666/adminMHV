

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css'; // cần thiết để hiển thị style cho toast

import "./globals.css";

import { Metadata } from "next";
import AppContainer from "../../common/AppContainer/AppContainer";

export const metadata: Metadata = {
  title: "Quản Trị MHV",
  description: "Chào mừng bạn đến với MHV.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider >
          <ModalsProvider>
            <Notifications position="top-right" />
            <AppContainer>
              {children}
            </AppContainer>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

