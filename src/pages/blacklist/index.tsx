import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockUsers } from '@/data/mock';

interface BlacklistItem {
  userId: string;
  userName: string;
  userAvatar: string;
  addedAt: string;
}

const BlacklistPage: React.FC = () => {
  const [blacklist, setBlacklist] = useState<BlacklistItem[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(mockUsers);

  useEffect(() => {
    const storedBlacklist = Taro.getStorageSync('blacklist') || [];
    setBlacklist(storedBlacklist);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockUsers.filter(user => 
        user.name.includes(searchQuery.trim())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(mockUsers);
    }
  }, [searchQuery]);

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

  const handleAddUser = (user: typeof mockUsers[0]) => {
    const exists = blacklist.some(item => item.userId === user.id);
    if (exists) {
      Taro.showToast({ title: '该用户已在黑名单中', icon: 'none' });
      return;
    }

    const newItem: BlacklistItem = {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      addedAt: new Date().toLocaleString('zh-CN')
    };

    const updatedBlacklist = [...blacklist, newItem];
    setBlacklist(updatedBlacklist);
    Taro.setStorageSync('blacklist', updatedBlacklist);
    setShowAddPopup(false);
    setSearchQuery('');
    Taro.showToast({ title: '已加入黑名单', icon: 'success' });
  };

  const handleManualAdd = () => {
    Taro.showModal({
      title: '手动添加黑名单',
      editable: true,
      placeholderText: '请输入要拉黑的用户名',
      success: (res) => {
        if (res.confirm && res.content) {
          const user = mockUsers.find(u => u.name === res.content.trim());
          if (user) {
            handleAddUser(user);
          } else {
            const newItem: BlacklistItem = {
              userId: Date.now().toString(),
              userName: res.content.trim(),
              userAvatar: 'https://picsum.photos/id/1/200/200',
              addedAt: new Date().toLocaleString('zh-CN')
            };
            const updatedBlacklist = [...blacklist, newItem];
            setBlacklist(updatedBlacklist);
            Taro.setStorageSync('blacklist', updatedBlacklist);
            Taro.showToast({ title: '已加入黑名单', icon: 'success' });
          }
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

      <View className={styles.footer}>
        <Button className={styles.addBtn} onClick={() => setShowAddPopup(true)}>
          <Text className={styles.btnText}>从用户列表添加</Text>
        </Button>
        <Button className={`${styles.addBtn} ${styles.secondary}`} onClick={handleManualAdd}>
          <Text className={styles.btnText}>手动输入添加</Text>
        </Button>
      </View>

      {showAddPopup && (
        <>
          <View className={styles.mask} onClick={() => setShowAddPopup(false)} />
          <View className={styles.popup}>
            <Text className={styles.popupTitle}>选择要拉黑的用户</Text>
            
            <View className={styles.searchBox}>
              <Input
                className={styles.searchInput}
                placeholder="搜索用户名"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.detail.value)}
              />
            </View>

            <View className={styles.userList}>
              {searchResults.map((user) => {
                const isBlocked = blacklist.some(item => item.userId === user.id);
                return (
                  <View
                    key={user.id}
                    className={`${styles.userItem} ${isBlocked ? styles.disabled : ''}`}
                  >
                    <Image className={styles.avatar} src={user.avatar} mode="aspectFill" />
                    <View className={styles.userInfo}>
                      <Text className={styles.userName}>{user.name}</Text>
                      <Text className={styles.userLocation}>{user.location}</Text>
                    </View>
                    {isBlocked ? (
                      <Text className={styles.blockedText}>已拉黑</Text>
                    ) : (
                      <Button className={styles.blockBtn} onClick={() => handleAddUser(user)}>
                        <Text className={styles.btnText}>拉黑</Text>
                      </Button>
                    )}
                  </View>
                );
              })}
            </View>

            <View className={styles.popupActions}>
              <Button className={`${styles.popupBtn} ${styles.cancel}`} onClick={() => setShowAddPopup(false)}>
                <Text className={styles.btnText}>取消</Text>
              </Button>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default BlacklistPage;
