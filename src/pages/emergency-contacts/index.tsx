import React, { useState, useEffect } from 'react';
import { View, Text, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export const getEmergencyContacts = (): EmergencyContact[] => {
  return Taro.getStorageSync('emergencyContacts') || [];
};

export const showContactSelector = (onSelect: (contact: EmergencyContact) => void): void => {
  const contacts = getEmergencyContacts();
  
  if (contacts.length === 0) {
    Taro.showToast({ title: '请先添加紧急联系人', icon: 'none' });
    return;
  }

  const contactNames = contacts.map(c => `${c.name} (${c.relationship})`);
  
  Taro.showActionSheet({
    itemList: contactNames,
    success: (res) => {
      const selectedContact = contacts[res.tapIndex];
      Taro.showModal({
        title: '确认通知',
        content: `确定向 ${selectedContact.name} 发送紧急通知吗？`,
        success: (modalRes) => {
          if (modalRes.confirm) {
            onSelect(selectedContact);
            Taro.showToast({ title: '通知已发送', icon: 'success' });
          }
        }
      });
    }
  });
};

const EmergencyContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');

  const relationOptions = [
    '父母', '配偶', '子女', '兄弟姐妹', '朋友', '同事', '其他'
  ];

  useEffect(() => {
    const storedContacts = getEmergencyContacts();
    setContacts(storedContacts);
  }, []);

  const handleAddContact = () => {
    if (!name.trim() || !phone.trim() || !relationship) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
      relationship
    };

    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    Taro.setStorageSync('emergencyContacts', updatedContacts);

    setName('');
    setPhone('');
    setRelationship('');
    setShowAddPopup(false);
    Taro.showToast({ title: '添加成功', icon: 'success' });
  };

  const handleDeleteContact = (contactId: string) => {
    Taro.showModal({
      title: '删除联系人',
      content: '确认删除该紧急联系人？',
      success: (res) => {
        if (res.confirm) {
          const updatedContacts = contacts.filter(c => c.id !== contactId);
          setContacts(updatedContacts);
          Taro.setStorageSync('emergencyContacts', updatedContacts);
          Taro.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    });
  };

  const handleCallContact = (phone: string) => {
    Taro.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        Taro.showToast({ title: '拨打电话失败', icon: 'none' });
      }
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.section}>
        {contacts.length > 0 ? (
          <View className={styles.contactList}>
            {contacts.map((contact) => (
              <View
                key={contact.id}
                className={styles.contactItem}
                onClick={() => handleCallContact(contact.phone)}
              >
                <View className={styles.contactAvatar}>
                  <Text className={styles.avatarText}>{contact.name.charAt(0)}</Text>
                </View>
                <View className={styles.contactInfo}>
                  <Text className={styles.contactName}>{contact.name}</Text>
                  <Text className={styles.contactPhone}>{contact.phone}</Text>
                  <Text className={styles.contactRelation}>{contact.relationship}</Text>
                </View>
                <Button
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteContact(contact.id);
                  }}
                >
                  <Text className={styles.btnIcon}>🗑️</Text>
                </Button>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📞</Text>
            <Text className={styles.emptyText}>暂无紧急联系人</Text>
          </View>
        )}
      </View>

      <View className={styles.footer}>
        <Button className={styles.addBtn} onClick={() => setShowAddPopup(true)}>
          <Text className={styles.btnText}>添加紧急联系人</Text>
        </Button>
      </View>

      {showAddPopup && (
        <>
          <View className={styles.mask} onClick={() => setShowAddPopup(false)} />
          <View className={styles.popup}>
            <Text className={styles.popupTitle}>添加紧急联系人</Text>
            
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>姓名</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入姓名"
                value={name}
                onChange={(e) => setName(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>电话</Text>
              <Input
                className={styles.formInput}
                type="number"
                placeholder="请输入手机号码"
                value={phone}
                onChange={(e) => setPhone(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>关系</Text>
              <View className={styles.relationOptions}>
                {relationOptions.map((option) => (
                  <Button
                    key={option}
                    className={`${styles.relationItem} ${relationship === option ? styles.active : ''}`}
                    onClick={() => setRelationship(option)}
                  >
                    <Text className={styles.relationText}>{option}</Text>
                  </Button>
                ))}
              </View>
            </View>

            <View className={styles.popupActions}>
              <Button className={`${styles.popupBtn} ${styles.cancel}`} onClick={() => setShowAddPopup(false)}>
                <Text className={styles.btnText}>取消</Text>
              </Button>
              <Button className={`${styles.popupBtn} ${styles.confirm}`} onClick={handleAddContact}>
                <Text className={styles.btnText}>确认添加</Text>
              </Button>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default EmergencyContactsPage;
