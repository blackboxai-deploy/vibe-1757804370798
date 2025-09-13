'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EMOJI_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  trigger?: React.ReactNode;
  className?: string;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  trigger,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Recent');

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpen(false);
  };

  const defaultTrigger = (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-8 w-8 p-0 hover:bg-muted"
      type="button"
    >
      <span className="text-lg">😊</span>
    </Button>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        {trigger || defaultTrigger}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" side="top">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-10 rounded-none border-b">
            {EMOJI_CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.name}
                value={category.name}
                className="text-xs px-2 data-[state=active]:bg-muted"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="h-64">
            {EMOJI_CATEGORIES.map((category) => (
              <TabsContent
                key={category.name}
                value={category.name}
                className="m-0 h-full"
              >
                <ScrollArea className="h-full">
                  <div className="grid grid-cols-8 gap-1 p-3">
                    {category.emojis.map((emoji, index) => (
                      <Button
                        key={`${emoji}-${index}`}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-10 w-10 p-0 text-lg hover:bg-muted rounded-md transition-colors",
                          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        )}
                        onClick={() => handleEmojiClick(emoji)}
                        type="button"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};