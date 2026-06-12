import type { User, CompanionType, Order, Chat, Message } from '@/types';

export const companionTypes: CompanionType[] = [
  { id: '1', name: '散步', icon: '🚶', description: '一起散步聊天' },
  { id: '2', name: '咖啡', icon: '☕', description: '咖啡厅小坐' },
  { id: '3', name: '陪逛', icon: '🛍️', description: '逛街购物陪伴' },
  { id: '4', name: '排队', icon: '⏳', description: '帮忙排队占位' },
  { id: '5', name: '倾听', icon: '👂', description: '临时情绪倾听' },
  { id: '6', name: '线上', icon: '💬', description: '只线上一小时' }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: '小雨',
    avatar: 'https://picsum.photos/id/64/200/200',
    age: 26,
    gender: 'female',
    location: '朝阳区',
    tags: ['温柔', '善倾听', '爱旅行'],
    rating: 4.9,
    reviewCount: 128,
    isVerified: true,
    isOnline: true,
    availableTime: ['今天 14:00-18:00', '明天 10:00-16:00'],
    skills: ['倾听', '聊天', '拍照'],
    bio: '喜欢旅行和美食，乐于倾听他人故事，希望能给你带来温暖。',
    hourlyRate: 68
  },
  {
    id: '2',
    name: '阿杰',
    avatar: 'https://picsum.photos/id/91/200/200',
    age: 28,
    gender: 'male',
    location: '海淀区',
    tags: ['幽默', '运动', '电影'],
    rating: 4.8,
    reviewCount: 96,
    isVerified: true,
    isOnline: true,
    availableTime: ['今天 16:00-20:00', '明天 14:00-18:00'],
    skills: ['聊天', '运动', '电影推荐'],
    bio: '热爱运动和电影，擅长活跃气氛，陪你度过愉快时光。',
    hourlyRate: 58
  },
  {
    id: '3',
    name: '小美',
    avatar: 'https://picsum.photos/id/177/200/200',
    age: 24,
    gender: 'female',
    location: '西城区',
    tags: ['文艺', '咖啡', '阅读'],
    rating: 4.7,
    reviewCount: 72,
    isVerified: true,
    isOnline: false,
    availableTime: ['明天 10:00-14:00', '周末全天'],
    skills: ['咖啡品鉴', '阅读分享', '拍照'],
    bio: '文艺青年一枚，喜欢咖啡和阅读，期待与你分享美好时光。',
    hourlyRate: 78
  },
  {
    id: '4',
    name: '大伟',
    avatar: 'https://picsum.photos/id/338/200/200',
    age: 30,
    gender: 'male',
    location: '东城区',
    tags: ['稳重', '可靠', '倾听'],
    rating: 4.9,
    reviewCount: 156,
    isVerified: true,
    isOnline: true,
    availableTime: ['今天 18:00-22:00', '周末全天'],
    skills: ['倾听', '人生建议', '心理咨询'],
    bio: '资深倾听者，有丰富的人生阅历，愿意陪伴你度过低谷。',
    hourlyRate: 88
  },
  {
    id: '5',
    name: '萌萌',
    avatar: 'https://picsum.photos/id/1027/200/200',
    age: 22,
    gender: 'female',
    location: '朝阳区',
    tags: ['活泼', '时尚', '购物'],
    rating: 4.6,
    reviewCount: 64,
    isVerified: true,
    isOnline: false,
    availableTime: ['周末全天'],
    skills: ['逛街', '穿搭建议', '拍照'],
    bio: '时尚达人，喜欢逛街购物，陪你发现美美的自己！',
    hourlyRate: 68
  },
  {
    id: '6',
    name: '小陈',
    avatar: 'https://picsum.photos/id/201/200/200',
    age: 25,
    gender: 'male',
    location: '海淀区',
    tags: ['科技', '游戏', '数码'],
    rating: 4.5,
    reviewCount: 45,
    isVerified: false,
    isOnline: true,
    availableTime: ['今天 20:00-24:00', '周末全天'],
    skills: ['游戏', '数码推荐', '线上聊天'],
    bio: '科技爱好者，喜欢玩游戏，线上陪伴首选！',
    hourlyRate: 48
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    type: '咖啡',
    title: '咖啡厅小坐聊天',
    duration: 1,
    location: '星巴克(国贸店)',
    budget: 80,
    meetingType: 'offline',
    status: 'inProgress',
    createdAt: '2024-01-15 10:30',
    startTime: '2024-01-15 14:00',
    endTime: '2024-01-15 15:00',
    user: mockUsers[0],
    companion: mockUsers[1],
    rating: undefined,
    review: undefined
  },
  {
    id: '2',
    type: '散步',
    title: '晚间公园散步',
    duration: 1,
    location: '朝阳公园',
    budget: 60,
    meetingType: 'offline',
    status: 'completed',
    createdAt: '2024-01-14 16:00',
    startTime: '2024-01-14 19:00',
    endTime: '2024-01-14 20:00',
    user: mockUsers[0],
    companion: mockUsers[3],
    rating: 5,
    review: '非常好的陪伴，很舒服的聊天体验！'
  },
  {
    id: '3',
    type: '线上',
    title: '线上聊天陪伴',
    duration: 1,
    location: '线上',
    budget: 50,
    meetingType: 'online',
    status: 'pending',
    createdAt: '2024-01-15 09:00',
    startTime: '2024-01-15 20:00',
    endTime: '2024-01-15 21:00',
    user: mockUsers[0],
    companion: undefined,
    rating: undefined,
    review: undefined
  },
  {
    id: '4',
    type: '陪逛',
    title: '商场购物陪伴',
    duration: 2,
    location: '三里屯太古里',
    budget: 150,
    meetingType: 'offline',
    status: 'accepted',
    createdAt: '2024-01-15 11:00',
    startTime: '2024-01-16 14:00',
    endTime: '2024-01-16 16:00',
    user: mockUsers[0],
    companion: mockUsers[4],
    rating: undefined,
    review: undefined
  }
];

const mockMessages: Message[] = [
  { id: '1', senderId: '2', content: '你好！我是阿杰，很高兴认识你~', type: 'text', createdAt: '2024-01-15 10:30', isRead: true },
  { id: '2', senderId: '1', content: '你好！期待今天下午见面~', type: 'text', createdAt: '2024-01-15 10:32', isRead: true },
  { id: '3', senderId: '2', content: '好的，下午见！', type: 'text', createdAt: '2024-01-15 10:35', isRead: false },
  { id: '4', senderId: '3', content: '你好，我看到了你的订单', type: 'text', createdAt: '2024-01-15 09:15', isRead: true },
  { id: '5', senderId: '1', content: '你好，方便明天见面吗？', type: 'text', createdAt: '2024-01-15 09:20', isRead: true },
  { id: '6', senderId: '4', content: '上次见面很愉快，期待下次！', type: 'text', createdAt: '2024-01-14 20:15', isRead: true },
  { id: '7', senderId: '6', content: '线上聊天随时可以开始！', type: 'text', createdAt: '2024-01-15 09:05', isRead: false }
];

export const mockChats: Chat[] = [
  {
    id: '1',
    user: mockUsers[1],
    lastMessage: mockMessages[2],
    unreadCount: 1
  },
  {
    id: '2',
    user: mockUsers[2],
    lastMessage: mockMessages[4],
    unreadCount: 0
  },
  {
    id: '3',
    user: mockUsers[3],
    lastMessage: mockMessages[5],
    unreadCount: 0
  },
  {
    id: '4',
    user: mockUsers[5],
    lastMessage: mockMessages[6],
    unreadCount: 1
  }
];

export const currentUser: User = {
  id: '1',
  name: '小雨',
  avatar: 'https://picsum.photos/id/64/200/200',
  age: 26,
  gender: 'female',
  location: '朝阳区',
  tags: ['温柔', '善倾听', '爱旅行'],
  rating: 4.9,
  reviewCount: 128,
  isVerified: true,
  isOnline: true,
  availableTime: [],
  skills: ['倾听', '聊天', '拍照'],
  bio: '喜欢旅行和美食，乐于倾听他人故事，希望能给你带来温暖。',
  hourlyRate: 68
};
