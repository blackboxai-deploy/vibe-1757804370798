// Application constants and configuration

export const APP_NAME = "ChatHub";

export const DEFAULT_ROOMS = [
  {
    id: "general",
    name: "General",
    description: "General discussion for everyone"
  },
  {
    id: "random",
    name: "Random",
    description: "Random conversations and fun topics"
  },
  {
    id: "tech-talk",
    name: "Tech Talk",
    description: "Discussions about technology and development"
  },
  {
    id: "announcements",
    name: "Announcements",
    description: "Important updates and announcements"
  }
];

export const USER_STATUS_OPTIONS = [
  { value: 'online', label: 'Online', color: 'bg-green-500' },
  { value: 'away', label: 'Away', color: 'bg-yellow-500' },
  { value: 'offline', label: 'Offline', color: 'bg-gray-500' }
] as const;

export const MESSAGE_TYPES = [
  'text',
  'image',
  'file'
] as const;

export const EMOJI_CATEGORIES = [
  { name: 'Recent', emojis: ['😊', '👍', '❤️', '😂', '😢', '😮', '😡', '👏'] },
  { name: 'Smileys', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚'] },
  { name: 'Gestures', emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌'] },
  { name: 'Objects', emojis: ['💻', '📱', '⌚', '📷', '📹', '🎵', '🎮', '🔥', '💯', '✨', '⭐', '🌟', '💥', '💢', '💫', '💤', '🕳️', '👁️', '💬', '💭'] }
];

export const FILE_UPLOAD_LIMITS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.doc', '.docx']
};

export const CHAT_CONFIG = {
  messagesPerPage: 50,
  maxMessageLength: 2000,
  typingIndicatorTimeout: 3000,
  onlineStatusUpdateInterval: 30000, // 30 seconds
  messageUpdateInterval: 5000 // 5 seconds for real-time simulation
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_USER: 'chat_auth_user',
  CHAT_ROOMS: 'chat_rooms',
  CHAT_MESSAGES: 'chat_messages',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'chat_theme'
};

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  MESSAGES: '/api/messages',
  ROOMS: '/api/rooms',
  UPLOAD: '/api/upload',
  USERS: '/api/users'
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

export const NOTIFICATION_TYPES = {
  MESSAGE: 'message',
  MENTION: 'mention',
  ROOM_INVITE: 'room_invite'
} as const;