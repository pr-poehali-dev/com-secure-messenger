export interface User {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  lastSeen?: string;
  token?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  mediaUrl?: string;
  mediaType?: "image" | "audio" | "video" | "file";
  isEncrypted: boolean;
  createdAt: string;
  reactions?: { emoji: string; count: number; mine: boolean }[];
}

export interface Chat {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerUsername: string;
  partnerAvatar?: string;
  partnerOnline?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}
