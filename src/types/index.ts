export interface User {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: 'male' | 'female';
  location: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isOnline: boolean;
  availableTime: string[];
  skills: string[];
  bio: string;
  hourlyRate: number;
}

export interface CompanionType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Order {
  id: string;
  type: string;
  title: string;
  duration: number;
  location: string;
  budget: number;
  meetingType: 'online' | 'offline';
  status: 'pending' | 'accepted' | 'inProgress' | 'completed' | 'cancelled';
  createdAt: string;
  startTime: string;
  endTime: string;
  user: User;
  companion?: User;
  rating?: number;
  review?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'system';
  createdAt: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface BlacklistItem {
  userId: string;
  userName: string;
  userAvatar: string;
  addedAt: string;
}
