'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { USER_STATUS_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface UserListProps {
  className?: string;
}

export const UserList: React.FC<UserListProps> = ({ className }) => {
  const { chatState } = useChat();
  const { user: currentUser } = useAuth();

  const getStatusColor = (status: string) => {
    const statusOption = USER_STATUS_OPTIONS.find(opt => opt.value === status);
    return statusOption?.color || 'bg-gray-500';
  };

  const sortedUsers = React.useMemo(() => {
    const users = [...chatState.onlineUsers];
    
    // Sort by: current user first, then online, then away, then offline
    return users.sort((a, b) => {
      if (a.id === currentUser?.id) return -1;
      if (b.id === currentUser?.id) return 1;
      
      const statusOrder = { online: 0, away: 1, offline: 2 };
      const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
      const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
      
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.username.localeCompare(b.username);
    });
  }, [chatState.onlineUsers, currentUser?.id]);

  const usersByStatus = React.useMemo(() => {
    const groups = {
      online: sortedUsers.filter(user => user.status === 'online'),
      away: sortedUsers.filter(user => user.status === 'away'),
      offline: sortedUsers.filter(user => user.status === 'offline')
    };
    return groups;
  }, [sortedUsers]);

  if (chatState.isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-muted rounded animate-pulse" />
              <div className="h-2 bg-muted rounded w-3/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const formatLastSeen = (lastSeen: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const renderUserGroup = (title: string, users: typeof sortedUsers) => {
    if (users.length === 0) return null;

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between px-2 py-1">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </h4>
          <Badge variant="outline" className="text-xs h-5">
            {users.length}
          </Badge>
        </div>
        
        <div className="space-y-0.5">
          {users.map((user) => (
            <div
              key={user.id}
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-muted/50',
                user.id === currentUser?.id && 'bg-muted/30'
              )}
            >
              <UserAvatar
                src={user.avatar}
                alt={user.username}
                size="sm"
                status={user.status}
                showStatus={true}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-sm font-medium truncate',
                    user.id === currentUser?.id && 'text-primary'
                  )}>
                    {user.username}
                    {user.id === currentUser?.id && (
                      <span className="ml-1 text-xs text-muted-foreground">(you)</span>
                    )}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {user.status === 'online' 
                    ? 'Online' 
                    : user.status === 'away'
                    ? 'Away'
                    : formatLastSeen(user.lastSeen)
                  }
                </p>
              </div>
              
              <div className={cn(
                'w-2 h-2 rounded-full flex-shrink-0',
                getStatusColor(user.status)
              )} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between px-2 py-1">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Members
        </h3>
        <Badge variant="secondary" className="text-xs">
          {sortedUsers.length}
        </Badge>
      </div>
      
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-4">
          {renderUserGroup('Online', usersByStatus.online)}
          {renderUserGroup('Away', usersByStatus.away)}
          {renderUserGroup('Offline', usersByStatus.offline)}
        </div>
      </ScrollArea>
    </div>
  );
};