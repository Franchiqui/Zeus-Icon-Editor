import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/layout/header';
import { IconLibraryProvider } from '@/context/icon-library-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zeus Icon Editor',
  description: 'A powerful icon editor with library support',
  icons: {
    icon: [
      { url: '/Nuevo-Logo-3-Ico.ico', sizes: 'any' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} h-screen overflow-hidden flex flex-col`}>
        <Providers>
          <IconLibraryProvider>
            <Header />
            <main className="flex-1 overflow-hidden flex flex-col">{children}</main>
          </IconLibraryProvider>
        </Providers>
      </body>
    </html>
  );
}