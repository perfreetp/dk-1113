import React, { useState } from 'react';
import { View, Text, Button, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { companionTypes } from '@/data/mock';

const PublishPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [locationRange, setLocationRange] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [meetingType, setMeetingType] = useState<'online' | 'offline'>('offline');
  const [note, setNote] = useState<string>('');

  const durationOptions = [
    { value: 1, label: '1小时' },
    { value: 2, label: '2小时' },
    { value: 3, label: '3小时' },
    { value: 4, label: '4小时' }
  ];

  const rangeOptions = [
    { value: '1km', label: '1公里内' },
    { value: '3km', label: '3公里内' },
    { value: '5km', label: '5公里内' },
    { value: '10km', label: '10公里内' }
  ];

  const canPublish = selectedType && duration > 0 && locationRange && budget;

  const handlePublish = () => {
    if (!canPublish) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    Taro.showLoading({ title: '发布中...' });
    
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    }, 1000);
  };

  const handleLocationPick = () => {
    Taro.chooseLocation({
      success: (res) => {
        setLocation(res.address || res.name || '');
      },
      fail: () => {
        Taro.showToast({ title: '获取位置失败', icon: 'none' });
      }
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>陪伴类型</Text>
        <View className={styles.typeGrid}>
          {companionTypes.map((type) => (
            <Button
              key={type.id}
              className={`${styles.typeItem} ${selectedType === type.name ? styles.active : ''}`}
              onClick={() => setSelectedType(type.name)}
            >
              <Text className={styles.typeIcon}>{type.icon}</Text>
              <Text className={styles.typeName}>{type.name}</Text>
            </Button>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>时长</Text>
        <View className={styles.durationOptions}>
          {durationOptions.map((option) => (
            <Button
              key={option.value}
              className={`${styles.durationItem} ${duration === option.value ? styles.active : ''}`}
              onClick={() => setDuration(option.value)}
            >
              <Text className={styles.durationText}>{option.label}</Text>
            </Button>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>地点范围</Text>
        <View className={styles.rangeOptions}>
          {rangeOptions.map((option) => (
            <Button
              key={option.value}
              className={`${styles.rangeItem} ${locationRange === option.value ? styles.active : ''}`}
              onClick={() => setLocationRange(option.value)}
            >
              <Text className={styles.rangeText}>{option.label}</Text>
            </Button>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>具体地点</Text>
        <View className={styles.inputGroup}>
          <View className={styles.inputLabel}>点击选择位置</View>
          <Button className={styles.input} onClick={handleLocationPick}>
            <Text className={styles.input}>{location || '请选择见面地点'}</Text>
          </Button>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>预算（元）</Text>
        <View className={styles.budgetInput}>
          <Text className={styles.currency}>¥</Text>
          <Input
            className={styles.input}
            type="number"
            placeholder="请输入预算"
            value={budget}
            onChange={(e) => setBudget(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>见面方式</Text>
        <View className={styles.meetingOptions}>
          <Button
            className={`${styles.meetingItem} ${meetingType === 'offline' ? styles.active : ''}`}
            onClick={() => setMeetingType('offline')}
          >
            <Text className={styles.meetingIcon}>📍</Text>
            <Text className={styles.meetingText}>线下见面</Text>
          </Button>
          <Button
            className={`${styles.meetingItem} ${meetingType === 'online' ? styles.active : ''}`}
            onClick={() => setMeetingType('online')}
          >
            <Text className={styles.meetingIcon}>💬</Text>
            <Text className={styles.meetingText}>只线上一小时</Text>
          </Button>
        </View>
        {meetingType === 'online' && (
          <Text className={styles.warning}>线上模式：仅支持文字聊天，保护您的隐私安全</Text>
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>备注（选填）</Text>
        <Input
          className={styles.noteInput}
          type="textarea"
          placeholder="请输入您的需求或特别说明..."
          value={note}
          onChange={(e) => setNote(e.detail.value)}
        />
      </View>

      <View className={styles.footer}>
        <Button
          className={`${styles.publishBtn} ${!canPublish ? styles.disabled : ''}`}
          onClick={handlePublish}
          disabled={!canPublish}
        >
          <Text className={styles.btnText}>发布需求</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default PublishPage;
