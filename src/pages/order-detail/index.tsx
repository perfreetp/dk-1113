import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockOrders } from '@/data/mock';
import type { Order } from '@/types';

const OrderDetailPage: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);

  const typeIcons: Record<string, string> = {
    '散步': '🚶',
    '咖啡': '☕',
    '陪逛': '🛍️',
    '排队': '⏳',
    '倾听': '👂',
    '线上': '💬'
  };

  const statusLabels: Record<string, string> = {
    'pending': '待接单',
    'accepted': '已接单',
    'inProgress': '进行中',
    'completed': '已完成',
    'cancelled': '已取消'
  };

  useEffect(() => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = (currentPage as any)?.options || {};
    const orderId = options.id || '1';
    
    const foundOrder = mockOrders.find(o => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      const storedOrders = Taro.getStorageSync('orders') || [];
      const storedOrder = storedOrders.find((o: Order) => o.id === orderId);
      if (storedOrder) {
        setOrder(storedOrder);
      } else {
        setOrder(mockOrders[0]);
      }
    }
  }, []);

  if (!order) {
    return (
      <View className={styles.page}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const handleContact = () => {
    if (order.companion) {
      Taro.navigateTo({ url: `/pages/chat-detail/index?id=${order.companion.id}` });
    }
  };

  const handleConfirmMeeting = () => {
    Taro.showModal({
      title: '确认见面',
      content: '确认已与对方见面？确认后将开始计时',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已确认见面，开始计时', icon: 'success' });
        }
      }
    });
  };

  const handleShareRoute = () => {
    if (order.meetingType === 'online') {
      Taro.showToast({ title: '线上订单无需分享路线', icon: 'none' });
      return;
    }
    
    Taro.showModal({
      title: '分享路线',
      content: `起点：当前位置\n终点：${order.location}\n\n是否发送路线给对方？`,
      confirmText: '发送',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '路线已分享', icon: 'success' });
        }
      }
    });
  };

  const handleEndOrder = () => {
    Taro.showModal({
      title: '结束订单',
      content: '确认结束本次陪伴？结束后可进行评价',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '订单已结束', icon: 'success' });
        }
      }
    });
  };

  const handleEmergency = () => {
    const emergencyContacts = Taro.getStorageSync('emergencyContacts') || [];
    if (emergencyContacts.length === 0) {
      Taro.showModal({
        title: '紧急联系',
        content: '您还未添加紧急联系人，请先添加',
        confirmText: '去添加',
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({ url: '/pages/emergency-contacts/index' });
          }
        }
      });
      return;
    }

    const contactNames = emergencyContacts.map((c: any) => c.name).join('、');
    Taro.showModal({
      title: '紧急联系',
      content: `选择要联系的紧急联系人：\n${contactNames}`,
      confirmText: '联系第一个',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm && emergencyContacts.length > 0) {
          const contact = emergencyContacts[0];
          Taro.showModal({
            title: '联系紧急联系人',
            content: `正在拨打 ${contact.name} 的电话：${contact.phone}`,
            showCancel: false
          });
          setTimeout(() => {
            Taro.hideModal();
            Taro.showToast({ title: '已通知紧急联系人', icon: 'success' });
          }, 2000);
        }
      }
    });
  };

  const handleRate = () => {
    Taro.showModal({
      title: '评价陪伴者',
      editable: true,
      placeholderText: '请输入评价内容',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '评价成功', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.orderHeader}>
        <View className={styles.orderStatus}>
          <View className={styles.statusDot} />
          <Text className={styles.statusText}>{statusLabels[order.status]}</Text>
        </View>
        <View className={styles.orderType}>
          <Text className={styles.typeIcon}>{typeIcons[order.type] || '👤'}</Text>
          <View className={styles.typeInfo}>
            <Text className={styles.typeName}>{order.type}</Text>
            <Text className={styles.orderNo}>订单号：{order.id}</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>订单信息</Text>
        <View className={styles.infoList}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>订单标题</Text>
            <Text className={styles.infoValue}>{order.title}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>见面地点</Text>
            <Text className={styles.infoValue}>{order.location}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>时长</Text>
            <Text className={styles.infoValue}>{order.duration}小时</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>预算</Text>
            <Text className={`${styles.infoValue} ${styles.infoHighlight}`}>¥{order.budget}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>见面方式</Text>
            <Text className={styles.infoValue}>{order.meetingType === 'online' ? '线上聊天' : '线下见面'}</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>陪伴者信息</Text>
        {order.companion ? (
          <View className={styles.partnerCard}>
            <Image className={styles.partnerAvatar} src={order.companion.avatar} mode="aspectFill" />
            <View className={styles.partnerInfo}>
              <View className={styles.partnerName}>
                <Text>{order.companion.name}</Text>
                {order.companion.isVerified && <Text className={styles.verifiedBadge}>✓</Text>}
              </View>
              <Text className={styles.partnerMeta}>评分 ★{order.companion.rating} | {order.companion.reviewCount}条评价</Text>
            </View>
            <Button className={styles.contactBtn} onClick={handleContact}>
              <Text className={styles.btnText}>发消息</Text>
            </Button>
          </View>
        ) : (
          <Text className={styles.infoValue}>暂无陪伴者接单</Text>
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>时间信息</Text>
        <View className={styles.timeSection}>
          <View className={styles.timeItem}>
            <Text className={styles.timeLabel}>开始时间</Text>
            <Text className={styles.timeValue}>{order.startTime}</Text>
          </View>
          <View className={styles.timeItem}>
            <Text className={styles.timeLabel}>结束时间</Text>
            <Text className={styles.timeValue}>{order.endTime}</Text>
          </View>
        </View>
        {order.status === 'inProgress' && (
          <View className={styles.countdownBox}>
            <Text className={styles.countdownText}>⏰ 距离结束还有 45 分钟</Text>
          </View>
        )}
      </View>

      {order.status === 'completed' && order.review && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>我的评价</Text>
          <View className={styles.reviewSection}>
            <View className={styles.reviewHeader}>
              <Text className={styles.starIcon}>★</Text>
              <Text className={styles.reviewRating}>{order.rating}</Text>
            </View>
            <Text className={styles.reviewContent}>{order.review}</Text>
          </View>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>费用信息</Text>
        <View className={styles.priceSection}>
          <Text className={styles.priceLabel}>订单金额</Text>
          <Text className={styles.priceValue}>¥{order.budget}</Text>
        </View>
      </View>

      <View className={styles.footer}>
        {order.status === 'inProgress' && (
          <>
            <Button className={styles.actionBtn} onClick={handleShareRoute}>
              <Text className={styles.btnText}>分享路线</Text>
            </Button>
            <Button className={`${styles.actionBtn} ${styles.primary}`} onClick={handleConfirmMeeting}>
              <Text className={styles.btnText}>确认见面</Text>
            </Button>
            <Button className={styles.actionBtn} onClick={handleEmergency}>
              <Text className={styles.btnText}>紧急联系</Text>
            </Button>
          </>
        )}
        {order.status === 'completed' && !order.review && (
          <Button className={`${styles.actionBtn} ${styles.primary}`} onClick={handleRate}>
            <Text className={styles.btnText}>去评价</Text>
          </Button>
        )}
        {order.status === 'pending' && (
          <Button className={`${styles.actionBtn} ${styles.primary}`} onClick={handleEndOrder}>
            <Text className={styles.btnText}>取消订单</Text>
          </Button>
        )}
      </View>
    </View>
  );
};

export default OrderDetailPage;
