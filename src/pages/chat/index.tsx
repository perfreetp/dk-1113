import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockChats, mockUsers } from '@/data/mock';

interface ChatItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
}

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<ChatItem[]>([]);

  useEffect(() => {
    loadChats();

    const onShow = () => {
      loadChats();
    };

    Taro.onShow(onShow);
    return () => {
      Taro.offShow(onShow);
    };
  }, []);

  const loadChats = () => {
    const storedChats = Taro.getStorageSync('chats') || [];
    
    const mergedChats: ChatItem[] = [];
    const storedIds = new Set(storedChats.map((c: any) => c.userId));
    
    storedChats.forEach((chat: any) => {
      mergedChats.push({
        id: chat.id,
        userId: chat.userId,
        userName: chat.userName,
        userAvatar: chat.userAvatar,
        lastMessage: chat.lastMessage,
        lastTime: chat.lastTime,
        unreadCount: chat.unreadCount || 0
      });
    });

    mockChats.forEach((mockChat) => {
      if (!storedIds.has(mockChat.user.id)) {
        mergedChats.push({
          id: mockChat.id,
          userId: mockChat.user.id,
          userName: mockChat.user.name,
          userAvatar: mockChat.user.avatar,
          lastMessage: mockChat.lastMessage.content,
          lastTime: mockChat.lastMessage.createdAt.split(' ')[1],
          unreadCount: mockChat.unreadCount
        });
      }
    });

    mergedChats.sort((a, b) => {
      return new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime();
    });

    setChats(mergedChats);
  };

  const handleChatTap = (chat: ChatItem) => {
    Taro.navigateTo({ url: `/pages/chat-detail/index?id=${chat.userId}` });
  };

  return (
    <View className={styles.page}>
      {chats.length > 0 ? (
        <View className={styles.chatList}>
          {chats.map((chat) => {
            const user = mockUsers.find(u => u.id === chat.userId);
            return (
              <View
                key={chat.id}
                className={styles.chatItem}
                onClick={() => handleChatTap(chat)}
              >
                <Image className={styles.avatar} src={chat.userAvatar} mode="aspectFill" />
                <View className={styles.chatContent}>
                  <View className={styles.chatHeader}>
                    <Text className={styles.userName}>{chat.userName}</Text>
                    <Text className={styles.chatTime}>{chat.lastTime}</Text>
                  </View>
                  <Text className={styles.lastMessage}>{chat.lastMessage}</Text>
                </View>
                {chat.unreadCount > 0 && (
                  <View className={styles.unreadBadge}>
                    <Text className={styles.badgeText}>{chat.unreadCount}</Text>
                  </View>
                )}
                {user && !user.isOnline && (
                  <View className={styles.offlineBadge} />
                )}
              </View>
            );
          })}
        </View>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>💬</Text>
          <Text className={styles.emptyText}>暂无会话</Text>
          <Text className={styles.emptyTip}>去首页邀请一位朋友开始聊天吧</Text>
        </View>
      )}
    </View>
  );
};

export default ChatPage;
