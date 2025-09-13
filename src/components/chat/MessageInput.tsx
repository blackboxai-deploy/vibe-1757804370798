'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmojiPicker } from '@/components/ui/EmojiPicker';
import { FileUpload } from '@/components/ui/FileUpload';
import { useChat } from '@/contexts/ChatContext';
import { CHAT_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  disabled = false,
  placeholder = "Type a message...",
  className
}) => {
  const { sendMessage, uploadFile, chatState } = useChat();
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDisabled = disabled || !chatState.currentRoom || isUploading;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!message.trim() || isDisabled) return;

    const messageContent = message.trim();
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      await sendMessage(messageContent);
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore message on error
      setMessage(messageContent);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newMessage = message.slice(0, start) + emoji + message.slice(end);
    
    setMessage(newMessage);
    
    // Set cursor position after emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const fileUrl = await uploadFile(file);
      
      let fileMessage = '';
      if (file.type.startsWith('image/')) {
        fileMessage = `Shared an image: ${file.name}`;
        await sendMessage(fileMessage, 'image', {
          url: fileUrl,
          name: file.name,
          size: file.size,
          type: file.type
        });
      } else {
        fileMessage = `Shared a file: ${file.name}`;
        await sendMessage(fileMessage, 'file', {
          url: fileUrl,
          name: file.name,
          size: file.size,
          type: file.type
        });
      }
      
      return fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= CHAT_CONFIG.maxMessageLength) {
      setMessage(value);
    }

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  if (!chatState.currentRoom) {
    return (
      <div className={cn('border-t bg-background p-4', className)}>
        <div className="text-center text-sm text-muted-foreground">
          Select a room to start chatting
        </div>
      </div>
    );
  }

  return (
    <div className={cn('border-t bg-background p-4', className)}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isDisabled}
              rows={1}
              className="min-h-[2.5rem] max-h-[7.5rem] resize-none pr-20"
              style={{ height: 'auto' }}
            />
            
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <FileUpload
                onFileUpload={handleFileUpload}
                disabled={isDisabled}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-muted"
                    type="button"
                    disabled={isDisabled}
                  >
                    <span className="text-sm">📎</span>
                  </Button>
                }
              />
              
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-muted"
                    type="button"
                    disabled={isDisabled}
                  >
                    <span className="text-sm">😊</span>
                  </Button>
                }
              />
            </div>
          </div>
          
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || isDisabled}
            className="h-10 px-4"
          >
            {isUploading ? 'Uploading...' : 'Send'}
          </Button>
        </div>
        
        {message.length > CHAT_CONFIG.maxMessageLength * 0.8 && (
          <div className="text-xs text-muted-foreground text-right">
            {message.length} / {CHAT_CONFIG.maxMessageLength}
          </div>
        )}
      </form>
    </div>
  );
};