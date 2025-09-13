'use client';

import React, { useState } from 'react';
import { Message as MessageType } from '@/lib/types';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Button } from '@/components/ui/button';
import { EmojiPicker } from '@/components/ui/EmojiPicker';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';

interface MessageProps {
  message: MessageType;
  isLastMessage?: boolean;
  showAvatar?: boolean;
}

export const Message: React.FC<MessageProps> = ({
  message,
  isLastMessage = false,
  showAvatar = true
}) => {
  const { user } = useAuth();
  const { addReaction } = useChat();
  const [showReactions, setShowReactions] = useState(false);
  
  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const handleReactionAdd = (emoji: string) => {
    addReaction(message.id, emoji);
  };

  const getReactionCounts = () => {
    const counts: { [emoji: string]: { count: number; users: string[] } } = {};
    
    message.reactions.forEach(reaction => {
      if (!counts[reaction.emoji]) {
        counts[reaction.emoji] = { count: 0, users: [] };
      }
      counts[reaction.emoji].count++;
      counts[reaction.emoji].users.push(reaction.username);
    });
    
    return counts;
  };

  const reactionCounts = getReactionCounts();
  const hasUserReacted = (emoji: string) => {
    return message.reactions.some(r => r.emoji === emoji && r.userId === user?.id);
  };

  return (
    <div className={cn(
      'group flex gap-3 px-4 py-2 hover:bg-muted/50 transition-colors',
      isLastMessage && 'pb-4'
    )}>
      {showAvatar && (
        <div className="flex-shrink-0">
          <UserAvatar
            src={message.userAvatar}
            alt={message.username}
            size="md"
            showStatus={false}
          />
        </div>
      )}
      
      <div className={cn('flex-1 min-w-0', !showAvatar && 'ml-11')}>
        {showAvatar && (
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-semibold text-sm text-foreground">
              {message.username}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTime(message.timestamp)}
              {message.edited && (
                <span className="ml-1 text-xs text-muted-foreground">(edited)</span>
              )}
            </span>
          </div>
        )}
        
        <div className="space-y-2">
          {/* Message Content */}
          <div className="text-sm text-foreground break-words">
            {message.type === 'text' && message.content}
            
            {message.type === 'image' && message.fileUrl && (
              <div className="space-y-2">
                {message.content && (
                  <p className="text-foreground">{message.content}</p>
                )}
                <div className="max-w-md">
                  <img
                    src={message.fileUrl}
                    alt={message.fileName || 'Uploaded image'}
                    className="rounded-lg border bg-muted max-w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
            
            {message.type === 'file' && message.fileUrl && (
              <div className="space-y-2">
                {message.content && (
                  <p className="text-foreground">{message.content}</p>
                )}
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50 max-w-sm">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-sm">📄</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {message.fileName}
                    </p>
                    {message.fileSize && (
                      <p className="text-xs text-muted-foreground">
                        {Math.round(message.fileSize / 1024)} KB
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Reactions */}
          {Object.keys(reactionCounts).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(reactionCounts).map(([emoji, data]) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-6 px-2 py-0 text-xs rounded-full border',
                    hasUserReacted(emoji) 
                      ? 'bg-primary/10 border-primary/30 text-primary' 
                      : 'bg-muted/50 border-muted hover:bg-muted'
                  )}
                  onClick={() => handleReactionAdd(emoji)}
                  title={data.users.join(', ')}
                >
                  <span className="mr-1">{emoji}</span>
                  <span>{data.count}</span>
                </Button>
              ))}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className={cn(
            'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
            showReactions && 'opacity-100'
          )}>
            <EmojiPicker
              onEmojiSelect={handleReactionAdd}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-xs hover:bg-muted"
                  onMouseEnter={() => setShowReactions(true)}
                  onMouseLeave={() => setShowReactions(false)}
                >
                  <span className="text-sm">😊</span>
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};