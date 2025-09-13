import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { APP_NAME } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `${APP_NAME} - Real-time Chat Application`,
  description: 'Connect, chat, and collaborate in real-time with ChatHub - a modern messaging platform.',
  keywords: ['chat', 'messaging', 'real-time', 'communication', 'collaboration'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}