'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ChatState, ChatContextType, Message, ChatRoom, FileData } from '@/lib/types';
import { LOCAL_STORAGE_KEYS, CHAT_CONFIG } from '@/lib/constants';
import { 
  MOCK_ROOMS, 
  MOCK_MESSAGES, 
  MOCK_USERS, 
  generateMockMessage,
  generateMockRoom,
  simulateNetworkDelay 
} from '@/lib/chatData';
import { useAuth } from './AuthContext';

type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_ROOM'; payload: ChatRoom | null }
  | { type: 'SET_ROOMS'; payload: ChatRoom[] }
  | { type: 'ADD_ROOM'; payload: ChatRoom }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; content: string } }
  | { type: 'ADD_REACTION'; payload: { messageId: string; emoji: string; userId: string; username: string } }
  | { type: 'SET_ONLINE_USERS'; payload: typeof MOCK_USERS }
  | { type: 'RESET_CHAT' };

const initialState: ChatState = {
  currentUser: null,
  currentRoom: null,
  rooms: [],
  messages: [],
  onlineUsers: [],
  isLoading: true
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_CURRENT_ROOM':
      return { ...state, currentRoom: action.payload };
    
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload };
    
    case 'ADD_ROOM':
      return { ...state, rooms: [...state.rooms, action.payload] };
    
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    
    case 'ADD_MESSAGE':
      return { 
        ...state, 
        messages: [...state.messages, action.payload].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
      };
    
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id
            ? { ...msg, content: action.payload.content, edited: true, editedAt: new Date() }
            : msg
        )
      };
    
    case 'ADD_REACTION':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.messageId
            ? {
                ...msg,
                reactions: [
                  ...msg.reactions.filter(r => !(r.userId === action.payload.userId && r.emoji === action.payload.emoji)),
                  {
                    emoji: action.payload.emoji,
                    userId: action.payload.userId,
                    username: action.payload.username
                  }
                ]
              }
            : msg
        )
      };
    
    case 'SET_ONLINE_USERS':
      return { ...state, onlineUsers: action.payload };
    
    case 'RESET_CHAT':
      return initialState;
    
    default:
      return state;
  }
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();

  // Initialize chat data
  useEffect(() => {
    const initializeChatData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        // Load rooms
        const savedRooms = localStorage.getItem(LOCAL_STORAGE_KEYS.CHAT_ROOMS);
        const rooms = savedRooms ? JSON.parse(savedRooms) : MOCK_ROOMS;
        dispatch({ type: 'SET_ROOMS', payload: rooms });

        // Load messages
        const savedMessages = localStorage.getItem(LOCAL_STORAGE_KEYS.CHAT_MESSAGES);
        const messages = savedMessages ? JSON.parse(savedMessages) : MOCK_MESSAGES;
        dispatch({ type: 'SET_MESSAGES', payload: messages });

        // Set online users
        dispatch({ type: 'SET_ONLINE_USERS', payload: MOCK_USERS });

        // Set default room
        dispatch({ type: 'SET_CURRENT_ROOM', payload: rooms[0] || null });

        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        console.error('Error initializing chat data:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    if (user) {
      initializeChatData();
    } else {
      dispatch({ type: 'RESET_CHAT' });
    }
  }, [user]);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (state.rooms.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CHAT_ROOMS, JSON.stringify(state.rooms));
    }
  }, [state.rooms]);

  useEffect(() => {
    if (state.messages.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(state.messages));
    }
  }, [state.messages]);

  // Simulate real-time message updates
  useEffect(() => {
    if (!user || !state.currentRoom) return;

    const interval = setInterval(async () => {
      // Randomly add a message from another user
      if (Math.random() < 0.3 && state.currentRoom) { // 30% chance and null check
        const otherUsers = MOCK_USERS.filter(u => u.id !== user.id && u.status === 'online');
        if (otherUsers.length > 0) {
          const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
          const randomMessages = [
            "That's interesting!",
            "I agree with that point.",
            "Has anyone seen the latest updates?",
            "Great discussion everyone!",
            "I'm working on something similar.",
            "Thanks for sharing!",
            "Looking forward to hearing more about this.",
            "Good point! 👍"
          ];
          
          const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
          const newMessage = generateMockMessage(
            randomMessage,
            randomUser.id,
            randomUser.username,
            randomUser.avatar,
            state.currentRoom.id
          );
          
          dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
        }
      }
    }, CHAT_CONFIG.messageUpdateInterval);

    return () => clearInterval(interval);
  }, [user, state.currentRoom]);

  const sendMessage = async (content: string, type: Message['type'] = 'text', fileData?: FileData) => {
    if (!user || !state.currentRoom || !content.trim()) return;

    try {
      await simulateNetworkDelay(100, 300);

      const newMessage = generateMockMessage(
        content,
        user.id,
        user.username,
        user.avatar,
        state.currentRoom.id,
        type
      );

      if (fileData) {
        newMessage.fileUrl = fileData.url;
        newMessage.fileName = fileData.name;
        newMessage.fileSize = fileData.size;
      }

      dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const joinRoom = (roomId: string) => {
    const room = state.rooms.find(r => r.id === roomId);
    if (room) {
      dispatch({ type: 'SET_CURRENT_ROOM', payload: room });
    }
  };

  const createRoom = async (name: string, description: string) => {
    if (!user) return;

    try {
      await simulateNetworkDelay();
      const newRoom = generateMockRoom(name, description, user.id);
      dispatch({ type: 'ADD_ROOM', payload: newRoom });
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    if (!user) return;

    try {
      await simulateNetworkDelay(50, 200);
      dispatch({ 
        type: 'ADD_REACTION', 
        payload: { messageId, emoji, userId: user.id, username: user.username } 
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const editMessage = async (messageId: string, newContent: string) => {
    if (!user) return;

    try {
      await simulateNetworkDelay(100, 300);
      dispatch({ type: 'UPDATE_MESSAGE', payload: { id: messageId, content: newContent } });
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    try {
      await simulateNetworkDelay(1000, 3000); // Simulate file upload delay
      
      // Create a mock URL for the uploaded file - simulate actual file storage
      const fileUrl = `https://storage.googleapis.com/workspace-chatapp/uploads/${file.name.replace(/[^a-z0-9.-]/gi, '_').toLowerCase()}`;
      return fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const searchMessages = (query: string): Message[] => {
    if (!query.trim()) return [];
    
    const lowercaseQuery = query.toLowerCase();
    return state.messages.filter(message =>
      message.content.toLowerCase().includes(lowercaseQuery) ||
      message.username.toLowerCase().includes(lowercaseQuery)
    );
  };

  const contextValue: ChatContextType = {
    chatState: state,
    sendMessage,
    joinRoom,
    createRoom,
    addReaction,
    editMessage,
    uploadFile,
    searchMessages
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};