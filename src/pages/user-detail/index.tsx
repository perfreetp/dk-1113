import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockUsers } from '@/data/mock';
import type { User } from '@/types';

const UserDetailPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>('');

  const reportOptions = [
    { value: 'fake', label: '虚假信息' },
    { value: 'inappropriate', label: '不当内容' },
    { value: 'harassment', label: '骚扰行为' },
    { value: 'scam', label: '诈骗行为' },
    { value: 'other', label: '其他' }
  ];

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = (currentPage as any)?.options || {};
    const userId = options.id || '1';
    
    const foundUser = mockUsers.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
    } else {
      setUser(mockUsers[0]);
    }
  }, []);

  if (!user) {
    return (
      <View className={styles.page}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const handleChat = () => {
    Taro.navigateTo({ url: `/pages/chat-detail/index?id=${user.id}` });
  };

  const handleInvite = () => {
    Taro.showModal({
      title: '发送邀请',
      content: `确定向 ${user.name} 发送陪伴邀请吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '邀请已发送', icon: 'success' });
        }
      }
    });
  };

  const handleReport = () => {
    setShowReportPopup(true);
  };

  const handleConfirmReport = () => {
    if (!selectedReport) {
      Taro.showToast({ title: '请选择举报类型', icon: 'none' });
      return;
    }

    Taro.showModal({
      title: '确认举报',
      content: '举报后将由人工审核，请确保信息真实',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '举报已提交', icon: 'success' });
          setShowReportPopup(false);
          setSelectedReport('');
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
              {user.isOnline && <View className={styles.onlineBadge} />}
            </View>
            <View className={styles.userMeta}>
              <Text className={styles.metaItem}>{user.age}岁</Text>
              <Text className={styles.metaItem}>📍 {user.location}</Text>
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
        <Text className={styles.sectionTitle}>个人简介</Text>
        <Text className={styles.bioText}>{user.bio}</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>基本信息</Text>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>评分</Text>
            <View className={styles.ratingSection}>
              <Text className={styles.starIcon}>★</Text>
              <Text className={styles.ratingValue}>{user.rating}</Text>
            </View>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>评价数</Text>
            <Text className={styles.infoValue}>{user.reviewCount}条</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>服务价格</Text>
            <Text className={styles.infoValue}>¥{user.hourlyRate}/小时</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>认证状态</Text>
            <Text className={styles.infoValue}>{user.isVerified ? '已认证' : '未认证'}</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>空闲时间</Text>
        <View className={styles.availableTime}>
          {user.availableTime.map((time, index) => (
            <Text key={index} className={styles.timeItem}>{time}</Text>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>擅长话题</Text>
        <View className={styles.skillTags}>
          {user.skills.map((skill, index) => (
            <Text key={index} className={styles.skillTag}>{skill}</Text>
          ))}
        </View>
      </View>

      <View className={styles.footer}>
        <Button className={styles.actionBtn} onClick={handleChat}>
          <Text className={styles.btnText}>发消息</Text>
        </Button>
        <Button className={`${styles.actionBtn} ${styles.primary}`} onClick={handleInvite}>
          <Text className={styles.btnText}>邀请陪伴</Text>
        </Button>
        <Button className={styles.reportBtn} onClick={handleReport}>
          <Text className={styles.btnIcon}>⚠️</Text>
        </Button>
      </View>

      {showReportPopup && (
        <>
          <View className={styles.mask} onClick={() => setShowReportPopup(false)} />
          <View className={styles.popup}>
            <Text className={styles.popupTitle}>选择举报类型</Text>
            <View className={styles.reportOptions}>
              {reportOptions.map((option) => (
                <Button
                  key={option.value}
                  className={`${styles.reportItem} ${selectedReport === option.value ? styles.active : ''}`}
                  onClick={() => setSelectedReport(option.value)}
                >
                  <Text className={styles.reportText}>{option.label}</Text>
                </Button>
              ))}
            </View>
            <View className={styles.popupActions}>
              <Button className={`${styles.popupBtn} ${styles.cancel}`} onClick={() => setShowReportPopup(false)}>
                <Text className={styles.btnText}>取消</Text>
              </Button>
              <Button className={`${styles.popupBtn} ${styles.confirm}`} onClick={handleConfirmReport}>
                <Text className={styles.btnText}>确认举报</Text>
              </Button>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default UserDetailPage;
