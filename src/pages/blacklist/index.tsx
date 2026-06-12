import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface BlacklistItem {
  userId: string;
  userName: string;
  userAvatar: string;
  addedAt: string;
}

const BlacklistPage: React.FC = () => {
  const [blacklist, setBlacklist] = useState<BlacklistItem[]>([]);

  useEffect(() => {
    const storedBlacklist = Taro.getStorageSync('blacklist') || [];
    setBlacklist(storedBlacklist);
  }, []);

  const handleRemove = (userId: string) => {
    Taro.showModal({
      title: '移除黑名单',
      content: '确认将该用户移出黑名单？',
      success: (res) => {
        if (res.confirm) {
          const updatedBlacklist = blacklist.filter(item => item.userId !== userId);
          setBlacklist(updatedBlacklist);
          Taro.setStorageSync('blacklist', updatedBlacklist);
          Taro.showToast({ title: '已移除', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.section}>
        {blacklist.length > 0 ? (
          <View className={styles.blacklistList}>
            {blacklist.map((item) => (
              <View key={item.userId} className={styles.blacklistItem}>
                <Image className={styles.userAvatar} src={item.userAvatar} mode="aspectFill" />
                <View className={styles.userInfo}>
                  <Text className={styles.userName}>{item.userName}</Text>
                  <Text className={styles.addedTime}>加入时间：{item.addedAt}</Text>
                </View>
                <Button className={styles.removeBtn} onClick={() => handleRemove(item.userId)}>
                  <Text className={styles.btnText}>移除</Text>
                </Button>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🚫</Text>
            <Text className={styles.emptyText}>黑名单为空</Text>
            <Text className={styles.tips}>被拉黑的用户将无法与您联系</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default BlacklistPage;
