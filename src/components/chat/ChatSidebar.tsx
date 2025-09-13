'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { RoomList } from './RoomList';
import { UserList } from './UserList';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  className?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ className }) => {
  const { user, logout } = useAuth();
  const { chatState } = useChat();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">💬</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground">{APP_NAME}</h1>
            <p className="text-xs text-muted-foreground">Real-time chat</p>
          </div>
        </div>
      </div>

      {/* Current User */}
      {user && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <UserAvatar
              src={user.avatar}
              alt={user.username}
              size="md"
              status="online"
              showStatus={true}
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-foreground truncate">
                {user.username}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {user.email}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 w-8 p-0 hover:bg-muted"
              title="Logout"
            >
              <span className="text-sm">🚪</span>
            </Button>
          </div>
        </div>
      )}

      {/* Room List */}
      <div className="flex-1 p-4 min-h-0">
        <RoomList />
        
        <Separator className="my-4" />
        
        {/* Online Users */}
        <UserList />
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {chatState.onlineUsers.filter(u => u.status === 'online').length} online
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn('hidden md:flex w-80 flex-col', className)}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <div className="flex items-center justify-between p-4 border-b bg-background">
            <div className="flex items-center gap-3">
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="text-lg">☰</span>
                </Button>
              </SheetTrigger>
              
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">💬</span>
              </div>
              
              <div>
                <h1 className="text-lg font-bold text-foreground">{APP_NAME}</h1>
              </div>
            </div>

            {user && (
              <div className="flex items-center gap-2">
                <UserAvatar
                  src={user.avatar}
                  alt={user.username}
                  size="sm"
                  status="online"
                  showStatus={true}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="h-8 w-8 p-0"
                  title="Logout"
                >
                  <span className="text-sm">🚪</span>
                </Button>
              </div>
            )}
          </div>

          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};