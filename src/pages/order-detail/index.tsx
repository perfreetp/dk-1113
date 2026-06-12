import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockOrders, mockUsers } from '@/data/mock';
import type { Order, User } from '@/types';
import { showContactSelector } from '../emergency-contacts';

interface Candidate {
  user: User;
  invited: boolean;
  accepted: boolean;
}

const OrderDetailPage: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showRouteCard, setShowRouteCard] = useState(false);

  const currentUserId = '1';

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

  const refreshOrder = () => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = (currentPage as any)?.options || {};
    const orderId = options.id || '1';
    
    const storedOrders = Taro.getStorageSync('orders') || [];
    const foundOrder = storedOrders.find((o: Order) => o.id === orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
      loadCandidates(foundOrder.id);
    } else {
      const mockOrder = mockOrders.find(o => o.id === orderId);
      if (mockOrder) {
        setOrder(mockOrder);
        loadCandidates(mockOrder.id);
      } else {
        setOrder(mockOrders[0]);
        loadCandidates(mockOrders[0].id);
      }
    }
  };

  const loadCandidates = (orderId: string) => {
    const storedCandidates = Taro.getStorageSync(`candidates_${orderId}`) || [];
    const availableUsers = mockUsers.filter(u => u.id !== currentUserId);
    
    const candidateList: Candidate[] = availableUsers.map(user => {
      const stored = storedCandidates.find((c: any) => c.userId === user.id);
      return {
        user,
        invited: stored?.invited || false,
        accepted: stored?.accepted || false
      };
    });
    
    setCandidates(candidateList);
  };

  useEffect(() => {
    refreshOrder();
  }, []);

  useEffect(() => {
    const onShow = () => {
      refreshOrder();
    };

    Taro.onShow(onShow);
    return () => {
      Taro.offShow(onShow);
    };
  }, []);

  if (!order) {
    return (
      <View className={styles.page}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const hasAcceptedCandidate = candidates.some(c => c.accepted);

  const saveOrder = (updatedOrder: Order) => {
    const storedOrders = Taro.getStorageSync('orders') || [];
    const orderIndex = storedOrders.findIndex((o: Order) => o.id === updatedOrder.id);
    
    if (orderIndex >= 0) {
      storedOrders[orderIndex] = updatedOrder;
    } else {
      storedOrders.push(updatedOrder);
    }
    
    Taro.setStorageSync('orders', storedOrders);
    setOrder(updatedOrder);
  };

  const saveCandidates = (orderId: string, updatedCandidates: Candidate[]) => {
    const stored = updatedCandidates.map(c => ({
      userId: c.user.id,
      invited: c.invited,
      accepted: c.accepted
    }));
    Taro.setStorageSync(`candidates_${orderId}`, stored);
    setCandidates(updatedCandidates);
  };

  const handleContact = () => {
    if (order.companion) {
      Taro.navigateTo({ url: `/pages/chat-detail/index?id=${order.companion.id}` });
    }
  };

  const handleInviteCandidate = (user: User) => {
    if (hasAcceptedCandidate) {
      Taro.showToast({ title: '已有陪伴者接受邀请', icon: 'none' });
      return;
    }

    const updatedCandidates = candidates.map(c => 
      c.user.id === user.id ? { ...c, invited: true } : c
    );
    
    saveCandidates(order.id, updatedCandidates);
    Taro.showToast({ title: `已邀请 ${user.name}`, icon: 'success' });
  };

  const handleAcceptInvitation = (user: User) => {
    const updatedCandidates = candidates.map(c => ({
      ...c,
      accepted: c.user.id === user.id,
      invited: c.user.id === user.id ? true : c.invited
    }));
    
    saveCandidates(order.id, updatedCandidates);
    
    const updatedOrder: Order = {
      ...order,
      status: 'accepted',
      companion: user
    };
    
    saveOrder(updatedOrder);
    Taro.showToast({ title: `${user.name} 已接受邀请`, icon: 'success' });
  };

  const handleAcceptOrder = () => {
    if (order.status !== 'pending') return;
    
    const availableUsers = mockUsers.filter(u => u.id !== currentUserId);
    
    if (availableUsers.length === 0) {
      Taro.showToast({ title: '暂无可用陪伴者', icon: 'none' });
      return;
    }
    
    const randomCompanion = availableUsers[Math.floor(Math.random() * availableUsers.length)];
    
    const updatedCandidates = candidates.map(c => ({
      ...c,
      invited: true,
      accepted: c.user.id === randomCompanion.id
    }));
    saveCandidates(order.id, updatedCandidates);
    
    const updatedOrder: Order = {
      ...order,
      status: 'accepted',
      companion: randomCompanion
    };
    
    saveOrder(updatedOrder);
    Taro.showToast({ title: `已匹配陪伴者 ${randomCompanion.name}`, icon: 'success' });
  };

  const handleConfirmMeeting = () => {
    if (order.status !== 'accepted' && order.status !== 'pending') return;
    
    const updatedOrder: Order = {
      ...order,
      status: 'confirmed'
    };
    
    saveOrder(updatedOrder);
    Taro.showToast({ title: '已确认见面', icon: 'success' });
  };

  const handleStartCompanion = () => {
    if (order.status !== 'confirmed') return;
    
    const updatedOrder: Order = {
      ...order,
      status: 'inProgress'
    };
    
    saveOrder(updatedOrder);
    Taro.showToast({ title: '开始计时', icon: 'success' });
  };

  const handleShareRoute = () => {
    if (order.meetingType === 'online') {
      Taro.showToast({ title: '线上订单无需分享路线', icon: 'none' });
      return;
    }

    setShowRouteCard(true);
  };

  const handleSendRoute = () => {
    setShowRouteCard(false);
    Taro.showToast({ title: '路线已分享', icon: 'success' });
  };

  const handleStartOnlineChat = () => {
    if (order.companion) {
      Taro.navigateTo({ url: `/pages/chat-detail/index?id=${order.companion.id}` });
    }
  };

  const handleEndOrder = () => {
    if (order.status !== 'inProgress') return;
    
    Taro.showModal({
      title: '结束订单',
      content: '确认结束本次陪伴？结束后可进行评价',
      success: (res) => {
        if (res.confirm) {
          const updatedOrder: Order = {
            ...order,
            status: 'completed'
          };
          saveOrder(updatedOrder);
          Taro.showToast({ title: '订单已结束', icon: 'success' });
        }
      }
    });
  };

  const handleCancelOrder = () => {
    Taro.showModal({
      title: '取消订单',
      content: '确认取消该订单？',
      success: (res) => {
        if (res.confirm) {
          const updatedOrder: Order = {
            ...order,
            status: 'cancelled'
          };
          saveOrder(updatedOrder);
          Taro.showToast({ title: '订单已取消', icon: 'success' });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      }
    });
  };

  const handleEmergency = () => {
    showContactSelector((contact) => {
      Taro.showToast({ 
        title: `已通知 ${contact.name}`, 
        icon: 'success' 
      });
    });
  };

  const handleRate = () => {
    Taro.showModal({
      title: '评价陪伴者',
      editable: true,
      placeholderText: '请输入评价内容',
      success: (res) => {
        if (res.confirm) {
          const updatedOrder: Order = {
            ...order,
            rating: 5,
            review: res.content || '满意'
          };
          saveOrder(updatedOrder);
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

      {order.status === 'pending' && !order.companion && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>候选陪伴者</Text>
          <View className={styles.candidateList}>
            {candidates.map((candidate) => (
              <View key={candidate.user.id} className={styles.candidateItem}>
                <Image className={styles.candidateAvatar} src={candidate.user.avatar} mode="aspectFill" />
                <View className={styles.candidateInfo}>
                  <Text className={styles.candidateName}>{candidate.user.name}</Text>
                  <Text className={styles.candidateMeta}>★{candidate.user.rating} | ¥{candidate.user.hourlyRate}/小时</Text>
                </View>
                {candidate.accepted ? (
                  <Text className={styles.acceptedBadge}>已接受</Text>
                ) : hasAcceptedCandidate ? (
                  <Text className={styles.disabledBadge}>已有人接单</Text>
                ) : candidate.invited ? (
                  <Button className={styles.acceptBtn} onClick={() => handleAcceptInvitation(candidate.user)}>
                    <Text className={styles.btnText}>接受邀请</Text>
                  </Button>
                ) : (
                  <Button className={styles.inviteBtn} onClick={() => handleInviteCandidate(candidate.user)}>
                    <Text className={styles.btnText}>邀请</Text>
                  </Button>
                )}
              </View>
            ))}
          </View>
          <Button className={styles.matchBtn} onClick={handleAcceptOrder}>
            <Text className={styles.btnText}>自动匹配陪伴者</Text>
          </Button>
        </View>
      )}

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
        {(order.status === 'inProgress' || order.status === 'confirmed') && (
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
        {order.status === 'pending' && !order.companion && (
          <Button className={`${styles.actionBtn} ${styles.primary}`} onClick={handleCancelOrder}>
            <Text className={styles.btnText}>取消订单</Text>
          </Button>
        )}
        {order.status === 'pending' && order.companion && (
          <>
            <Button className={`${styles.actionBtn} ${styles.primary}`} onClick={handleConfirmMeeting}>
              <Text className={styles.btnText}>确认见面</Text>
            </Button>
            <Button className={styles.actionBtn} onClick={handleCancelOrder}>
              <Text className={styles.btnText}>取消订单</Text>
            </Button>
          </>
        )}
        {order.status === 'accepted' && (
          <Button className={`${styles.actionBtn} ${styles.primary}`} onClick={handleConfirmMeeting}>
            <Text className={styles.btnText}>确认见面</Text>
          </Button>
        )}
        {order.status === 'confirmed' && (
          <Button className={`${styles.actionBtn} ${styles.primary}`} onClick={handleStartCompanion}>
            <Text className={styles.btnText}>开始陪伴</Text>
          </Button>
        )}
        {order.status === 'inProgress' && (
          <>
            {order.meetingType === 'offline' && (
              <Button className={styles.actionBtn} onClick={handleShareRoute}>
                <Text className={styles.btnText}>分享路线</Text>
              </Button>
            )}
            {order.meetingType === 'online' && (
              <Button className={styles.actionBtn} onClick={handleStartOnlineChat}>
                <Text className={styles.btnText}>进入聊天</Text>
              </Button>
            )}
            <Button className={`${styles.actionBtn} ${styles.primary}`} onClick={handleEndOrder}>
              <Text className={styles.btnText}>结束订单</Text>
            </Button>
            <Button className={styles.emergencyBtn} onClick={handleEmergency}>
              <Text className={styles.btnText}>紧急联系</Text>
            </Button>
          </>
        )}
        {order.status === 'completed' && !order.review && (
          <Button className={`${styles.actionBtn} ${styles.primary}`} onClick={handleRate}>
            <Text className={styles.btnText}>去评价</Text>
          </Button>
        )}
        {order.status === 'cancelled' && (
          <Text className={styles.emptyText}>订单已取消</Text>
        )}
      </View>

      {showRouteCard && (
        <>
          <View className={styles.mask} onClick={() => setShowRouteCard(false)} />
          <View className={styles.routeCard}>
            <Text className={styles.routeTitle}>路线分享</Text>
            
            <View className={styles.routeInfo}>
              <View className={styles.routeItem}>
                <Text className={styles.routeIcon}>📍</Text>
                <View className={styles.routeDetail}>
                  <Text className={styles.routeLabel}>当前位置</Text>
                  <Text className={styles.routeValue}>我的位置</Text>
                </View>
              </View>
              
              <View className={styles.routeArrow}>↓</View>
              
              <View className={styles.routeItem}>
                <Text className={styles.routeIcon}>🏁</Text>
                <View className={styles.routeDetail}>
                  <Text className={styles.routeLabel}>目的地</Text>
                  <Text className={styles.routeValue}>{order.location}</Text>
                </View>
              </View>
            </View>

            <View className={styles.shareInfo}>
              <Text className={styles.shareLabel}>发送对象</Text>
              <Text className={styles.shareValue}>{order.companion?.name || '陪伴者'}</Text>
            </View>

            <View className={styles.routeActions}>
              <Button className={`${styles.routeBtn} ${styles.cancel}`} onClick={() => setShowRouteCard(false)}>
                <Text className={styles.btnText}>取消</Text>
              </Button>
              <Button className={`${styles.routeBtn} ${styles.confirm}`} onClick={handleSendRoute}>
                <Text className={styles.btnText}>发送路线</Text>
              </Button>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default OrderDetailPage;
