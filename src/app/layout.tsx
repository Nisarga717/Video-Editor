import React from 'react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Editor App',
  description: 'A powerful video editing application'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}