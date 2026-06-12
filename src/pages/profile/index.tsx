import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { currentUser } from '@/data/mock';

const ProfilePage: React.FC = () => {
  const [user] = useState(currentUser);

  const menuItems = [
    { icon: '📋', text: '我的订单', badge: '4', url: '/pages/order/index' },
    { icon: '⭐', text: '我的评价', url: '' },
    { icon: '🎁', text: '我的收藏', badge: '2', url: '' },
    { icon: '👤', text: '成为陪伴者', url: '' }
  ];

  const safeItems = [
    { icon: '🚫', text: '黑名单', url: '' },
    { icon: '🛟', text: '紧急联系人', url: '' },
    { icon: '⚠️', text: '举报中心', url: '' },
    { icon: '🔒', text: '账号安全', url: '' },
    { icon: '📱', text: '在线模式设置', url: '' }
  ];

  const settingsItems = [
    { icon: '⚙️', text: '设置', url: '' },
    { icon: 'ℹ️', text: '关于我们', url: '' },
    { icon: '📞', text: '联系客服', url: '' }
  ];

  const handleMenuTap = (url: string) => {
    if (url) {
      Taro.navigateTo({ url });
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' });
    }
  };

  const handleVerification = () => {
    Taro.showModal({
      title: '安全认证',
      content: '完成实名认证和人脸认证可提高可信度',
      confirmText: '去认证',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '认证功能开发中', icon: 'none' });
        }
      }
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.userHeader}>
        <View className={styles.userInfo}>
          <Image className={styles.avatar} src={user.avatar} mode="aspectFill" />
          <View className={styles.userDetail}>
            <View className={styles.userName}>
              <Text>{user.name}</Text>
              {user.isVerified && <Text className={styles.verifiedBadge}>✓已认证</Text>}
            </View>
            <View className={styles.userStats}>
              <View className={styles.statItem}>
                <Text className={styles.statNum}>128</Text>
                <Text className={styles.statLabel}>接单次数</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statNum}>4.9</Text>
                <Text className={styles.statLabel}>评分</Text>
              </View>
              <View className={styles.statItem}>
                <Text className={styles.statNum}>256</Text>
                <Text className={styles.statLabel}>获赞</Text>
              </View>
            </View>
          </View>
        </View>
        <View className={styles.userTags}>
          {user.tags.map((tag, index) => (
            <Text key={index} className={styles.tag}>{tag}</Text>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.menuList}>
          {menuItems.map((item, index) => (
            <View
              key={index}
              className={styles.menuItem}
              onClick={() => handleMenuTap(item.url)}
            >
              <Text className={styles.menuIcon}>{item.icon}</Text>
              <Text className={styles.menuText}>{item.text}</Text>
              {item.badge && (
                <View className={styles.menuBadge}>
                  <Text className={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.divider} />

      <View className={styles.section}>
        <View className={styles.sectionTitle}>安全中心</View>
        <View className={styles.menuList}>
          {safeItems.map((item, index) => (
            <View
              key={index}
              className={styles.menuItem}
              onClick={() => handleMenuTap(item.url)}
            >
              <Text className={styles.menuIcon}>{item.icon}</Text>
              <Text className={styles.menuText}>{item.text}</Text>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.divider} />

      <View className={styles.section}>
        <View className={styles.menuList}>
          {settingsItems.map((item, index) => (
            <View
              key={index}
              className={styles.menuItem}
              onClick={() => handleMenuTap(item.url)}
            >
              <Text className={styles.menuIcon}>{item.icon}</Text>
              <Text className={styles.menuText}>{item.text}</Text>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.safeSection}>
        <Text className={styles.menuIcon}>🛡️</Text>
        <Text className={styles.menuText}>开启安全保护，让陪伴更安心</Text>
      </View>

      <View className={styles.divider} />

      <View className={styles.section}>
        <View className={styles.sectionTitle}>在线模式设置</View>
        <View className={styles.menuList}>
          <View className={styles.menuItem}>
            <Text className={styles.menuIcon}>💬</Text>
            <Text className={styles.menuText}>只线上一小时模式</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.divider} />

      <View className={styles.section}>
        <View className={styles.menuList}>
          <View className={styles.menuItem} onClick={handleVerification}>
            <Text className={styles.menuIcon}>✅</Text>
            <Text className={styles.menuText}>安全认证</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfilePage;
