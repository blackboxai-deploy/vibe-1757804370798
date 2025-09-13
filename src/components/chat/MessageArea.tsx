'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Message } from './Message';
import { MessageInput } from './MessageInput';
import { useChat } from '@/contexts/ChatContext';
import { Message as MessageType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MessageAreaProps {
  className?: string;
}

export const MessageArea: React.FC<MessageAreaProps> = ({ className }) => {
  const { chatState } = useChat();
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  // Filter messages for current room
  const currentRoomMessages = chatState.messages.filter(
    message => message.roomId === chatState.currentRoom?.id
  );

  // Group messages by date
  const groupedMessages = React.useMemo(() => {
    const groups: { date: string; messages: MessageType[] }[] = [];
    let currentDate = '';
    let currentGroup: MessageType[] = [];

    currentRoomMessages.forEach(message => {
      const messageDate = new Date(message.timestamp).toDateString();
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  }, [currentRoomMessages]);

  const scrollToBottom = (force = false) => {
    if (force || !showScrollToBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToBottomClick = () => {
    scrollToBottom(true);
    setShowScrollToBottom(false);
  };

  // Auto-scroll to bottom when new messages arrive or room changes
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [chatState.currentRoom?.id]);

  useEffect(() => {
    if (currentRoomMessages.length > 0) {
      // Only auto-scroll if it's a new message and user was near bottom
      if (!showScrollToBottom) {
        scrollToBottom();
      }
    }
  }, [currentRoomMessages.length, showScrollToBottom]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollElement = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = scrollElement;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollToBottom(!isNearBottom);
    lastScrollTop.current = scrollTop;
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const shouldShowAvatar = (message: MessageType, index: number, messages: MessageType[]) => {
    if (index === messages.length - 1) return true;
    const nextMessage = messages[index + 1];
    return nextMessage.userId !== message.userId || 
           new Date(nextMessage.timestamp).getTime() - new Date(message.timestamp).getTime() > 300000; // 5 minutes
  };

  if (!chatState.currentRoom) {
    return (
      <div className={cn('flex-1 flex items-center justify-center bg-background', className)}>
        <div className="text-center space-y-4">
          <div className="text-6xl">💬</div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Welcome to ChatHub!</h3>
            <p className="text-muted-foreground max-w-md">
              Select a room from the sidebar to start chatting with your team.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Room Header */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              #{chatState.currentRoom.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {chatState.currentRoom.description}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {chatState.currentRoom.memberCount} members
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 relative">
        <ScrollArea 
          className="h-full"
          ref={scrollAreaRef}
          onScrollCapture={handleScroll}
        >
          <div className="space-y-0">
            {groupedMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full py-16">
                <div className="text-center space-y-2">
                  <div className="text-4xl">🎉</div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Start the conversation!
                  </h3>
                  <p className="text-muted-foreground">
                    Be the first to send a message in #{chatState.currentRoom.name}
                  </p>
                </div>
              </div>
            ) : (
              groupedMessages.map((group, groupIndex) => (
                <div key={group.date}>
                  {/* Date Header */}
                  <div className="flex items-center justify-center py-4">
                    <div className="bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
                      {formatDateHeader(group.date)}
                    </div>
                  </div>
                  
                  {/* Messages */}
                  {group.messages.map((message, messageIndex) => (
                    <Message
                      key={message.id}
                      message={message}
                      showAvatar={shouldShowAvatar(message, messageIndex, group.messages)}
                      isLastMessage={
                        groupIndex === groupedMessages.length - 1 && 
                        messageIndex === group.messages.length - 1
                      }
                    />
                  ))}
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Scroll to Bottom Button */}
        {showScrollToBottom && (
          <div className="absolute bottom-4 right-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleScrollToBottomClick}
              className="rounded-full shadow-lg border h-10 w-10 p-0"
            >
              <span className="text-lg">↓</span>
            </Button>
          </div>
        )}
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};