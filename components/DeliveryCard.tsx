
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

export interface Delivery {
  id: string;
  customerName: string;
  address: string;
  city: string;
  province: string;
  containerSize: '20' | '40';
  deliveryType: 'sales' | 'rental';
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'en-route' | 'arrived' | 'delivered' | 'delayed';
  specialInstructions?: string;
  driverId: string;
  driverName: string;
}

interface DeliveryCardProps {
  delivery: Delivery;
  onPress: (delivery: Delivery) => void;
}

export const getStatusColor = (status: Delivery['status']) => {
  switch (status) {
    case 'scheduled': return colors.primary;
    case 'en-route': return colors.accent;
    case 'arrived': return '#ff9500';
    case 'delivered': return colors.secondary;
    case 'delayed': return '#ff3b30';
    default: return colors.textSecondary;
  }
};

export const getStatusText = (status: Delivery['status']) => {
  switch (status) {
    case 'scheduled': return 'Scheduled';
    case 'en-route': return 'En Route';
    case 'arrived': return 'Arrived';
    case 'delivered': return 'Delivered';
    case 'delayed': return 'Delayed';
    default: return status;
  }
};

export const getDeliveryTypeColor = (type: Delivery['deliveryType']) => {
  return type === 'sales' ? '#34C759' : '#007AFF';
};

export const getDeliveryTypeText = (type: Delivery['deliveryType']) => {
  return type === 'sales' ? 'Sales' : 'Rental';
};

export default function DeliveryCard({ delivery, onPress }: DeliveryCardProps) {
  const handlePress = () => {
    console.log('DeliveryCard pressed:', delivery.id);
    onPress(delivery);
  };

  return (
    <Pressable 
      style={[commonStyles.card, styles.deliveryCard]}
      onPress={handlePress}
    >
      <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 12 }]}>
        <View style={{ flex: 1 }}>
          <View style={[commonStyles.row, { marginBottom: 4 }]}>
            <Text style={styles.customerName}>{delivery.customerName}</Text>
            <View style={[styles.deliveryTypeBadge, { backgroundColor: getDeliveryTypeColor(delivery.deliveryType) }]}>
              <Text style={styles.deliveryTypeText}>
                {getDeliveryTypeText(delivery.deliveryType)}
              </Text>
            </View>
          </View>
          <Text style={commonStyles.textSecondary}>{delivery.city}, {delivery.province}</Text>
        </View>
        <View style={[commonStyles.statusBadge, { backgroundColor: getStatusColor(delivery.status) }]}>
          <Text style={[commonStyles.statusText, { color: '#ffffff' }]}>
            {getStatusText(delivery.status)}
          </Text>
        </View>
      </View>
      
      <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 8 }]}>
        <View style={commonStyles.row}>
          <IconSymbol name="cube.box" color={colors.primary} size={16} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 6 }]}>
            {delivery.containerSize}&apos; Container
          </Text>
        </View>
        <Text style={commonStyles.textSecondary}>
          {delivery.scheduledDate} at {delivery.scheduledTime}
        </Text>
      </View>
      
      <View style={commonStyles.row}>
        <IconSymbol name="person.circle" color={colors.textSecondary} size={16} />
        <Text style={[commonStyles.textSecondary, { marginLeft: 6 }]}>
          Driver: {delivery.driverName}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  deliveryCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  deliveryTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  deliveryTypeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
});
