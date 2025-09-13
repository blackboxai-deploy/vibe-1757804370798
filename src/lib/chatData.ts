// Mock data and API simulation for the chat application

import { User, Message, ChatRoom, AuthUser } from './types';
import { DEFAULT_ROOMS } from './constants';

// Mock users data with placeholder avatars
export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    username: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e79fc261-7896-440e-913f-d12de60778c2.png',
    status: 'online',
    lastSeen: new Date(),
    joinedAt: new Date(Date.now() - 86400000 * 30) // 30 days ago
  },
  {
    id: 'user-2',
    username: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b68bc2f5-9343-4254-8798-0df66e035e35.png',
    status: 'online',
    lastSeen: new Date(),
    joinedAt: new Date(Date.now() - 86400000 * 25)
  },
  {
    id: 'user-3',
    username: 'Mike Rodriguez',
    email: 'mike@example.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a322a0b4-417a-4f00-9a54-21b3d64674f1.png',
    status: 'away',
    lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
    joinedAt: new Date(Date.now() - 86400000 * 15)
  },
  {
    id: 'user-4',
    username: 'Emma Wilson',
    email: 'emma@example.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/178d4fd1-5c8a-4bb9-9c29-3dca785704b4.png',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
    joinedAt: new Date(Date.now() - 86400000 * 20)
  },
  {
    id: 'user-5',
    username: 'David Kumar',
    email: 'david@example.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/27d27175-1402-4d49-8846-940cc8ba198c.png',
    status: 'online',
    lastSeen: new Date(),
    joinedAt: new Date(Date.now() - 86400000 * 10)
  }
];

// Mock chat rooms
export const MOCK_ROOMS: ChatRoom[] = DEFAULT_ROOMS.map((room, index) => ({
  id: room.id,
  name: room.name,
  description: room.description,
  type: 'public' as const,
  memberCount: Math.floor(Math.random() * 50) + 10,
  createdAt: new Date(Date.now() - 86400000 * (30 - index * 5)),
  createdBy: MOCK_USERS[0].id
}));

// Mock messages for realistic chat history
export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    content: 'Hey everyone! Welcome to our chat app. How is everyone doing today?',
    userId: 'user-1',
    username: 'Alex Johnson',
    userAvatar: MOCK_USERS[0].avatar,
    roomId: 'general',
    timestamp: new Date(Date.now() - 3600000 * 2),
    edited: false,
    type: 'text',
    reactions: [
      { emoji: '👋', userId: 'user-2', username: 'Sarah Chen' },
      { emoji: '😊', userId: 'user-3', username: 'Mike Rodriguez' }
    ]
  },
  {
    id: 'msg-2',
    content: 'Hi Alex! I\'m doing great, thanks for asking. Really excited about this new chat platform!',
    userId: 'user-2',
    username: 'Sarah Chen',
    userAvatar: MOCK_USERS[1].avatar,
    roomId: 'general',
    timestamp: new Date(Date.now() - 3600000 * 2 + 300000),
    edited: false,
    type: 'text',
    reactions: [
      { emoji: '🎉', userId: 'user-1', username: 'Alex Johnson' }
    ]
  },
  {
    id: 'msg-3',
    content: 'Same here! The interface looks really clean and modern. Great work on the design.',
    userId: 'user-3',
    username: 'Mike Rodriguez',
    userAvatar: MOCK_USERS[2].avatar,
    roomId: 'general',
    timestamp: new Date(Date.now() - 3600000 * 2 + 600000),
    edited: false,
    type: 'text',
    reactions: [
      { emoji: '👍', userId: 'user-1', username: 'Alex Johnson' },
      { emoji: '💯', userId: 'user-2', username: 'Sarah Chen' }
    ]
  },
  {
    id: 'msg-4',
    content: 'Has anyone tried the file upload feature yet? I\'m curious about how it works.',
    userId: 'user-4',
    username: 'Emma Wilson',
    userAvatar: MOCK_USERS[3].avatar,
    roomId: 'general',
    timestamp: new Date(Date.now() - 3600000 * 1 + 900000),
    edited: false,
    type: 'text',
    reactions: []
  },
  {
    id: 'msg-5',
    content: 'Speaking of tech, has anyone been following the latest developments in AI? There\'s some fascinating stuff happening.',
    userId: 'user-5',
    username: 'David Kumar',
    userAvatar: MOCK_USERS[4].avatar,
    roomId: 'tech-talk',
    timestamp: new Date(Date.now() - 1800000),
    edited: false,
    type: 'text',
    reactions: [
      { emoji: '🤖', userId: 'user-1', username: 'Alex Johnson' },
      { emoji: '🚀', userId: 'user-3', username: 'Mike Rodriguez' }
    ]
  },
  {
    id: 'msg-6',
    content: 'Absolutely! The pace of innovation is incredible. I\'ve been experimenting with some new frameworks lately.',
    userId: 'user-2',
    username: 'Sarah Chen',
    userAvatar: MOCK_USERS[1].avatar,
    roomId: 'tech-talk',
    timestamp: new Date(Date.now() - 1500000),
    edited: false,
    type: 'text',
    reactions: [
      { emoji: '⚡', userId: 'user-5', username: 'David Kumar' }
    ]
  },
  {
    id: 'msg-7',
    content: 'Random thought: why do we call it "debugging" when it should be "de-bugging"? 🐛',
    userId: 'user-3',
    username: 'Mike Rodriguez',
    userAvatar: MOCK_USERS[2].avatar,
    roomId: 'random',
    timestamp: new Date(Date.now() - 900000),
    edited: false,
    type: 'text',
    reactions: [
      { emoji: '😂', userId: 'user-1', username: 'Alex Johnson' },
      { emoji: '🤔', userId: 'user-4', username: 'Emma Wilson' },
      { emoji: '🐛', userId: 'user-5', username: 'David Kumar' }
    ]
  },
  {
    id: 'msg-8',
    content: 'Haha! That\'s actually a great point. Programming humor at its finest!',
    userId: 'user-1',
    username: 'Alex Johnson',
    userAvatar: MOCK_USERS[0].avatar,
    roomId: 'random',
    timestamp: new Date(Date.now() - 600000),
    edited: false,
    type: 'text',
    reactions: [
      { emoji: '👨‍💻', userId: 'user-2', username: 'Sarah Chen' }
    ]
  },
  {
    id: 'msg-9',
    content: 'Welcome to ChatHub! Here are some important guidelines for using our platform effectively.',
    userId: 'user-1',
    username: 'Alex Johnson',
    userAvatar: MOCK_USERS[0].avatar,
    roomId: 'announcements',
    timestamp: new Date(Date.now() - 86400000 * 2),
    edited: false,
    type: 'text',
    reactions: [
      { emoji: '📢', userId: 'user-2', username: 'Sarah Chen' },
      { emoji: '👀', userId: 'user-3', username: 'Mike Rodriguez' }
    ]
  },
  {
    id: 'msg-10',
    content: 'Just pushed some updates to the chat system. You should see improved performance now!',
    userId: 'user-5',
    username: 'David Kumar',
    userAvatar: MOCK_USERS[4].avatar,
    roomId: 'announcements',
    timestamp: new Date(Date.now() - 300000),
    edited: false,
    type: 'text',
    reactions: [
      { emoji: '🚀', userId: 'user-1', username: 'Alex Johnson' },
      { emoji: '⚡', userId: 'user-2', username: 'Sarah Chen' },
      { emoji: '💪', userId: 'user-4', username: 'Emma Wilson' }
    ]
  }
];

// Utility functions for mock API
export const generateMockUser = (username: string, email: string): AuthUser => {
  return {
    id: `user-${Date.now()}`,
    username,
    email,
    avatar: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f882f24c-e248-440b-b003-9faac0a7fb10.png' ', '+')}+profile+picture+professional`,
    isAuthenticated: true
  };
};

export const generateMockMessage = (
  content: string,
  userId: string,
  username: string,
  userAvatar: string,
  roomId: string,
  type: Message['type'] = 'text'
): Message => {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content,
    userId,
    username,
    userAvatar,
    roomId,
    timestamp: new Date(),
    edited: false,
    type,
    reactions: []
  };
};

export const generateMockRoom = (name: string, description: string, createdBy: string): ChatRoom => {
  return {
    id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    type: 'public',
    memberCount: 1,
    createdAt: new Date(),
    createdBy
  };
};

// Mock API simulation delays
export const simulateNetworkDelay = (min = 200, max = 800): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Mock authentication validation
export const validateCredentials = (email: string, password: string): boolean => {
  // Simple validation - in real app this would be server-side
  return email.includes('@') && password.length >= 6;
};

export const validateSignupData = (username: string, email: string, password: string): { valid: boolean; error?: string } => {
  if (username.length < 2) {
    return { valid: false, error: 'Username must be at least 2 characters long' };
  }
  if (!email.includes('@')) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long' };
  }
  return { valid: true };
};