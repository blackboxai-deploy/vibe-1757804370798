'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';

interface RoomListProps {
  className?: string;
}

export const RoomList: React.FC<RoomListProps> = ({ className }) => {
  const { chatState, joinRoom } = useChat();

  const getUnreadCount = (roomId: string) => {
    // For demo purposes, return random unread count for non-current rooms
    if (chatState.currentRoom?.id === roomId) return 0;
    return Math.random() < 0.3 ? Math.floor(Math.random() * 5) + 1 : 0;
  };

  const getLastMessagePreview = (roomId: string) => {
    const roomMessages = chatState.messages
      .filter(msg => msg.roomId === roomId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const lastMessage = roomMessages[0];
    if (!lastMessage) return 'No messages yet';
    
    const preview = lastMessage.type === 'text' 
      ? lastMessage.content 
      : lastMessage.type === 'image' 
        ? '📷 Image'
        : '📎 File';
    
    return preview.length > 30 ? preview.substring(0, 30) + '...' : preview;
  };

  const formatLastMessageTime = (roomId: string) => {
    const roomMessages = chatState.messages
      .filter(msg => msg.roomId === roomId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const lastMessage = roomMessages[0];
    if (!lastMessage) return '';
    
    const now = new Date();
    const messageTime = new Date(lastMessage.timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  if (chatState.isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between px-2 py-1">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Channels
        </h3>
        <Badge variant="secondary" className="text-xs">
          {chatState.rooms.length}
        </Badge>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {chatState.rooms.map((room) => {
            const isActive = chatState.currentRoom?.id === room.id;
            const unreadCount = getUnreadCount(room.id);
            const lastMessagePreview = getLastMessagePreview(room.id);
            const lastMessageTime = formatLastMessageTime(room.id);

            return (
              <Button
                key={room.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start h-auto p-3 text-left',
                  isActive && 'bg-muted font-medium'
                )}
                onClick={() => joinRoom(room.id)}
              >
                <div className="flex items-center gap-3 w-full min-w-0">
                  <div className="flex-shrink-0">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium',
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted-foreground/10 text-muted-foreground'
                    )}>
                      #
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        'text-sm font-medium truncate',
                        isActive ? 'text-foreground' : 'text-foreground/80'
                      )}>
                        {room.name}
                      </span>
                      {lastMessageTime && (
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {lastMessageTime}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground truncate">
                        {lastMessagePreview}
                      </p>
                      {unreadCount > 0 && (
                        <Badge 
                          variant="default" 
                          className="ml-2 h-5 min-w-[1.25rem] px-1.5 text-xs flex-shrink-0"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};