import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/providers';
import { Stack } from '@mui/material';

export const metadata: Metadata = {
  title: 'Shop Sphere',
  description: 'Store for everyone',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <Providers>
        <body>
          <Stack
            bgcolor={'background.default'}
            color={'text.primary'}
            flex={1}
          >
            {children}
          </Stack>
        </body>
      </Providers>
    </html>
  );
}
