import React, { useState } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { companionTypes, mockUsers } from '@/data/mock';
import type { User } from '@/types';

const HomePage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [users] = useState<User[]>(mockUsers);

  const handlePublish = () => {
    Taro.navigateTo({ url: '/pages/publish/index' });
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(selectedType === typeId ? '' : typeId);
  };

  const handleUserTap = (user: User) => {
    Taro.navigateTo({ url: `/pages/user-detail/index?id=${user.id}` });
  };

  const handleInvite = (user: User) => {
    Taro.navigateTo({ url: `/pages/chat-detail/index?id=${user.id}` });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>一小时朋友</Text>
        <Text className={styles.subtitle}>遇见温暖，共享时光</Text>
        <Button className={styles.publishBtn} onClick={handlePublish}>
          <Text className={styles.btnText}>发布陪伴需求</Text>
        </Button>
      </View>

      <View className={styles.typeSection}>
        <Text className={styles.sectionTitle}>选择陪伴类型</Text>
        <View className={styles.typeList}>
          {companionTypes.map((type) => (
            <Button
              key={type.id}
              className={`${styles.typeItem} ${selectedType === type.id ? styles.active : ''}`}
              onClick={() => handleTypeSelect(type.id)}
            >
              <Text className={styles.typeIcon}>{type.icon}</Text>
              <Text className={styles.typeName}>{type.name}</Text>
            </Button>
          ))}
        </View>
      </View>

      <View className={styles.userSection}>
        <Text className={styles.sectionTitle}>附近可接单者</Text>
        {users.length > 0 ? (
          users.map((user) => (
            <View
              key={user.id}
              className={styles.userCard}
              onClick={() => handleUserTap(user)}
            >
              <View className={styles.userHeader}>
                <Image className={styles.avatar} src={user.avatar} mode="aspectFill" />
                <View className={styles.userInfo}>
                  <View className={styles.userName}>
                    <Text>{user.name}</Text>
                    {user.isVerified && <Text className={styles.verifiedBadge}>✓</Text>}
                    {user.isOnline && <View className={styles.onlineBadge} />}
                  </View>
                  <View className={styles.userMeta}>
                    <Text className={`${styles.metaItem} ${styles.location}`}>📍 {user.location}</Text>
                    <Text className={styles.metaItem}>{user.age}岁</Text>
                  </View>
                </View>
              </View>

              <View className={styles.userTags}>
                {user.tags.slice(0, 4).map((tag, index) => (
                  <Text key={index} className={styles.tag}>{tag}</Text>
                ))}
              </View>

              <View className={styles.userBottom}>
                <View className={styles.rating}>
                  <Text className={styles.star}>★</Text>
                  <Text className={styles.ratingNum}>{user.rating}</Text>
                  <Text className={styles.reviewCount}>({user.reviewCount})</Text>
                </View>
                <View className={styles.price}>
                  <Text className={styles.priceNum}>¥{user.hourlyRate}</Text>
                  <Text className={styles.priceUnit}>/小时</Text>
                </View>
                <Button className={styles.inviteBtn} onClick={(e) => { e.stopPropagation(); handleInvite(user); }}>
                  <Text className={styles.btnText}>邀请</Text>
                </Button>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>👥</Text>
            <Text className={styles.emptyText}>暂无附近可接单者</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HomePage;
