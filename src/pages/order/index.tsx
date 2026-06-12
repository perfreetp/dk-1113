import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockOrders } from '@/data/mock';
import type { Order } from '@/types';

const OrderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>([]);

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待接单' },
    { key: 'accepted', label: '已接单' },
    { key: 'confirmed', label: '见面确认' },
    { key: 'inProgress', label: '进行中' },
    { key: 'completed', label: '已完成' }
  ];

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
    'confirmed': '见面确认',
    'inProgress': '进行中',
    'completed': '已完成',
    'cancelled': '已取消'
  };

  const loadOrders = () => {
    const storedOrders = Taro.getStorageSync('orders') || [];
    const allOrders = [...mockOrders, ...storedOrders];
    const uniqueOrders = allOrders.filter((order, index, self) => 
      index === self.findIndex((o) => o.id === order.id)
    );
    setOrders(uniqueOrders);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const onShow = () => {
      loadOrders();
    };

    Taro.onShow(onShow);
    return () => {
      Taro.offShow(onShow);
    };
  }, []);

  const filteredOrders = activeTab === 'all' ? orders : orders.filter(order => order.status === activeTab);

  const handleOrderTap = (order: Order) => {
    Taro.navigateTo({ url: `/pages/order-detail/index?id=${order.id}` });
  };

  const handleRate = (order: Order) => {
    Taro.showModal({
      title: '评价',
      editable: true,
      placeholderText: '请输入评价内容',
      success: (res) => {
        if (res.confirm) {
          const storedOrders = Taro.getStorageSync('orders') || [];
          const updatedOrders = storedOrders.map((o: Order) => 
            o.id === order.id ? { ...o, rating: 5, review: res.content || '满意' } : o
          );
          Taro.setStorageSync('orders', updatedOrders);
          loadOrders();
          Taro.showToast({ title: '评价成功', icon: 'success' });
        }
      }
    });
  };

  const handleCancelOrder = (order: Order) => {
    Taro.showModal({
      title: '取消订单',
      content: '确认取消该订单？',
      success: (res) => {
        if (res.confirm) {
          const storedOrders = Taro.getStorageSync('orders') || [];
          const updatedOrders = storedOrders.map((o: Order) => 
            o.id === order.id ? { ...o, status: 'cancelled' } : o
          );
          Taro.setStorageSync('orders', updatedOrders);
          loadOrders();
          Taro.showToast({ title: '订单已取消', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.tabBar}>
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text className={styles.tabText}>{tab.label}</Text>
          </View>
        ))}
      </View>

      {filteredOrders.length > 0 ? (
        <View className={styles.orderList}>
          {filteredOrders.map((order) => (
            <View
              key={order.id}
              className={styles.orderCard}
              onClick={() => handleOrderTap(order)}
            >
              <View className={styles.orderHeader}>
                <View className={styles.orderType}>
                  <Text className={styles.typeIcon}>{typeIcons[order.type] || '👤'}</Text>
                  <Text className={styles.typeName}>{order.type}</Text>
                </View>
                <Text className={styles.orderStatus}>{statusLabels[order.status]}</Text>
              </View>

              <View className={styles.orderContent}>
                <Text className={styles.orderTitle}>{order.title}</Text>
                <View className={styles.orderMeta}>
                  <Text className={styles.metaItem}>📍 {order.location}</Text>
                  <Text className={styles.metaItem}>⏱️ {order.duration}小时</Text>
                  <Text className={styles.metaItem}>📅 {order.startTime}</Text>
                  {order.meetingType === 'online' && (
                    <Text className={styles.metaItem}>💬 线上模式</Text>
                  )}
                </View>
              </View>

              {order.companion && (
                <View className={styles.orderPartner}>
                  <Image className={styles.partnerAvatar} src={order.companion.avatar} mode="aspectFill" />
                  <View className={styles.partnerInfo}>
                    <Text className={styles.partnerName}>{order.companion.name}</Text>
                    <Text className={styles.partnerRating}>★ {order.companion.rating}</Text>
                  </View>
                </View>
              )}

              <View className={styles.orderFooter}>
                <View className={styles.orderPrice}>
                  <Text className={styles.priceLabel}>预算</Text>
                  <Text className={styles.priceNum}>¥{order.budget}</Text>
                </View>
                <View className={styles.orderActions}>
                  {(order.status === 'inProgress' || order.status === 'confirmed') && (
                    <View className={styles.countdown}>
                      <Text className={styles.countdownText}>⏰ 距离结束还有 45 分钟</Text>
                    </View>
                  )}
                  {order.status === 'completed' && !order.rating && (
                    <Button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); handleRate(order); }}>
                      <Text className={styles.btnText}>评价</Text>
                    </Button>
                  )}
                  {order.status === 'pending' && (
                    <Button className={`${styles.actionBtn} ${styles.primary}`} onClick={(e) => { e.stopPropagation(); handleCancelOrder(order); }}>
                      <Text className={styles.btnText}>取消订单</Text>
                    </Button>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>暂无订单</Text>
        </View>
      )}
    </View>
  );
};

export default OrderPage;
