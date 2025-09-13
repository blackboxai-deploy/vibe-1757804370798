'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { MessageArea } from '@/components/chat/MessageArea';
import { useAuth } from '@/contexts/AuthContext';

export default function ChatPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Loading ChatHub...</h3>
            <p className="text-muted-foreground">Preparing your chat experience</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <ChatSidebar />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <MessageArea />
      </div>
    </div>
  );
}