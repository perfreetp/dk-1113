import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, Input, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockUsers, currentUser } from '@/data/mock';
import type { Message } from '@/types';

const ChatDetailPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: '2', content: '你好！我是阿杰，很高兴认识你~', type: 'text', createdAt: '2024-01-15 10:30', isRead: true },
    { id: '2', senderId: '1', content: '你好！期待今天下午见面~', type: 'text', createdAt: '2024-01-15 10:32', isRead: true },
    { id: '3', senderId: '2', content: '好的，下午见！', type: 'text', createdAt: '2024-01-15 10:35', isRead: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const targetUser = mockUsers[1];

  const quickActions = [
    { text: '邀请散步', action: 'invite_walk' },
    { text: '邀请喝咖啡', action: 'invite_coffee' },
    { text: '线上聊天', action: 'online_chat' },
    { text: '确认见面', action: 'confirm_meeting' },
    { text: '分享路线', action: 'share_route' },
    { text: '提醒对方', action: 'remind' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        scrollTop: 99999,
        duration: 300
      });
    }, 100);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: '1',
      content: inputValue,
      type: 'text',
      createdAt: new Date().toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-'),
      isRead: false
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: targetUser.id,
        content: '收到，我会准时到达的~',
        type: 'text',
        createdAt: new Date().toLocaleString('zh-CN', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-'),
        isRead: false
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    let message = '';
    switch (action) {
      case 'invite_walk':
        message = '想邀请你一起散步，大约1小时，你有空吗？';
        break;
      case 'invite_coffee':
        message = '想邀请你一起喝咖啡，你看什么时候方便？';
        break;
      case 'online_chat':
        message = '我们可以先线上聊一聊';
        break;
      case 'confirm_meeting':
        message = '确认一下，今天下午2点在星巴克见可以吗？';
        break;
      case 'share_route':
        Taro.showToast({ title: '路线分享功能开发中', icon: 'none' });
        return;
      case 'remind':
        message = '记得我们今天下午的见面哦！';
        break;
      default:
        return;
    }
    setInputValue(message);
    setShowQuickActions(false);
  };

  return (
    <View className={styles.page}>
      <ScrollView
        ref={scrollRef}
        className={styles.messageList}
        scrollY
        scrollWithAnimation
      >
        <View className={styles.systemMessage}>
          <Text className={styles.systemText}>这是一个安全的聊天环境，请文明交流</Text>
        </View>
        
        {messages.map((msg) => {
          const isSelf = msg.senderId === '1';
          const user = isSelf ? currentUser : targetUser;
          
          return (
            <View key={msg.id} className={`${styles.messageItem} ${isSelf ? styles.self : ''}`}>
              <Image className={styles.avatar} src={user.avatar} mode="aspectFill" />
              <View className={styles.messageContent}>
                <View className={styles.messageBubble}>
                  <Text className={styles.messageText}>{msg.content}</Text>
                </View>
                <Text className={styles.messageTime}>{msg.createdAt.split(' ')[1]}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {showQuickActions && (
        <View className={styles.quickActions}>
          <View className={styles.actionGrid}>
            {quickActions.map((action) => (
              <Button
                key={action.action}
                className={styles.actionItem}
                onClick={() => handleQuickAction(action.action)}
              >
                <Text className={styles.actionText}>{action.text}</Text>
              </Button>
            ))}
          </View>
        </View>
      )}

      <View className={styles.footer}>
        <Button className={styles.actionBtn} onClick={() => setShowQuickActions(!showQuickActions)}>
          <Text className={styles.btnIcon}>+</Text>
        </Button>
        <View className={styles.inputWrap}>
          <Input
            className={styles.input}
            placeholder="输入消息..."
            value={inputValue}
            onChange={(e) => setInputValue(e.detail.value)}
            onConfirm={handleSend}
          />
        </View>
        <Button
          className={`${styles.sendBtn} ${!inputValue.trim() ? styles.disabled : ''}`}
          onClick={handleSend}
          disabled={!inputValue.trim()}
        >
          <Text className={styles.btnIcon}>➤</Text>
        </Button>
      </View>
    </View>
  );
};

export default ChatDetailPage;
