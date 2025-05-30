// app/layout.tsx
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/core/styles.css';
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
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <ModalsProvider>
            <AppContainer>
              {children}
            </AppContainer>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

