// Core TypeScript interfaces for the chat application

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
  joinedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  username: string;
  userAvatar: string;
  roomId: string;
  timestamp: Date;
  edited: boolean;
  editedAt?: Date;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  reactions: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  username: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  memberCount: number;
  lastMessage?: Message;
  createdAt: Date;
  createdBy: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isAuthenticated: boolean;
}

export interface ChatState {
  currentUser: AuthUser | null;
  currentRoom: ChatRoom | null;
  rooms: ChatRoom[];
  messages: Message[];
  onlineUsers: User[];
  isLoading: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface ChatContextType {
  chatState: ChatState;
  sendMessage: (content: string, type?: Message['type'], fileData?: FileData) => void;
  joinRoom: (roomId: string) => void;
  createRoom: (name: string, description: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  editMessage: (messageId: string, newContent: string) => void;
  uploadFile: (file: File) => Promise<string>;
  searchMessages: (query: string) => Message[];
}

export interface FileData {
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface EmojiData {
  emoji: string;
  name: string;
  category: string;
}

export interface NotificationData {
  id: string;
  type: 'message' | 'mention' | 'room_invite';
  title: string;
  message: string;
  roomId?: string;
  userId: string;
  timestamp: Date;
  read: boolean;
}

// API Response types
export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export interface SignupResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export interface MessageResponse {
  success: boolean;
  message?: Message;
  error?: string;
}

export interface RoomResponse {
  success: boolean;
  room?: ChatRoom;
  error?: string;
}