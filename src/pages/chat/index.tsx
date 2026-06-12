import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockChats } from '@/data/mock';
import type { Chat } from '@/types';

const ChatPage: React.FC = () => {
  const [chats] = useState<Chat[]>(mockChats);

  const handleChatTap = (chat: Chat) => {
    Taro.navigateTo({ url: `/pages/chat-detail/index?id=${chat.user.id}` });
  };

  return (
    <View className={styles.page}>
      {chats.length > 0 ? (
        <View className={styles.chatList}>
          {chats.map((chat) => (
            <View
              key={chat.id}
              className={styles.chatItem}
              onClick={() => handleChatTap(chat)}
            >
              <Image className={styles.avatar} src={chat.user.avatar} mode="aspectFill" />
              <View className={styles.chatContent}>
                <View className={styles.chatHeader}>
                  <Text className={styles.userName}>{chat.user.name}</Text>
                  <Text className={styles.chatTime}>{chat.lastMessage.createdAt.split(' ')[1]}</Text>
                </View>
                <Text className={styles.lastMessage}>{chat.lastMessage.content}</Text>
              </View>
              {chat.unreadCount > 0 && (
                <View className={styles.unreadBadge}>
                  <Text className={styles.badgeText}>{chat.unreadCount}</Text>
                </View>
              )}
            </View>
          ))}
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
